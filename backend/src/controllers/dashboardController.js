import db from "../config/database.js";

export const getDashboard = async (req, res) => {

    try {

        const [[user]] = await db.query(
            "SELECT COUNT(*) AS total_user FROM users WHERE role='pelanggan'"
        );

        const [[booking]] = await db.query(
            "SELECT COUNT(*) AS total_booking FROM booking"
        );

        const [[layanan]] = await db.query(
            "SELECT COUNT(*) AS total_layanan FROM layanan"
        );

        const [[menunggu]] = await db.query(
            "SELECT COUNT(*) AS total FROM booking WHERE status='Menunggu'"
        );

        const [[diproses]] = await db.query(
            "SELECT COUNT(*) AS total FROM booking WHERE status='Diproses'"
        );

        const [[selesai]] = await db.query(
            "SELECT COUNT(*) AS total FROM booking WHERE status='Selesai'"
        );

        res.json({
            success: true,
            data: {
                total_user: user.total_user,
                total_booking: booking.total_booking,
                total_layanan: layanan.total_layanan,
                menunggu: menunggu.total,
                diproses: diproses.total,
                selesai: selesai.total
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};