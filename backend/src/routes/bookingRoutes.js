import express from "express";

import verifyToken from "../middleware/verifyToken.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createBooking,
    getBooking,
    getBookingById,
    getAllBooking,
    adminCreateBooking,
    adminUpdateBooking,
    adminDeleteBooking,
    updateStatusBooking
} from "../controllers/bookingController.js";

const router = express.Router();

// Admin
router.get(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    getAllBooking
);

router.post(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    adminCreateBooking
);

router.put(
    "/admin/:id",
    verifyToken,
    roleMiddleware("admin"),
    adminUpdateBooking
);

router.delete(
    "/admin/:id",
    verifyToken,
    roleMiddleware("admin"),
    adminDeleteBooking
);

router.put(
    "/status/:id",
    verifyToken,
    roleMiddleware("admin"),
    updateStatusBooking
);

// Pelanggan & detail
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

router.get(
    "/:id",
    verifyToken,
    getBookingById
);

export default router;