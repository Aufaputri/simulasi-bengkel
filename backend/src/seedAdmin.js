import dotenv from "dotenv";
import bcrypt from "bcrypt";
import db from "./config/database.js";

dotenv.config();

const buatAdmin = async () => {
    try {
        const nama = "Admin";
        const email = "admin-1@gmail.com";
        const password = "adminbengkel123";
        const no_hp = "081234567890";
        const address = "Depok";

        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Email sudah terdaftar!");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users
            (nama, email, password, no_hp, address, role)
            VALUES (?, ?, ?, ?, ?, 'admin')`,
            [nama, email, hashedPassword, no_hp, address]
        );

        console.log("Akun admin berhasil dibuat!");
    } catch (error) {
        console.error("Gagal membuat admin:", error.message);
    } finally {
        await db.end();
    }
};

buatAdmin();