// "use client";

// import { useEffect, useState } from "react";
// import api from "@/services/api";
// import Swal from "sweetalert2";
// import {
//     FaPlus,
//     FaSearch,
//     FaEdit,
//     FaTrash,
//     FaUsers,
//     FaEnvelope,
//     FaPhoneAlt,
//     FaMapMarkerAlt,
//     FaTimes,
//     FaUserCheck,
// } from "react-icons/fa";

// export default function PelangganPage() {
//     const [pelanggan, setPelanggan] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");
//     const [showForm, setShowForm] = useState(false);
//     const [editId, setEditId] = useState(null);

//     const [form, setForm] = useState({
//         nama: "",
//         email: "",
//         password: "",
//         no_hp: "",
//         address: "",
//     });

//     const getPelanggan = async () => {
//         try {
//             const response = await api.get("/pelanggan");
//             setPelanggan(response.data.data || []);
//         } catch (error) {
//             console.error(error);
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengambil data pelanggan",
//                 "error"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         let active = true;
//         api.get("/pelanggan")
//             .then((response) => {
//                 if (active) setPelanggan(response.data.data || []);
//             })
//             .catch((error) => {
//                 console.error(error);
//                 if (active) {
//                     Swal.fire(
//                         "Gagal",
//                         error.response?.data?.message || "Gagal mengambil data pelanggan",
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
//             nama: "",
//             email: "",
//             password: "",
//             no_hp: "",
//             address: "",
//         });
//         setEditId(null);
//         setShowForm(false);
//     };

//     const handleEdit = (item) => {
//         setForm({
//             nama: item.nama || "",
//             email: item.email || "",
//             password: "",
//             no_hp: item.no_hp || "",
//             address: item.address || "",
//         });
//         setEditId(item.id);
//         setShowForm(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             if (editId) {
//                 await api.put(`/pelanggan/${editId}`, {
//                     nama: form.nama,
//                     email: form.email,
//                     no_hp: form.no_hp,
//                     address: form.address,
//                 });

//                 Swal.fire("Berhasil", "Data pelanggan berhasil diperbarui", "success");
//             } else {
//                 await api.post("/pelanggan", form);
//                 Swal.fire("Berhasil", "Pelanggan baru berhasil ditambahkan", "success");
//             }

//             resetForm();
//             getPelanggan();
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal menyimpan data pelanggan",
//                 "error"
//             );
//         }
//     };

//     const handleDelete = async (item) => {
//         const result = await Swal.fire({
//             title: "Hapus Pelanggan?",
//             text: `Data pelanggan "${item.nama}" beserta akunnya akan dihapus.`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Ya, Hapus",
//             cancelButtonText: "Batal",
//             confirmButtonColor: "#ef4444",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             await api.delete(`/pelanggan/${item.id}`);
//             setPelanggan((prev) => prev.filter((p) => p.id !== item.id));
//             Swal.fire("Berhasil", "Pelanggan berhasil dihapus", "success");
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Pelanggan gagal dihapus",
//                 "error"
//             );
//         }
//     };

//     const filteredPelanggan = pelanggan.filter((item) => {
//         const keyword = search.toLowerCase();
//         return (
//             item.nama?.toLowerCase().includes(keyword) ||
//             item.email?.toLowerCase().includes(keyword) ||
//             item.no_hp?.toLowerCase().includes(keyword) ||
//             item.address?.toLowerCase().includes(keyword)
//         );
//     });

//     return (
//         <div className="space-y-6">
//             {/* Page Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
//                         Manajemen Pelanggan
//                     </h1>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                         Kelola data profil pelanggan, kontak telepon, dan riwayat alamat bengkel.
//                     </p>
//                 </div>

//                 <button
//                     onClick={() => {
//                         resetForm();
//                         setShowForm(true);
//                     }}
//                     className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer self-start sm:self-auto"
//                 >
//                     <FaPlus className="text-xs" /> Tambah Pelanggan
//                 </button>
//             </div>

//             {/* Table Card */}
//             <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
//                 {/* Search & Counter */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
//                     <div>
//                         <h2 className="text-sm sm:text-base font-bold text-slate-900">
//                             Daftar Pelanggan Terdaftar
//                         </h2>
//                         <p className="text-xs text-slate-400 mt-0.5">
//                             Menampilkan {filteredPelanggan.length} dari {pelanggan.length} orang pelanggan
//                         </p>
//                     </div>

//                     <div className="relative w-full sm:w-72">
//                         <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Cari nama, email, atau HP..."
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
//                                 <th className="px-4 py-3.5">Nama Pelanggan</th>
//                                 <th className="px-4 py-3.5">Email</th>
//                                 <th className="px-4 py-3.5">Kontak WhatsApp / HP</th>
//                                 <th className="px-4 py-3.5">Alamat Tempat Tinggal</th>
//                                 <th className="px-4 py-3.5 text-center w-28">Aksi</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-slate-100 bg-white">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="6" className="text-center py-12 text-slate-400">
//                                         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
//                                         Memuat data pelanggan...
//                                     </td>
//                                 </tr>
//                             ) : filteredPelanggan.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="text-center py-12 text-slate-400">
//                                         <FaUsers className="mx-auto mb-2 text-2xl text-slate-300" />
//                                         {pelanggan.length === 0
//                                             ? "Belum ada data pelanggan."
//                                             : "Data pelanggan tidak ditemukan."}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredPelanggan.map((item, index) => (
//                                     <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
//                                         <td className="px-4 py-4 text-center font-medium text-slate-400">
//                                             {index + 1}
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
//                                                     {item.nama?.charAt(0).toUpperCase()}
//                                                 </div>
//                                                 <span className="font-bold text-slate-800">
//                                                     {item.nama}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
//                                             <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
//                                                 <FaEnvelope className="text-slate-400 text-[10px]" />
//                                                 {item.email}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
//                                             <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
//                                                 <FaPhoneAlt className="text-emerald-600 text-[10px]" />
//                                                 {item.no_hp}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-4 text-slate-600 max-w-xs">
//                                             {item.address ? (
//                                                 <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 line-clamp-1">
//                                                     <FaMapMarkerAlt className="text-rose-400 text-[10px] shrink-0" />
//                                                     {item.address}
//                                                 </span>
//                                             ) : (
//                                                 <span className="text-slate-300">-</span>
//                                             )}
//                                         </td>
//                                         <td className="px-4 py-4">
//                                             <div className="flex justify-center gap-1.5">
//                                                 <button
//                                                     onClick={() => handleEdit(item)}
//                                                     className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
//                                                     title="Edit Pelanggan"
//                                                 >
//                                                     <FaEdit />
//                                                 </button>

//                                                 <button
//                                                     onClick={() => handleDelete(item)}
//                                                     className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
//                                                     title="Hapus Pelanggan"
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
//                                     <FaUserCheck />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-bold text-slate-900">
//                                         {editId ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
//                                     </h2>
//                                     <p className="text-xs text-slate-400">
//                                         Data akun pelanggan untuk booking servis
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
//                                     Nama Lengkap
//                                 </label>
//                                 <input
//                                     required
//                                     value={form.nama}
//                                     onChange={(e) => setForm({ ...form, nama: e.target.value })}
//                                     className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     placeholder="Contoh: Budi Santoso"
//                                 />
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Email
//                                     </label>
//                                     <input
//                                         required
//                                         type="email"
//                                         value={form.email}
//                                         onChange={(e) => setForm({ ...form, email: e.target.value })}
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                         placeholder="budi@example.com"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Nomor WhatsApp / HP
//                                     </label>
//                                     <input
//                                         required
//                                         value={form.no_hp}
//                                         onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                         placeholder="08123456789"
//                                     />
//                                 </div>
//                             </div>

//                             {!editId && (
//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Password Awal
//                                     </label>
//                                     <input
//                                         required
//                                         type="password"
//                                         minLength={6}
//                                         value={form.password}
//                                         onChange={(e) => setForm({ ...form, password: e.target.value })}
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                         placeholder="Minimal 6 karakter"
//                                     />
//                                 </div>
//                             )}

//                             <div>
//                                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                     Alamat Rumah (Opsional)
//                                 </label>
//                                 <textarea
//                                     rows="3"
//                                     value={form.address}
//                                     onChange={(e) => setForm({ ...form, address: e.target.value })}
//                                     className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     placeholder="Jl. Merdeka No. 12, Depok"
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
//                                     Simpan Pelanggan
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
    FaUsers,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaTimes,
    FaUserCheck,
} from "react-icons/fa";

export default function PelangganPage() {
    const [pelanggan, setPelanggan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        nama: "",
        email: "",
        password: "",
        no_hp: "",
        address: "",
    });

    const getPelanggan = async () => {
        try {
            const response = await api.get("/pelanggan");
            setPelanggan(response.data.data || []);
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengambil data pelanggan",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        api.get("/pelanggan")
            .then((response) => {
                if (active) setPelanggan(response.data.data || []);
            })
            .catch((error) => {
                console.error(error);
                if (active) {
                    Swal.fire(
                        "Gagal",
                        error.response?.data?.message || "Gagal mengambil data pelanggan",
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
            nama: "",
            email: "",
            password: "",
            no_hp: "",
            address: "",
        });
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setForm({
            nama: item.nama || "",
            email: item.email || "",
            password: "",
            no_hp: item.no_hp || "",
            address: item.address || "",
        });
        setEditId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                await api.put(`/pelanggan/${editId}`, {
                    nama: form.nama,
                    email: form.email,
                    no_hp: form.no_hp,
                    address: form.address,
                });

                Swal.fire("Berhasil", "Data pelanggan berhasil diperbarui", "success");
            } else {
                await api.post("/pelanggan", form);
                Swal.fire("Berhasil", "Pelanggan baru berhasil ditambahkan", "success");
            }

            resetForm();
            getPelanggan();
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal menyimpan data pelanggan",
                "error"
            );
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Pelanggan?",
            text: `Data pelanggan "${item.nama}" beserta akunnya akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#937D7A",
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/pelanggan/${item.id}`);
            setPelanggan((prev) => prev.filter((p) => p.id !== item.id));
            Swal.fire("Berhasil", "Pelanggan berhasil dihapus", "success");
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Pelanggan gagal dihapus",
                "error"
            );
        }
    };

    const filteredPelanggan = pelanggan.filter((item) => {
        const keyword = search.toLowerCase();
        return (
            item.nama?.toLowerCase().includes(keyword) ||
            item.email?.toLowerCase().includes(keyword) ||
            item.no_hp?.toLowerCase().includes(keyword) ||
            item.address?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#C6B2AE]/70 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div>
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#564B5E] bg-[#FADBB2]/70 border border-[#C6B2AE] px-2.5 py-0.5 rounded-md mb-1.5">
                        MobiCare
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#564B5E]">
                        Manajemen Pelanggan
                    </h1>
                    <p className="text-xs sm:text-sm text-[#937D7A] mt-1">
                        Kelola data profil pelanggan, kontak telepon, dan riwayat alamat bengkel.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#564B5E] hover:bg-[#937D7A] text-[#FADBB2] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer self-start sm:self-auto"
                >
                    <FaPlus className="text-xs" /> Tambah Pelanggan
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-[#C6B2AE]/70 rounded-2xl p-5 sm:p-6 shadow-xs">
                {/* Search & Counter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-[#564B5E]">
                            Daftar Pelanggan Terdaftar
                        </h2>
                        <p className="text-xs text-[#937D7A] mt-0.5">
                            Menampilkan {filteredPelanggan.length} dari {pelanggan.length} orang pelanggan
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#937D7A] text-xs" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, email, atau HP..."
                            className="w-full pl-9 pr-4 py-2 bg-[#C6B2AE]/15 border border-[#C6B2AE] rounded-xl text-xs sm:text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition-all focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-[#C6B2AE]/70">
                    <table className="w-full min-w-[750px] text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="bg-[#C6B2AE]/25 text-[#564B5E] uppercase tracking-wider text-[11px] font-bold border-b border-[#C6B2AE]/70">
                                <th className="px-4 py-3.5 text-center w-12">No</th>
                                <th className="px-4 py-3.5">Nama Pelanggan</th>
                                <th className="px-4 py-3.5">Email</th>
                                <th className="px-4 py-3.5">Kontak WhatsApp / HP</th>
                                <th className="px-4 py-3.5">Alamat Tempat Tinggal</th>
                                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#C6B2AE]/35 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-[#937D7A]">
                                        <div className="w-6 h-6 border-2 border-[#564B5E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Memuat data pelanggan...
                                    </td>
                                </tr>
                            ) : filteredPelanggan.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-[#937D7A]">
                                        <FaUsers className="mx-auto mb-2 text-2xl text-[#C6B2AE]" />
                                        {pelanggan.length === 0
                                            ? "Belum ada data pelanggan."
                                            : "Data pelanggan tidak ditemukan."}
                                    </td>
                                </tr>
                            ) : (
                                filteredPelanggan.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-[#FADBB2]/20 transition-colors">
                                        <td className="px-4 py-4 text-center font-medium text-[#937D7A]">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#564B5E] text-[#FADBB2] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                                    {item.nama?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-[#564B5E]">
                                                    {item.nama}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[#564B5E]/85 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-[#564B5E]">
                                                <FaEnvelope className="text-[#937D7A] text-[10px]" />
                                                {item.email}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-[#564B5E] whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#564B5E] bg-[#FADBB2]/60 border border-[#C6B2AE] px-2.5 py-1 rounded-md">
                                                <FaPhoneAlt className="text-[#564B5E] text-[10px]" />
                                                {item.no_hp}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-[#564B5E]/80 max-w-xs">
                                            {item.address ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-[#564B5E] line-clamp-1">
                                                    <FaMapMarkerAlt className="text-[#937D7A] text-[10px] shrink-0" />
                                                    {item.address}
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
                                                    title="Edit Pelanggan"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="p-2 rounded-lg text-[#564B5E] hover:bg-[#937D7A]/20 transition cursor-pointer"
                                                    title="Hapus Pelanggan"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
                                    <FaUserCheck />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#564B5E]">
                                        {editId ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
                                    </h2>
                                    <p className="text-xs text-[#937D7A]">
                                        Data akun pelanggan untuk booking servis
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
                                    Nama Lengkap
                                </label>
                                <input
                                    required
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    placeholder="Contoh: Budi Santoso"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                        placeholder="budi@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Nomor WhatsApp / HP
                                    </label>
                                    <input
                                        required
                                        value={form.no_hp}
                                        onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                        placeholder="08123456789"
                                    />
                                </div>
                            </div>

                            {!editId && (
                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Password Awal
                                    </label>
                                    <input
                                        required
                                        type="password"
                                        minLength={6}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                        placeholder="Minimal 6 karakter"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                    Alamat Rumah (Opsional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    placeholder="Jl. Merdeka No. 12, Depok"
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
                                    Simpan Pelanggan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}