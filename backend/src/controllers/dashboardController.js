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

        const [[pendapatan]] = await db.query(`
            SELECT COALESCE(SUM(layanan.harga), 0) AS total_pendapatan
            FROM booking
            JOIN detail_booking ON booking.id = detail_booking.booking_id
            JOIN layanan ON detail_booking.layanan_id = layanan.id
            WHERE booking.status = 'Selesai'
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