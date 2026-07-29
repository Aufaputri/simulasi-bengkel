import express from "express";
import db from "./config/database.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend Booking Bengkel Berjalan "
    });
});

app.get("/test-db", async (req, res) => {

    try {

        const [rows] = await db.query("SELECT NOW() AS waktu");

        res.json({
            message: "Database berhasil terhubung",
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

app.post("/register", async (req, res) => {

    try {

        const {
            nama,
            email,
            password,
            no_hp,
            address
        } = req.body;

        await db.query(
            `INSERT INTO users
            (nama,email,password,no_hp,address)
            VALUES (?,?,?,?,?)`,
            [
                nama,
                email,
                password,
                no_hp,
                address
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

});

export default app;