import express from "express";

import verifyToken from "../middleware/verifyToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
    "/",
    verifyToken,
    roleMiddleware("admin"),
    getDashboard
);

export default router;