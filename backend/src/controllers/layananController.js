import db from "../config/database.js";

export const getLayanan = async (req, res) => {
    try {

        const [rows] = await db.query(
            "SELECT * FROM layanan ORDER BY id DESC"
        );

        res.status(200).json({
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

export const getLayananById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM layanan WHERE id=?",
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Layanan tidak ditemukan"
            });

        }

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const createLayanan = async (req, res) => {

    try {

        const {
            nama_layanan,
            deskripsi,
            harga,
            estimasi
        } = req.body;

        await db.query(
            `INSERT INTO layanan
            (nama_layanan,deskripsi,harga,estimasi)
            VALUES(?,?,?,?)`,
            [
                nama_layanan,
                deskripsi,
                harga,
                estimasi
            ]
        );

        res.status(201).json({
            success: true,
            message: "Layanan berhasil ditambahkan"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateLayanan = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nama_layanan,
            deskripsi,
            harga,
            estimasi
        } = req.body;

        await db.query(
            `UPDATE layanan
            SET
            nama_layanan=?,
            deskripsi=?,
            harga=?,
            estimasi=?
            WHERE id=?`,
            [
                nama_layanan,
                deskripsi,
                harga,
                estimasi,
                id
            ]
        );

        res.json({
            success: true,
            message: "Layanan berhasil diupdate"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const deleteLayanan = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM layanan WHERE id=?",
            [id]
        );

        res.json({
            success: true,
            message: "Layanan berhasil dihapus"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};