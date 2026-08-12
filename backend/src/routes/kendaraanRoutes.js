import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
    createKendaraan,
    getKendaraan,
    getKendaraanById,
    updateKendaraan,
    deleteKendaraan
} from "../controllers/kendaraanController.js";

const router = express.Router();

router.get("/", verifyToken, getKendaraan);
router.get("/:id", verifyToken, getKendaraanById);

router.post("/", verifyToken, createKendaraan);

router.put("/:id", verifyToken, updateKendaraan);

router.delete("/:id", verifyToken, deleteKendaraan);

export default router;