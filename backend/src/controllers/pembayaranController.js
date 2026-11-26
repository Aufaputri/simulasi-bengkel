// // import midtransClient from "midtrans-client";
// // import db from "../config/database.js";

// // const snap = new midtransClient.Snap({
// //     isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
// //     serverKey: process.env.MIDTRANS_SERVER_KEY,
// //     clientKey: process.env.MIDTRANS_CLIENT_KEY,
// // });

// // const getBookingWithTotal = async (bookingId) => {
// //     const [rows] = await db.query(
// //         `SELECT
// //             booking.id,
// //             booking.kode_booking,
// //             booking.user_id,
// //             booking.status,
// //             users.nama,
// //             users.email,
// //             users.no_hp,
// //             COALESCE(SUM(layanan.harga), 0) AS total_harga
// //          FROM booking
// //          JOIN users ON booking.user_id = users.id
// //          LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
// //          LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
// //          WHERE booking.id = ?
// //          GROUP BY booking.id`,
// //         [bookingId]
// //     );
// //     return rows[0] || null;
// // };

// // // Pelanggan: inisiasi pembayaran Cash atau Midtrans untuk suatu booking
// // export const createPembayaran = async (req, res) => {
// //     try {
// //         const { booking_id, metode } = req.body;
// //         const cleanMetode = String(metode || "").toLowerCase();

// //         if (!booking_id || !["cash", "midtrans"].includes(cleanMetode)) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "booking_id dan metode ('cash' atau 'midtrans') wajib diisi"
// //             });
// //         }

// //         const booking = await getBookingWithTotal(booking_id);
// //         if (!booking) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Booking tidak ditemukan"
// //             });
// //         }

// //         if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
// //             return res.status(403).json({
// //                 success: false,
// //                 message: "Akses ditolak"
// //             });
// //         }

// //         const grossAmount = Math.round(Number(booking.total_harga || 0));
// //         if (grossAmount <= 0) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Total biaya booking tidak valid (Rp 0)"
// //             });
// //         }

// //         const [existingRows] = await db.query(
// //             "SELECT * FROM pembayaran WHERE booking_id = ? ORDER BY id DESC LIMIT 1",
// //             [booking.id]
// //         );
// //         const existing = existingRows[0] || null;

// //         if (existing && existing.status_pembayaran === "lunas") {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Booking ini sudah lunas"
// //             });
// //         }

// //         // 1. Pembayaran CASH (bayar di kasir bengkel, admin konfirmasi lunas)
// //         if (cleanMetode === "cash") {
// //             const orderId = existing?.order_id || `CASH-${booking.kode_booking}-${Date.now()}`;

// //             if (existing) {
// //                 await db.query(
// //                     `UPDATE pembayaran
// //                      SET order_id = ?, metode_pembayaran = 'cash', gross_amount = ?,
// //                          status_pembayaran = 'pending', snap_token = NULL, redirect_url = NULL
// //                      WHERE id = ?`,
// //                     [orderId, grossAmount, existing.id]
// //                 );
// //             } else {
// //                 await db.query(
// //                     `INSERT INTO pembayaran
// //                      (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran)
// //                      VALUES (?, ?, 'cash', ?, 'pending')`,
// //                     [booking.id, orderId, grossAmount]
// //                 );
// //             }

// //             return res.status(200).json({
// //                 success: true,
// //                 message: "Metode pembayaran Cash dipilih. Silakan lakukan pembayaran di kasir bengkel.",
// //                 data: {
// //                     booking_id: booking.id,
// //                     order_id: orderId,
// //                     metode_pembayaran: "cash",
// //                     gross_amount: grossAmount,
// //                     status_pembayaran: "pending"
// //                 }
// //             });
// //         }

// //         // 2. Pembayaran MIDTRANS SNAP
// //         if (
// //             existing &&
// //             existing.metode_pembayaran === "midtrans" &&
// //             existing.status_pembayaran === "pending" &&
// //             existing.snap_token &&
// //             existing.redirect_url
// //         ) {
// //             return res.status(200).json({
// //                 success: true,
// //                 message: "Token pembayaran Midtrans siap digunakan",
// //                 data: {
// //                     booking_id: booking.id,
// //                     order_id: existing.order_id,
// //                     metode_pembayaran: "midtrans",
// //                     gross_amount: grossAmount,
// //                     status_pembayaran: "pending",
// //                     snap_token: existing.snap_token,
// //                     redirect_url: existing.redirect_url
// //                 }
// //             });
// //         }

// //         const orderId = `BKL-${booking.id}-${Date.now()}`;

// //         const parameter = {
// //             transaction_details: {
// //                 order_id: orderId,
// //                 gross_amount: grossAmount,
// //             },
// //             customer_details: {
// //                 first_name: booking.nama || "Pelanggan",
// //                 email: booking.email || "pelanggan@bengkel.local",
// //                 phone: booking.no_hp || "08123456789",
// //             },
// //             item_details: [
// //                 {
// //                     id: `BOOKING-${booking.id}`,
// //                     price: grossAmount,
// //                     quantity: 1,
// //                     name: `Servis ${booking.kode_booking}`.slice(0, 50),
// //                 },
// //             ],
// //         };

// //         const transaction = await snap.createTransaction(parameter);

// //         if (existing) {
// //             await db.query(
// //                 `UPDATE pembayaran
// //                  SET order_id = ?, metode_pembayaran = 'midtrans', gross_amount = ?,
// //                      status_pembayaran = 'pending', snap_token = ?, redirect_url = ?
// //                  WHERE id = ?`,
// //                 [
// //                     orderId,
// //                     grossAmount,
// //                     transaction.token,
// //                     transaction.redirect_url,
// //                     existing.id
// //                 ]
// //             );
// //         } else {
// //             await db.query(
// //                 `INSERT INTO pembayaran
// //                  (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran, snap_token, redirect_url)
// //                  VALUES (?, ?, 'midtrans', ?, 'pending', ?, ?)`,
// //                 [
// //                     booking.id,
// //                     orderId,
// //                     grossAmount,
// //                     transaction.token,
// //                     transaction.redirect_url
// //                 ]
// //             );
// //         }

// //         return res.status(200).json({
// //             success: true,
// //             message: "Transaksi Midtrans berhasil dibuat",
// //             data: {
// //                 booking_id: booking.id,
// //                 order_id: orderId,
// //                 metode_pembayaran: "midtrans",
// //                 gross_amount: grossAmount,
// //                 status_pembayaran: "pending",
// //                 snap_token: transaction.token,
// //                 redirect_url: transaction.redirect_url
// //             }
// //         });
// //     } catch (error) {
// //         console.error("ERROR CREATE PEMBAYARAN:", error);
// //         return res.status(500).json({
// //             success: false,
// //             message: error.message || "Gagal memproses pembayaran"
// //         });
// //     }
// // };

// // // Cek status transaksi langsung ke Midtrans API & sinkronkan ke DB
// // export const cekStatusPembayaran = async (req, res) => {
// //     try {
// //         const { bookingId } = req.params;

// //         const [rows] = await db.query(
// //             `SELECT pembayaran.*, booking.user_id
// //              FROM pembayaran
// //              JOIN booking ON pembayaran.booking_id = booking.id
// //              WHERE pembayaran.booking_id = ?
// //              ORDER BY pembayaran.id DESC LIMIT 1`,
// //             [bookingId]
// //         );

// //         if (rows.length === 0) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Data pembayaran belum ada"
// //             });
// //         }

// //         const pay = rows[0];
// //         if (req.user.role !== "admin" && pay.user_id !== req.user.id) {
// //             return res.status(403).json({
// //                 success: false,
// //                 message: "Akses ditolak"
// //             });
// //         }

// //         if (pay.metode_pembayaran === "midtrans" && pay.status_pembayaran !== "lunas") {
// //             const statusRes = await snap.transaction.status(pay.order_id);
// //             const txStatus = statusRes.transaction_status;
// //             const fraudStatus = statusRes.fraud_status;

// //             let mappedStatus = "pending";
// //             if (txStatus === "capture") {
// //                 mappedStatus = fraudStatus === "challenge" ? "pending" : "lunas";
// //             } else if (txStatus === "settlement") {
// //                 mappedStatus = "lunas";
// //             } else if (["cancel", "deny"].includes(txStatus)) {
// //                 mappedStatus = "gagal";
// //             } else if (txStatus === "expire") {
// //                 mappedStatus = "kadaluarsa";
// //             }

// //             await db.query(
// //                 `UPDATE pembayaran
// //                  SET status_pembayaran = ?,
// //                      payment_type = ?,
// //                      midtrans_transaction_id = ?,
// //                      paid_at = CASE WHEN ? = 'lunas' AND paid_at IS NULL THEN NOW() ELSE paid_at END
// //                  WHERE id = ?`,
// //                 [
// //                     mappedStatus,
// //                     statusRes.payment_type || pay.payment_type,
// //                     statusRes.transaction_id || pay.midtrans_transaction_id,
// //                     mappedStatus,
// //                     pay.id
// //                 ]
// //             );

// //             pay.status_pembayaran = mappedStatus;
// //             pay.payment_type = statusRes.payment_type || pay.payment_type;
// //         }

// //         return res.json({
// //             success: true,
// //             data: pay
// //         });
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // Webhook notifikasi otomatis dari Midtrans
// // export const midtransWebhook = async (req, res) => {
// //     try {
// //         const notification = await snap.transaction.notification(req.body);
// //         const orderId = notification.order_id;
// //         const txStatus = notification.transaction_status;
// //         const fraudStatus = notification.fraud_status;
// //         const paymentType = notification.payment_type || null;
// //         const txId = notification.transaction_id || null;

// //         let mappedStatus = "pending";
// //         if (txStatus === "capture") {
// //             mappedStatus = fraudStatus === "challenge" ? "pending" : "lunas";
// //         } else if (txStatus === "settlement") {
// //             mappedStatus = "lunas";
// //         } else if (["cancel", "deny"].includes(txStatus)) {
// //             mappedStatus = "gagal";
// //         } else if (txStatus === "expire") {
// //             mappedStatus = "kadaluarsa";
// //         }

// //         await db.query(
// //             `UPDATE pembayaran
// //              SET status_pembayaran = ?,
// //                  payment_type = ?,
// //                  midtrans_transaction_id = ?,
// //                  paid_at = CASE WHEN ? = 'lunas' AND paid_at IS NULL THEN NOW() ELSE paid_at END
// //              WHERE order_id = ?`,
// //             [mappedStatus, paymentType, txId, mappedStatus, orderId]
// //         );

// //         return res.status(200).json({ success: true });
// //     } catch (error) {
// //         console.error("MIDTRANS WEBHOOK ERROR:", error);
// //         return res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// // // Admin: melihat semua data pembayaran (cash & midtrans)
// // export const getAllPembayaran = async (req, res) => {
// //     try {
// //         const { metode, status, search } = req.query;

// //         let query = `
// //             SELECT
// //                 pembayaran.*,
// //                 booking.kode_booking,
// //                 DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
// //                 booking.jam_booking,
// //                 booking.status AS status_booking,
// //                 users.nama AS nama_pelanggan,
// //                 users.no_hp,
// //                 kendaraan.merk,
// //                 kendaraan.tipe,
// //                 kendaraan.plat_nomor
// //             FROM pembayaran
// //             JOIN booking ON pembayaran.booking_id = booking.id
// //             JOIN users ON booking.user_id = users.id
// //             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
// //             WHERE 1=1
// //         `;
// //         const params = [];

// //         if (metode && ["cash", "midtrans"].includes(String(metode).toLowerCase())) {
// //             query += " AND pembayaran.metode_pembayaran = ?";
// //             params.push(String(metode).toLowerCase());
// //         }

// //         if (status && ["pending", "lunas", "gagal", "kadaluarsa"].includes(String(status).toLowerCase())) {
// //             query += " AND pembayaran.status_pembayaran = ?";
// //             params.push(String(status).toLowerCase());
// //         }

// //         if (search && search.trim()) {
// //             const kw = `%${search.trim()}%`;
// //             query += ` AND (
// //                 pembayaran.order_id LIKE ?
// //                 OR booking.kode_booking LIKE ?
// //                 OR users.nama LIKE ?
// //                 OR kendaraan.plat_nomor LIKE ?
// //             )`;
// //             params.push(kw, kw, kw, kw);
// //         }

// //         query += " ORDER BY pembayaran.created_at DESC";

// //         const [rows] = await db.query(query, params);
// //         return res.json({ success: true, data: rows });
// //     } catch (error) {
// //         return res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// // // Admin: konfirmasi pembayaran lunas (terutama Cash)
// // export const konfirmasiLunas = async (req, res) => {
// //     try {
// //         const { id } = req.params;

// //         const [result] = await db.query(
// //             `UPDATE pembayaran
// //              SET status_pembayaran = 'lunas',
// //                  paid_at = COALESCE(paid_at, NOW())
// //              WHERE id = ?`,
// //             [id]
// //         );

// //         if (result.affectedRows === 0) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Data pembayaran tidak ditemukan"
// //             });
// //         }

// //         return res.json({
// //             success: true,
// //             message: "Pembayaran berhasil dikonfirmasi LUNAS"
// //         });
// //     } catch (error) {
// //         return res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// // import midtransClient from "midtrans-client";
// // import db from "../config/database.js";

// // const snap = new midtransClient.Snap({
// //     isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
// //     serverKey: process.env.MIDTRANS_SERVER_KEY,
// //     clientKey: process.env.MIDTRANS_CLIENT_KEY,
// // });

// // const getBookingWithTotal = async (bookingId) => {
// //     const [rows] = await db.query(
// //         `SELECT
// //             booking.id,
// //             booking.kode_booking,
// //             booking.user_id,
// //             booking.status,
// //             users.nama,
// //             users.email,
// //             users.no_hp,
// //             COALESCE(SUM(layanan.harga), 0) AS total_harga
// //          FROM booking
// //          JOIN users ON booking.user_id = users.id
// //          LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
// //          LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
// //          WHERE booking.id = ?
// //          GROUP BY booking.id`,
// //         [bookingId]
// //     );
// //     return rows[0] || null;
// // };

// // // Pelanggan: inisiasi pembayaran Cash atau Midtrans untuk suatu booking
// // export const createPembayaran = async (req, res) => {
// //     try {
// //         const { booking_id, metode } = req.body;
// //         const cleanMetode = String(metode || "").toLowerCase();

// //         if (!booking_id || !["cash", "midtrans"].includes(cleanMetode)) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "booking_id dan metode ('cash' atau 'midtrans') wajib diisi"
// //             });
// //         }

// //         const booking = await getBookingWithTotal(booking_id);
// //         if (!booking) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Booking tidak ditemukan"
// //             });
// //         }

// //         if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
// //             return res.status(403).json({
// //                 success: false,
// //                 message: "Akses ditolak"
// //             });
// //         }

// //         const grossAmount = Math.round(Number(booking.total_harga || 0));
// //         if (grossAmount <= 0) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Total biaya booking tidak valid (Rp 0)"
// //             });
// //         }

// //         const [existingRows] = await db.query(
// //             "SELECT * FROM pembayaran WHERE booking_id = ? ORDER BY id DESC LIMIT 1",
// //             [booking.id]
// //         );
// //         const existing = existingRows[0] || null;

// //         if (existing && existing.status_pembayaran === "lunas") {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Booking ini sudah lunas"
// //             });
// //         }

// //         // 1. Pembayaran CASH (bayar di kasir bengkel, admin konfirmasi lunas)
// //         if (cleanMetode === "cash") {
// //             const orderId = existing?.order_id || `CASH-${booking.kode_booking}-${Date.now()}`;

// //             if (existing) {
// //                 await db.query(
// //                     `UPDATE pembayaran
// //                      SET order_id = ?, metode_pembayaran = 'cash', gross_amount = ?,
// //                          status_pembayaran = 'pending', snap_token = NULL, redirect_url = NULL,
// //                          midtrans_transaction_id = NULL
// //                      WHERE id = ?`,
// //                     [orderId, grossAmount, existing.id]
// //                 );
// //             } else {
// //                 await db.query(
// //                     `INSERT INTO pembayaran
// //                      (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran)
// //                      VALUES (?, ?, 'cash', ?, 'pending')`,
// //                     [booking.id, orderId, grossAmount]
// //                 );
// //             }

// //             return res.status(200).json({
// //                 success: true,
// //                 message: "Metode pembayaran Cash dipilih. Silakan lakukan pembayaran di kasir bengkel.",
// //                 data: {
// //                     booking_id: booking.id,
// //                     order_id: orderId,
// //                     metode_pembayaran: "cash",
// //                     gross_amount: grossAmount,
// //                     status_pembayaran: "pending"
// //                 }
// //             });
// //         }

// //         // 2. Pembayaran MIDTRANS SNAP
// //         if (
// //             existing &&
// //             existing.metode_pembayaran === "midtrans" &&
// //             existing.status_pembayaran === "pending" &&
// //             existing.snap_token &&
// //             existing.redirect_url
// //         ) {
// //             return res.status(200).json({
// //                 success: true,
// //                 message: "Token pembayaran Midtrans siap digunakan",
// //                 data: {
// //                     booking_id: booking.id,
// //                     order_id: existing.order_id,
// //                     metode_pembayaran: "midtrans",
// //                     gross_amount: grossAmount,
// //                     status_pembayaran: "pending",
// //                     snap_token: existing.snap_token,
// //                     redirect_url: existing.redirect_url
// //                 }
// //             });
// //         }

// //         const orderId = `BKL-${booking.id}-${Date.now()}`;

// //         const parameter = {
// //             transaction_details: {
// //                 order_id: orderId,
// //                 gross_amount: grossAmount,
// //             },
// //             customer_details: {
// //                 first_name: booking.nama || "Pelanggan",
// //                 email: booking.email || "pelanggan@bengkel.local",
// //                 phone: booking.no_hp || "08123456789",
// //             },
// //             item_details: [
// //                 {
// //                     id: `BOOKING-${booking.id}`,
// //                     price: grossAmount,
// //                     quantity: 1,
// //                     name: `Servis ${booking.kode_booking}`.slice(0, 50),
// //                 },
// //             ],
// //         };

// //         const transaction = await snap.createTransaction(parameter);

// //         if (existing) {
// //             await db.query(
// //                 `UPDATE pembayaran
// //                  SET order_id = ?, metode_pembayaran = 'midtrans', gross_amount = ?,
// //                      status_pembayaran = 'pending', snap_token = ?, redirect_url = ?
// //                  WHERE id = ?`,
// //                 [
// //                     orderId,
// //                     grossAmount,
// //                     transaction.token,
// //                     transaction.redirect_url,
// //                     existing.id
// //                 ]
// //             );
// //         } else {
// //             await db.query(
// //                 `INSERT INTO pembayaran
// //                  (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran, snap_token, redirect_url)
// //                  VALUES (?, ?, 'midtrans', ?, 'pending', ?, ?)`,
// //                 [
// //                     booking.id,
// //                     orderId,
// //                     grossAmount,
// //                     transaction.token,
// //                     transaction.redirect_url
// //                 ]
// //             );
// //         }

// //         return res.status(200).json({
// //             success: true,
// //             message: "Transaksi Midtrans berhasil dibuat",
// //             data: {
// //                 booking_id: booking.id,
// //                 order_id: orderId,
// //                 metode_pembayaran: "midtrans",
// //                 gross_amount: grossAmount,
// //                 status_pembayaran: "pending",
// //                 snap_token: transaction.token,
// //                 redirect_url: transaction.redirect_url
// //             }
// //         });
// //     } catch (error) {
// //         console.error("ERROR CREATE PEMBAYARAN:", error);
// //         return res.status(500).json({
// //             success: false,
// //             message: error.message || "Gagal memproses pembayaran"
// //         });
// //     }
// // };

// // // Cek status transaksi langsung ke Midtrans API (mencatat bukti transfer, tetap pending sampai dikonfirmasi admin)
// // export const cekStatusPembayaran = async (req, res) => {
// //     try {
// //         const { bookingId } = req.params;

// //         const [rows] = await db.query(
// //             `SELECT pembayaran.*, booking.user_id
// //              FROM pembayaran
// //              JOIN booking ON pembayaran.booking_id = booking.id
// //              WHERE pembayaran.booking_id = ?
// //              ORDER BY pembayaran.id DESC LIMIT 1`,
// //             [bookingId]
// //         );

// //         if (rows.length === 0) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Data pembayaran belum ada"
// //             });
// //         }

// //         const pay = rows[0];
// //         if (req.user.role !== "admin" && pay.user_id !== req.user.id) {
// //             return res.status(403).json({
// //                 success: false,
// //                 message: "Akses ditolak"
// //             });
// //         }

// //         if (pay.metode_pembayaran === "midtrans" && pay.status_pembayaran !== "lunas") {
// //             const statusRes = await snap.transaction.status(pay.order_id);
// //             const txStatus = statusRes.transaction_status;
// //             const fraudStatus = statusRes.fraud_status;

// //             let mappedStatus = "pending";
// //             let midtransSettled = false;

// //             if (txStatus === "capture") {
// //                 if (fraudStatus !== "challenge") {
// //                     midtransSettled = true;
// //                 }
// //             } else if (txStatus === "settlement") {
// //                 midtransSettled = true;
// //             } else if (["cancel", "deny"].includes(txStatus)) {
// //                 mappedStatus = "gagal";
// //             } else if (txStatus === "expire") {
// //                 mappedStatus = "kadaluarsa";
// //             }

// //             const txId = midtransSettled
// //                 ? statusRes.transaction_id || `SETTLED-${pay.order_id}`
// //                 : pay.midtrans_transaction_id;

// //             await db.query(
// //                 `UPDATE pembayaran
// //                  SET status_pembayaran = ?,
// //                      payment_type = ?,
// //                      midtrans_transaction_id = ?
// //                  WHERE id = ?`,
// //                 [
// //                     mappedStatus,
// //                     statusRes.payment_type || pay.payment_type,
// //                     txId,
// //                     pay.id
// //                 ]
// //             );

// //             pay.status_pembayaran = mappedStatus;
// //             pay.payment_type = statusRes.payment_type || pay.payment_type;
// //             pay.midtrans_transaction_id = txId;
// //             pay.midtrans_paid = Boolean(txId);
// //         }

// //         return res.json({
// //             success: true,
// //             data: pay
// //         });
// //     } catch (error) {
// //         return res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // Webhook notifikasi otomatis dari Midtrans (mencatat bukti transfer, tetap pending sampai dikonfirmasi admin)
// // export const midtransWebhook = async (req, res) => {
// //     try {
// //         const notification = await snap.transaction.notification(req.body);
// //         const orderId = notification.order_id;
// //         const txStatus = notification.transaction_status;
// //         const fraudStatus = notification.fraud_status;
// //         const paymentType = notification.payment_type || null;

// //         let mappedStatus = "pending";
// //         let midtransSettled = false;

// //         if (txStatus === "capture") {
// //             if (fraudStatus !== "challenge") {
// //                 midtransSettled = true;
// //             }
// //         } else if (txStatus === "settlement") {
// //             midtransSettled = true;
// //         } else if (["cancel", "deny"].includes(txStatus)) {
// //             mappedStatus = "gagal";
// //         } else if (txStatus === "expire") {
// //             mappedStatus = "kadaluarsa";
// //         }

// //         const txId = midtransSettled
// //             ? notification.transaction_id || `SETTLED-${orderId}`
// //             : null;

// //         await db.query(
// //             `UPDATE pembayaran
// //              SET status_pembayaran = ?,
// //                  payment_type = COALESCE(?, payment_type),
// //                  midtrans_transaction_id = COALESCE(?, midtrans_transaction_id)
// //              WHERE order_id = ?`,
// //             [mappedStatus, paymentType, txId, orderId]
// //         );

// //         return res.status(200).json({ success: true });
// //     } catch (error) {
// //         console.error("MIDTRANS WEBHOOK ERROR:", error);
// //         return res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// // // Admin: melihat semua data pembayaran (cash & midtrans)
// // export const getAllPembayaran = async (req, res) => {
// //     try {
// //         const { metode, status, search } = req.query;

// //         let query = `
// //             SELECT
// //                 pembayaran.*,
// //                 booking.kode_booking,
// //                 DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
// //                 booking.jam_booking,
// //                 booking.status AS status_booking,
// //                 users.nama AS nama_pelanggan,
// //                 users.no_hp,
// //                 kendaraan.merk,
// //                 kendaraan.tipe,
// //                 kendaraan.plat_nomor
// //             FROM pembayaran
// //             JOIN booking ON pembayaran.booking_id = booking.id
// //             JOIN users ON booking.user_id = users.id
// //             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
// //             WHERE 1=1
// //         `;
// //         const params = [];

// //         if (metode && ["cash", "midtrans"].includes(String(metode).toLowerCase())) {
// //             query += " AND pembayaran.metode_pembayaran = ?";
// //             params.push(String(metode).toLowerCase());
// //         }

// //         if (status && ["pending", "lunas", "gagal", "kadaluarsa"].includes(String(status).toLowerCase())) {
// //             query += " AND pembayaran.status_pembayaran = ?";
// //             params.push(String(status).toLowerCase());
// //         }

// //         if (search && search.trim()) {
// //             const kw = `%${search.trim()}%`;
// //             query += ` AND (
// //                 pembayaran.order_id LIKE ?
// //                 OR booking.kode_booking LIKE ?
// //                 OR users.nama LIKE ?
// //                 OR kendaraan.plat_nomor LIKE ?
// //             )`;
// //             params.push(kw, kw, kw, kw);
// //         }

// //         query += " ORDER BY pembayaran.created_at DESC";

// //         const [rows] = await db.query(query, params);
// //         return res.json({ success: true, data: rows });
// //     } catch (error) {
// //         return res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// // // Admin: konfirmasi pembayaran lunas (mempertahankan metode asli cash/midtrans)
// // // Admin: konfirmasi pembayaran lunas (hanya jika cash atau midtrans sudah terbayar)
// // export const konfirmasiLunas = async (req, res) => {
// //     try {
// //         const { id } = req.params;

// //         const [rows] = await db.query(
// //             "SELECT * FROM pembayaran WHERE id = ? LIMIT 1",
// //             [id]
// //         );

// //         if (rows.length === 0) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Data pembayaran tidak ditemukan"
// //             });
// //         }

// //         const pay = rows[0];

// //         if (pay.status_pembayaran === "lunas") {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Pembayaran ini sudah LUNAS"
// //             });
// //         }

// //         if (pay.metode_pembayaran === "midtrans" && !pay.midtrans_transaction_id) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "Pelanggan belum menyelesaikan pembayaran Midtrans. Klik 'Cek Midtrans' setelah pelanggan membayar."
// //             });
// //         }

// //         await db.query(
// //             `UPDATE pembayaran
// //              SET status_pembayaran = 'lunas',
// //                  paid_at = COALESCE(paid_at, NOW())
// //              WHERE id = ?`,
// //             [id]
// //         );

// //         return res.json({
// //             success: true,
// //             message: "Pembayaran berhasil dikonfirmasi LUNAS"
// //         });
// //     } catch (error) {
// //         return res.status(500).json({ success: false, message: error.message });
// //     }
// // };

// import "dotenv/config";
// import midtransClient from "midtrans-client";
// import db from "../config/database.js";

// const getSnapClient = () => {
//     const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
//     const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
//     const isProduction = String(process.env.MIDTRANS_IS_PRODUCTION).trim() === "true";

//     if (!serverKey) {
//         throw new Error("MIDTRANS_SERVER_KEY belum terbaca di .env backend");
//     }

//     return new midtransClient.Snap({
//         isProduction,
//         serverKey,
//         clientKey,
//     });
// };

// const getBookingWithTotal = async (bookingId) => {
//     const [rows] = await db.query(
//         `SELECT
//             booking.id,
//             booking.kode_booking,
//             booking.user_id,
//             booking.status,
//             users.nama,
//             users.email,
//             users.no_hp,
//             COALESCE(SUM(layanan.harga), 0) AS total_harga
//          FROM booking
//          JOIN users ON booking.user_id = users.id
//          LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
//          LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
//          WHERE booking.id = ?
//          GROUP BY booking.id`,
//         [bookingId]
//     );
//     return rows[0] || null;
// };

// // Pelanggan: inisiasi pembayaran Cash atau Midtrans untuk suatu booking
// export const createPembayaran = async (req, res) => {
//     try {
//         const { booking_id, metode } = req.body;
//         const cleanMetode = String(metode || "").toLowerCase();

//         if (!booking_id || !["cash", "midtrans"].includes(cleanMetode)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "booking_id dan metode ('cash' atau 'midtrans') wajib diisi"
//             });
//         }

//         const booking = await getBookingWithTotal(booking_id);
//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking tidak ditemukan"
//             });
//         }

//         if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Akses ditolak"
//             });
//         }

//         const grossAmount = Math.round(Number(booking.total_harga || 0));
//         if (grossAmount <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Total biaya booking tidak valid (Rp 0)"
//             });
//         }

//         const [existingRows] = await db.query(
//             "SELECT * FROM pembayaran WHERE booking_id = ? ORDER BY id DESC LIMIT 1",
//             [booking.id]
//         );
//         const existing = existingRows[0] || null;

//         if (existing && existing.status_pembayaran === "lunas") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Booking ini sudah lunas"
//             });
//         }

//         // 1. Pembayaran CASH (bayar di kasir bengkel, admin konfirmasi lunas)
//         if (cleanMetode === "cash") {
//             const orderId = existing?.order_id || `CASH-${booking.kode_booking}-${Date.now()}`;

//             if (existing) {
//                 await db.query(
//                     `UPDATE pembayaran
//                      SET order_id = ?, metode_pembayaran = 'cash', gross_amount = ?,
//                          status_pembayaran = 'pending', snap_token = NULL, redirect_url = NULL,
//                          midtrans_transaction_id = NULL
//                      WHERE id = ?`,
//                     [orderId, grossAmount, existing.id]
//                 );
//             } else {
//                 await db.query(
//                     `INSERT INTO pembayaran
//                      (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran)
//                      VALUES (?, ?, 'cash', ?, 'pending')`,
//                     [booking.id, orderId, grossAmount]
//                 );
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Metode pembayaran Cash dipilih. Silakan lakukan pembayaran di kasir bengkel.",
//                 data: {
//                     booking_id: booking.id,
//                     order_id: orderId,
//                     metode_pembayaran: "cash",
//                     gross_amount: grossAmount,
//                     status_pembayaran: "pending"
//                 }
//             });
//         }

//         // 2. Pembayaran MIDTRANS (tetap tercatat berhasil terkirim / menunggu ACC admin)
//         if (
//             existing &&
//             existing.metode_pembayaran === "midtrans" &&
//             existing.status_pembayaran === "pending" &&
//             existing.snap_token &&
//             existing.redirect_url
//         ) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Pembayaran Midtrans tercatat. Menunggu bukti langsung & ACC admin.",
//                 data: {
//                     booking_id: booking.id,
//                     order_id: existing.order_id,
//                     metode_pembayaran: "midtrans",
//                     gross_amount: grossAmount,
//                     status_pembayaran: "pending",
//                     snap_token: existing.snap_token,
//                     redirect_url: existing.redirect_url
//                 }
//             });
//         }

//         const orderId = `BKL-${booking.id}-${Date.now()}`;

//         const parameter = {
//             transaction_details: {
//                 order_id: orderId,
//                 gross_amount: grossAmount,
//             },
//             customer_details: {
//                 first_name: booking.nama || "Pelanggan",
//                 email: booking.email || "pelanggan@bengkel.local",
//                 phone: booking.no_hp || "08123456789",
//             },
//             item_details: [
//                 {
//                     id: `BOOKING-${booking.id}`,
//                     price: grossAmount,
//                     quantity: 1,
//                     name: `Servis ${booking.kode_booking}`.slice(0, 50),
//                 },
//             ],
//         };

//         let transaction = { token: null, redirect_url: null };
//         try {
//             const snapRes = await getSnapClient().createTransaction(parameter);
//             transaction = {
//                 token: snapRes?.token || null,
//                 redirect_url: snapRes?.redirect_url || null,
//             };
//         } catch (midtransErr) {
//             console.warn("MIDTRANS CREATE TRANSACTION FALLBACK:", midtransErr.message);
//         }

//         if (existing) {
//             await db.query(
//                 `UPDATE pembayaran
//                  SET order_id = ?, metode_pembayaran = 'midtrans', gross_amount = ?,
//                      status_pembayaran = 'pending', snap_token = ?, redirect_url = ?
//                  WHERE id = ?`,
//                 [
//                     orderId,
//                     grossAmount,
//                     transaction.token,
//                     transaction.redirect_url,
//                     existing.id
//                 ]
//             );
//         } else {
//             await db.query(
//                 `INSERT INTO pembayaran
//                  (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran, snap_token, redirect_url)
//                  VALUES (?, ?, 'midtrans', ?, 'pending', ?, ?)`,
//                 [
//                     booking.id,
//                     orderId,
//                     grossAmount,
//                     transaction.token,
//                     transaction.redirect_url
//                 ]
//             );
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Pembayaran Midtrans berhasil diproses. Menunggu bukti langsung & ACC admin.",
//             data: {
//                 booking_id: booking.id,
//                 order_id: orderId,
//                 metode_pembayaran: "midtrans",
//                 gross_amount: grossAmount,
//                 status_pembayaran: "pending",
//                 snap_token: transaction.token,
//                 redirect_url: transaction.redirect_url
//             }
//         });
//     } catch (error) {
//         console.error("ERROR CREATE PEMBAYARAN:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Gagal memproses pembayaran"
//         });
//     }
// };

// // Cek status pembayaran (tanpa memaksa gagal jika Midtrans mengembalikan 403)
// export const cekStatusPembayaran = async (req, res) => {
//     try {
//         const { bookingId } = req.params;

//         const [rows] = await db.query(
//             `SELECT pembayaran.*, booking.user_id
//              FROM pembayaran
//              JOIN booking ON pembayaran.booking_id = booking.id
//              WHERE pembayaran.booking_id = ?
//              ORDER BY pembayaran.id DESC LIMIT 1`,
//             [bookingId]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Data pembayaran belum ada"
//             });
//         }

//         const pay = rows[0];
//         if (req.user.role !== "admin" && pay.user_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Akses ditolak"
//             });
//         }

//         if (pay.metode_pembayaran === "midtrans" && pay.status_pembayaran !== "lunas") {
//             try {
//                 const statusRes = await getSnapClient().transaction.status(pay.order_id);
//                 const txStatus = statusRes.transaction_status;
//                 const fraudStatus = statusRes.fraud_status;

//                 let mappedStatus = "pending";
//                 let midtransSettled = false;

//                 if (txStatus === "capture") {
//                     if (fraudStatus !== "challenge") {
//                         midtransSettled = true;
//                     }
//                 } else if (txStatus === "settlement") {
//                     midtransSettled = true;
//                 } else if (["cancel", "deny"].includes(txStatus)) {
//                     mappedStatus = "gagal";
//                 } else if (txStatus === "expire") {
//                     mappedStatus = "kadaluarsa";
//                 }

//                 const txId = midtransSettled
//                     ? statusRes.transaction_id || `SETTLED-${pay.order_id}`
//                     : pay.midtrans_transaction_id;

//                 await db.query(
//                     `UPDATE pembayaran
//                      SET status_pembayaran = ?,
//                          payment_type = ?,
//                          midtrans_transaction_id = ?
//                      WHERE id = ?`,
//                     [
//                         mappedStatus,
//                         statusRes.payment_type || pay.payment_type,
//                         txId,
//                         pay.id
//                     ]
//                 );

//                 pay.status_pembayaran = mappedStatus;
//                 pay.payment_type = statusRes.payment_type || pay.payment_type;
//                 pay.midtrans_transaction_id = txId;
//                 pay.midtrans_paid = Boolean(txId);
//             } catch (midtransErr) {
//                 console.warn("CEK STATUS MIDTRANS SKIPPED:", midtransErr.message);
//             }
//         }

//         return res.json({
//             success: true,
//             data: pay
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Webhook notifikasi otomatis dari Midtrans
// export const midtransWebhook = async (req, res) => {
//     try {
//         const notification = await getSnapClient().transaction.notification(req.body);
//         const orderId = notification.order_id;
//         const txStatus = notification.transaction_status;
//         const fraudStatus = notification.fraud_status;
//         const paymentType = notification.payment_type || null;

//         let mappedStatus = "pending";
//         let midtransSettled = false;

//         if (txStatus === "capture") {
//             if (fraudStatus !== "challenge") {
//                 midtransSettled = true;
//             }
//         } else if (txStatus === "settlement") {
//             midtransSettled = true;
//         } else if (["cancel", "deny"].includes(txStatus)) {
//             mappedStatus = "gagal";
//         } else if (txStatus === "expire") {
//             mappedStatus = "kadaluarsa";
//         }

//         const txId = midtransSettled
//             ? notification.transaction_id || `SETTLED-${orderId}`
//             : null;

//         await db.query(
//             `UPDATE pembayaran
//              SET status_pembayaran = ?,
//                  payment_type = COALESCE(?, payment_type),
//                  midtrans_transaction_id = COALESCE(?, midtrans_transaction_id)
//              WHERE order_id = ?`,
//             [mappedStatus, paymentType, txId, orderId]
//         );

//         return res.status(200).json({ success: true });
//     } catch (error) {
//         console.error("MIDTRANS WEBHOOK ERROR:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Admin: melihat semua data pembayaran (cash & midtrans)
// export const getAllPembayaran = async (req, res) => {
//     try {
//         const { metode, status, search } = req.query;

//         let query = `
//             SELECT
//                 pembayaran.*,
//                 booking.kode_booking,
//                 DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
//                 booking.jam_booking,
//                 booking.status AS status_booking,
//                 users.nama AS nama_pelanggan,
//                 users.no_hp,
//                 kendaraan.merk,
//                 kendaraan.tipe,
//                 kendaraan.plat_nomor
//             FROM pembayaran
//             JOIN booking ON pembayaran.booking_id = booking.id
//             JOIN users ON booking.user_id = users.id
//             JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
//             WHERE 1=1
//         `;
//         const params = [];

//         if (metode && ["cash", "midtrans"].includes(String(metode).toLowerCase())) {
//             query += " AND pembayaran.metode_pembayaran = ?";
//             params.push(String(metode).toLowerCase());
//         }

//         if (status && ["pending", "lunas", "gagal", "kadaluarsa"].includes(String(status).toLowerCase())) {
//             query += " AND pembayaran.status_pembayaran = ?";
//             params.push(String(status).toLowerCase());
//         }

//         if (search && search.trim()) {
//             const kw = `%${search.trim()}%`;
//             query += ` AND (
//                 pembayaran.order_id LIKE ?
//                 OR booking.kode_booking LIKE ?
//                 OR users.nama LIKE ?
//                 OR kendaraan.plat_nomor LIKE ?
//             )`;
//             params.push(kw, kw, kw, kw);
//         }

//         query += " ORDER BY pembayaran.created_at DESC";

//         const [rows] = await db.query(query, params);
//         return res.json({ success: true, data: rows });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Admin: ACC & konfirmasi pembayaran lunas setelah bukti dicek di bengkel
// export const konfirmasiLunas = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [rows] = await db.query(
//             "SELECT * FROM pembayaran WHERE id = ? LIMIT 1",
//             [id]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Data pembayaran tidak ditemukan"
//             });
//         }

//         const pay = rows[0];

//         if (pay.status_pembayaran === "lunas") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Pembayaran ini sudah LUNAS"
//             });
//         }

//         await db.query(
//             `UPDATE pembayaran
//              SET status_pembayaran = 'lunas',
//                  paid_at = COALESCE(paid_at, NOW())
//              WHERE id = ?`,
//             [id]
//         );

//         return res.json({
//             success: true,
//             message: "Pembayaran berhasil di-ACC dan ditandai LUNAS"
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

import "dotenv/config";
import midtransClient from "midtrans-client";
import db from "../config/database.js";

const getSnapClient = () => {
    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
    const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
    const isProduction = String(process.env.MIDTRANS_IS_PRODUCTION).trim() === "true";

    if (!serverKey) {
        throw new Error("MIDTRANS_SERVER_KEY belum terbaca di .env backend");
    }

    return new midtransClient.Snap({
        isProduction,
        serverKey,
        clientKey,
    });
};

const sanitizeEmail = (email) => {
    const trimmed = String(email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && !trimmed.endsWith(".local")
        ? trimmed
        : "pelanggan@example.com";
};

const sanitizePhone = (phone) => {
    const cleaned = String(phone || "").replace(/[^\d+]/g, "");
    return cleaned.length >= 6 ? cleaned : "08123456789";
};

const getBookingWithTotal = async (bookingId) => {
    const [rows] = await db.query(
        `SELECT
            booking.id,
            booking.kode_booking,
            booking.user_id,
            booking.status,
            users.nama,
            users.email,
            users.no_hp,
            COALESCE(SUM(layanan.harga), 0) AS total_harga
         FROM booking
         JOIN users ON booking.user_id = users.id
         LEFT JOIN detail_booking ON booking.id = detail_booking.booking_id
         LEFT JOIN layanan ON detail_booking.layanan_id = layanan.id
         WHERE booking.id = ?
         GROUP BY booking.id`,
        [bookingId]
    );
    return rows[0] || null;
};

// Pelanggan: inisiasi pembayaran Cash atau Midtrans (TF) untuk suatu booking
export const createPembayaran = async (req, res) => {
    try {
        const { booking_id, metode } = req.body;
        const cleanMetode = String(metode || "").toLowerCase();

        if (!booking_id || !["cash", "midtrans"].includes(cleanMetode)) {
            return res.status(400).json({
                success: false,
                message: "booking_id dan metode ('cash' atau 'midtrans') wajib diisi"
            });
        }

        const booking = await getBookingWithTotal(booking_id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking tidak ditemukan"
            });
        }

        if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak"
            });
        }

        const grossAmount = Math.round(Number(booking.total_harga || 0));
        if (grossAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Total biaya booking tidak valid (Rp 0)"
            });
        }

        const [existingRows] = await db.query(
            "SELECT * FROM pembayaran WHERE booking_id = ? ORDER BY id DESC LIMIT 1",
            [booking.id]
        );
        const existing = existingRows[0] || null;

        if (existing && existing.status_pembayaran === "lunas") {
            return res.status(400).json({
                success: false,
                message: "Booking ini sudah lunas"
            });
        }

        // 1. Pembayaran CASH
        if (cleanMetode === "cash") {
            const orderId = existing?.order_id || `CASH-${booking.kode_booking}-${Date.now()}`;

            if (existing) {
                await db.query(
                    `UPDATE pembayaran
                     SET order_id = ?, metode_pembayaran = 'cash', gross_amount = ?,
                         status_pembayaran = 'pending', snap_token = NULL, redirect_url = NULL,
                         midtrans_transaction_id = NULL
                     WHERE id = ?`,
                    [orderId, grossAmount, existing.id]
                );
            } else {
                await db.query(
                    `INSERT INTO pembayaran
                     (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran)
                     VALUES (?, ?, 'cash', ?, 'pending')`,
                    [booking.id, orderId, grossAmount]
                );
            }

            return res.status(200).json({
                success: true,
                message: "Metode pembayaran Cash dipilih. Silakan lakukan pembayaran di kasir bengkel.",
                data: {
                    booking_id: booking.id,
                    order_id: orderId,
                    metode_pembayaran: "cash",
                    gross_amount: grossAmount,
                    status_pembayaran: "pending"
                }
            });
        }

        // 2. Pembayaran MIDTRANS SNAP (buka web Midtrans VA, tetap belum lunas sampai admin konfirmasi)
        if (
            existing &&
            existing.metode_pembayaran === "midtrans" &&
            existing.status_pembayaran === "pending" &&
            Number(existing.gross_amount) === grossAmount &&
            existing.snap_token &&
            existing.redirect_url
        ) {
            return res.status(200).json({
                success: true,
                message: "Token pembayaran Midtrans siap digunakan",
                data: {
                    booking_id: booking.id,
                    order_id: existing.order_id,
                    metode_pembayaran: "midtrans",
                    gross_amount: grossAmount,
                    status_pembayaran: "pending",
                    snap_token: existing.snap_token,
                    redirect_url: existing.redirect_url
                }
            });
        }

        const orderId = `BKL-${booking.id}-${Date.now()}`;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount,
            },
            customer_details: {
                first_name: (booking.nama || "Pelanggan").trim().slice(0, 50),
                email: sanitizeEmail(booking.email),
                phone: sanitizePhone(booking.no_hp),
            },
            item_details: [
                {
                    id: `BOOKING-${booking.id}`,
                    price: grossAmount,
                    quantity: 1,
                    name: `Servis ${booking.kode_booking}`.slice(0, 50),
                },
            ],
        };

        let transaction;
        try {
            transaction = await getSnapClient().createTransaction(parameter);
        } catch (midtransErr) {
            console.error("MIDTRANS CREATE TRANSACTION ERROR:", {
                httpStatusCode: midtransErr?.httpStatusCode,
                ApiResponse: midtransErr?.ApiResponse,
                message: midtransErr?.message,
            });

            if (midtransErr?.httpStatusCode === 401) {
                return res.status(502).json({
                    success: false,
                    message:
                        "Midtrans menolak kredensial (401 Unauthorized). Periksa MIDTRANS_SERVER_KEY & MIDTRANS_CLIENT_KEY di backend/.env (untuk Sandbox harus diawali SB-Mid-server-... / SB-Mid-client-...).",
                });
            }

            return res.status(502).json({
                success: false,
                message:
                    midtransErr?.ApiResponse?.error_messages?.[0] ||
                    midtransErr?.message ||
                    "Gagal membuat transaksi ke Midtrans",
            });
        }

        if (existing) {
            await db.query(
                `UPDATE pembayaran
                 SET order_id = ?, metode_pembayaran = 'midtrans', gross_amount = ?,
                     status_pembayaran = 'pending', snap_token = ?, redirect_url = ?,
                     midtrans_transaction_id = NULL, payment_type = NULL, paid_at = NULL
                 WHERE id = ?`,
                [
                    orderId,
                    grossAmount,
                    transaction.token,
                    transaction.redirect_url,
                    existing.id
                ]
            );
        } else {
            await db.query(
                `INSERT INTO pembayaran
                 (booking_id, order_id, metode_pembayaran, gross_amount, status_pembayaran, snap_token, redirect_url)
                 VALUES (?, ?, 'midtrans', ?, 'pending', ?, ?)`,
                [
                    booking.id,
                    orderId,
                    grossAmount,
                    transaction.token,
                    transaction.redirect_url
                ]
            );
        }

        return res.status(200).json({
            success: true,
            message: "Transaksi Midtrans berhasil dibuat",
            data: {
                booking_id: booking.id,
                order_id: orderId,
                metode_pembayaran: "midtrans",
                gross_amount: grossAmount,
                status_pembayaran: "pending",
                snap_token: transaction.token,
                redirect_url: transaction.redirect_url
            }
        });
    } catch (error) {
        console.error("ERROR CREATE PEMBAYARAN:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal memproses pembayaran"
        });
    }
};

// Cek status pembayaran (tidak memaksa admin cek Midtrans)
export const cekStatusPembayaran = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const [rows] = await db.query(
            `SELECT pembayaran.*, booking.user_id
             FROM pembayaran
             JOIN booking ON pembayaran.booking_id = booking.id
             WHERE pembayaran.booking_id = ?
             ORDER BY pembayaran.id DESC LIMIT 1`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data pembayaran belum ada"
            });
        }

        const pay = rows[0];
        if (req.user.role !== "admin" && pay.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak"
            });
        }

        return res.json({
            success: true,
            data: pay
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Webhook notifikasi otomatis dari Midtrans (tetap belum lunas sampai dikonfirmasi admin)
export const midtransWebhook = async (req, res) => {
    try {
        const notification = await getSnapClient().transaction.notification(req.body);
        const orderId = notification.order_id;
        const txStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;
        const paymentType = notification.payment_type || null;

        const isSettled =
            txStatus === "settlement" ||
            (txStatus === "capture" && fraudStatus !== "challenge");
        const txId = isSettled ? notification.transaction_id || `SETTLED-${orderId}` : null;

        await db.query(
            `UPDATE pembayaran
             SET payment_type = COALESCE(?, payment_type),
                 midtrans_transaction_id = COALESCE(?, midtrans_transaction_id)
             WHERE order_id = ? AND status_pembayaran != 'lunas'`,
            [paymentType, txId, orderId]
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("MIDTRANS WEBHOOK ERROR:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: melihat semua data pembayaran (cash & midtrans)
export const getAllPembayaran = async (req, res) => {
    try {
        const { metode, status, search } = req.query;

        let query = `
            SELECT
                pembayaran.*,
                booking.kode_booking,
                DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
                booking.jam_booking,
                booking.status AS status_booking,
                users.nama AS nama_pelanggan,
                users.no_hp,
                kendaraan.merk,
                kendaraan.tipe,
                kendaraan.plat_nomor
            FROM pembayaran
            JOIN booking ON pembayaran.booking_id = booking.id
            JOIN users ON booking.user_id = users.id
            JOIN kendaraan ON booking.kendaraan_id = kendaraan.id
            WHERE 1=1
        `;
        const params = [];

        if (metode && ["cash", "midtrans"].includes(String(metode).toLowerCase())) {
            query += " AND pembayaran.metode_pembayaran = ?";
            params.push(String(metode).toLowerCase());
        }

        if (status && ["pending", "lunas", "gagal", "kadaluarsa"].includes(String(status).toLowerCase())) {
            query += " AND pembayaran.status_pembayaran = ?";
            params.push(String(status).toLowerCase());
        }

        if (search && search.trim()) {
            const kw = `%${search.trim()}%`;
            query += ` AND (
                pembayaran.order_id LIKE ?
                OR booking.kode_booking LIKE ?
                OR users.nama LIKE ?
                OR kendaraan.plat_nomor LIKE ?
            )`;
            params.push(kw, kw, kw, kw);
        }

        query += " ORDER BY pembayaran.created_at DESC";

        const [rows] = await db.query(query, params);
        return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: ACC & konfirmasi pembayaran lunas setelah bukti dicek saat ketemu offline di bengkel
export const konfirmasiLunas = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM pembayaran WHERE id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data pembayaran tidak ditemukan"
            });
        }

        const pay = rows[0];

        if (pay.status_pembayaran === "lunas") {
            return res.status(400).json({
                success: false,
                message: "Pembayaran ini sudah LUNAS"
            });
        }

        await db.query(
            `UPDATE pembayaran
             SET status_pembayaran = 'lunas',
                 paid_at = COALESCE(paid_at, NOW())
             WHERE id = ?`,
            [id]
        );

        return res.json({
            success: true,
            message: "Pembayaran berhasil di-ACC dan ditandai LUNAS",
            data: {
                id: pay.id,
                booking_id: pay.booking_id,
                status_pembayaran: "lunas",
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};