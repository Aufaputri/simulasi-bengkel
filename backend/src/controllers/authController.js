import db from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    try {

        const {
            nama,
            email,
            password,
            no_hp,
            address
        } = req.body;

        // cek email
        const [cek] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (cek.length > 0) {
            return res.status(400).json({
                message: "Email sudah digunakan"
            });
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // insert user
        await db.query(
            `INSERT INTO users
            (nama,email,password,no_hp,address,role)
            VALUES(?,?,?,?,?,?)`,
            [
                nama,
                email,
                hashPassword,
                no_hp,
                address,
                "pelanggan"
            ]
        );

        res.status(201).json({
            message: "Register berhasil"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({
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
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};