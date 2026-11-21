
import db from "../config/database.js";

const validateKendaraanInput = ({ merk, tipe, tahun, plat_nomor }) => {
    const cleanMerk = merk?.trim();
    const cleanTipe = tipe?.trim();
    const cleanPlat = plat_nomor?.trim().toUpperCase();
    const parsedTahun = Number(tahun);
    const maxYear = new Date().getFullYear() + 1;

    if (!cleanMerk || !cleanTipe || !tahun || !cleanPlat) {
        return {
            error: "Merek, tipe, tahun, dan nomor polisi wajib diisi"
        };
    }

    if (!Number.isInteger(parsedTahun) || parsedTahun < 1901 || parsedTahun > maxYear) {
        return {
            error: `Tahun kendaraan harus berupa angka antara 1901 hingga ${maxYear}`
        };
    }

    return {
        cleanMerk,
        cleanTipe,
        parsedTahun,
        cleanPlat
    };
};

// Pelanggan: menambahkan kendaraan
export const createKendaraan = async (req, res) => {
    try {
        const { merk, tipe, tahun, plat_nomor, warna } = req.body;
        const validated = validateKendaraanInput({ merk, tipe, tahun, plat_nomor });

        if (validated.error) {
            return res.status(400).json({
                success: false,
                message: validated.error
            });
        }

        const [result] = await db.query(
            `INSERT INTO kendaraan
            (user_id, merk, tipe, tahun, plat_nomor, warna)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                validated.cleanMerk,
                validated.cleanTipe,
                validated.parsedTahun,
                validated.cleanPlat,
                warna?.trim() || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Kendaraan berhasil ditambahkan",
            data: { id: result.insertId }
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Nomor polisi (plat nomor) sudah terdaftar"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan: melihat kendaraan miliknya
export const getKendaraan = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM kendaraan WHERE user_id = ? ORDER BY created_at DESC",
            [req.user.id]
        );

        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan: melihat detail kendaraan
export const getKendaraanById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM kendaraan WHERE id = ? AND user_id = ?",
            [id, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan"
            });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan: mengedit kendaraan
export const updateKendaraan = async (req, res) => {
    try {
        const { id } = req.params;
        const { merk, tipe, tahun, plat_nomor, warna } = req.body;
        const validated = validateKendaraanInput({ merk, tipe, tahun, plat_nomor });

        if (validated.error) {
            return res.status(400).json({
                success: false,
                message: validated.error
            });
        }

        const [result] = await db.query(
            `UPDATE kendaraan
             SET merk = ?, tipe = ?, tahun = ?, plat_nomor = ?, warna = ?
             WHERE id = ? AND user_id = ?`,
            [
                validated.cleanMerk,
                validated.cleanTipe,
                validated.parsedTahun,
                validated.cleanPlat,
                warna?.trim() || null,
                id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Kendaraan berhasil diperbarui"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Nomor polisi (plat nomor) sudah terdaftar"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Pelanggan: menghapus kendaraan
export const deleteKendaraan = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM kendaraan WHERE id = ? AND user_id = ?",
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Kendaraan berhasil dihapus"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                success: false,
                message: "Kendaraan sudah digunakan dalam booking dan tidak bisa dihapus."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: melihat semua kendaraan pelanggan
export const getAllKendaraan = async (req, res) => {
    try {
        const { user_id, search } = req.query;

        let query = `
            SELECT
                kendaraan.*,
                users.nama AS nama_pelanggan,
                users.no_hp
            FROM kendaraan
            JOIN users ON kendaraan.user_id = users.id
            WHERE users.role = 'pelanggan'
        `;
        const params = [];

        if (user_id) {
            query += ` AND kendaraan.user_id = ?`;
            params.push(user_id);
        }

        if (search && search.trim()) {
            const keyword = `%${search.trim()}%`;
            query += ` AND (users.nama LIKE ? OR kendaraan.merk LIKE ? OR kendaraan.tipe LIKE ? OR kendaraan.plat_nomor LIKE ?)`;
            params.push(keyword, keyword, keyword, keyword);
        }

        query += ` ORDER BY kendaraan.created_at DESC`;

        const [rows] = await db.query(query, params);

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

// Admin: menambah kendaraan untuk pelanggan tertentu
export const adminCreateKendaraan = async (req, res) => {
    try {
        const { user_id, merk, tipe, tahun, plat_nomor, warna } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "Pemilik kendaraan (pelanggan) wajib dipilih"
            });
        }

        const validated = validateKendaraanInput({ merk, tipe, tahun, plat_nomor });
        if (validated.error) {
            return res.status(400).json({
                success: false,
                message: validated.error
            });
        }

        const [pelanggan] = await db.query(
            "SELECT id FROM users WHERE id = ? AND role = 'pelanggan'",
            [user_id]
        );

        if (pelanggan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pelanggan tidak ditemukan"
            });
        }

        const [result] = await db.query(
            `INSERT INTO kendaraan
            (user_id, merk, tipe, tahun, plat_nomor, warna)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                validated.cleanMerk,
                validated.cleanTipe,
                validated.parsedTahun,
                validated.cleanPlat,
                warna?.trim() || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Kendaraan berhasil ditambahkan",
            data: { id: result.insertId }
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Nomor polisi (plat nomor) sudah terdaftar"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: edit kendaraan
export const adminUpdateKendaraan = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, merk, tipe, tahun, plat_nomor, warna } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "Pemilik kendaraan (pelanggan) wajib dipilih"
            });
        }

        const validated = validateKendaraanInput({ merk, tipe, tahun, plat_nomor });
        if (validated.error) {
            return res.status(400).json({
                success: false,
                message: validated.error
            });
        }

        const [pelanggan] = await db.query(
            "SELECT id FROM users WHERE id = ? AND role = 'pelanggan'",
            [user_id]
        );

        if (pelanggan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pelanggan tidak ditemukan"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM kendaraan WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan"
            });
        }

        await db.query(
            `UPDATE kendaraan
             SET user_id = ?, merk = ?, tipe = ?, tahun = ?,
                 plat_nomor = ?, warna = ?
             WHERE id = ?`,
            [
                user_id,
                validated.cleanMerk,
                validated.cleanTipe,
                validated.parsedTahun,
                validated.cleanPlat,
                warna?.trim() || null,
                id
            ]
        );

        res.json({
            success: true,
            message: "Kendaraan berhasil diperbarui"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Nomor polisi (plat nomor) sudah terdaftar"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: hapus kendaraan
export const adminDeleteKendaraan = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM kendaraan WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Kendaraan berhasil dihapus"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                success: false,
                message: "Kendaraan sudah digunakan dalam booking dan tidak bisa dihapus."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};