import express from "express";
import cors from "cors";
import db from "./config/database.js";
import authRoutes from "./routes/authroutes.js";
import verifyToken from "./middleware/verifyToken.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import layananRoutes from "./routes/layananRoutes.js";
import kendaraanRoutes from "./routes/kendaraanRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import pelangganRoutes from "./routes/pelangganRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/layanan", layananRoutes);
app.use("/kendaraan", kendaraanRoutes);
app.use("/booking", bookingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/pelanggan", pelangganRoutes);
// Route utama
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Booking Bengkel Berjalan 🚗"
    });
});

app.get("/cek-db", async (req, res) => {
    const [rows] = await db.query("SELECT DATABASE() AS db");
    res.json(rows);
});

// Test koneksi database
app.get("/test-db", async (req, res) => {
    try {

        const [rows] = await db.query("SELECT NOW() AS waktu");

        res.status(200).json({
            success: true,
            message: "Database berhasil terhubung",
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

app.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Berhasil mengakses profile",
        user: req.user
    });

});

app.get(
    "/admin",
    verifyToken,
    roleMiddleware("admin"),
    (req, res) => {

        res.json({
            message: "Selamat datang Admin"
        });

    }
);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan"
    });
});

export default app;