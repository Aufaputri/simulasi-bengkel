import db from "../config/database.js";

export const createKendaraan = async (req, res) => {

    try {

        const {
            merk,
            tipe,
            tahun,
            no_polisi
        } = req.body;

        await db.query(
            `INSERT INTO kendaraan
            (user_id,merk,tipe,tahun,no_polisi)
            VALUES(?,?,?,?,?)`,
            [
                req.user.id,
                merk,
                tipe,
                tahun,
                no_polisi
            ]
        );

        res.status(201).json({
            success: true,
            message: "Kendaraan berhasil ditambahkan"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getKendaraan = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM kendaraan WHERE user_id=?",
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

export const getKendaraanById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM kendaraan WHERE id=? AND user_id=?",
            [id, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kendaraan tidak ditemukan"
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

export const updateKendaraan = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            merk,
            tipe,
            tahun,
            no_polisi
        } = req.body;

        await db.query(
            `UPDATE kendaraan
            SET
            merk=?,
            tipe=?,
            tahun=?,
            no_polisi=?
            WHERE id=? AND user_id=?`,
            [
                merk,
                tipe,
                tahun,
                no_polisi,
                id,
                req.user.id
            ]
        );

        res.json({
            success: true,
            message: "Kendaraan berhasil diupdate"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const deleteKendaraan = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM kendaraan WHERE id=? AND user_id=?",
            [id, req.user.id]
        );

        res.json({
            success: true,
            message: "Kendaraan berhasil dihapus"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};