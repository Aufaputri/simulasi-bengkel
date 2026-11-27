
// import crypto from "crypto";
// import "dotenv/config";
// import midtransClient from "midtrans-client";
// import db from "../config/database.js";

// const getMidtransConfig = () => {
//     const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
//     const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
//     const isProduction = String(process.env.MIDTRANS_IS_PRODUCTION || "").trim().toLowerCase() === "true";

//     if (!serverKey) {
//         throw new Error("MIDTRANS_SERVER_KEY belum terbaca di .env backend");
//     }

//     return {
//         serverKey,
//         clientKey,
//         isProduction,
//         snap: new midtransClient.Snap({
//             isProduction,
//             serverKey,
//             clientKey,
//         }),
//     };
// };

// const sanitizeEmail = (email) => {
//     const trimmed = String(email || "").trim();
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && !trimmed.endsWith(".local")
//         ? trimmed
//         : "pelanggan@example.com";
// };

// const sanitizePhone = (phone) => {
//     const cleaned = String(phone || "").replace(/[^\d+]/g, "");
//     return cleaned.length >= 6 ? cleaned : "08123456789";
// };

// const isValidMidtransSignature = (body, serverKey) => {
//     const { order_id, status_code, gross_amount, signature_key } = body || {};
//     if (!order_id || !status_code || !gross_amount || !signature_key) {
//         return false;
//     }

//     const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
//     const expectedSignature = crypto.createHash("sha512").update(raw).digest("hex");
//     return expectedSignature === String(signature_key).toLowerCase();
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

// // Pelanggan: inisiasi pembayaran Cash atau Midtrans (TF) untuk suatu booking
// export const createPembayaran = async (req, res) => {
//     try {
//         const { booking_id, metode } = req.body;
//         const cleanMetode = String(metode || "").toLowerCase().trim();

//         if (!booking_id || !["cash", "midtrans"].includes(cleanMetode)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "booking_id dan metode ('cash' atau 'midtrans') wajib diisi",
//             });
//         }

//         const booking = await getBookingWithTotal(booking_id);
//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking tidak ditemukan",
//             });
//         }

//         if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Akses ditolak",
//             });
//         }

//         const grossAmount = Math.round(Number(booking.total_harga || 0));
//         if (grossAmount <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Total biaya booking tidak valid (Rp 0)",
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
//                 message: "Booking ini sudah lunas",
//             });
//         }

//         // 1. Pembayaran CASH
//         if (cleanMetode === "cash") {
//             const orderId = existing?.order_id || `CASH-${booking.kode_booking}-${Date.now()}`;

//             if (existing) {
//                 await db.query(
//                     `UPDATE pembayaran
//                      SET order_id = ?, metode_pembayaran = 'cash', gross_amount = ?,
//                          status_pembayaran = 'pending', snap_token = NULL, redirect_url = NULL,
//                          midtrans_transaction_id = NULL, payment_type = NULL, paid_at = NULL
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
//                     status_pembayaran: "pending",
//                 },
//             });
//         }

//         // 2. Pembayaran MIDTRANS SNAP (buka web Midtrans VA, tetap belum lunas sampai admin konfirmasi)
//         if (
//             existing &&
//             existing.metode_pembayaran === "midtrans" &&
//             existing.status_pembayaran === "pending" &&
//             Number(existing.gross_amount) === grossAmount &&
//             existing.snap_token &&
//             existing.redirect_url
//         ) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Token pembayaran Midtrans siap digunakan",
//                 data: {
//                     booking_id: booking.id,
//                     order_id: existing.order_id,
//                     metode_pembayaran: "midtrans",
//                     gross_amount: grossAmount,
//                     status_pembayaran: "pending",
//                     snap_token: existing.snap_token,
//                     redirect_url: existing.redirect_url,
//                 },
//             });
//         }

//         const orderId = `BKL-${booking.id}-${Date.now()}`;

//         const parameter = {
//             transaction_details: {
//                 order_id: orderId,
//                 gross_amount: grossAmount,
//             },
//             customer_details: {
//                 first_name: (booking.nama || "Pelanggan").trim().slice(0, 50),
//                 email: sanitizeEmail(booking.email),
//                 phone: sanitizePhone(booking.no_hp),
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

//         let transaction;
//         try {
//             const { snap } = getMidtransConfig();
//             transaction = await snap.createTransaction(parameter);
//         } catch (midtransErr) {
//             console.error("MIDTRANS CREATE TRANSACTION ERROR:", {
//                 httpStatusCode: midtransErr?.httpStatusCode,
//                 ApiResponse: midtransErr?.ApiResponse,
//                 message: midtransErr?.message,
//             });

//             if (midtransErr?.httpStatusCode === 401) {
//                 return res.status(502).json({
//                     success: false,
//                     message:
//                         "Midtrans menolak kredensial (401 Unauthorized). Periksa MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, dan MIDTRANS_IS_PRODUCTION di backend/.env lalu restart server.",
//                 });
//             }

//             return res.status(502).json({
//                 success: false,
//                 message:
//                     midtransErr?.ApiResponse?.error_messages?.[0] ||
//                     midtransErr?.message ||
//                     "Gagal membuat transaksi ke Midtrans",
//             });
//         }

//         if (existing) {
//             await db.query(
//                 `UPDATE pembayaran
//                  SET order_id = ?, metode_pembayaran = 'midtrans', gross_amount = ?,
//                      status_pembayaran = 'pending', snap_token = ?, redirect_url = ?,
//                      midtrans_transaction_id = NULL, payment_type = NULL, paid_at = NULL
//                  WHERE id = ?`,
//                 [
//                     orderId,
//                     grossAmount,
//                     transaction.token,
//                     transaction.redirect_url,
//                     existing.id,
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
//                     transaction.redirect_url,
//                 ]
//             );
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Transaksi Midtrans berhasil dibuat",
//             data: {
//                 booking_id: booking.id,
//                 order_id: orderId,
//                 metode_pembayaran: "midtrans",
//                 gross_amount: grossAmount,
//                 status_pembayaran: "pending",
//                 snap_token: transaction.token,
//                 redirect_url: transaction.redirect_url,
//             },
//         });
//     } catch (error) {
//         console.error("ERROR CREATE PEMBAYARAN:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Gagal memproses pembayaran",
//         });
//     }
// };

// // Cek status pembayaran (tidak memaksa admin cek Midtrans)
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
//                 message: "Data pembayaran belum ada",
//             });
//         }

//         const pay = rows[0];
//         if (req.user.role !== "admin" && pay.user_id !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Akses ditolak",
//             });
//         }

//         return res.json({
//             success: true,
//             data: pay,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // Webhook notifikasi otomatis dari Midtrans (tetap belum lunas sampai dikonfirmasi admin)
// export const midtransWebhook = async (req, res) => {
//     try {
//         const { serverKey, snap } = getMidtransConfig();

//         if (!isValidMidtransSignature(req.body, serverKey)) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Signature Midtrans tidak valid",
//             });
//         }

//         const notification = await snap.transaction.notification(req.body);
//         const orderId = notification.order_id;
//         const txStatus = notification.transaction_status;
//         const fraudStatus = notification.fraud_status;
//         const paymentType = notification.payment_type || null;

//         const isSettled =
//             txStatus === "settlement" ||
//             (txStatus === "capture" && fraudStatus !== "challenge");
//         const txId = isSettled ? notification.transaction_id || `SETTLED-${orderId}` : null;

//         await db.query(
//             `UPDATE pembayaran
//              SET payment_type = COALESCE(?, payment_type),
//                  midtrans_transaction_id = COALESCE(?, midtrans_transaction_id)
//              WHERE order_id = ? AND status_pembayaran != 'lunas'`,
//             [paymentType, txId, orderId]
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

//         if (search && String(search).trim()) {
//             const kw = `%${String(search).trim()}%`;
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

// // Admin: ACC & konfirmasi pembayaran lunas setelah bukti dicek saat ketemu offline di bengkel
// export const konfirmasiLunas = async (req, res) => {
//     const conn = typeof db.getConnection === "function" ? await db.getConnection() : null;
//     const executor = conn || db;

//     try {
//         const { id } = req.params;

//         if (conn) await conn.beginTransaction();

//         const [rows] = await executor.query(
//             "SELECT * FROM pembayaran WHERE id = ? LIMIT 1",
//             [id]
//         );

//         if (rows.length === 0) {
//             if (conn) await conn.rollback();
//             return res.status(404).json({
//                 success: false,
//                 message: "Data pembayaran tidak ditemukan",
//             });
//         }

//         const pay = rows[0];

//         if (pay.status_pembayaran === "lunas") {
//             if (conn) await conn.rollback();
//             return res.status(400).json({
//                 success: false,
//                 message: "Pembayaran ini sudah LUNAS",
//             });
//         }

//         await executor.query(
//             `UPDATE pembayaran
//              SET status_pembayaran = 'lunas',
//                  paid_at = COALESCE(paid_at, NOW())
//              WHERE id = ?`,
//             [id]
//         );

//         if (conn) await conn.commit();

//         return res.json({
//             success: true,
//             message: "Pembayaran berhasil di-ACC dan ditandai LUNAS",
//             data: {
//                 id: pay.id,
//                 booking_id: pay.booking_id,
//                 status_pembayaran: "lunas",
//             },
//         });
//     } catch (error) {
//         if (conn) {
//             try {
//                 await conn.rollback();
//             } catch (_) {}
//         }
//         return res.status(500).json({ success: false, message: error.message });
//     } finally {
//         if (conn && typeof conn.release === "function") {
//             conn.release();
//         }
//     }
// };

import crypto from "crypto";
import "dotenv/config";
import midtransClient from "midtrans-client";
import db from "../config/database.js";

const JAM_TUTUP_MENIT = 19 * 60; // 19:00

const getJakartaDateTimeParts = (date = new Date()) => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const map = {};
    for (const p of parts) {
        if (p.type !== "literal") map[p.type] = p.value;
    }
    const todayStr = `${map.year}-${map.month}-${map.day}`;
    const currentMinutes = Number(map.hour) * 60 + Number(map.minute);
    return { todayStr, currentMinutes };
};

const isBookingPaymentExpired = (tanggalBooking, now = new Date()) => {
    if (!tanggalBooking) return true;
    const bookingDateStr = String(tanggalBooking).slice(0, 10);
    const { todayStr, currentMinutes } = getJakartaDateTimeParts(now);

    if (todayStr > bookingDateStr) {
        return true;
    }
    if (todayStr === bookingDateStr && currentMinutes > JAM_TUTUP_MENIT) {
        return true;
    }
    return false;
};

const getMidtransConfig = () => {
    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
    const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();
    const isProduction = String(process.env.MIDTRANS_IS_PRODUCTION || "").trim().toLowerCase() === "true";

    if (!serverKey) {
        throw new Error("MIDTRANS_SERVER_KEY belum terbaca di .env backend");
    }

    return {
        serverKey,
        clientKey,
        isProduction,
        snap: new midtransClient.Snap({
            isProduction,
            serverKey,
            clientKey,
        }),
    };
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

const isValidMidtransSignature = (body, serverKey) => {
    const { order_id, status_code, gross_amount, signature_key } = body || {};
    if (!order_id || !status_code || !gross_amount || !signature_key) {
        return false;
    }

    const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto.createHash("sha512").update(raw).digest("hex");
    return expectedSignature === String(signature_key).toLowerCase();
};

const getBookingWithTotal = async (bookingId) => {
    const [rows] = await db.query(
        `SELECT
            booking.id,
            booking.kode_booking,
            booking.user_id,
            DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking,
            booking.jam_booking,
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
        const cleanMetode = String(metode || "").toLowerCase().trim();

        if (!booking_id || !["cash", "midtrans"].includes(cleanMetode)) {
            return res.status(400).json({
                success: false,
                message: "booking_id dan metode ('cash' atau 'midtrans') wajib diisi",
            });
        }

        const booking = await getBookingWithTotal(booking_id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking tidak ditemukan",
            });
        }

        if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak",
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
                message: "Booking ini sudah lunas",
            });
        }

        // Batas pembayaran hanya berlaku sampai jam tutup bengkel (19:00) pada tanggal_booking
        if (isBookingPaymentExpired(booking.tanggal_booking)) {
            if (existing && existing.status_pembayaran === "pending") {
                await db.query(
                    `UPDATE pembayaran
                     SET status_pembayaran = 'kadaluarsa', snap_token = NULL, redirect_url = NULL
                     WHERE id = ?`,
                    [existing.id]
                );
            }
            return res.status(400).json({
                success: false,
                message: `Batas pembayaran untuk booking tanggal ${booking.tanggal_booking} sudah berakhir (tutup bengkel 19:00). Silakan buat booking ulang.`,
            });
        }

        const grossAmount = Math.round(Number(booking.total_harga || 0));
        if (grossAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Total biaya booking tidak valid (Rp 0)",
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
                         midtrans_transaction_id = NULL, payment_type = NULL, paid_at = NULL
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
                    status_pembayaran: "pending",
                },
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
                    redirect_url: existing.redirect_url,
                },
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
            const { snap } = getMidtransConfig();
            transaction = await snap.createTransaction(parameter);
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
                        "Midtrans menolak kredensial (401 Unauthorized). Periksa MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, dan MIDTRANS_IS_PRODUCTION di backend/.env lalu restart server.",
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
                    existing.id,
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
                    transaction.redirect_url,
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
                redirect_url: transaction.redirect_url,
            },
        });
    } catch (error) {
        console.error("ERROR CREATE PEMBAYARAN:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal memproses pembayaran",
        });
    }
};

// Cek status pembayaran (tidak memaksa admin cek Midtrans)
export const cekStatusPembayaran = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const [rows] = await db.query(
            `SELECT pembayaran.*, booking.user_id,
                    DATE_FORMAT(booking.tanggal_booking, '%Y-%m-%d') AS tanggal_booking
             FROM pembayaran
             JOIN booking ON pembayaran.booking_id = booking.id
             WHERE pembayaran.booking_id = ?
             ORDER BY pembayaran.id DESC LIMIT 1`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data pembayaran belum ada",
            });
        }

        const pay = rows[0];
        if (req.user.role !== "admin" && pay.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak",
            });
        }

        if (pay.status_pembayaran === "pending" && isBookingPaymentExpired(pay.tanggal_booking)) {
            await db.query(
                `UPDATE pembayaran
                 SET status_pembayaran = 'kadaluarsa', snap_token = NULL, redirect_url = NULL
                 WHERE id = ?`,
                [pay.id]
            );
            pay.status_pembayaran = "kadaluarsa";
            pay.snap_token = null;
            pay.redirect_url = null;
        }

        return res.json({
            success: true,
            data: pay,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Webhook notifikasi otomatis dari Midtrans (tetap belum lunas sampai dikonfirmasi admin)
export const midtransWebhook = async (req, res) => {
    try {
        const { serverKey, snap } = getMidtransConfig();

        if (!isValidMidtransSignature(req.body, serverKey)) {
            return res.status(401).json({
                success: false,
                message: "Signature Midtrans tidak valid",
            });
        }

        const notification = await snap.transaction.notification(req.body);
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

        if (search && String(search).trim()) {
            const kw = `%${String(search).trim()}%`;
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
    const conn = typeof db.getConnection === "function" ? await db.getConnection() : null;
    const executor = conn || db;

    try {
        const { id } = req.params;

        if (conn) await conn.beginTransaction();

        const [rows] = await executor.query(
            "SELECT * FROM pembayaran WHERE id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) {
            if (conn) await conn.rollback();
            return res.status(404).json({
                success: false,
                message: "Data pembayaran tidak ditemukan",
            });
        }

        const pay = rows[0];

        if (pay.status_pembayaran === "lunas") {
            if (conn) await conn.rollback();
            return res.status(400).json({
                success: false,
                message: "Pembayaran ini sudah LUNAS",
            });
        }

        await executor.query(
            `UPDATE pembayaran
             SET status_pembayaran = 'lunas',
                 paid_at = COALESCE(paid_at, NOW())
             WHERE id = ?`,
            [id]
        );

        if (conn) await conn.commit();

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
        if (conn) {
            try {
                await conn.rollback();
            } catch (_) {}
        }
        return res.status(500).json({ success: false, message: error.message });
    } finally {
        if (conn && typeof conn.release === "function") {
            conn.release();
        }
    }
};