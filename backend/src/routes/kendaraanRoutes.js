import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createKendaraan,
    getKendaraan,
    getKendaraanById,
    updateKendaraan,
    deleteKendaraan,
    getAllKendaraan,
    adminCreateKendaraan,
    adminUpdateKendaraan,
    adminDeleteKendaraan
} from "../controllers/kendaraanController.js";

const router = express.Router();

// Route admin
router.get(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    getAllKendaraan
);

router.post(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    adminCreateKendaraan
);

router.put(
    "/admin/:id",
    verifyToken,
    roleMiddleware("admin"),
    adminUpdateKendaraan
);

router.delete(
    "/admin/:id",
    verifyToken,
    roleMiddleware("admin"),
    adminDeleteKendaraan
);

// Route pelanggan
router.get("/", verifyToken, getKendaraan);
router.get("/:id", verifyToken, getKendaraanById);
router.post("/", verifyToken, createKendaraan);
router.put("/:id", verifyToken, updateKendaraan);
router.delete("/:id", verifyToken, deleteKendaraan);

export default router;