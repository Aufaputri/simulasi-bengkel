import express from "express";
import {
    getLayanan,
    getLayananById,
    createLayanan,
    updateLayanan,
    deleteLayanan
} from "../controllers/layananController.js";

import verifyToken from "../middleware/verifyToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Semua user login boleh melihat layanan
router.get("/", verifyToken, getLayanan);
router.get("/:id", verifyToken, getLayananById);

// Hanya admin
router.post("/", verifyToken, roleMiddleware("admin"), createLayanan);
router.put("/:id", verifyToken, roleMiddleware("admin"), updateLayanan);
router.delete("/:id", verifyToken, roleMiddleware("admin"), deleteLayanan);

export default router;