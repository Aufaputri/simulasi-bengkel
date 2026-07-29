import db from "../config/database.js";
import bcrypt from "bcrypt";

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