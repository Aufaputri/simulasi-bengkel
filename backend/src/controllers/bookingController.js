import db from "../config/database.js";
import { generateKodeBooking } from "../utils/generateKodeBooking.js";

export const createBooking = async (req, res) => {

    try {

        const {

            kendaraan_id,
            layanan_id,
            tanggal_booking,
            keluhan

        } = req.body;

        const kode = generateKodeBooking();

        await db.query(

            `INSERT INTO booking
            (
                kode_booking,
                user_id,
                kendaraan_id,
                layanan_id,
                tanggal_booking,
                keluhan
            )
            VALUES(?,?,?,?,?,?)`,

            [

                kode,
                req.user.id,
                kendaraan_id,
                layanan_id,
                tanggal_booking,
                keluhan

            ]

        );

        res.status(201).json({

            success: true,
            message: "Booking berhasil dibuat",

            kode_booking: kode

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

export const getBooking = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT

            booking.*,

            kendaraan.merk,
            kendaraan.tipe,

            layanan.nama_layanan,
            layanan.harga

            FROM booking

            JOIN kendaraan
            ON booking.kendaraan_id=kendaraan.id

            JOIN layanan
            ON booking.layanan_id=layanan.id

            WHERE booking.user_id=?`

            ,

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

export const getAllBooking = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT

            booking.id,
            booking.kode_booking,
            booking.tanggal_booking,
            booking.keluhan,
            booking.status,

            users.nama,

            kendaraan.merk,
            kendaraan.tipe,
            kendaraan.no_polisi,

            layanan.nama_layanan,
            layanan.harga

            FROM booking

            JOIN users
            ON booking.user_id = users.id

            JOIN kendaraan
            ON booking.kendaraan_id = kendaraan.id

            JOIN layanan
            ON booking.layanan_id = layanan.id

            ORDER BY booking.created_at DESC`

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

export const updateStatusBooking = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        await db.query(

            `UPDATE booking
            SET status=?
            WHERE id=?`,

            [
                status,
                id
            ]

        );

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