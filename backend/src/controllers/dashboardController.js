import db from "../config/database.js";

export const getDashboard = async (req, res) => {
    try {
        const [[user]] = await db.query(
            "SELECT COUNT(*) AS total_user FROM users WHERE role = 'pelanggan'"
        );

        const [[kendaraan]] = await db.query(
            "SELECT COUNT(*) AS total_kendaraan FROM kendaraan"
        );

        const [[booking]] = await db.query(
            "SELECT COUNT(*) AS total_booking FROM booking"
        );

        const [[layanan]] = await db.query(
            "SELECT COUNT(*) AS total_layanan FROM layanan"
        );

        const [[menunggu]] = await db.query(
            "SELECT COUNT(*) AS total FROM booking WHERE status = 'Menunggu'"
        );

        const [[diproses]] = await db.query(
            "SELECT COUNT(*) AS total FROM booking WHERE status = 'Diproses'"
        );

        const [[selesai]] = await db.query(
            "SELECT COUNT(*) AS total FROM booking WHERE status = 'Selesai'"
        );

        // Saldo / pendapatan hanya dihitung dari pembayaran yang sudah di-ACC / dikonfirmasi LUNAS oleh admin
        const [[pendapatan]] = await db.query(`
            SELECT COALESCE(SUM(
                COALESCE(
                    NULLIF(pembayaran.gross_amount, 0),
                    sub_biaya.total_biaya
                )
            ), 0) AS total_pendapatan
            FROM pembayaran
            JOIN booking ON pembayaran.booking_id = booking.id
            LEFT JOIN (
                SELECT
                    detail_booking.booking_id,
                    COALESCE(SUM(layanan.harga), 0) AS total_biaya
                FROM detail_booking
                JOIN layanan ON detail_booking.layanan_id = layanan.id
                GROUP BY detail_booking.booking_id
            ) AS sub_biaya ON booking.id = sub_biaya.booking_id
            WHERE pembayaran.status_pembayaran = 'lunas'
        `);

        res.json({
            success: true,
            data: {
                total_user: user.total_user,
                total_kendaraan: kendaraan.total_kendaraan,
                total_booking: booking.total_booking,
                total_layanan: layanan.total_layanan,
                menunggu: menunggu.total,
                diproses: diproses.total,
                selesai: selesai.total,
                total_pendapatan: Number(pendapatan.total_pendapatan || 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};