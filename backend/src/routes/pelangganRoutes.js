import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    getAllPelanggan,
    getPelangganById,
    createPelanggan,
    updatePelanggan,
    deletePelanggan,
} from "../controllers/pelangganController.js";

const router = express.Router();

router.use(verifyToken, roleMiddleware("admin"));

router.get("/", getAllPelanggan);
router.get("/:id", getPelangganById);
router.post("/", createPelanggan);
router.put("/:id", updatePelanggan);
router.delete("/:id", deletePelanggan);

export default router;