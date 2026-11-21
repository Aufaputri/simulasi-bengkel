import db from "../config/database.js";
import { generateKodeBooking } from "../utils/generateKodeBooking.js";

const VALID_STATUSES = ["Menunggu", "Diproses", "Selesai"];

const normalizeLayananIds = (layanan_ids, layanan_id) => {
    let ids = [];

    if (Array.isArray(layanan_ids)) {
        ids = layanan_ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    } else if (layanan_id !== undefined && layanan_id !== null && layanan_id !== "") {
        const parsed = Number(layanan_id);
        if (Number.isInteger(parsed) && parsed > 0) {
            ids = [parsed];
        }
    }

    return [...new Set(ids)];
};

const insertBookingWithDetails = async ({
    userId,
    kendaraanId,
    layananIds,
    tanggalBooking,
    jamBooking,
    keluhan,
    status = "Menunggu"
}) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const kode = generateKodeBooking();

        const [bookingResult] = await conn.query(
            `INSERT INTO booking
            (kode_booking, user_id, kendaraan_id, tanggal_booking, jam_booking, keluhan, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                kode,
                userId,
                kendaraanId,
                tanggalBooking,
                jamBooking,
                keluhan?.trim() || null,
                status
            ]
        );

        const bookingId = bookingResult.insertId;
        const detailValues = layananIds.map((layananId) => [bookingId, layananId]);

        await conn.query(
            `INSERT INTO detail_booking (booking_id, layanan_id) VALUES ?`,
            [detailValues]
        );

        await conn.commit();

        return { id: bookingId, kode_booking: kode };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

// Pelanggan: membuat booking baru (mendukung 1 atau banyak layanan)
export const createBooking = async (req, res) => {
    try {
        const {
            kendaraan_id,
            layanan_id,
            layanan_ids,
            tanggal_booking,
            jam_booking,
            keluhan
        } = req.body;

        const selectedLayananIds = normalizeLayananIds(layanan_ids, layanan_id);

        if (!kendaraan_id || !tanggal_booking || !jam_booking || selectedLayananIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Kendaraan, minimal 1 layanan, tanggal booking, dan jam booking wajib diisi"
            });
        }

        // Pastikan kendaraan milik user yang sedang login
        const [kendaraanRows] = await db.query(
            "SELECT id FROM kendaraan WHERE id = ? AND user_id = ?",
            [kendaraan_id, req.user.id]
        );

        if (kendaraanRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan atau bukan milik Anda"
            });
        }

        // Pastikan semua layanan valid
        const [layananRows] = await db.query(
            "SELECT id FROM layanan WHERE id IN (?)",
            [selectedLayananIds]
        );

        if (layananRows.length !== selectedLayananIds.length) {
            return res.status(404).json({
                success: false,
                message: "Salah satu layanan yang dipilih tidak ditemukan"
            });
        }

        const created = await insertBookingWithDetails({
            userId: req.user.id,
            kendaraanId: kendaraan_id,
            layananIds: selectedLayananIds,
            tanggalBooking: tanggal_booking,
            jamBooking: jam_booking,
            keluhan
        });

        res.status(201).json({
            success: true,
            message: "Booking berhasil dibuat",
            kode_booking: created.kode_booking,
            data: created
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan: melihat riwayat & status booking miliknya
export const getBooking = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                booking.id,
                booking.kode_booking,
                booking.user_id,
                booking.kendaraan_id,
                DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
                booking.jam_booking,
                booking.keluhan,
                booking.status,
                booking.created_at,
                booking.updated_at,

                kendaraan.merk,
                kendaraan.tipe,
                kendaraan.plat_nomor,

                GROUP_CONCAT(layanan.id ORDER BY layanan.id) AS layanan_ids,
                GROUP_CONCAT(layanan.nama_layanan ORDER BY layanan.id SEPARATOR ', ') AS nama_layanan,
                COALESCE(SUM(layanan.harga), 0) AS total_harga

            FROM booking
            JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
            LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
            LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
            WHERE booking.user_id = ?
            GROUP BY booking.id
            ORDER BY booking.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan / Admin: melihat detail 1 booking beserta rincian layanan
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT
                booking.id,
                booking.kode_booking,
                booking.user_id,
                booking.kendaraan_id,
                DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
                booking.jam_booking,
                booking.keluhan,
                booking.status,
                booking.created_at,

                users.nama,
                users.email,
                users.no_hp,

                kendaraan.merk,
                kendaraan.tipe,
                kendaraan.tahun,
                kendaraan.plat_nomor,
                kendaraan.warna

            FROM booking
            JOIN users ON booking.user_id = users.id
            JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
            WHERE booking.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking tidak ditemukan"
            });
        }

        const bookingData = rows[0];

        if (req.user.role !== "admin" && bookingData.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak"
            });
        }

        const [layananItems] = await db.query(
            `SELECT layanan.id, layanan.nama_layanan, layanan.harga, layanan.estimasi
             FROM detail_booking
             JOIN layanan ON detail_booking.layanan_id = layanan.id
             WHERE detail_booking.booking_id = ?`,
            [id]
        );

        const total_harga = layananItems.reduce(
            (sum, item) => sum + Number(item.harga || 0),
            0
        );

        res.json({
            success: true,
            data: {
                ...bookingData,
                layanan: layananItems,
                layanan_ids: layananItems.map((l) => l.id),
                total_harga
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: melihat semua booking (mendukung pencarian & filter status/tanggal)
export const getAllBooking = async (req, res) => {
    try {
        const { search, status, tanggal } = req.query;

        let query = `
            SELECT
                booking.id,
                booking.kode_booking,
                booking.user_id,
                booking.kendaraan_id,
                DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
                booking.jam_booking,
                booking.keluhan,
                booking.status,
                booking.created_at,

                users.nama,
                users.no_hp,
                users.email,

                kendaraan.merk,
                kendaraan.tipe,
                kendaraan.plat_nomor,

                GROUP_CONCAT(layanan.id ORDER BY layanan.id) AS layanan_ids,
                GROUP_CONCAT(
                    layanan.nama_layanan
                    ORDER BY layanan.id
                    SEPARATOR ', '
                ) AS nama_layanan,

                COALESCE(SUM(layanan.harga), 0) AS total_harga

            FROM booking
            JOIN users ON booking.user_id = users.id
            JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
            LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
            LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
            WHERE 1=1
        `;

        const params = [];

        if (status && VALID_STATUSES.includes(status)) {
            query += ` AND booking.status = ?`;
            params.push(status);
        }

        if (tanggal) {
            query += ` AND booking.tanggal_booking = ?`;
            params.push(tanggal);
        }

        if (search && search.trim()) {
            const keyword = `%${search.trim()}%`;
            query += ` AND (
                booking.kode_booking LIKE ?
                OR users.nama LIKE ?
                OR kendaraan.merk LIKE ?
                OR kendaraan.tipe LIKE ?
                OR kendaraan.plat_nomor LIKE ?
            )`;
            params.push(keyword, keyword, keyword, keyword, keyword);
        }

        query += ` GROUP BY booking.id ORDER BY booking.created_at DESC`;

        const [rows] = await db.query(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("ERROR GET ALL BOOKING:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: membuat booking baru atas nama pelanggan
export const adminCreateBooking = async (req, res) => {
    try {
        const {
            user_id,
            kendaraan_id,
            layanan_id,
            layanan_ids,
            tanggal_booking,
            jam_booking,
            keluhan,
            status
        } = req.body;

        const selectedLayananIds = normalizeLayananIds(layanan_ids, layanan_id);
        const bookingStatus = status || "Menunggu";

        if (!user_id || !kendaraan_id || !tanggal_booking || !jam_booking || selectedLayananIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Pelanggan, kendaraan, minimal 1 layanan, tanggal, dan jam booking wajib diisi"
            });
        }

        if (!VALID_STATUSES.includes(bookingStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status booking tidak valid (pilih: Menunggu, Diproses, Selesai)"
            });
        }

        const [kendaraanRows] = await db.query(
            "SELECT id FROM kendaraan WHERE id = ? AND user_id = ?",
            [kendaraan_id, user_id]
        );

        if (kendaraanRows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Kendaraan tidak ditemukan atau bukan milik pelanggan yang dipilih"
            });
        }

        const [layananRows] = await db.query(
            "SELECT id FROM layanan WHERE id IN (?)",
            [selectedLayananIds]
        );

        if (layananRows.length !== selectedLayananIds.length) {
            return res.status(404).json({
                success: false,
                message: "Salah satu layanan yang dipilih tidak ditemukan"
            });
        }

        const created = await insertBookingWithDetails({
            userId: user_id,
            kendaraanId: kendaraan_id,
            layananIds: selectedLayananIds,
            tanggalBooking: tanggal_booking,
            jamBooking: jam_booking,
            keluhan,
            status: bookingStatus
        });

        res.status(201).json({
            success: true,
            message: "Booking berhasil ditambahkan",
            kode_booking: created.kode_booking,
            data: created
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: mengedit booking (termasuk rincian layanan)
export const adminUpdateBooking = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { id } = req.params;
        const {
            user_id,
            kendaraan_id,
            layanan_id,
            layanan_ids,
            tanggal_booking,
            jam_booking,
            keluhan,
            status
        } = req.body;

        const selectedLayananIds = normalizeLayananIds(layanan_ids, layanan_id);

        if (!user_id || !kendaraan_id || !tanggal_booking || !jam_booking || selectedLayananIds.length === 0) {
            conn.release();
            return res.status(400).json({
                success: false,
                message: "Pelanggan, kendaraan, minimal 1 layanan, tanggal, dan jam booking wajib diisi"
            });
        }

        if (status && !VALID_STATUSES.includes(status)) {
            conn.release();
            return res.status(400).json({
                success: false,
                message: "Status booking tidak valid (pilih: Menunggu, Diproses, Selesai)"
            });
        }

        const [existing] = await conn.query(
            "SELECT id, status FROM booking WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            conn.release();
            return res.status(404).json({
                success: false,
                message: "Booking tidak ditemukan"
            });
        }

        const [kendaraanRows] = await conn.query(
            "SELECT id FROM kendaraan WHERE id = ? AND user_id = ?",
            [kendaraan_id, user_id]
        );

        if (kendaraanRows.length === 0) {
            conn.release();
            return res.status(400).json({
                success: false,
                message: "Kendaraan tidak ditemukan atau bukan milik pelanggan yang dipilih"
            });
        }

        const [layananRows] = await conn.query(
            "SELECT id FROM layanan WHERE id IN (?)",
            [selectedLayananIds]
        );

        if (layananRows.length !== selectedLayananIds.length) {
            conn.release();
            return res.status(404).json({
                success: false,
                message: "Salah satu layanan yang dipilih tidak ditemukan"
            });
        }

        await conn.beginTransaction();

        await conn.query(
            `UPDATE booking
             SET user_id = ?, kendaraan_id = ?, tanggal_booking = ?, jam_booking = ?, keluhan = ?, status = ?
             WHERE id = ?`,
            [
                user_id,
                kendaraan_id,
                tanggal_booking,
                jam_booking,
                keluhan?.trim() || null,
                status || existing[0].status,
                id
            ]
        );

        await conn.query("DELETE FROM detail_booking WHERE booking_id = ?", [id]);

        const detailValues = selectedLayananIds.map((layananId) => [Number(id), layananId]);
        await conn.query(
            "INSERT INTO detail_booking (booking_id, layanan_id) VALUES ?",
            [detailValues]
        );

        await conn.commit();
        conn.release();

        res.json({
            success: true,
            message: "Data booking berhasil diperbarui"
        });
    } catch (error) {
        try {
            await conn.rollback();
        } catch {
            // ignore rollback error if transaction hasn't started
        }
        conn.release();

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: menghapus booking
export const adminDeleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM booking WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Booking berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: mengubah status booking
export const updateStatusBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status booking tidak valid (pilih: Menunggu, Diproses, Selesai)"
            });
        }

        const [result] = await db.query(
            `UPDATE booking
             SET status = ?
             WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Status booking berhasil diubah"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};