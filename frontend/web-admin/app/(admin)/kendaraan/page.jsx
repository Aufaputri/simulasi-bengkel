
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import api from "@/services/api";
// import Swal from "sweetalert2";
// import {
//     FaPlus,
//     FaSearch,
//     FaCar,
//     FaMotorcycle,
//     FaEdit,
//     FaTrash,
//     FaUser,
//     FaTimes,
//     FaCalendarAlt,
//     FaPalette,
// } from "react-icons/fa";

// const detectJenis = (item) => {
//     const raw = String(item?.jenis_kendaraan || item?.jenis || "")
//         .toLowerCase()
//         .trim();
//     if (raw === "mobil" || raw.includes("mobil") || raw.includes("roda 4")) {
//         return "mobil";
//     }
//     if (raw === "motor" || raw.includes("motor") || raw.includes("roda 2")) {
//         return "motor";
//     }
//     const text = `${item?.merk || ""} ${item?.tipe || ""}`.toLowerCase();
//     if (
//         /\b(civic|br-v|brv|hr-v|hrv|avanza|xenia|brio|ayla|agya|jazz|yaris|ertiga|xpander|innova|pajero|fortuner|calya|sigra)\b/.test(
//             text
//         )
//     ) {
//         return "mobil";
//     }
//     return "motor";
// };

// export default function KendaraanPage() {
//     const [kendaraan, setKendaraan] = useState([]);
//     const [pelanggan, setPelanggan] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");
//     const [jenisFilter, setJenisFilter] = useState("semua"); // "semua" | "mobil" | "motor"
//     const [showForm, setShowForm] = useState(false);
//     const [editId, setEditId] = useState(null);

//     const [form, setForm] = useState({
//         user_id: "",
//         jenis_kendaraan: "motor",
//         merk: "",
//         tipe: "",
//         tahun: "",
//         plat_nomor: "",
//         warna: "",
//     });

//     const getData = async () => {
//         try {
//             const [kendaraanResponse, pelangganResponse] = await Promise.all([
//                 api.get("/kendaraan/admin"),
//                 api.get("/pelanggan"),
//             ]);

//             setKendaraan(kendaraanResponse.data.data || []);
//             setPelanggan(pelangganResponse.data.data || []);
//         } catch (error) {
//             console.error(error);
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengambil data",
//                 "error"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         let active = true;
//         Promise.all([
//             api.get("/kendaraan/admin"),
//             api.get("/pelanggan"),
//         ])
//             .then(([kendaraanResponse, pelangganResponse]) => {
//                 if (!active) return;
//                 setKendaraan(kendaraanResponse.data.data || []);
//                 setPelanggan(pelangganResponse.data.data || []);
//             })
//             .catch((error) => {
//                 console.error(error);
//                 if (active) {
//                     Swal.fire(
//                         "Gagal",
//                         error.response?.data?.message || "Gagal mengambil data",
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
//             user_id: "",
//             jenis_kendaraan: "motor",
//             merk: "",
//             tipe: "",
//             tahun: "",
//             plat_nomor: "",
//             warna: "",
//         });
//         setEditId(null);
//         setShowForm(false);
//     };

//     const handleEdit = (item) => {
//         setForm({
//             user_id: String(item.user_id),
//             jenis_kendaraan: detectJenis(item),
//             merk: item.merk || "",
//             tipe: item.tipe || "",
//             tahun: item.tahun || "",
//             plat_nomor: item.plat_nomor || "",
//             warna: item.warna || "",
//         });

//         setEditId(item.id);
//         setShowForm(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const payload = {
//             ...form,
//             jenis_kendaraan: form.jenis_kendaraan === "mobil" ? "mobil" : "motor",
//             tahun: Number(form.tahun),
//             user_id: Number(form.user_id),
//             plat_nomor: form.plat_nomor.trim().toUpperCase(),
//         };

//         try {
//             if (editId) {
//                 await api.put(`/kendaraan/admin/${editId}`, payload);
//                 Swal.fire("Berhasil", "Data kendaraan berhasil diperbarui", "success");
//             } else {
//                 await api.post("/kendaraan/admin", payload);
//                 Swal.fire("Berhasil", "Kendaraan baru berhasil ditambahkan", "success");
//             }

//             resetForm();
//             await getData();
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal menyimpan data kendaraan",
//                 "error"
//             );
//         }
//     };

//     const handleDelete = async (item) => {
//         const result = await Swal.fire({
//             title: "Hapus Kendaraan?",
//             text: `Hapus kendaraan ${item.merk} ${item.tipe} (${item.plat_nomor})?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Ya, Hapus",
//             cancelButtonText: "Batal",
//             confirmButtonColor: "#ef4444",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             await api.delete(`/kendaraan/admin/${item.id}`);
//             setKendaraan((prev) =>
//                 prev.filter((data) => data.id !== item.id)
//             );
//             Swal.fire("Berhasil", "Kendaraan berhasil dihapus", "success");
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Kendaraan gagal dihapus",
//                 "error"
//             );
//         }
//     };

//     const counts = useMemo(() => {
//         let mobil = 0;
//         let motor = 0;
//         for (const item of kendaraan) {
//             if (detectJenis(item) === "mobil") mobil += 1;
//             else motor += 1;
//         }
//         return { semua: kendaraan.length, mobil, motor };
//     }, [kendaraan]);

//     const filteredKendaraan = useMemo(() => {
//         const keyword = search.toLowerCase().trim();
//         return kendaraan.filter((item) => {
//             const jenis = detectJenis(item);
//             if (jenisFilter !== "semua" && jenis !== jenisFilter) {
//                 return false;
//             }
//             if (!keyword) return true;
//             return (
//                 item.nama_pelanggan?.toLowerCase().includes(keyword) ||
//                 item.merk?.toLowerCase().includes(keyword) ||
//                 item.tipe?.toLowerCase().includes(keyword) ||
//                 item.plat_nomor?.toLowerCase().includes(keyword) ||
//                 jenis.includes(keyword)
//             );
//         });
//     }, [kendaraan, jenisFilter, search]);

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
//                         Manajemen Kendaraan
//                     </h1>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                         Kelola data armada sepeda motor dan mobil milik pelanggan bengkel.
//                     </p>
//                 </div>

//                 <button
//                     onClick={() => {
//                         resetForm();
//                         setShowForm(true);
//                     }}
//                     className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer self-start sm:self-auto"
//                 >
//                     <FaPlus className="text-xs" /> Tambah Kendaraan
//                 </button>
//             </div>

//             {/* Content Table Card */}
//             <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
//                 {/* Filter Tabs + Search & Counter */}
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
//                     <div>
//                         <h2 className="text-sm sm:text-base font-bold text-slate-900">
//                             Daftar Kendaraan Terdaftar
//                         </h2>
//                         <p className="text-xs text-slate-400 mt-0.5">
//                             Menampilkan {filteredKendaraan.length} dari {kendaraan.length} unit kendaraan
//                         </p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                         {/* Pemisah Semua / Mobil / Motor */}
//                         <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start">
//                             <button
//                                 type="button"
//                                 onClick={() => setJenisFilter("semua")}
//                                 className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
//                                     jenisFilter === "semua"
//                                         ? "bg-white text-blue-600 shadow-2xs"
//                                         : "text-slate-600 hover:text-slate-900"
//                                 }`}
//                             >
//                                 Semua ({counts.semua})
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setJenisFilter("mobil")}
//                                 className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
//                                     jenisFilter === "mobil"
//                                         ? "bg-white text-emerald-700 shadow-2xs"
//                                         : "text-slate-600 hover:text-slate-900"
//                                 }`}
//                             >
//                                 <FaCar className="text-[11px]" /> Mobil ({counts.mobil})
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setJenisFilter("motor")}
//                                 className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
//                                     jenisFilter === "motor"
//                                         ? "bg-white text-indigo-700 shadow-2xs"
//                                         : "text-slate-600 hover:text-slate-900"
//                                 }`}
//                             >
//                                 <FaMotorcycle className="text-[11px]" /> Motor ({counts.motor})
//                             </button>
//                         </div>

//                         <div className="relative w-full sm:w-64">
//                             <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//                             <input
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Cari kendaraan, plat, atau pemilik..."
//                                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto rounded-xl border border-slate-200/80">
//                     <table className="w-full min-w-[920px] text-xs sm:text-sm text-left">
//                         <thead>
//                             <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80">
//                                 <th className="px-4 py-3.5 text-center w-12">No</th>
//                                 <th className="px-4 py-3.5">Pemilik Kendaraan</th>
//                                 <th className="px-4 py-3.5">Jenis</th>
//                                 <th className="px-4 py-3.5">Merek & Tipe</th>
//                                 <th className="px-4 py-3.5">Nomor Polisi (Plat)</th>
//                                 <th className="px-4 py-3.5">Tahun</th>
//                                 <th className="px-4 py-3.5">Warna</th>
//                                 <th className="px-4 py-3.5 text-center w-28">Aksi</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-slate-100 bg-white">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="8" className="text-center py-12 text-slate-400">
//                                         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
//                                         Memuat data kendaraan...
//                                     </td>
//                                 </tr>
//                             ) : filteredKendaraan.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="8" className="text-center py-12 text-slate-400">
//                                         <FaCar className="mx-auto mb-2 text-2xl text-slate-300" />
//                                         {kendaraan.length === 0
//                                             ? "Belum ada kendaraan yang ditambahkan."
//                                             : "Data kendaraan tidak ditemukan."}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredKendaraan.map((item, index) => {
//                                     const jenis = detectJenis(item);
//                                     const isMobil = jenis === "mobil";
//                                     return (
//                                         <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
//                                             <td className="px-4 py-4 text-center font-medium text-slate-400">
//                                                 {index + 1}
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <div className="flex items-center gap-2.5">
//                                                     <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
//                                                         {item.nama_pelanggan?.charAt(0).toUpperCase() || <FaUser className="text-[10px]" />}
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-bold text-slate-800">
//                                                             {item.nama_pelanggan}
//                                                         </p>
//                                                         {item.no_hp && (
//                                                             <p className="text-[11px] text-slate-400">
//                                                                 {item.no_hp}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <span
//                                                     className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
//                                                         isMobil
//                                                             ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                                                             : "bg-indigo-50 text-indigo-700 border border-indigo-200"
//                                                     }`}
//                                                 >
//                                                     {isMobil ? (
//                                                         <FaCar className="text-[10px]" />
//                                                     ) : (
//                                                         <FaMotorcycle className="text-[10px]" />
//                                                     )}
//                                                     {isMobil ? "Mobil" : "Motor"}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <div className="flex items-center gap-2 font-semibold text-slate-800">
//                                                     {isMobil ? (
//                                                         <FaCar className="text-slate-400 text-xs shrink-0" />
//                                                     ) : (
//                                                         <FaMotorcycle className="text-slate-400 text-xs shrink-0" />
//                                                     )}
//                                                     <span>{item.merk} {item.tipe}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <span className="inline-block font-mono font-bold text-xs px-2.5 py-1 bg-slate-900 text-white rounded-md tracking-wider shadow-2xs border border-slate-700">
//                                                     {item.plat_nomor}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
//                                                 <span className="inline-flex items-center gap-1 text-xs font-medium">
//                                                     <FaCalendarAlt className="text-slate-400 text-[10px]" />
//                                                     {item.tahun}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
//                                                 {item.warna ? (
//                                                     <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
//                                                         <FaPalette className="text-slate-400 text-[10px]" />
//                                                         {item.warna}
//                                                     </span>
//                                                 ) : (
//                                                     <span className="text-slate-300">-</span>
//                                                 )}
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <div className="flex justify-center gap-1.5">
//                                                     <button
//                                                         onClick={() => handleEdit(item)}
//                                                         className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
//                                                         title="Edit Kendaraan"
//                                                     >
//                                                         <FaEdit />
//                                                     </button>

//                                                     <button
//                                                         onClick={() => handleDelete(item)}
//                                                         className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
//                                                         title="Hapus Kendaraan"
//                                                     >
//                                                         <FaTrash />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
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
//                                     {form.jenis_kendaraan === "mobil" ? <FaCar /> : <FaMotorcycle />}
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-bold text-slate-900">
//                                         {editId ? "Edit Kendaraan" : "Tambah Kendaraan Pelanggan"}
//                                     </h2>
//                                     <p className="text-xs text-slate-400">
//                                         Pilih jenis kendaraan (Motor / Mobil) & lengkapi data
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
//                                     Pemilik Kendaraan (Pelanggan)
//                                 </label>
//                                 <select
//                                     required
//                                     value={form.user_id}
//                                     onChange={(e) => setForm({ ...form, user_id: e.target.value })}
//                                     className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                 >
//                                     <option value="">Pilih pelanggan pemilik</option>
//                                     {pelanggan.map((item) => (
//                                         <option key={item.id} value={item.id}>
//                                             {item.nama} ({item.no_hp})
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Pilihan Jenis Kendaraan: Motor / Mobil */}
//                             <div>
//                                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                     Jenis Kendaraan
//                                 </label>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <button
//                                         type="button"
//                                         onClick={() => setForm({ ...form, jenis_kendaraan: "motor" })}
//                                         className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
//                                             form.jenis_kendaraan === "motor"
//                                                 ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
//                                                 : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                                         }`}
//                                     >
//                                         <FaMotorcycle /> Motor
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setForm({ ...form, jenis_kendaraan: "mobil" })}
//                                         className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
//                                             form.jenis_kendaraan === "mobil"
//                                                 ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
//                                                 : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                                         }`}
//                                     >
//                                         <FaCar /> Mobil
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Merek Kendaraan
//                                     </label>
//                                     <input
//                                         required
//                                         value={form.merk}
//                                         onChange={(e) => setForm({ ...form, merk: e.target.value })}
//                                         placeholder="Contoh: Honda / Toyota"
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Tipe / Model
//                                     </label>
//                                     <input
//                                         required
//                                         value={form.tipe}
//                                         onChange={(e) => setForm({ ...form, tipe: e.target.value })}
//                                         placeholder="Contoh: Vario 160 / Avanza"
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                 <div className="sm:col-span-2">
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Nomor Polisi (Plat)
//                                     </label>
//                                     <input
//                                         required
//                                         value={form.plat_nomor}
//                                         onChange={(e) => setForm({ ...form, plat_nomor: e.target.value })}
//                                         placeholder="B 1234 XYZ"
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold uppercase outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Tahun
//                                     </label>
//                                     <input
//                                         required
//                                         type="number"
//                                         min={1901}
//                                         max={new Date().getFullYear() + 1}
//                                         value={form.tahun}
//                                         onChange={(e) => setForm({ ...form, tahun: e.target.value })}
//                                         placeholder="2024"
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                     Warna Kendaraan (Opsional)
//                                 </label>
//                                 <input
//                                     value={form.warna}
//                                     onChange={(e) => setForm({ ...form, warna: e.target.value })}
//                                     placeholder="Contoh: Hitam Glossy / Merah Doff"
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
//                                     className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition cursor-pointer"
//                                 >
//                                     Simpan Kendaraan
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

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
    FaPlus,
    FaSearch,
    FaCar,
    FaMotorcycle,
    FaEdit,
    FaTrash,
    FaUser,
    FaTimes,
    FaCalendarAlt,
    FaPalette,
} from "react-icons/fa";

const detectJenis = (item) => {
    const raw = String(item?.jenis_kendaraan || item?.jenis || "")
        .toLowerCase()
        .trim();
    if (raw === "mobil" || raw.includes("mobil") || raw.includes("roda 4")) {
        return "mobil";
    }
    if (raw === "motor" || raw.includes("motor") || raw.includes("roda 2")) {
        return "motor";
    }
    const text = `${item?.merk || ""} ${item?.tipe || ""}`.toLowerCase();
    if (
        /\b(civic|br-v|brv|hr-v|hrv|avanza|xenia|brio|ayla|agya|jazz|yaris|ertiga|xpander|innova|pajero|fortuner|calya|sigra)\b/.test(
            text
        )
    ) {
        return "mobil";
    }
    return "motor";
};

export default function KendaraanPage() {
    const [kendaraan, setKendaraan] = useState([]);
    const [pelanggan, setPelanggan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [jenisFilter, setJenisFilter] = useState("semua"); // "semua" | "mobil" | "motor"
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        user_id: "",
        jenis_kendaraan: "motor",
        merk: "",
        tipe: "",
        tahun: "",
        plat_nomor: "",
        warna: "",
    });

    const getData = async () => {
        try {
            const [kendaraanResponse, pelangganResponse] = await Promise.all([
                api.get("/kendaraan/admin"),
                api.get("/pelanggan"),
            ]);

            setKendaraan(kendaraanResponse.data.data || []);
            setPelanggan(pelangganResponse.data.data || []);
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengambil data",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        Promise.all([
            api.get("/kendaraan/admin"),
            api.get("/pelanggan"),
        ])
            .then(([kendaraanResponse, pelangganResponse]) => {
                if (!active) return;
                setKendaraan(kendaraanResponse.data.data || []);
                setPelanggan(pelangganResponse.data.data || []);
            })
            .catch((error) => {
                console.error(error);
                if (active) {
                    Swal.fire(
                        "Gagal",
                        error.response?.data?.message || "Gagal mengambil data",
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
            user_id: "",
            jenis_kendaraan: "motor",
            merk: "",
            tipe: "",
            tahun: "",
            plat_nomor: "",
            warna: "",
        });
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setForm({
            user_id: String(item.user_id),
            jenis_kendaraan: detectJenis(item),
            merk: item.merk || "",
            tipe: item.tipe || "",
            tahun: item.tahun || "",
            plat_nomor: item.plat_nomor || "",
            warna: item.warna || "",
        });

        setEditId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            jenis_kendaraan: form.jenis_kendaraan === "mobil" ? "mobil" : "motor",
            tahun: Number(form.tahun),
            user_id: Number(form.user_id),
            plat_nomor: form.plat_nomor.trim().toUpperCase(),
        };

        try {
            if (editId) {
                await api.put(`/kendaraan/admin/${editId}`, payload);
                Swal.fire("Berhasil", "Data kendaraan berhasil diperbarui", "success");
            } else {
                await api.post("/kendaraan/admin", payload);
                Swal.fire("Berhasil", "Kendaraan baru berhasil ditambahkan", "success");
            }

            resetForm();
            await getData();
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal menyimpan data kendaraan",
                "error"
            );
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Kendaraan?",
            text: `Hapus kendaraan ${item.merk} ${item.tipe} (${item.plat_nomor})?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#937D7A",
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/kendaraan/admin/${item.id}`);
            setKendaraan((prev) =>
                prev.filter((data) => data.id !== item.id)
            );
            Swal.fire("Berhasil", "Kendaraan berhasil dihapus", "success");
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Kendaraan gagal dihapus",
                "error"
            );
        }
    };

    const counts = useMemo(() => {
        let mobil = 0;
        let motor = 0;
        for (const item of kendaraan) {
            if (detectJenis(item) === "mobil") mobil += 1;
            else motor += 1;
        }
        return { semua: kendaraan.length, mobil, motor };
    }, [kendaraan]);

    const filteredKendaraan = useMemo(() => {
        const keyword = search.toLowerCase().trim();
        return kendaraan.filter((item) => {
            const jenis = detectJenis(item);
            if (jenisFilter !== "semua" && jenis !== jenisFilter) {
                return false;
            }
            if (!keyword) return true;
            return (
                item.nama_pelanggan?.toLowerCase().includes(keyword) ||
                item.merk?.toLowerCase().includes(keyword) ||
                item.tipe?.toLowerCase().includes(keyword) ||
                item.plat_nomor?.toLowerCase().includes(keyword) ||
                jenis.includes(keyword)
            );
        });
    }, [kendaraan, jenisFilter, search]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#C6B2AE]/70 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div>
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#564B5E] bg-[#FADBB2]/70 border border-[#C6B2AE] px-2.5 py-0.5 rounded-md mb-1.5">
                        MobiCare
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#564B5E]">
                        Manajemen Kendaraan
                    </h1>
                    <p className="text-xs sm:text-sm text-[#937D7A] mt-1">
                        Kelola data armada sepeda motor dan mobil milik pelanggan bengkel.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#564B5E] hover:bg-[#937D7A] text-[#FADBB2] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer self-start sm:self-auto"
                >
                    <FaPlus className="text-xs" /> Tambah Kendaraan
                </button>
            </div>

            {/* Content Table Card */}
            <div className="bg-white border border-[#C6B2AE]/70 rounded-2xl p-5 sm:p-6 shadow-xs">
                {/* Filter Tabs + Search & Counter */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-[#564B5E]">
                            Daftar Kendaraan Terdaftar
                        </h2>
                        <p className="text-xs text-[#937D7A] mt-0.5">
                            Menampilkan {filteredKendaraan.length} dari {kendaraan.length} unit kendaraan
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Pemisah Semua / Mobil / Motor */}
                        <div className="inline-flex bg-[#C6B2AE]/20 p-1 rounded-xl border border-[#C6B2AE]/70 self-start">
                            <button
                                type="button"
                                onClick={() => setJenisFilter("semua")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    jenisFilter === "semua"
                                        ? "bg-[#564B5E] text-[#FADBB2] shadow-2xs"
                                        : "text-[#564B5E] hover:bg-[#FADBB2]/50"
                                }`}
                            >
                                Semua ({counts.semua})
                            </button>
                            <button
                                type="button"
                                onClick={() => setJenisFilter("mobil")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    jenisFilter === "mobil"
                                        ? "bg-[#564B5E] text-[#FADBB2] shadow-2xs"
                                        : "text-[#564B5E] hover:bg-[#FADBB2]/50"
                                }`}
                            >
                                <FaCar className="text-[11px]" /> Mobil ({counts.mobil})
                            </button>
                            <button
                                type="button"
                                onClick={() => setJenisFilter("motor")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    jenisFilter === "motor"
                                        ? "bg-[#564B5E] text-[#FADBB2] shadow-2xs"
                                        : "text-[#564B5E] hover:bg-[#FADBB2]/50"
                                }`}
                            >
                                <FaMotorcycle className="text-[11px]" /> Motor ({counts.motor})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#937D7A] text-xs" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kendaraan, plat, atau pemilik..."
                                className="w-full pl-9 pr-4 py-2 bg-[#C6B2AE]/15 border border-[#C6B2AE] rounded-xl text-xs sm:text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition-all focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-[#C6B2AE]/70">
                    <table className="w-full min-w-[920px] text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="bg-[#C6B2AE]/25 text-[#564B5E] uppercase tracking-wider text-[11px] font-bold border-b border-[#C6B2AE]/70">
                                <th className="px-4 py-3.5 text-center w-12">No</th>
                                <th className="px-4 py-3.5">Pemilik Kendaraan</th>
                                <th className="px-4 py-3.5">Jenis</th>
                                <th className="px-4 py-3.5">Merek & Tipe</th>
                                <th className="px-4 py-3.5">Nomor Polisi (Plat)</th>
                                <th className="px-4 py-3.5">Tahun</th>
                                <th className="px-4 py-3.5">Warna</th>
                                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#C6B2AE]/35 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-12 text-[#937D7A]">
                                        <div className="w-6 h-6 border-2 border-[#564B5E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Memuat data kendaraan...
                                    </td>
                                </tr>
                            ) : filteredKendaraan.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-12 text-[#937D7A]">
                                        <FaCar className="mx-auto mb-2 text-2xl text-[#C6B2AE]" />
                                        {kendaraan.length === 0
                                            ? "Belum ada kendaraan yang ditambahkan."
                                            : "Data kendaraan tidak ditemukan."}
                                    </td>
                                </tr>
                            ) : (
                                filteredKendaraan.map((item, index) => {
                                    const jenis = detectJenis(item);
                                    const isMobil = jenis === "mobil";
                                    return (
                                        <tr key={item.id} className="hover:bg-[#FADBB2]/20 transition-colors">
                                            <td className="px-4 py-4 text-center font-medium text-[#937D7A]">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-[#564B5E] text-[#FADBB2] flex items-center justify-center font-bold text-xs shrink-0">
                                                        {item.nama_pelanggan?.charAt(0).toUpperCase() || <FaUser className="text-[10px]" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#564B5E]">
                                                            {item.nama_pelanggan}
                                                        </p>
                                                        {item.no_hp && (
                                                            <p className="text-[11px] text-[#937D7A]">
                                                                {item.no_hp}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                        isMobil
                                                            ? "bg-[#FADBB2]/65 text-[#564B5E] border-[#C6B2AE]"
                                                            : "bg-[#564B5E]/12 text-[#564B5E] border-[#564B5E]/30"
                                                    }`}
                                                >
                                                    {isMobil ? (
                                                        <FaCar className="text-[10px] text-[#937D7A]" />
                                                    ) : (
                                                        <FaMotorcycle className="text-[10px] text-[#564B5E]" />
                                                    )}
                                                    {isMobil ? "Mobil" : "Motor"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 font-semibold text-[#564B5E]">
                                                    {isMobil ? (
                                                        <FaCar className="text-[#937D7A] text-xs shrink-0" />
                                                    ) : (
                                                        <FaMotorcycle className="text-[#937D7A] text-xs shrink-0" />
                                                    )}
                                                    <span>{item.merk} {item.tipe}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="inline-block font-mono font-bold text-xs px-2.5 py-1 bg-[#564B5E] text-[#FADBB2] rounded-md tracking-wider shadow-2xs border border-[#937D7A]/50">
                                                    {item.plat_nomor}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[#564B5E]/80 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-xs font-medium">
                                                    <FaCalendarAlt className="text-[#937D7A] text-[10px]" />
                                                    {item.tahun}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[#564B5E]/80 whitespace-nowrap">
                                                {item.warna ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-[#564B5E] font-medium">
                                                        <FaPalette className="text-[#937D7A] text-[10px]" />
                                                        {item.warna}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#C6B2AE]">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-1.5">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 rounded-lg text-[#937D7A] hover:bg-[#FADBB2]/60 transition cursor-pointer"
                                                        title="Edit Kendaraan"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="p-2 rounded-lg text-[#564B5E] hover:bg-[#937D7A]/20 transition cursor-pointer"
                                                        title="Hapus Kendaraan"
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
                <div className="fixed inset-0 z-50 bg-[#564B5E]/55 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C6B2AE]">
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#C6B2AE]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#C6B2AE]/25 border border-[#C6B2AE] text-[#564B5E] flex items-center justify-center">
                                    {form.jenis_kendaraan === "mobil" ? <FaCar /> : <FaMotorcycle />}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#564B5E]">
                                        {editId ? "Edit Kendaraan" : "Tambah Kendaraan Pelanggan"}
                                    </h2>
                                    <p className="text-xs text-[#937D7A]">
                                        Pilih jenis kendaraan (Motor / Mobil) & lengkapi data
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={resetForm}
                                className="p-2 text-[#937D7A] hover:text-[#564B5E] rounded-lg transition cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                    Pemilik Kendaraan (Pelanggan)
                                </label>
                                <select
                                    required
                                    value={form.user_id}
                                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                                    className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                >
                                    <option value="">Pilih pelanggan pemilik</option>
                                    {pelanggan.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama} ({item.no_hp})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pilihan Jenis Kendaraan: Motor / Mobil */}
                            <div>
                                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                    Jenis Kendaraan
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, jenis_kendaraan: "motor" })}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                                            form.jenis_kendaraan === "motor"
                                                ? "bg-[#564B5E] text-[#FADBB2] border-[#564B5E] shadow-sm"
                                                : "bg-[#C6B2AE]/15 text-[#564B5E] border-[#C6B2AE] hover:bg-[#FADBB2]/50"
                                        }`}
                                    >
                                        <FaMotorcycle /> Motor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, jenis_kendaraan: "mobil" })}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                                            form.jenis_kendaraan === "mobil"
                                                ? "bg-[#937D7A] text-[#FADBB2] border-[#937D7A] shadow-sm"
                                                : "bg-[#C6B2AE]/15 text-[#564B5E] border-[#C6B2AE] hover:bg-[#FADBB2]/50"
                                        }`}
                                    >
                                        <FaCar /> Mobil
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Merek Kendaraan
                                    </label>
                                    <input
                                        required
                                        value={form.merk}
                                        onChange={(e) => setForm({ ...form, merk: e.target.value })}
                                        placeholder="Contoh: Honda / Toyota"
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Tipe / Model
                                    </label>
                                    <input
                                        required
                                        value={form.tipe}
                                        onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                                        placeholder="Contoh: Vario 160 / Avanza"
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Nomor Polisi (Plat)
                                    </label>
                                    <input
                                        required
                                        value={form.plat_nomor}
                                        onChange={(e) => setForm({ ...form, plat_nomor: e.target.value })}
                                        placeholder="B 1234 XYZ"
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold uppercase text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Tahun
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min={1901}
                                        max={new Date().getFullYear() + 1}
                                        value={form.tahun}
                                        onChange={(e) => setForm({ ...form, tahun: e.target.value })}
                                        placeholder="2024"
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                    Warna Kendaraan (Opsional)
                                </label>
                                <input
                                    value={form.warna}
                                    onChange={(e) => setForm({ ...form, warna: e.target.value })}
                                    placeholder="Contoh: Hitam Glossy / Merah Doff"
                                    className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-[#C6B2AE]/50">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2.5 rounded-xl border border-[#C6B2AE] text-[#564B5E] hover:bg-[#C6B2AE]/20 text-xs sm:text-sm font-semibold transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-[#564B5E] hover:bg-[#937D7A] text-[#FADBB2] text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
                                >
                                    Simpan Kendaraan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}