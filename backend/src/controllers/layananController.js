// import db from "../config/database.js";

// export const getLayanan = async (req, res) => {
//     try {
//         const { search } = req.query;
//         let query = "SELECT * FROM layanan";
//         const params = [];

//         if (search && search.trim()) {
//             const keyword = `%${search.trim()}%`;
//             query += " WHERE nama_layanan LIKE ? OR deskripsi LIKE ?";
//             params.push(keyword, keyword);
//         }

//         query += " ORDER BY id DESC";

//         const [rows] = await db.query(query, params);

//         res.status(200).json({
//             success: true,
//             data: rows
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export const getLayananById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [rows] = await db.query(
//             "SELECT * FROM layanan WHERE id = ?",
//             [id]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Layanan tidak ditemukan"
//             });
//         }

//         res.json({
//             success: true,
//             data: rows[0]
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export const createLayanan = async (req, res) => {
//     try {
//         const {
//             nama_layanan,
//             deskripsi,
//             harga,
//             estimasi
//         } = req.body;

//         const cleanNama = nama_layanan?.trim();
//         const parsedHarga = Number(harga);

//         if (!cleanNama || harga === undefined || harga === null || harga === "") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Nama layanan dan harga wajib diisi"
//             });
//         }

//         if (Number.isNaN(parsedHarga) || parsedHarga <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Harga layanan harus berupa angka lebih dari 0"
//             });
//         }

//         const [result] = await db.query(
//             `INSERT INTO layanan
//             (nama_layanan, deskripsi, harga, estimasi)
//             VALUES (?, ?, ?, ?)`,
//             [
//                 cleanNama,
//                 deskripsi?.trim() || null,
//                 parsedHarga,
//                 estimasi?.trim() || null
//             ]
//         );

//         res.status(201).json({
//             success: true,
//             message: "Layanan berhasil ditambahkan",
//             data: { id: result.insertId }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export const updateLayanan = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const {
//             nama_layanan,
//             deskripsi,
//             harga,
//             estimasi
//         } = req.body;

//         const cleanNama = nama_layanan?.trim();
//         const parsedHarga = Number(harga);

//         if (!cleanNama || harga === undefined || harga === null || harga === "") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Nama layanan dan harga wajib diisi"
//             });
//         }

//         if (Number.isNaN(parsedHarga) || parsedHarga <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Harga layanan harus berupa angka lebih dari 0"
//             });
//         }

//         const [existing] = await db.query(
//             "SELECT id FROM layanan WHERE id = ?",
//             [id]
//         );

//         if (existing.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Layanan tidak ditemukan"
//             });
//         }

//         await db.query(
//             `UPDATE layanan
//             SET
//             nama_layanan = ?,
//             deskripsi = ?,
//             harga = ?,
//             estimasi = ?
//             WHERE id = ?`,
//             [
//                 cleanNama,
//                 deskripsi?.trim() || null,
//                 parsedHarga,
//                 estimasi?.trim() || null,
//                 id
//             ]
//         );

//         res.json({
//             success: true,
//             message: "Layanan berhasil diperbarui"
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export const deleteLayanan = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const [result] = await db.query(
//             "DELETE FROM layanan WHERE id = ?",
//             [id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Layanan tidak ditemukan"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Layanan berhasil dihapus"
//         });
//     } catch (error) {
//         if (error.code === "ER_ROW_IS_REFERENCED_2") {
//             return res.status(409).json({
//                 success: false,
//                 message: "Layanan tidak dapat dihapus karena masih digunakan pada data booking."
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

import db from "../config/database.js";

const normalizeJenis = (val) => {
    const v = String(val || "").trim().toLowerCase();
    return v === "mobil" ? "mobil" : "motor";
};

export const getLayanan = async (req, res) => {
    try {
        const { search, jenis_kendaraan } = req.query;
        let query = "SELECT * FROM layanan WHERE 1=1";
        const params = [];

        if (jenis_kendaraan && ["motor", "mobil"].includes(String(jenis_kendaraan).toLowerCase())) {
            query += " AND jenis_kendaraan = ?";
            params.push(String(jenis_kendaraan).toLowerCase());
        }

        if (search && search.trim()) {
            const keyword = `%${search.trim()}%`;
            query += " AND (nama_layanan LIKE ? OR deskripsi LIKE ?)";
            params.push(keyword, keyword);
        }

        query += " ORDER BY id DESC";

        const [rows] = await db.query(query, params);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getLayananById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM layanan WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Layanan tidak ditemukan"
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createLayanan = async (req, res) => {
    try {
        const {
            nama_layanan,
            jenis_kendaraan,
            deskripsi,
            harga,
            estimasi
        } = req.body;

        const cleanNama = nama_layanan?.trim();
        const parsedHarga = Number(harga);
        const jenis = normalizeJenis(jenis_kendaraan);

        if (!cleanNama || harga === undefined || harga === null || harga === "") {
            return res.status(400).json({
                success: false,
                message: "Nama layanan dan harga wajib diisi"
            });
        }

        if (Number.isNaN(parsedHarga) || parsedHarga <= 0) {
            return res.status(400).json({
                success: false,
                message: "Harga layanan harus berupa angka lebih dari 0"
            });
        }

        const [result] = await db.query(
            `INSERT INTO layanan
            (nama_layanan, jenis_kendaraan, deskripsi, harga, estimasi)
            VALUES (?, ?, ?, ?, ?)`,
            [
                cleanNama,
                jenis,
                deskripsi?.trim() || null,
                parsedHarga,
                estimasi?.trim() || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Layanan berhasil ditambahkan",
            data: { id: result.insertId, jenis_kendaraan: jenis }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateLayanan = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nama_layanan,
            jenis_kendaraan,
            deskripsi,
            harga,
            estimasi
        } = req.body;

        const cleanNama = nama_layanan?.trim();
        const parsedHarga = Number(harga);
        const jenis = normalizeJenis(jenis_kendaraan);

        if (!cleanNama || harga === undefined || harga === null || harga === "") {
            return res.status(400).json({
                success: false,
                message: "Nama layanan dan harga wajib diisi"
            });
        }

        if (Number.isNaN(parsedHarga) || parsedHarga <= 0) {
            return res.status(400).json({
                success: false,
                message: "Harga layanan harus berupa angka lebih dari 0"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM layanan WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Layanan tidak ditemukan"
            });
        }

        await db.query(
            `UPDATE layanan
            SET
            nama_layanan = ?,
            jenis_kendaraan = ?,
            deskripsi = ?,
            harga = ?,
            estimasi = ?
            WHERE id = ?`,
            [
                cleanNama,
                jenis,
                deskripsi?.trim() || null,
                parsedHarga,
                estimasi?.trim() || null,
                id
            ]
        );

        res.json({
            success: true,
            message: "Layanan berhasil diperbarui"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteLayanan = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM layanan WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Layanan tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Layanan berhasil dihapus"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                success: false,
                message: "Layanan tidak dapat dihapus karena masih digunakan pada data booking."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};