import db from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
    try {
        const {
            nama,
            email,
            password,
            no_hp,
            address
        } = req.body;

        const cleanNama = nama?.trim();
        const cleanEmail = email?.trim().toLowerCase();
        const cleanNoHp = no_hp?.trim();
        const cleanAddress = address?.trim() || null;

        if (!cleanNama || !cleanEmail || !password || !cleanNoHp) {
            return res.status(400).json({
                success: false,
                message: "Nama, email, password, dan nomor HP wajib diisi"
            });
        }

        if (!EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Format email tidak valid"
            });
        }

        if (String(password).length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password minimal 6 karakter"
            });
        }

        // cek email
        const [cek] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [cleanEmail]
        );

        if (cek.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email sudah digunakan"
            });
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // insert user
        const [result] = await db.query(
            `INSERT INTO users
            (nama, email, password, no_hp, address, role)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                cleanNama,
                cleanEmail,
                hashPassword,
                cleanNoHp,
                cleanAddress,
                "pelanggan"
            ]
        );

        const token = jwt.sign(
            {
                id: result.insertId,
                role: "pelanggan"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(201).json({
            success: true,
            message: "Register berhasil",
            token,
            user: {
                id: result.insertId,
                nama: cleanNama,
                email: cleanEmail,
                no_hp: cleanNoHp,
                address: cleanAddress,
                role: "pelanggan"
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const cleanEmail = email?.trim().toLowerCase();

        if (!cleanEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan password wajib diisi"
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [cleanEmail]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Email tidak ditemukan"
            });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                no_hp: user.no_hp,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};