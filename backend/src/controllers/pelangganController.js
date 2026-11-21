import db from "../config/database.js";
import bcrypt from "bcrypt";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Menampilkan semua pelanggan
export const getAllPelanggan = async (req, res) => {
    try {
        const { search } = req.query;
        let query = `
            SELECT id, nama, email, no_hp, address, created_at
            FROM users
            WHERE role = 'pelanggan'
        `;
        const params = [];

        if (search && search.trim()) {
            const keyword = `%${search.trim()}%`;
            query += ` AND (nama LIKE ? OR email LIKE ? OR no_hp LIKE ?)`;
            params.push(keyword, keyword, keyword);
        }

        query += ` ORDER BY created_at DESC`;

        const [rows] = await db.query(query, params);

        res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Menampilkan detail pelanggan
export const getPelangganById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT id, nama, email, no_hp, address, created_at
             FROM users
             WHERE id = ? AND role = 'pelanggan'`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pelanggan tidak ditemukan",
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Menambahkan pelanggan
export const createPelanggan = async (req, res) => {
    try {
        const { nama, email, password, no_hp, address } = req.body;

        const cleanNama = nama?.trim();
        const cleanEmail = email?.trim().toLowerCase();
        const cleanNoHp = no_hp?.trim();
        const cleanAddress = address?.trim() || null;

        if (!cleanNama || !cleanEmail || !password || !cleanNoHp) {
            return res.status(400).json({
                success: false,
                message: "Nama, email, password, dan nomor HP wajib diisi",
            });
        }

        if (!EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Format email tidak valid",
            });
        }

        if (String(password).length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password minimal 6 karakter",
            });
        }

        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [cleanEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO users (nama, email, password, no_hp, address, role)
             VALUES (?, ?, ?, ?, ?, 'pelanggan')`,
            [cleanNama, cleanEmail, hashedPassword, cleanNoHp, cleanAddress]
        );

        res.status(201).json({
            success: true,
            message: "Pelanggan berhasil ditambahkan",
            data: {
                id: result.insertId,
                nama: cleanNama,
                email: cleanEmail,
                no_hp: cleanNoHp,
                address: cleanAddress,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Mengedit pelanggan
export const updatePelanggan = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, no_hp, address, password } = req.body;

        const cleanNama = nama?.trim();
        const cleanEmail = email?.trim().toLowerCase();
        const cleanNoHp = no_hp?.trim();
        const cleanAddress = address?.trim() || null;

        if (!cleanNama || !cleanEmail || !cleanNoHp) {
            return res.status(400).json({
                success: false,
                message: "Nama, email, dan nomor HP wajib diisi",
            });
        }

        if (!EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Format email tidak valid",
            });
        }

        if (password && String(password).length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password baru minimal 6 karakter",
            });
        }

        const [pelanggan] = await db.query(
            "SELECT id FROM users WHERE id = ? AND role = 'pelanggan'",
            [id]
        );

        if (pelanggan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pelanggan tidak ditemukan",
            });
        }

        const [existingEmail] = await db.query(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [cleanEmail, id]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email sudah digunakan pengguna lain",
            });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                `UPDATE users
                 SET nama = ?, email = ?, no_hp = ?, address = ?, password = ?
                 WHERE id = ? AND role = 'pelanggan'`,
                [cleanNama, cleanEmail, cleanNoHp, cleanAddress, hashedPassword, id]
            );
        } else {
            await db.query(
                `UPDATE users
                 SET nama = ?, email = ?, no_hp = ?, address = ?
                 WHERE id = ? AND role = 'pelanggan'`,
                [cleanNama, cleanEmail, cleanNoHp, cleanAddress, id]
            );
        }

        res.json({
            success: true,
            message: "Data pelanggan berhasil diperbarui",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Menghapus pelanggan
export const deletePelanggan = async (req, res) => {
    try {
        const { id } = req.params;

        const [pelanggan] = await db.query(
            "SELECT id FROM users WHERE id = ? AND role = 'pelanggan'",
            [id]
        );

        if (pelanggan.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pelanggan tidak ditemukan",
            });
        }

        await db.query(
            "DELETE FROM users WHERE id = ? AND role = 'pelanggan'",
            [id]
        );

        res.json({
            success: true,
            message: "Pelanggan berhasil dihapus",
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                success: false,
                message: "Pelanggan tidak bisa dihapus karena masih memiliki data kendaraan atau booking",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};