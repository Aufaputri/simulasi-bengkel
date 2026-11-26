// "use client";

// import { useEffect, useState } from "react";
// import api from "@/services/api";
// import Swal from "sweetalert2";
// import {
//     FaPlus,
//     FaSearch,
//     FaEdit,
//     FaTrash,
//     FaTools,
//     FaClock,
//     FaTimes,
//     FaWrench,
//     FaMoneyBillWave,
// } from "react-icons/fa";

// const formatRupiah = (angka) =>
//     new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         minimumFractionDigits: 0,
//     }).format(Number(angka || 0));

// export default function LayananPage() {
//     const [layanan, setLayanan] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [search, setSearch] = useState("");
//     const [showForm, setShowForm] = useState(false);
//     const [editId, setEditId] = useState(null);

//     const [form, setForm] = useState({
//         nama_layanan: "",
//         harga: "",
//         estimasi: "",
//         deskripsi: "",
//     });

//     const getLayanan = async () => {
//         try {
//             const response = await api.get("/layanan");
//             setLayanan(response.data.data || []);
//         } catch (error) {
//             console.error(error);
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengambil data layanan",
//                 "error"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         let active = true;
//         api.get("/layanan")
//             .then((response) => {
//                 if (active) setLayanan(response.data.data || []);
//             })
//             .catch((error) => {
//                 console.error(error);
//                 if (active) {
//                     Swal.fire(
//                         "Gagal",
//                         error.response?.data?.message || "Gagal mengambil data layanan",
//                         "error"
//                     );
//                 }
//             })
//             .finally(() => {
//                 if (active) setLoading(false);
//             });

//         return () => {
//             active = false;
//         };
//     }, []);

//     const resetForm = () => {
//         setForm({
//             nama_layanan: "",
//             harga: "",
//             estimasi: "",
//             deskripsi: "",
//         });
//         setEditId(null);
//         setShowForm(false);
//     };

//     const handleEdit = (item) => {
//         setForm({
//             nama_layanan: item.nama_layanan || "",
//             harga: item.harga ? String(Number(item.harga)) : "",
//             estimasi: item.estimasi || "",
//             deskripsi: item.deskripsi || "",
//         });
//         setEditId(item.id);
//         setShowForm(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const hargaNum = Number(form.harga);
//         if (!form.nama_layanan.trim()) {
//             Swal.fire("Perhatian", "Nama layanan wajib diisi", "warning");
//             return;
//         }
//         if (Number.isNaN(hargaNum) || hargaNum <= 0) {
//             Swal.fire("Perhatian", "Harga harus berupa angka lebih dari 0", "warning");
//             return;
//         }

//         setSaving(true);
//         try {
//             const payload = {
//                 nama_layanan: form.nama_layanan.trim(),
//                 harga: hargaNum,
//                 estimasi: form.estimasi.trim(),
//                 deskripsi: form.deskripsi.trim(),
//             };

//             if (editId) {
//                 await api.put(`/layanan/${editId}`, payload);
//                 Swal.fire("Berhasil", "Data layanan berhasil diperbarui", "success");
//             } else {
//                 await api.post("/layanan", payload);
//                 Swal.fire("Berhasil", "Layanan baru berhasil ditambahkan", "success");
//             }

//             resetForm();
//             await getLayanan();
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal menyimpan data layanan",
//                 "error"
//             );
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDelete = async (item) => {
//         const result = await Swal.fire({
//             title: "Hapus Layanan Bengkel?",
//             text: `Layanan "${item.nama_layanan}" akan dihapus dari katalog bengkel.`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Ya, Hapus",
//             cancelButtonText: "Batal",
//             confirmButtonColor: "#ef4444",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             await api.delete(`/layanan/${item.id}`);
//             setLayanan((prev) => prev.filter((l) => l.id !== item.id));
//             Swal.fire("Berhasil", "Layanan berhasil dihapus", "success");
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Layanan gagal dihapus",
//                 "error"
//             );
//         }
//     };

//     const filteredLayanan = layanan.filter((item) => {
//         const keyword = search.toLowerCase();
//         return (
//             item.nama_layanan?.toLowerCase().includes(keyword) ||
//             item.deskripsi?.toLowerCase().includes(keyword) ||
//             item.estimasi?.toLowerCase().includes(keyword)
//         );
//     });

//     return (
//         <div className="space-y-6">
//             {/* Page Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
//                         Katalog Layanan & Tarif
//                     </h1>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                         Kelola daftar paket servis bengkel, estimasi durasi, dan rincian harga.
//                     </p>
//                 </div>

//                 <button
//                     onClick={() => {
//                         resetForm();
//                         setShowForm(true);
//                     }}
//                     className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer self-start sm:self-auto"
//                 >
//                     <FaPlus className="text-xs" /> Tambah Layanan
//                 </button>
//             </div>

//             {/* Content Card */}
//             <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
//                 {/* Search Bar & Summary */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
//                     <div>
//                         <h2 className="text-sm sm:text-base font-bold text-slate-900">
//                             Daftar Layanan Tersedia
//                         </h2>
//                         <p className="text-xs text-slate-400 mt-0.5">
//                             Menampilkan {filteredLayanan.length} dari {layanan.length} layanan
//                         </p>
//                     </div>

//                     <div className="relative w-full sm:w-72">
//                         <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Cari nama atau deskripsi..."
//                             className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                         />
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto rounded-xl border border-slate-200/80">
//                     <table className="w-full min-w-[750px] text-xs sm:text-sm text-left">
//                         <thead>
//                             <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80">
//                                 <th className="px-4 py-3.5 text-center w-12">No</th>
//                                 <th className="px-4 py-3.5">Nama Layanan</th>
//                                 <th className="px-4 py-3.5">Tarif Layanan</th>
//                                 <th className="px-4 py-3.5">Estimasi Durasi</th>
//                                 <th className="px-4 py-3.5">Deskripsi</th>
//                                 <th className="px-4 py-3.5 text-center w-28">Aksi</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-slate-100 bg-white">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="6" className="text-center py-12 text-slate-400">
//                                         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
//                                         Memuat data layanan...
//                                     </td>
//                                 </tr>
//                             ) : filteredLayanan.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="text-center py-12 text-slate-400">
//                                         <FaTools className="mx-auto mb-2 text-2xl text-slate-300" />
//                                         {layanan.length === 0
//                                             ? "Belum ada layanan yang ditambahkan."
//                                             : "Layanan tidak ditemukan."}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredLayanan.map((item, index) => (
//                                     <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
//                                         <td className="px-4 py-4 text-center font-medium text-slate-400">
//                                             {index + 1}
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
//                                                     <FaWrench className="text-xs" />
//                                                 </div>
//                                                 <span className="font-bold text-slate-800">
//                                                     {item.nama_layanan}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4 font-extrabold text-blue-600 whitespace-nowrap">
//                                             {formatRupiah(item.harga)}
//                                         </td>
//                                         <td className="px-4 py-4 whitespace-nowrap">
//                                             {item.estimasi ? (
//                                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
//                                                     <FaClock className="text-slate-400 text-[10px]" />
//                                                     {item.estimasi}
//                                                 </span>
//                                             ) : (
//                                                 <span className="text-slate-300">-</span>
//                                             )}
//                                         </td>
//                                         <td className="px-4 py-4 text-slate-600 max-w-xs">
//                                             <span className="line-clamp-2 text-xs leading-relaxed text-slate-500">
//                                                 {item.deskripsi || "-"}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div className="flex justify-center gap-1.5">
//                                                 <button
//                                                     onClick={() => handleEdit(item)}
//                                                     className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
//                                                     title="Edit Layanan"
//                                                 >
//                                                     <FaEdit />
//                                                 </button>

//                                                 <button
//                                                     onClick={() => handleDelete(item)}
//                                                     className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
//                                                     title="Hapus Layanan"
//                                                 >
//                                                     <FaTrash />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Modal Form */}
//             {showForm && (
//                 <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
//                     <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
//                         <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
//                                     <FaTools />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-bold text-slate-900">
//                                         {editId ? "Edit Layanan Servis" : "Tambah Layanan Servis"}
//                                     </h2>
//                                     <p className="text-xs text-slate-400">
//                                         Atur nama, tarif, dan estimasi waktu servis
//                                     </p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={resetForm}
//                                 className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                     Nama Layanan
//                                 </label>
//                                 <input
//                                     required
//                                     value={form.nama_layanan}
//                                     onChange={(e) =>
//                                         setForm({ ...form, nama_layanan: e.target.value })
//                                     }
//                                     placeholder="Contoh: Ganti Oli Mesin & Filter"
//                                     className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                 />
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Tarif / Harga (Rp)
//                                     </label>
//                                     <div className="relative">
//                                         <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
//                                             Rp
//                                         </span>
//                                         <input
//                                             required
//                                             type="number"
//                                             min="1"
//                                             step="500"
//                                             value={form.harga}
//                                             onChange={(e) =>
//                                                 setForm({ ...form, harga: e.target.value })
//                                             }
//                                             placeholder="75000"
//                                             className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Estimasi Waktu
//                                     </label>
//                                     <input
//                                         value={form.estimasi}
//                                         onChange={(e) =>
//                                             setForm({ ...form, estimasi: e.target.value })
//                                         }
//                                         placeholder="Contoh: 30 Menit / 1 Jam"
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                     Deskripsi Layanan (Opsional)
//                                 </label>
//                                 <textarea
//                                     rows="3"
//                                     value={form.deskripsi}
//                                     onChange={(e) =>
//                                         setForm({ ...form, deskripsi: e.target.value })
//                                     }
//                                     placeholder="Jelaskan komponen yang diperiksa atau diganti..."
//                                     className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                 />
//                             </div>

//                             <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
//                                 <button
//                                     type="button"
//                                     onClick={resetForm}
//                                     className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
//                                 >
//                                     Batal
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={saving}
//                                     className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition cursor-pointer"
//                                 >
//                                     {saving ? "Menyimpan..." : "Simpan Layanan"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaTools,
    FaClock,
    FaTimes,
    FaWrench,
    FaMotorcycle,
    FaCar,
} from "react-icons/fa";

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(angka || 0));

export default function LayananPage() {
    const [layanan, setLayanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [filterJenis, setFilterJenis] = useState("semua"); // 'semua' | 'motor' | 'mobil'
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        nama_layanan: "",
        jenis_kendaraan: "motor",
        harga: "",
        estimasi: "",
        deskripsi: "",
    });

    const getLayanan = async () => {
        try {
            const response = await api.get("/layanan");
            setLayanan(response.data.data || []);
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengambil data layanan",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        api.get("/layanan")
            .then((response) => {
                if (active) setLayanan(response.data.data || []);
            })
            .catch((error) => {
                console.error(error);
                if (active) {
                    Swal.fire(
                        "Gagal",
                        error.response?.data?.message || "Gagal mengambil data layanan",
                        "error"
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const resetForm = () => {
        setForm({
            nama_layanan: "",
            jenis_kendaraan: "motor",
            harga: "",
            estimasi: "",
            deskripsi: "",
        });
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setForm({
            nama_layanan: item.nama_layanan || "",
            jenis_kendaraan: item.jenis_kendaraan === "mobil" ? "mobil" : "motor",
            harga: item.harga ? String(Number(item.harga)) : "",
            estimasi: item.estimasi || "",
            deskripsi: item.deskripsi || "",
        });
        setEditId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hargaNum = Number(form.harga);
        if (!form.nama_layanan.trim()) {
            Swal.fire("Perhatian", "Nama layanan wajib diisi", "warning");
            return;
        }
        if (Number.isNaN(hargaNum) || hargaNum <= 0) {
            Swal.fire("Perhatian", "Harga harus berupa angka lebih dari 0", "warning");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                nama_layanan: form.nama_layanan.trim(),
                jenis_kendaraan: form.jenis_kendaraan,
                harga: hargaNum,
                estimasi: form.estimasi.trim(),
                deskripsi: form.deskripsi.trim(),
            };

            if (editId) {
                await api.put(`/layanan/${editId}`, payload);
                Swal.fire("Berhasil", "Data layanan berhasil diperbarui", "success");
            } else {
                await api.post("/layanan", payload);
                Swal.fire("Berhasil", "Layanan baru berhasil ditambahkan", "success");
            }

            resetForm();
            await getLayanan();
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal menyimpan data layanan",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Layanan Bengkel?",
            text: `Layanan "${item.nama_layanan}" akan dihapus dari katalog bengkel.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/layanan/${item.id}`);
            setLayanan((prev) => prev.filter((l) => l.id !== item.id));
            Swal.fire("Berhasil", "Layanan berhasil dihapus", "success");
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Layanan gagal dihapus",
                "error"
            );
        }
    };

    const filteredLayanan = layanan.filter((item) => {
        const jenis = item.jenis_kendaraan === "mobil" ? "mobil" : "motor";
        const matchJenis = filterJenis === "semua" ? true : jenis === filterJenis;

        const keyword = search.toLowerCase();
        const matchSearch =
            item.nama_layanan?.toLowerCase().includes(keyword) ||
            item.deskripsi?.toLowerCase().includes(keyword) ||
            item.estimasi?.toLowerCase().includes(keyword) ||
            jenis.includes(keyword);

        return matchJenis && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                        Katalog Layanan & Tarif
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Kelola paket servis bengkel untuk motor dan mobil, estimasi durasi, serta tarif.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer self-start sm:self-auto"
                >
                    <FaPlus className="text-xs" /> Tambah Layanan
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                {/* Search Bar, Filter & Summary */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                            Daftar Layanan Tersedia
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Menampilkan {filteredLayanan.length} dari {layanan.length} layanan
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start">
                            {[
                                { key: "semua", label: "Semua" },
                                { key: "motor", label: "Motor" },
                                { key: "mobil", label: "Mobil" },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setFilterJenis(tab.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        filterJenis === tab.key
                                            ? "bg-white text-blue-600 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-64">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau deskripsi..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                    <table className="w-full min-w-[820px] text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80">
                                <th className="px-4 py-3.5 text-center w-12">No</th>
                                <th className="px-4 py-3.5">Nama Layanan</th>
                                <th className="px-4 py-3.5">Kendaraan</th>
                                <th className="px-4 py-3.5">Tarif Layanan</th>
                                <th className="px-4 py-3.5">Estimasi Durasi</th>
                                <th className="px-4 py-3.5">Deskripsi</th>
                                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-slate-400">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Memuat data layanan...
                                    </td>
                                </tr>
                            ) : filteredLayanan.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-slate-400">
                                        <FaTools className="mx-auto mb-2 text-2xl text-slate-300" />
                                        {layanan.length === 0
                                            ? "Belum ada layanan yang ditambahkan."
                                            : "Layanan tidak ditemukan."}
                                    </td>
                                </tr>
                            ) : (
                                filteredLayanan.map((item, index) => {
                                    const isMobil = item.jenis_kendaraan === "mobil";
                                    return (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-4 text-center font-medium text-slate-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                                        <FaWrench className="text-xs" />
                                                    </div>
                                                    <span className="font-bold text-slate-800">
                                                        {item.nama_layanan}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        isMobil
                                                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                                    }`}
                                                >
                                                    {isMobil ? (
                                                        <FaCar className="text-[11px]" />
                                                    ) : (
                                                        <FaMotorcycle className="text-[11px]" />
                                                    )}
                                                    {isMobil ? "Mobil" : "Motor"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 font-extrabold text-blue-600 whitespace-nowrap">
                                                {formatRupiah(item.harga)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {item.estimasi ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                                        <FaClock className="text-slate-400 text-[10px]" />
                                                        {item.estimasi}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 max-w-xs">
                                                <span className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                    {item.deskripsi || "-"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-1.5">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                                                        title="Edit Layanan"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                                        title="Hapus Layanan"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FaTools />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editId ? "Edit Layanan Servis" : "Tambah Layanan Servis"}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Atur jenis kendaraan, nama, tarif, dan estimasi waktu servis
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={resetForm}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Jenis Kendaraan
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "motor", label: "Motor" },
                                        { value: "mobil", label: "Mobil" },
                                    ].map((opt) => {
                                        const active = form.jenis_kendaraan === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() =>
                                                    setForm({ ...form, jenis_kendaraan: opt.value })
                                                }
                                                className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                                    active
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Nama Layanan
                                </label>
                                <input
                                    required
                                    value={form.nama_layanan}
                                    onChange={(e) =>
                                        setForm({ ...form, nama_layanan: e.target.value })
                                    }
                                    placeholder="Contoh: Ganti Oli Mesin & Filter"
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        Tarif / Harga (Rp)
    </label>
    <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            Rp
        </span>
        <input
            required
            type="text"
            inputMode="numeric"
            value={form.harga}
            onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setForm({ ...form, harga: digitsOnly });
            }}
            placeholder="75000"
            className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
    </div>
</div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Estimasi Waktu
                                    </label>
                                    <input
                                        value={form.estimasi}
                                        onChange={(e) =>
                                            setForm({ ...form, estimasi: e.target.value })
                                        }
                                        placeholder="Contoh: 30 Menit / 1 Jam"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Deskripsi Layanan (Opsional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={form.deskripsi}
                                    onChange={(e) =>
                                        setForm({ ...form, deskripsi: e.target.value })
                                    }
                                    placeholder="Jelaskan komponen yang diperiksa atau diganti..."
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition cursor-pointer"
                                >
                                    {saving ? "Menyimpan..." : "Simpan Layanan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}