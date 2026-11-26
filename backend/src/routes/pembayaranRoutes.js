import express from "express";
import {
    createPembayaran,
    cekStatusPembayaran,
    midtransWebhook,
    getAllPembayaran,
    konfirmasiLunas,
} from "../controllers/pembayaranController.js";
import verifyToken from "../middleware/verifyToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Webhook publik dari Midtrans
router.post("/webhook", midtransWebhook);

// Endpoint pelanggan
router.post("/bayar", verifyToken, createPembayaran);
router.post("/cek-status/:bookingId", verifyToken, cekStatusPembayaran);

// Endpoint admin
router.get("/", verifyToken, roleMiddleware("admin"), getAllPembayaran);
router.patch("/:id/lunas", verifyToken, roleMiddleware("admin"), konfirmasiLunas);

export default router;