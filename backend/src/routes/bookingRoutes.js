import express from "express";

import verifyToken from "../middleware/verifyToken.js";

import roleMiddleware from "../middleware/roleMiddleware.js";

import {

    createBooking,
    getBooking,
    getAllBooking,
    updateStatusBooking

} from "../controllers/bookingController.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    createBooking
);

router.get(
    "/",
    verifyToken,
    getBooking
);

// Admin
router.get(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    getAllBooking
);

router.put(
    "/status/:id",
    verifyToken,
    roleMiddleware("admin"),
    updateStatusBooking
);

export default router;