// import db from "../config/database.js";
// import { generateKodeBooking } from "../utils/generateKodeBooking.js";

// const VALID_STATUSES = ["Menunggu", "Diproses", "Selesai"];

// const normalizeLayananIds = (layanan_ids, layanan_id) => {
//     let ids = [];

//     if (Array.isArray(layanan_ids)) {
//         ids = layanan_ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
//     } else if (layanan_id !== undefined && layanan_id !== null && layanan_id !== "") {
//         const parsed = Number(layanan_id);
//         if (Number.isInteger(parsed) && parsed > 0) {
//             ids = [parsed];
//         }
//     }

//     return [...new Set(ids)];
// };

// const insertBookingWithDetails = async ({
//     userId,
//     kendaraanId,
//     layananIds,
//     tanggalBooking,
//     jamBooking,
//     keluhan,
//     status = "Menunggu"
// }) => {
//     const conn = await db.getConnection();
//     try {
//         await conn.beginTransaction();

//         const kode = generateKodeBooking();

//         const [bookingResult] = await conn.query(
//             `INSERT INTO booking
//             (kode_booking, user_id, kendaraan_id, tanggal_booking, jam_booking, keluhan, status)
//             VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 kode,
//                 userId,
//                 kendaraanId,
//                 tanggalBooking,
//                 jamBooking,
//                 keluhan?.trim() || null,
//                 status
//             ]
//         );

//         const bookingId = bookingResult.insertId;
//         const detailValues = layananIds.map((layananId) => [bookingId, layananId]);

//         await conn.query(
//             `INSERT INTO detail_booking (booking_id, layanan_id) VALUES ?`,
//             [detailValues]
//         );

//         await conn.commit();

//         return { id: bookingId, kode_booking: kode };
//     } catch (error) {
//         await conn.rollback();
//         throw error;
//     } finally {
//         conn.release();
//     }
// };

// const getLatestPaymentMap = async (bookingIds) => {
//     const payMap = new Map();
//     if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
//         return payMap;
//     }

//     try {
//         const [payRows] = await db.query(
//             `SELECT
//                 id,
//                 booking_id,
//                 order_id,
//                 metode_pembayaran,
//                 status_pembayaran,
//                 payment_type,
//                 midtrans_transaction_id,
//                 redirect_url,
//                 paid_at
//              FROM pembayaran
//              WHERE booking_id IN (?)
//              ORDER BY id DESC`,
//             [bookingIds]
//         );

//         for (const p of payRows) {
//             if (!payMap.has(p.booking_id)) {
//                 payMap.set(p.booking_id, p);
//             }
//         }
//     } catch (payErr) {
//         console.warn("Info pembayaran belum tersedia:", payErr.message);
//     }

//     return payMap;
// };

// // Pelanggan: membuat booking baru (mendukung 1 atau banyak layanan)
// export const createBooking = async (req, res) => {
//     try {
//         const {
//             kendaraan_id,
//             layanan_id,
//             layanan_ids,
//             tanggal_booking,
//             jam_booking,
//             keluhan
//         } = req.body;

//         const selectedLayananIds = normalizeLayananIds(layanan_ids, layanan_id);

//         if (!kendaraan_id || !tanggal_booking || !jam_booking || selectedLayananIds.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Kendaraan, minimal 1 layanan, tanggal booking, dan jam booking wajib diisi"
//             });
//         }

//         // Pastikan kendaraan milik user yang sedang login
//         const [kendaraanRows] = await db.query(
//             "SELECT id FROM kendaraan WHERE id = ? AND user_id = ?",
//             [kendaraan_id, req.user.id]
//         );

//         if (kendaraanRows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Kendaraan tidak ditemukan atau bukan milik Anda"
//             });
//         }

//         // Pastikan semua layanan valid
//         const [layananRows] = await db.query(
//             "SELECT id FROM layanan WHERE id IN (?)",
//             [selectedLayananIds]
//         );

//         if (layananRows.length !== selectedLayananIds.length) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Salah satu layanan yang dipilih tidak ditemukan"
//             });
//         }

//         const created = await insertBookingWithDetails({
//             userId: req.user.id,
//             kendaraanId: kendaraan_id,
//             layananIds: selectedLayananIds,
//             tanggalBooking: tanggal_booking,
//             jamBooking: jam_booking,
//             keluhan
//         });

//         res.status(201).json({
//             success: true,
//             message: "Booking berhasil dibuat",
//             kode_booking: created.kode_booking,
//             data: created
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Pelanggan: melihat riwayat & status booking miliknya
// export const getBooking = async (req, res) => {
//     try {
//         const [rows] = await db.query(
//             `SELECT
//                 booking.id,
//                 booking.kode_booking,
//                 booking.user_id,
//                 booking.kendaraan_id,
//                 DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
//                 booking.jam_booking,
//                 booking.keluhan,
//                 booking.status,
//                 booking.created_at,
//                 booking.updated_at,

//                 kendaraan.merk,
//                 kendaraan.tipe,
//                 kendaraan.plat_nomor,

//                 GROUP_CONCAT(layanan.id ORDER BY layanan.id) AS layanan_ids,
//                 GROUP_CONCAT(layanan.nama_layanan ORDER BY layanan.id SEPARATOR ', ') AS nama_layanan,
//                 COALESCE(SUM(layanan.harga), 0) AS total_harga

//             FROM booking
//             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
//             LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
//             LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
//             WHERE booking.user_id = ?
//             GROUP BY booking.id
//             ORDER BY booking.created_at DESC`,
//             [req.user.id]
//         );

//         const payMap = await getLatestPaymentMap(rows.map((r) => r.id));

//         const formatted = rows.map((row) => {
//             const pay = payMap.get(row.id) || null;
//             const names = row.nama_layanan ? row.nama_layanan.split(", ") : [];
//             return {
//                 ...row,
//                 pembayaran_id: pay?.id || null,
//                 order_id: pay?.order_id || null,
//                 metode_pembayaran: pay?.metode_pembayaran || null,
//                 status_pembayaran: pay?.status_pembayaran || "belum_bayar",
//                 payment_type: pay?.payment_type || null,
//                 midtrans_paid: Boolean(pay?.midtrans_transaction_id),
//                 redirect_url: pay?.redirect_url || null,
//                 paid_at: pay?.paid_at || null,
//                 layanan: names.map((nama) => ({ nama_layanan: nama })),
//             };
//         });

//         res.json({
//             success: true,
//             data: formatted
//         });
//     } catch (error) {
//         console.error("ERROR GET BOOKING:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Pelanggan / Admin: melihat detail 1 booking beserta rincian layanan & pembayaran
// export const getBookingById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [rows] = await db.query(
//             `SELECT
//                 booking.id,
//                 booking.kode_booking,
//                 booking.user_id,
//                 booking.kendaraan_id,
//                 DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
//                 booking.jam_booking,
//                 booking.keluhan,
//                 booking.status,
//                 booking.created_at,

//                 users.nama,
//                 users.email,
//                 users.no_hp,

//                 kendaraan.merk,
//                 kendaraan.tipe,
//                 kendaraan.tahun,
//                 kendaraan.plat_nomor,
//                 kendaraan.warna

//             FROM booking
//             JOIN users ON booking.user_id = users.id
//             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
//             WHERE booking.id = ?`,
//             [id]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking tidak ditemukan"
//             });
//         }

//         const bookingData = rows[0];

//         if (req.user.role !== "admin" && bookingData.user_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Akses ditolak"
//             });
//         }

//         const [layananItems] = await db.query(
//             `SELECT layanan.id, layanan.nama_layanan, layanan.harga, layanan.estimasi
//              FROM detail_booking
//              JOIN layanan ON detail_booking.layanan_id = layanan.id
//              WHERE detail_booking.booking_id = ?`,
//             [id]
//         );

//         const total_harga = layananItems.reduce(
//             (sum, item) => sum + Number(item.harga || 0),
//             0
//         );

//         const payMap = await getLatestPaymentMap([bookingData.id]);
//         const pay = payMap.get(bookingData.id) || null;

//         res.json({
//             success: true,
//             data: {
//                 ...bookingData,
//                 layanan: layananItems,
//                 layanan_ids: layananItems.map((l) => l.id),
//                 total_harga,
//                 pembayaran_id: pay?.id || null,
//                 order_id: pay?.order_id || null,
//                 metode_pembayaran: pay?.metode_pembayaran || null,
//                 status_pembayaran: pay?.status_pembayaran || "belum_bayar",
//                 payment_type: pay?.payment_type || null,
//                 midtrans_paid: Boolean(pay?.midtrans_transaction_id),
//                 redirect_url: pay?.redirect_url || null,
//                 paid_at: pay?.paid_at || null,
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Admin: melihat semua booking (mendukung pencarian & filter status/tanggal + info pembayaran)
// export const getAllBooking = async (req, res) => {
//     try {
//         const { search, status, tanggal } = req.query;

//         let query = `
//             SELECT
//                 booking.id,
//                 booking.kode_booking,
//                 booking.user_id,
//                 booking.kendaraan_id,
//                 DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
//                 booking.jam_booking,
//                 booking.keluhan,
//                 booking.status,
//                 booking.created_at,

//                 users.nama,
//                 users.no_hp,
//                 users.email,

//                 kendaraan.merk,
//                 kendaraan.tipe,
//                 kendaraan.plat_nomor,

//                 GROUP_CONCAT(layanan.id ORDER BY layanan.id) AS layanan_ids,
//                 GROUP_CONCAT(
//                     layanan.nama_layanan
//                     ORDER BY layanan.id
//                     SEPARATOR ', '
//                 ) AS nama_layanan,

//                 COALESCE(SUM(layanan.harga), 0) AS total_harga

//             FROM booking
//             JOIN users ON booking.user_id = users.id
//             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
//             LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
//             LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
//             WHERE 1=1
//         `;

//         const params = [];

//         if (status && VALID_STATUSES.includes(status)) {
//             query += ` AND booking.status = ?`;
//             params.push(status);
//         }

//         if (tanggal) {
//             query += ` AND booking.tanggal_booking = ?`;
//             params.push(tanggal);
//         }

//         if (search && search.trim()) {
//             const keyword = `%${search.trim()}%`;
//             query += ` AND (
//                 booking.kode_booking LIKE ?
//                 OR users.nama LIKE ?
//                 OR kendaraan.merk LIKE ?
//                 OR kendaraan.tipe LIKE ?
//                 OR kendaraan.plat_nomor LIKE ?
//             )`;
//             params.push(keyword, keyword, keyword, keyword, keyword);
//         }

//         query += ` GROUP BY booking.id ORDER BY booking.created_at DESC`;

//         const [rows] = await db.query(query, params);
//         const payMap = await getLatestPaymentMap(rows.map((r) => r.id));

//         const formatted = rows.map((row) => {
//             const pay = payMap.get(row.id) || null;
//             return {
//                 ...row,
//                 pembayaran_id: pay?.id || null,
//                 order_id: pay?.order_id || null,
//                 metode_pembayaran: pay?.metode_pembayaran || null,
//                 status_pembayaran: pay?.status_pembayaran || "belum_bayar",
//                 payment_type: pay?.payment_type || null,
//                 midtrans_paid: Boolean(pay?.midtrans_transaction_id),
//                 redirect_url: pay?.redirect_url || null,
//                 paid_at: pay?.paid_at || null,
//             };
//         });

//         res.json({
//             success: true,
//             data: formatted
//         });
//     } catch (error) {
//         console.error("ERROR GET ALL BOOKING:", error);

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Admin: membuat booking baru atas nama pelanggan
// export const adminCreateBooking = async (req, res) => {
//     try {
//         const {
//             user_id,
//             kendaraan_id,
//             layanan_id,
//             layanan_ids,
//             tanggal_booking,
//             jam_booking,
//             keluhan,
//             status
//         } = req.body;

//         const selectedLayananIds = normalizeLayananIds(layanan_ids, layanan_id);
//         const bookingStatus = status || "Menunggu";

//         if (!user_id || !kendaraan_id || !tanggal_booking || !jam_booking || selectedLayananIds.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Pelanggan, kendaraan, minimal 1 layanan, tanggal, dan jam booking wajib diisi"
//             });
//         }

//         if (!VALID_STATUSES.includes(bookingStatus)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Status booking tidak valid (pilih: Menunggu, Diproses, Selesai)"
//             });
//         }

//         const [kendaraanRows] = await db.query(
//             "SELECT id FROM kendaraan WHERE id = ? AND user_id = ?",
//             [kendaraan_id, user_id]
//         );

//         if (kendaraanRows.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Kendaraan tidak ditemukan atau bukan milik pelanggan yang dipilih"
//             });
//         }

//         const [layananRows] = await db.query(
//             "SELECT id FROM layanan WHERE id IN (?)",
//             [selectedLayananIds]
//         );

//         if (layananRows.length !== selectedLayananIds.length) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Salah satu layanan yang dipilih tidak ditemukan"
//             });
//         }

//         const created = await insertBookingWithDetails({
//             userId: user_id,
//             kendaraanId: kendaraan_id,
//             layananIds: selectedLayananIds,
//             tanggalBooking: tanggal_booking,
//             jamBooking: jam_booking,
//             keluhan,
//             status: bookingStatus
//         });

//         res.status(201).json({
//             success: true,
//             message: "Booking berhasil ditambahkan",
//             kode_booking: created.kode_booking,
//             data: created
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Admin: mengedit booking (termasuk rincian layanan)
// export const adminUpdateBooking = async (req, res) => {
//     const conn = await db.getConnection();
//     try {
//         const { id } = req.params;
//         const {
//             user_id,
//             kendaraan_id,
//             layanan_id,
//             layanan_ids,
//             tanggal_booking,
//             jam_booking,
//             keluhan,
//             status
//         } = req.body;

//         const selectedLayananIds = normalizeLayananIds(layanan_ids, layanan_id);

//         if (!user_id || !kendaraan_id || !tanggal_booking || !jam_booking || selectedLayananIds.length === 0) {
//             conn.release();
//             return res.status(400).json({
//                 success: false,
//                 message: "Pelanggan, kendaraan, minimal 1 layanan, tanggal, dan jam booking wajib diisi"
//             });
//         }

//         if (status && !VALID_STATUSES.includes(status)) {
//             conn.release();
//             return res.status(400).json({
//                 success: false,
//                 message: "Status booking tidak valid (pilih: Menunggu, Diproses, Selesai)"
//             });
//         }

//         const [existing] = await conn.query(
//             "SELECT id, status FROM booking WHERE id = ?",
//             [id]
//         );

//         if (existing.length === 0) {
//             conn.release();
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking tidak ditemukan"
//             });
//         }

//         const [kendaraanRows] = await conn.query(
//             "SELECT id FROM kendaraan WHERE id = ? AND user_id = ?",
//             [kendaraan_id, user_id]
//         );

//         if (kendaraanRows.length === 0) {
//             conn.release();
//             return res.status(400).json({
//                 success: false,
//                 message: "Kendaraan tidak ditemukan atau bukan milik pelanggan yang dipilih"
//             });
//         }

//         const [layananRows] = await conn.query(
//             "SELECT id FROM layanan WHERE id IN (?)",
//             [selectedLayananIds]
//         );

//         if (layananRows.length !== selectedLayananIds.length) {
//             conn.release();
//             return res.status(404).json({
//                 success: false,
//                 message: "Salah satu layanan yang dipilih tidak ditemukan"
//             });
//         }

//         await conn.beginTransaction();

//         await conn.query(
//             `UPDATE booking
//              SET user_id = ?, kendaraan_id = ?, tanggal_booking = ?, jam_booking = ?, keluhan = ?, status = ?
//              WHERE id = ?`,
//             [
//                 user_id,
//                 kendaraan_id,
//                 tanggal_booking,
//                 jam_booking,
//                 keluhan?.trim() || null,
//                 status || existing[0].status,
//                 id
//             ]
//         );

//         await conn.query("DELETE FROM detail_booking WHERE booking_id = ?", [id]);

//         const detailValues = selectedLayananIds.map((layananId) => [Number(id), layananId]);
//         await conn.query(
//             "INSERT INTO detail_booking (booking_id, layanan_id) VALUES ?",
//             [detailValues]
//         );

//         await conn.commit();
//         conn.release();

//         res.json({
//             success: true,
//             message: "Data booking berhasil diperbarui"
//         });
//     } catch (error) {
//         try {
//             await conn.rollback();
//         } catch {
//             // ignore rollback error if transaction hasn't started
//         }
//         conn.release();

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Admin: menghapus booking
// export const adminDeleteBooking = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [result] = await db.query(
//             "DELETE FROM booking WHERE id = ?",
//             [id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking tidak ditemukan"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Booking berhasil dihapus"
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Admin: mengubah status booking
// export const updateStatusBooking = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         if (!status || !VALID_STATUSES.includes(status)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Status booking tidak valid (pilih: Menunggu, Diproses, Selesai)"
//             });
//         }

//         const [result] = await db.query(
//             `UPDATE booking
//              SET status = ?
//              WHERE id = ?`,
//             [status, id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking tidak ditemukan"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Status booking berhasil diubah"
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

import db from "../config/database.js";
import { generateKodeBooking } from "../utils/generateKodeBooking.js";

const VALID_STATUSES = ["Menunggu", "Diproses", "Selesai"];
const JAM_BUKA = "07:30";
const JAM_TUTUP = "19:00";

const normalizeJamHHMM = (rawJam) => {
    if (typeof rawJam !== "string") return null;
    const trimmed = rawJam.trim();
    const match = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/);
    if (!match) return null;
    const hh = String(Number(match[1])).padStart(2, "0");
    const mm = match[2];
    return `${hh}:${mm}`;
};

const isWithinJamOperasional = (jamHHMM) => {
    return jamHHMM >= JAM_BUKA && jamHHMM <= JAM_TUTUP;
};

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

const getLatestPaymentMap = async (bookingIds) => {
    const payMap = new Map();
    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        return payMap;
    }

    try {
        const [payRows] = await db.query(
            `SELECT
                id,
                booking_id,
                order_id,
                metode_pembayaran,
                status_pembayaran,
                payment_type,
                midtrans_transaction_id,
                redirect_url,
                paid_at
             FROM pembayaran
             WHERE booking_id IN (?)
             ORDER BY id DESC`,
            [bookingIds]
        );

        for (const p of payRows) {
            if (!payMap.has(p.booking_id)) {
                payMap.set(p.booking_id, p);
            }
        }
    } catch (payErr) {
        console.warn("Info pembayaran belum tersedia:", payErr.message);
    }

    return payMap;
};

// Pelanggan: cek jumlah antrian & daftar kendaraan pada tanggal & jam tertentu
export const getAntrianJadwal = async (req, res) => {
    try {
        const { tanggal, jam } = req.query;

        if (!tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(String(tanggal).trim())) {
            return res.status(400).json({
                success: false,
                message: "Parameter tanggal wajib diisi dengan format YYYY-MM-DD"
            });
        }

        const normalizedJam = normalizeJamHHMM(jam || "");
        if (!normalizedJam) {
            return res.status(400).json({
                success: false,
                message: "Parameter jam wajib diisi dengan format HH:MM (contoh: 09:00)"
            });
        }

        const cleanTanggal = String(tanggal).trim();

        const [rows] = await db.query(
            `SELECT
                booking.id,
                booking.kode_booking,
                booking.jam_booking,
                booking.status,
                kendaraan.merk,
                kendaraan.tipe,
                kendaraan.plat_nomor,
                kendaraan.warna
             FROM booking
             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
             WHERE DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') = ?
               AND TIME_FORMAT(booking.jam_booking, '%H:%i') = ?
               AND booking.status IN ('Menunggu', 'Diproses')
             ORDER BY booking.created_at ASC, booking.id ASC`,
            [cleanTanggal, normalizedJam]
        );

        res.json({
            success: true,
            data: {
                tanggal: cleanTanggal,
                jam: normalizedJam,
                jam_buka: JAM_BUKA,
                jam_tutup: JAM_TUTUP,
                dalam_jam_operasional: isWithinJamOperasional(normalizedJam),
                jumlah_antrian: rows.length,
                daftar_kendaraan: rows
            }
        });
    } catch (error) {
        console.error("ERROR GET ANTRIAN JADWAL:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
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

        const normalizedJam = normalizeJamHHMM(jam_booking);
        if (!normalizedJam) {
            return res.status(400).json({
                success: false,
                message: "Format jam booking tidak valid. Gunakan format HH:MM (contoh: 08:30)"
            });
        }

        if (!isWithinJamOperasional(normalizedJam)) {
            return res.status(400).json({
                success: false,
                message: `Jam booking di luar jam operasional bengkel (${JAM_BUKA} - ${JAM_TUTUP})`
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
            jamBooking: normalizedJam,
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

        const payMap = await getLatestPaymentMap(rows.map((r) => r.id));

        const formatted = rows.map((row) => {
            const pay = payMap.get(row.id) || null;
            const names = row.nama_layanan ? row.nama_layanan.split(", ") : [];
            return {
                ...row,
                pembayaran_id: pay?.id || null,
                order_id: pay?.order_id || null,
                metode_pembayaran: pay?.metode_pembayaran || null,
                status_pembayaran: pay?.status_pembayaran || "belum_bayar",
                payment_type: pay?.payment_type || null,
                midtrans_paid: Boolean(pay?.midtrans_transaction_id),
                redirect_url: pay?.redirect_url || null,
                paid_at: pay?.paid_at || null,
                layanan: names.map((nama) => ({ nama_layanan: nama })),
            };
        });

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error("ERROR GET BOOKING:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan / Admin: melihat detail 1 booking beserta rincian layanan & pembayaran
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

        const payMap = await getLatestPaymentMap([bookingData.id]);
        const pay = payMap.get(bookingData.id) || null;

        res.json({
            success: true,
            data: {
                ...bookingData,
                layanan: layananItems,
                layanan_ids: layananItems.map((l) => l.id),
                total_harga,
                pembayaran_id: pay?.id || null,
                order_id: pay?.order_id || null,
                metode_pembayaran: pay?.metode_pembayaran || null,
                status_pembayaran: pay?.status_pembayaran || "belum_bayar",
                payment_type: pay?.payment_type || null,
                midtrans_paid: Boolean(pay?.midtrans_transaction_id),
                redirect_url: pay?.redirect_url || null,
                paid_at: pay?.paid_at || null,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: melihat semua booking (mendukung pencarian & filter status/tanggal + info pembayaran)
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
        const payMap = await getLatestPaymentMap(rows.map((r) => r.id));

        const formatted = rows.map((row) => {
            const pay = payMap.get(row.id) || null;
            return {
                ...row,
                pembayaran_id: pay?.id || null,
                order_id: pay?.order_id || null,
                metode_pembayaran: pay?.metode_pembayaran || null,
                status_pembayaran: pay?.status_pembayaran || "belum_bayar",
                payment_type: pay?.payment_type || null,
                midtrans_paid: Boolean(pay?.midtrans_transaction_id),
                redirect_url: pay?.redirect_url || null,
                paid_at: pay?.paid_at || null,
            };
        });

        res.json({
            success: true,
            data: formatted
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

        const normalizedJam = normalizeJamHHMM(jam_booking);
        if (!normalizedJam) {
            return res.status(400).json({
                success: false,
                message: "Format jam booking tidak valid. Gunakan format HH:MM (contoh: 08:30)"
            });
        }

        if (!isWithinJamOperasional(normalizedJam)) {
            return res.status(400).json({
                success: false,
                message: `Jam booking di luar jam operasional bengkel (${JAM_BUKA} - ${JAM_TUTUP})`
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
            jamBooking: normalizedJam,
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

        const normalizedJam = normalizeJamHHMM(jam_booking);
        if (!normalizedJam) {
            conn.release();
            return res.status(400).json({
                success: false,
                message: "Format jam booking tidak valid. Gunakan format HH:MM (contoh: 08:30)"
            });
        }

        if (!isWithinJamOperasional(normalizedJam)) {
            conn.release();
            return res.status(400).json({
                success: false,
                message: `Jam booking di luar jam operasional bengkel (${JAM_BUKA} - ${JAM_TUTUP})`
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
                normalizedJam,
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