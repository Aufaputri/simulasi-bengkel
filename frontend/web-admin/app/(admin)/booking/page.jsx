
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/services/api";
// import Swal from "sweetalert2";
// import {
//     FaPlus,
//     FaSearch,
//     FaEdit,
//     FaTrash,
//     FaEye,
//     FaPrint,
//     FaClipboardList,
//     FaTimes,
//     FaCar,
//     FaCalendarAlt,
//     FaClock,
//     FaFilter,
//     FaWrench,
//     FaUser,
//     FaCheckCircle,
//     FaMoneyBillWave,
// } from "react-icons/fa";

// const formatRupiah = (angka) =>
//     new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         minimumFractionDigits: 0,
//     }).format(Number(angka || 0));

// const getStatusStyle = (status) => {
//     switch (status) {
//         case "Menunggu":
//             return {
//                 badge: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/60",
//                 dot: "bg-amber-500",
//             };
//         case "Diproses":
//             return {
//                 badge: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/60",
//                 dot: "bg-blue-600 animate-pulse",
//             };
//         case "Selesai":
//             return {
//                 badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/60",
//                 dot: "bg-emerald-600",
//             };
//         default:
//             return {
//                 badge: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/60",
//                 dot: "bg-slate-400",
//             };
//     }
// };

// const getPaymentInfo = (item) => {
//     const statusBayar = String(item.status_pembayaran || "belum_bayar").toLowerCase();
//     const metode = item.metode_pembayaran
//         ? String(item.metode_pembayaran).toUpperCase()
//         : "";

//     if (statusBayar === "lunas") {
//         return {
//             label: metode ? `LUNAS (${metode})` : "LUNAS",
//             subLabel: item.payment_type ? `via ${item.payment_type}` : "Sudah di-ACC admin",
//             badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
//             isLunas: true,
//             canConfirm: false,
//         };
//     }

//     if (statusBayar === "pending") {
//         return {
//             label: metode ? `BERHASIL • BELUM LUNAS (${metode})` : "BERHASIL • BELUM LUNAS",
//             subLabel: "Bukti TF/bayar dicek saat offline • Klik Konfirmasi Lunas",
//             badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
//             isLunas: false,
//             canConfirm: true,
//         };
//     }

//     if (statusBayar === "gagal" || statusBayar === "kadaluarsa") {
//         return {
//             label: metode ? `${statusBayar.toUpperCase()} (${metode})` : statusBayar.toUpperCase(),
//             subLabel: "Transaksi tidak aktif",
//             badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
//             isLunas: false,
//             canConfirm: false,
//         };
//     }

//     return {
//         label: "BELUM BAYAR",
//         subLabel: "Menunggu pelanggan melakukan pembayaran",
//         badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
//         isLunas: false,
//         canConfirm: false,
//     };
// };

// export default function BookingPage() {
//     const [bookings, setBookings] = useState([]);
//     const [pelanggan, setPelanggan] = useState([]);
//     const [kendaraan, setKendaraan] = useState([]);
//     const [layanan, setLayanan] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     const [search, setSearch] = useState("");
//     const [filterStatus, setFilterStatus] = useState("Semua");
//     const [filterBayar, setFilterBayar] = useState("Semua");
//     const [filterTanggal, setFilterTanggal] = useState("");

//     const [showForm, setShowForm] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [detailModal, setDetailModal] = useState(null);

//     const [form, setForm] = useState({
//         user_id: "",
//         kendaraan_id: "",
//         layanan_ids: [],
//         tanggal_booking: "",
//         jam_booking: "09:00",
//         keluhan: "",
//         status: "Menunggu",
//     });

//     const loadAllData = async () => {
//         try {
//             const [bookingRes, pelangganRes, kendaraanRes, layananRes] =
//                 await Promise.all([
//                     api.get("/booking/admin"),
//                     api.get("/pelanggan"),
//                     api.get("/kendaraan/admin"),
//                     api.get("/layanan"),
//                 ]);

//             setBookings(bookingRes.data.data || []);
//             setPelanggan(pelangganRes.data.data || []);
//             setKendaraan(kendaraanRes.data.data || []);
//             setLayanan(layananRes.data.data || []);
//         } catch (error) {
//             console.error(error);
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengambil data booking",
//                 "error"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         let active = true;
//         Promise.all([
//             api.get("/booking/admin"),
//             api.get("/pelanggan"),
//             api.get("/kendaraan/admin"),
//             api.get("/layanan"),
//         ])
//             .then(([bookingRes, pelangganRes, kendaraanRes, layananRes]) => {
//                 if (!active) return;
//                 setBookings(bookingRes.data.data || []);
//                 setPelanggan(pelangganRes.data.data || []);
//                 setKendaraan(kendaraanRes.data.data || []);
//                 setLayanan(layananRes.data.data || []);
//             })
//             .catch((error) => {
//                 console.error(error);
//                 if (active) {
//                     Swal.fire(
//                         "Gagal",
//                         error.response?.data?.message || "Gagal mengambil data booking",
//                         "error"
//                     );
//                 }
//             })
//             .finally(() => {
//                 if (active) setLoading(false);
//             });

//         const handleFocus = () => {
//             if (!active) return;
//             api.get("/booking/admin")
//                 .then((res) => {
//                     if (active) setBookings(res.data.data || []);
//                 })
//                 .catch(() => {});
//         };
//         window.addEventListener("focus", handleFocus);

//         return () => {
//             active = false;
//             window.removeEventListener("focus", handleFocus);
//         };
//     }, []);

//     const resetForm = () => {
//         const today = new Date().toISOString().split("T")[0];
//         setForm({
//             user_id: "",
//             kendaraan_id: "",
//             layanan_ids: [],
//             tanggal_booking: today,
//             jam_booking: "09:00",
//             keluhan: "",
//             status: "Menunggu",
//         });
//         setEditId(null);
//         setShowForm(false);
//     };

//     const handleOpenCreate = () => {
//         const today = new Date().toISOString().split("T")[0];
//         setForm({
//             user_id: "",
//             kendaraan_id: "",
//             layanan_ids: [],
//             tanggal_booking: today,
//             jam_booking: "09:00",
//             keluhan: "",
//             status: "Menunggu",
//         });
//         setEditId(null);
//         setShowForm(true);
//     };

//     const handleEdit = (item) => {
//         const parsedLayananIds = item.layanan_ids
//             ? String(item.layanan_ids)
//                   .split(",")
//                   .map(Number)
//                   .filter((n) => !Number.isNaN(n))
//             : [];

//         setForm({
//             user_id: String(item.user_id || ""),
//             kendaraan_id: String(item.kendaraan_id || ""),
//             layanan_ids: parsedLayananIds,
//             tanggal_booking: item.tanggal_booking || "",
//             jam_booking: item.jam_booking ? item.jam_booking.slice(0, 5) : "09:00",
//             keluhan: item.keluhan || "",
//             status: item.status || "Menunggu",
//         });
//         setEditId(item.id);
//         setShowForm(true);
//     };

//     const handleViewDetail = async (item) => {
//         try {
//             const response = await api.get(`/booking/${item.id}`);
//             const detail = response.data.data;
//             setDetailModal({
//                 ...detail,
//                 pembayaran_id: detail.pembayaran_id ?? item.pembayaran_id,
//                 status_pembayaran: detail.status_pembayaran || item.status_pembayaran,
//                 metode_pembayaran: detail.metode_pembayaran ?? item.metode_pembayaran,
//                 payment_type: detail.payment_type ?? item.payment_type,
//                 midtrans_paid: detail.midtrans_paid ?? item.midtrans_paid,
//             });
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengambil detail booking",
//                 "error"
//             );
//         }
//     };

//     // Admin ACC & konfirmasi pembayaran lunas setelah bukti dicek saat ketemu offline di bengkel
//     const handleKonfirmasiLunas = async (item) => {
//         const metodeLabel = item.metode_pembayaran
//             ? String(item.metode_pembayaran).toUpperCase()
//             : "CASH";

//         const result = await Swal.fire({
//             title: "Konfirmasi Pembayaran Lunas?",
//             text: `Bukti pembayaran sudah dicek di bengkel dan ubah status ${metodeLabel} untuk booking ${item.kode_booking} (${formatRupiah(
//                 item.total_harga
//             )}) menjadi LUNAS?`,
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#16a34a",
//             cancelButtonColor: "#64748b",
//             confirmButtonText: "Ya, Konfirmasi Lunas",
//             cancelButtonText: "Batal",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             if (item.pembayaran_id) {
//                 await api.patch(`/api/pembayaran/${item.pembayaran_id}/lunas`);
//             } else {
//                 await api.post("/api/pembayaran/bayar", {
//                     booking_id: item.id,
//                     metode: "cash",
//                 });
//                 const listRes = await api.get("/api/pembayaran", {
//                     params: { search: item.kode_booking },
//                 });
//                 const found = (listRes.data?.data || []).find(
//                     (p) => Number(p.booking_id) === Number(item.id)
//                 );
//                 if (found?.id) {
//                     await api.patch(`/api/pembayaran/${found.id}/lunas`);
//                 }
//             }

//             await loadAllData();
//             setDetailModal((prev) =>
//                 prev && prev.id === item.id
//                     ? {
//                           ...prev,
//                           status_pembayaran: "lunas",
//                           metode_pembayaran: prev.metode_pembayaran || "cash",
//                       }
//                     : prev
//             );
//             Swal.fire("Berhasil", "Pembayaran berhasil dikonfirmasi LUNAS", "success");
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengonfirmasi pembayaran",
//                 "error"
//             );
//         }
//     };

//     const toggleLayanan = (id) => {
//         setForm((prev) => {
//             const exists = prev.layanan_ids.includes(id);
//             return {
//                 ...prev,
//                 layanan_ids: exists
//                     ? prev.layanan_ids.filter((item) => item !== id)
//                     : [...prev.layanan_ids, id],
//             };
//         });
//     };

//     const handlePelangganChange = (userId) => {
//         setForm((prev) => ({
//             ...prev,
//             user_id: userId,
//             kendaraan_id: "",
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!form.user_id || !form.kendaraan_id) {
//             Swal.fire("Perhatian", "Pelanggan dan kendaraan wajib dipilih", "warning");
//             return;
//         }

//         if (form.layanan_ids.length === 0) {
//             Swal.fire("Perhatian", "Pilih minimal 1 layanan servis", "warning");
//             return;
//         }

//         if (!form.tanggal_booking || !form.jam_booking) {
//             Swal.fire("Perhatian", "Tanggal dan jam booking wajib diisi", "warning");
//             return;
//         }

//         setSaving(true);
//         try {
//             const payload = {
//                 user_id: Number(form.user_id),
//                 kendaraan_id: Number(form.kendaraan_id),
//                 layanan_ids: form.layanan_ids,
//                 tanggal_booking: form.tanggal_booking,
//                 jam_booking:
//                     form.jam_booking.length === 5
//                         ? `${form.jam_booking}:00`
//                         : form.jam_booking,
//                 keluhan: form.keluhan,
//                 status: form.status,
//             };

//             if (editId) {
//                 await api.put(`/booking/admin/${editId}`, payload);
//                 Swal.fire("Berhasil", "Data booking berhasil diperbarui", "success");
//             } else {
//                 await api.post("/booking/admin", payload);
//                 Swal.fire("Berhasil", "Booking berhasil ditambahkan", "success");
//             }

//             resetForm();
//             await loadAllData();
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal menyimpan data booking",
//                 "error"
//             );
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleStatusChange = async (item, statusBaru) => {
//         if (item.status === statusBaru) return;

//         const result = await Swal.fire({
//             title: "Ubah Status Booking?",
//             text: `Ubah status booking ${item.kode_booking} menjadi "${statusBaru}"?`,
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#2563eb",
//             cancelButtonColor: "#64748b",
//             confirmButtonText: "Ya, Ubah",
//             cancelButtonText: "Batal",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             await api.put(`/booking/status/${item.id}`, { status: statusBaru });
//             setBookings((prev) =>
//                 prev.map((b) =>
//                     b.id === item.id ? { ...b, status: statusBaru } : b
//                 )
//             );
//             Swal.fire({
//                 icon: "success",
//                 title: "Berhasil!",
//                 text: "Status booking berhasil diperbarui.",
//                 timer: 1400,
//                 showConfirmButton: false,
//             });
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Gagal mengubah status",
//                 "error"
//             );
//         }
//     };

//     const handleDelete = async (item) => {
//         const result = await Swal.fire({
//             title: "Hapus Booking Servis?",
//             text: `Booking ${item.kode_booking} atas nama ${item.nama} akan dihapus permanen.`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Ya, Hapus",
//             cancelButtonText: "Batal",
//             confirmButtonColor: "#ef4444",
//         });

//         if (!result.isConfirmed) return;

//         try {
//             await api.delete(`/booking/admin/${item.id}`);
//             setBookings((prev) => prev.filter((b) => b.id !== item.id));
//             Swal.fire("Berhasil", "Booking berhasil dihapus", "success");
//         } catch (error) {
//             Swal.fire(
//                 "Gagal",
//                 error.response?.data?.message || "Booking gagal dihapus",
//                 "error"
//             );
//         }
//     };

//     const kendaraanPelanggan = kendaraan.filter(
//         (k) => String(k.user_id) === String(form.user_id)
//     );

//     const estimasiTotalForm = layanan
//         .filter((l) => form.layanan_ids.includes(l.id))
//         .reduce((sum, l) => sum + Number(l.harga || 0), 0);

//     const filteredBookings = bookings.filter((item) => {
//         const keyword = search.toLowerCase();
//         const cocokSearch =
//             item.kode_booking?.toLowerCase().includes(keyword) ||
//             item.nama?.toLowerCase().includes(keyword) ||
//             item.merk?.toLowerCase().includes(keyword) ||
//             item.tipe?.toLowerCase().includes(keyword) ||
//             item.plat_nomor?.toLowerCase().includes(keyword) ||
//             item.nama_layanan?.toLowerCase().includes(keyword);

//         const cocokStatus =
//             filterStatus === "Semua" || item.status === filterStatus;

//         const stBayar = String(item.status_pembayaran || "belum_bayar").toLowerCase();
//         const cocokBayar =
//             filterBayar === "Semua" ||
//             (filterBayar === "Lunas" && stBayar === "lunas") ||
//             (filterBayar === "Belum Lunas" && stBayar !== "lunas");

//         const cocokTanggal =
//             !filterTanggal || item.tanggal_booking === filterTanggal;

//         return cocokSearch && cocokStatus && cocokBayar && cocokTanggal;
//     });

//     return (
//         <div className="space-y-6">
//             {/* Header Bar */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
//                         Manajemen Booking Servis
//                     </h1>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                         Atur antrean pengerjaan servis, konfirmasi pembayaran lunas saat offline di bengkel, dan cetak nota.
//                     </p>
//                 </div>

//                 <button
//                     onClick={handleOpenCreate}
//                     className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer self-start sm:self-auto"
//                 >
//                     <FaPlus className="text-xs" /> Tambah Booking
//                 </button>
//             </div>

//             {/* Filter and Table Card */}
//             <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
//                 {/* Search & Filter Controls */}
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
//                     <div>
//                         <h2 className="text-sm sm:text-base font-bold text-slate-900">
//                             Daftar Booking Servis
//                         </h2>
//                         <p className="text-xs text-slate-400 mt-0.5">
//                             Menampilkan {filteredBookings.length} dari {bookings.length} total transaksi
//                         </p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
//                         {/* Search Input */}
//                         <div className="relative w-full sm:w-64">
//                             <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//                             <input
//                                 type="text"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Cari kode, plat, nama..."
//                                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                             />
//                         </div>

//                         {/* Payment Filter */}
//                         <select
//                             value={filterBayar}
//                             onChange={(e) => setFilterBayar(e.target.value)}
//                             aria-label="Filter status pembayaran"
//                             className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
//                         >
//                             <option value="Semua">Semua Pembayaran</option>
//                             <option value="Lunas">Lunas</option>
//                             <option value="Belum Lunas">Berhasil • Belum Lunas</option>
//                         </select>

//                         {/* Status Filter */}
//                         <div className="relative">
//                             <select
//                                 value={filterStatus}
//                                 onChange={(e) => setFilterStatus(e.target.value)}
//                                 aria-label="Filter status booking"
//                                 className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
//                             >
//                                 <option value="Semua">Semua Status</option>
//                                 <option value="Menunggu">Menunggu</option>
//                                 <option value="Diproses">Diproses</option>
//                                 <option value="Selesai">Selesai</option>
//                             </select>
//                             <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
//                         </div>

//                         {/* Date Filter */}
//                         <input
//                             type="date"
//                             value={filterTanggal}
//                             onChange={(e) => setFilterTanggal(e.target.value)}
//                             className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                         />

//                         {(search || filterStatus !== "Semua" || filterBayar !== "Semua" || filterTanggal) && (
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setSearch("");
//                                     setFilterStatus("Semua");
//                                     setFilterBayar("Semua");
//                                     setFilterTanggal("");
//                                 }}
//                                 className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
//                             >
//                                 Reset
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto rounded-xl border border-slate-200/80">
//                     <table className="w-full min-w-[1120px] text-xs sm:text-sm text-left">
//                         <thead>
//                             <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80">
//                                 <th className="px-4 py-3.5">Kode Booking</th>
//                                 <th className="px-4 py-3.5">Pelanggan</th>
//                                 <th className="px-4 py-3.5">Kendaraan</th>
//                                 <th className="px-4 py-3.5">Jadwal Servis</th>
//                                 <th className="px-4 py-3.5">Layanan</th>
//                                 <th className="px-4 py-3.5">Total Biaya</th>
//                                 <th className="px-4 py-3.5">Pembayaran</th>
//                                 <th className="px-4 py-3.5">Status Pengerjaan</th>
//                                 <th className="px-4 py-3.5 text-center w-36">Aksi</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-slate-100 bg-white">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="9" className="text-center py-12 text-slate-400">
//                                         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
//                                         Memuat data booking...
//                                     </td>
//                                 </tr>
//                             ) : filteredBookings.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="9" className="text-center py-12 text-slate-400">
//                                         <FaClipboardList className="mx-auto mb-2 text-2xl text-slate-300" />
//                                         {bookings.length === 0
//                                             ? "Belum ada riwayat booking."
//                                             : "Data booking tidak ditemukan."}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredBookings.map((item) => {
//                                     const style = getStatusStyle(item.status);
//                                     const payInfo = getPaymentInfo(item);

//                                     return (
//                                         <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
//                                                     {item.kode_booking}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs shrink-0 font-bold">
//                                                         {item.nama?.charAt(0).toUpperCase() || <FaUser className="text-[10px]" />}
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-bold text-slate-800">
//                                                             {item.nama}
//                                                         </p>
//                                                         <p className="text-[11px] text-slate-400">
//                                                             {item.no_hp}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <p className="font-semibold text-slate-700 flex items-center gap-1.5">
//                                                     <FaCar className="text-slate-400 text-xs" />
//                                                     <span>{item.merk} {item.tipe}</span>
//                                                 </p>
//                                                 <span className="inline-block mt-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded tracking-wider shadow-2xs">
//                                                     {item.plat_nomor}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <p className="font-medium text-slate-700 flex items-center gap-1.5">
//                                                     <FaCalendarAlt className="text-slate-400 text-[11px]" />
//                                                     {item.tanggal_booking}
//                                                 </p>
//                                                 <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
//                                                     <FaClock className="text-slate-300 text-[10px]" />
//                                                     {item.jam_booking?.slice(0, 5)} WIB
//                                                 </p>
//                                             </td>
//                                             <td className="px-4 py-4 text-slate-600 max-w-xs">
//                                                 <span className="line-clamp-2 text-xs leading-relaxed" title={item.nama_layanan}>
//                                                     {item.nama_layanan || "-"}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-4 font-extrabold text-slate-900 whitespace-nowrap">
//                                                 {formatRupiah(item.total_harga)}
//                                             </td>
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <div className="flex flex-col items-start gap-1">
//                                                     <span
//                                                         className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${payInfo.badgeClass}`}
//                                                     >
//                                                         {payInfo.isLunas ? (
//                                                             <FaCheckCircle className="text-[10px]" />
//                                                         ) : (
//                                                             <FaMoneyBillWave className="text-[10px]" />
//                                                         )}
//                                                         {payInfo.label}
//                                                     </span>

//                                                     {payInfo.subLabel && (
//                                                         <span className="text-[10px] text-slate-500">
//                                                             {payInfo.subLabel}
//                                                         </span>
//                                                     )}

//                                                     {!payInfo.isLunas && payInfo.canConfirm && (
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleKonfirmasiLunas(item)}
//                                                             className="mt-0.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
//                                                         >
//                                                             Konfirmasi Lunas
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-4 whitespace-nowrap">
//                                                 <div className="relative inline-block">
//                                                     <select
//                                                         value={item.status}
//                                                         onChange={(e) =>
//                                                             handleStatusChange(item, e.target.value)
//                                                         }
//                                                         aria-label={`Ubah status booking ${item.kode_booking}`}
//                                                         className={`inline-flex items-center pl-6 pr-6 py-1 rounded-full border text-xs font-semibold outline-none cursor-pointer transition-colors shadow-2xs ${style.badge}`}
//                                                     >
//                                                         <option value="Menunggu">Menunggu</option>
//                                                         <option value="Diproses">Diproses</option>
//                                                         <option value="Selesai">Selesai</option>
//                                                     </select>
//                                                     <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${style.dot} pointer-events-none`} />
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <div className="flex justify-center gap-1.5">
//                                                     <button
//                                                         onClick={() => handleViewDetail(item)}
//                                                         className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
//                                                         title="Lihat Struk / Nota"
//                                                     >
//                                                         <FaEye />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleEdit(item)}
//                                                         className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
//                                                         title="Edit Booking"
//                                                     >
//                                                         <FaEdit />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(item)}
//                                                         className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
//                                                         title="Hapus Booking"
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

//             {/* MODAL FORM CREATE / EDIT BOOKING */}
//             {showForm && (
//                 <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
//                     <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
//                         <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
//                                     <FaClipboardList />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg font-bold text-slate-900">
//                                         {editId ? "Edit Booking Servis" : "Tambah Booking Servis Baru"}
//                                     </h2>
//                                     <p className="text-xs text-slate-400">
//                                         Pilih pelanggan, kendaraan, dan paket servis
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
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Pelanggan
//                                     </label>
//                                     <select
//                                         required
//                                         value={form.user_id}
//                                         onChange={(e) => handlePelangganChange(e.target.value)}
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     >
//                                         <option value="">Pilih pelanggan</option>
//                                         {pelanggan.map((p) => (
//                                             <option key={p.id} value={p.id}>
//                                                 {p.nama} ({p.no_hp})
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Kendaraan Pelanggan
//                                     </label>
//                                     <select
//                                         required
//                                         disabled={!form.user_id}
//                                         value={form.kendaraan_id}
//                                         onChange={(e) =>
//                                             setForm({ ...form, kendaraan_id: e.target.value })
//                                         }
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100 disabled:text-slate-400"
//                                     >
//                                         <option value="">
//                                             {!form.user_id
//                                                 ? "Pilih pelanggan terlebih dahulu"
//                                                 : kendaraanPelanggan.length === 0
//                                                 ? "Pelanggan belum punya kendaraan"
//                                                 : "Pilih kendaraan"}
//                                         </option>
//                                         {kendaraanPelanggan.map((k) => (
//                                             <option key={k.id} value={k.id}>
//                                                 {k.merk} {k.tipe} - {k.plat_nomor}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Tanggal Booking
//                                     </label>
//                                     <input
//                                         required
//                                         type="date"
//                                         value={form.tanggal_booking}
//                                         onChange={(e) =>
//                                             setForm({ ...form, tanggal_booking: e.target.value })
//                                         }
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Jam Kedatangan
//                                     </label>
//                                     <input
//                                         required
//                                         type="time"
//                                         value={form.jam_booking}
//                                         onChange={(e) =>
//                                             setForm({ ...form, jam_booking: e.target.value })
//                                         }
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                         Status Pengerjaan
//                                     </label>
//                                     <select
//                                         value={form.status}
//                                         onChange={(e) =>
//                                             setForm({ ...form, status: e.target.value })
//                                         }
//                                         className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                                     >
//                                         <option value="Menunggu">Menunggu</option>
//                                         <option value="Diproses">Diproses</option>
//                                         <option value="Selesai">Selesai</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Service checklist */}
//                             <div>
//                                 <div className="flex items-center justify-between mb-2">
//                                     <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
//                                         Pilih Paket Layanan (Bisa lebih dari 1)
//                                     </label>
//                                     <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
//                                         Estimasi Total: {formatRupiah(estimasiTotalForm)}
//                                     </span>
//                                 </div>

//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto border border-slate-200/90 rounded-2xl p-3 bg-slate-50/70">
//                                     {layanan.length === 0 ? (
//                                         <p className="text-xs text-slate-400 col-span-2 text-center py-4">
//                                             Belum ada layanan tersedia.
//                                         </p>
//                                     ) : (
//                                         layanan.map((item) => {
//                                             const checked = form.layanan_ids.includes(item.id);
//                                             return (
//                                                 <label
//                                                     key={item.id}
//                                                     className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
//                                                         checked
//                                                             ? "bg-blue-50 border-blue-400 shadow-2xs"
//                                                             : "bg-white border-slate-200/80 hover:border-slate-300"
//                                                     }`}
//                                                 >
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={checked}
//                                                         onChange={() => toggleLayanan(item.id)}
//                                                         className="mt-0.5 accent-blue-600 rounded"
//                                                     />
//                                                     <div className="text-xs min-w-0">
//                                                         <p className="font-bold text-slate-800 truncate">
//                                                             {item.nama_layanan}
//                                                         </p>
//                                                         <p className="text-blue-600 font-semibold mt-0.5">
//                                                             {formatRupiah(item.harga)}
//                                                             {item.estimasi && (
//                                                                 <span className="text-slate-400 font-normal">
//                                                                     {" "}• {item.estimasi}
//                                                                 </span>
//                                                             )}
//                                                         </p>
//                                                     </div>
//                                                 </label>
//                                             );
//                                         })
//                                     )}
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                                     Keluhan atau Catatan Pelanggan (Opsional)
//                                 </label>
//                                 <textarea
//                                     rows="3"
//                                     value={form.keluhan}
//                                     onChange={(e) =>
//                                         setForm({ ...form, keluhan: e.target.value })
//                                     }
//                                     placeholder="Contoh: Rem depan bunyi berdecit, tarikan bawah brebet..."
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
//                                     {saving ? "Menyimpan..." : "Simpan Booking"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* MODAL DETAIL / NOTA STRUK BUKTI BOOKING */}
//             {detailModal && (
//                 <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
//                     <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100">
//                         <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
//                             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                                 Pratinjau Nota Servis
//                             </span>
//                             <button
//                                 onClick={() => setDetailModal(null)}
//                                 className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div id="struk-cetak" className="space-y-5 text-slate-800">
//                             <div className="border-b-2 border-dashed border-slate-300 pb-5 text-center">
//                                 <div className="inline-flex items-center gap-2 mb-1">
//                                     <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
//                                         <FaWrench />
//                                     </div>
//                                     <h3 className="text-xl font-black tracking-tight text-slate-900">
//                                         BENGKEL RESMI AUTOSERVIS
//                                     </h3>
//                                 </div>
//                                 <p className="text-xs text-slate-500">
//                                     Jl. Pekapuran No. 45, Curug, Cimanggis, Kota Depok
//                                 </p>
//                                 <p className="text-xs text-slate-500">
//                                     WhatsApp: 0812-3456-7890 • Telp: (021) 874-2980
//                                 </p>
//                             </div>

//                             <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200/80">
//                                 <div>
//                                     <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                                         No. Booking / Nota
//                                     </p>
//                                     <p className="text-base font-extrabold text-blue-600 font-mono">
//                                         {detailModal.kode_booking}
//                                     </p>
//                                 </div>

//                                 <div className="text-right space-y-1">
//                                     <div>
//                                         <span
//                                             className={`inline-block px-3 py-0.5 rounded-full border text-xs font-bold ${getStatusStyle(
//                                                 detailModal.status
//                                             ).badge}`}
//                                         >
//                                             {detailModal.status}
//                                         </span>
//                                     </div>
//                                     <div>
//                                         <span
//                                             className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
//                                                 getPaymentInfo(detailModal).badgeClass
//                                             }`}
//                                         >
//                                             {getPaymentInfo(detailModal).label}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4 text-xs">
//                                 <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
//                                     <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
//                                         Informasi Pelanggan
//                                     </p>
//                                     <p className="font-bold text-slate-900 text-sm">
//                                         {detailModal.nama}
//                                     </p>
//                                     <p className="text-slate-600">
//                                         {detailModal.no_hp}
//                                     </p>
//                                     {detailModal.email && (
//                                         <p className="text-slate-500 text-[11px] truncate">
//                                             {detailModal.email}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
//                                     <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
//                                         Informasi Kendaraan
//                                     </p>
//                                     <p className="font-bold text-slate-900 text-sm">
//                                         {detailModal.merk} {detailModal.tipe}
//                                     </p>
//                                     <span className="inline-block font-mono font-bold text-xs px-2 py-0.5 bg-slate-900 text-white rounded">
//                                         {detailModal.plat_nomor}
//                                     </span>
//                                     <p className="text-slate-500 text-[11px]">
//                                         Tahun: {detailModal.tahun} {detailModal.warna ? `• ${detailModal.warna}` : ""}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="text-xs p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
//                                 <span className="text-slate-600 font-medium flex items-center gap-1.5">
//                                     <FaCalendarAlt className="text-blue-600" />
//                                     Jadwal Kedatangan Servis:
//                                 </span>
//                                 <span className="font-bold text-slate-900">
//                                     {detailModal.tanggal_booking} • {detailModal.jam_booking?.slice(0, 5)} WIB
//                                 </span>
//                             </div>

//                             <div>
//                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
//                                     Rincian Paket Layanan
//                                 </p>
//                                 <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
//                                     <div className="flex justify-between px-4 py-2 bg-slate-100 text-[11px] font-bold text-slate-600 uppercase">
//                                         <span>Item Layanan</span>
//                                         <span>Tarif</span>
//                                     </div>
//                                     {detailModal.layanan?.map((l) => (
//                                         <div
//                                             key={l.id}
//                                             className="flex items-center justify-between px-4 py-2.5 text-xs bg-white"
//                                         >
//                                             <div>
//                                                 <p className="font-semibold text-slate-800">
//                                                     {l.nama_layanan}
//                                                 </p>
//                                                 {l.estimasi && (
//                                                     <p className="text-[11px] text-slate-400">
//                                                         Durasi: {l.estimasi}
//                                                     </p>
//                                                 )}
//                                             </div>
//                                             <span className="font-bold text-slate-800">
//                                                 {formatRupiah(l.harga)}
//                                             </span>
//                                         </div>
//                                     ))}

//                                     <div className="flex items-center justify-between px-4 py-3 bg-blue-50 text-sm font-extrabold text-slate-900">
//                                         <span>TOTAL BIAYA ESTIMASI</span>
//                                         <span className="text-blue-700 text-base">
//                                             {formatRupiah(detailModal.total_harga)}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {detailModal.keluhan && (
//                                 <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/80">
//                                     <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
//                                         Keluhan / Permintaan Khusus Pelanggan
//                                     </p>
//                                     <p className="text-slate-700 italic">
//                                         &ldquo;{detailModal.keluhan}&rdquo;
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="no-print flex flex-wrap justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
//                             {getPaymentInfo(detailModal).canConfirm && !getPaymentInfo(detailModal).isLunas && (
//                                 <button
//                                     type="button"
//                                     onClick={() => handleKonfirmasiLunas(detailModal)}
//                                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
//                                 >
//                                     <FaCheckCircle className="text-xs" /> Konfirmasi Lunas
//                                 </button>
//                             )}
//                             <button
//                                 type="button"
//                                 onClick={() => window.print()}
//                                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
//                             >
//                                 <FaPrint className="text-xs" /> Cetak Nota / Struk
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setDetailModal(null)}
//                                 className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
//                             >
//                                 Tutup
//                             </button>
//                         </div>
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
    FaEye,
    FaPrint,
    FaClipboardList,
    FaTimes,
    FaCar,
    FaCalendarAlt,
    FaClock,
    FaFilter,
    FaWrench,
    FaUser,
    FaCheckCircle,
    FaMoneyBillWave,
} from "react-icons/fa";

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(angka || 0));

const getStatusStyle = (status) => {
    switch (status) {
        case "Menunggu":
            return {
                badge: "bg-[#FADBB2]/65 text-[#564B5E] border-[#C6B2AE] hover:bg-[#FADBB2]/90",
                dot: "bg-[#937D7A]",
            };
        case "Diproses":
            return {
                badge: "bg-[#564B5E]/12 text-[#564B5E] border-[#564B5E]/30 hover:bg-[#564B5E]/20",
                dot: "bg-[#564B5E] animate-pulse",
            };
        case "Selesai":
            return {
                badge: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80",
                dot: "bg-emerald-600",
            };
        default:
            return {
                badge: "bg-[#C6B2AE]/25 text-[#564B5E] border-[#C6B2AE] hover:bg-[#C6B2AE]/40",
                dot: "bg-[#937D7A]",
            };
    }
};

const getPaymentInfo = (item) => {
    const statusBayar = String(item.status_pembayaran || "belum_bayar").toLowerCase();
    const metode = item.metode_pembayaran
        ? String(item.metode_pembayaran).toUpperCase()
        : "";

    if (statusBayar === "lunas") {
        return {
            label: metode ? `LUNAS (${metode})` : "LUNAS",
            subLabel: item.payment_type ? `via ${item.payment_type}` : "Sudah di-ACC admin",
            badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
            isLunas: true,
            canConfirm: false,
        };
    }

    if (statusBayar === "pending") {
        return {
            label: metode ? `BERHASIL • BELUM LUNAS (${metode})` : "BERHASIL • BELUM LUNAS",
            subLabel: "Bukti TF/bayar dicek saat offline • Klik Konfirmasi Lunas",
            badgeClass: "bg-[#FADBB2]/65 text-[#564B5E] border-[#C6B2AE]",
            isLunas: false,
            canConfirm: true,
        };
    }

    if (statusBayar === "gagal" || statusBayar === "kadaluarsa") {
        return {
            label: metode ? `${statusBayar.toUpperCase()} (${metode})` : statusBayar.toUpperCase(),
            subLabel: "Transaksi tidak aktif",
            badgeClass: "bg-[#937D7A]/15 text-[#564B5E] border-[#937D7A]/35",
            isLunas: false,
            canConfirm: false,
        };
    }

    return {
        label: "BELUM BAYAR",
        subLabel: "Menunggu pelanggan melakukan pembayaran",
        badgeClass: "bg-[#C6B2AE]/25 text-[#564B5E]/80 border-[#C6B2AE]",
        isLunas: false,
        canConfirm: false,
    };
};

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const [pelanggan, setPelanggan] = useState([]);
    const [kendaraan, setKendaraan] = useState([]);
    const [layanan, setLayanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [filterBayar, setFilterBayar] = useState("Semua");
    const [filterTanggal, setFilterTanggal] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [detailModal, setDetailModal] = useState(null);

    const [form, setForm] = useState({
        user_id: "",
        kendaraan_id: "",
        layanan_ids: [],
        tanggal_booking: "",
        jam_booking: "09:00",
        keluhan: "",
        status: "Menunggu",
    });

    const loadAllData = async () => {
        try {
            const [bookingRes, pelangganRes, kendaraanRes, layananRes] =
                await Promise.all([
                    api.get("/booking/admin"),
                    api.get("/pelanggan"),
                    api.get("/kendaraan/admin"),
                    api.get("/layanan"),
                ]);

            setBookings(bookingRes.data.data || []);
            setPelanggan(pelangganRes.data.data || []);
            setKendaraan(kendaraanRes.data.data || []);
            setLayanan(layananRes.data.data || []);
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengambil data booking",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        Promise.all([
            api.get("/booking/admin"),
            api.get("/pelanggan"),
            api.get("/kendaraan/admin"),
            api.get("/layanan"),
        ])
            .then(([bookingRes, pelangganRes, kendaraanRes, layananRes]) => {
                if (!active) return;
                setBookings(bookingRes.data.data || []);
                setPelanggan(pelangganRes.data.data || []);
                setKendaraan(kendaraanRes.data.data || []);
                setLayanan(layananRes.data.data || []);
            })
            .catch((error) => {
                console.error(error);
                if (active) {
                    Swal.fire(
                        "Gagal",
                        error.response?.data?.message || "Gagal mengambil data booking",
                        "error"
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        const handleFocus = () => {
            if (!active) return;
            api.get("/booking/admin")
                .then((res) => {
                    if (active) setBookings(res.data.data || []);
                })
                .catch(() => {});
        };
        window.addEventListener("focus", handleFocus);

        return () => {
            active = false;
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    const resetForm = () => {
        const today = new Date().toISOString().split("T")[0];
        setForm({
            user_id: "",
            kendaraan_id: "",
            layanan_ids: [],
            tanggal_booking: today,
            jam_booking: "09:00",
            keluhan: "",
            status: "Menunggu",
        });
        setEditId(null);
        setShowForm(false);
    };

    const handleOpenCreate = () => {
        const today = new Date().toISOString().split("T")[0];
        setForm({
            user_id: "",
            kendaraan_id: "",
            layanan_ids: [],
            tanggal_booking: today,
            jam_booking: "09:00",
            keluhan: "",
            status: "Menunggu",
        });
        setEditId(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        const parsedLayananIds = item.layanan_ids
            ? String(item.layanan_ids)
                  .split(",")
                  .map(Number)
                  .filter((n) => !Number.isNaN(n))
            : [];

        setForm({
            user_id: String(item.user_id || ""),
            kendaraan_id: String(item.kendaraan_id || ""),
            layanan_ids: parsedLayananIds,
            tanggal_booking: item.tanggal_booking || "",
            jam_booking: item.jam_booking ? item.jam_booking.slice(0, 5) : "09:00",
            keluhan: item.keluhan || "",
            status: item.status || "Menunggu",
        });
        setEditId(item.id);
        setShowForm(true);
    };

    const handleViewDetail = async (item) => {
        try {
            const response = await api.get(`/booking/${item.id}`);
            const detail = response.data.data;
            setDetailModal({
                ...detail,
                pembayaran_id: detail.pembayaran_id ?? item.pembayaran_id,
                status_pembayaran: detail.status_pembayaran || item.status_pembayaran,
                metode_pembayaran: detail.metode_pembayaran ?? item.metode_pembayaran,
                payment_type: detail.payment_type ?? item.payment_type,
                midtrans_paid: detail.midtrans_paid ?? item.midtrans_paid,
            });
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengambil detail booking",
                "error"
            );
        }
    };

    // Admin ACC & konfirmasi pembayaran lunas setelah bukti dicek saat ketemu offline di bengkel
    const handleKonfirmasiLunas = async (item) => {
        const metodeLabel = item.metode_pembayaran
            ? String(item.metode_pembayaran).toUpperCase()
            : "CASH";

        const result = await Swal.fire({
            title: "Konfirmasi Pembayaran Lunas?",
            text: `Bukti pembayaran sudah dicek di bengkel dan ubah status ${metodeLabel} untuk booking ${item.kode_booking} (${formatRupiah(
                item.total_harga
            )}) menjadi LUNAS?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#564B5E",
            cancelButtonColor: "#937D7A",
            confirmButtonText: "Ya, Konfirmasi Lunas",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        try {
            if (item.pembayaran_id) {
                await api.patch(`/api/pembayaran/${item.pembayaran_id}/lunas`);
            } else {
                await api.post("/api/pembayaran/bayar", {
                    booking_id: item.id,
                    metode: "cash",
                });
                const listRes = await api.get("/api/pembayaran", {
                    params: { search: item.kode_booking },
                });
                const found = (listRes.data?.data || []).find(
                    (p) => Number(p.booking_id) === Number(item.id)
                );
                if (found?.id) {
                    await api.patch(`/api/pembayaran/${found.id}/lunas`);
                }
            }

            await loadAllData();
            setDetailModal((prev) =>
                prev && prev.id === item.id
                    ? {
                          ...prev,
                          status_pembayaran: "lunas",
                          metode_pembayaran: prev.metode_pembayaran || "cash",
                      }
                    : prev
            );
            Swal.fire("Berhasil", "Pembayaran berhasil dikonfirmasi LUNAS", "success");
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengonfirmasi pembayaran",
                "error"
            );
        }
    };

    const toggleLayanan = (id) => {
        setForm((prev) => {
            const exists = prev.layanan_ids.includes(id);
            return {
                ...prev,
                layanan_ids: exists
                    ? prev.layanan_ids.filter((item) => item !== id)
                    : [...prev.layanan_ids, id],
            };
        });
    };

    const handlePelangganChange = (userId) => {
        setForm((prev) => ({
            ...prev,
            user_id: userId,
            kendaraan_id: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.user_id || !form.kendaraan_id) {
            Swal.fire("Perhatian", "Pelanggan dan kendaraan wajib dipilih", "warning");
            return;
        }

        if (form.layanan_ids.length === 0) {
            Swal.fire("Perhatian", "Pilih minimal 1 layanan servis", "warning");
            return;
        }

        if (!form.tanggal_booking || !form.jam_booking) {
            Swal.fire("Perhatian", "Tanggal dan jam booking wajib diisi", "warning");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                user_id: Number(form.user_id),
                kendaraan_id: Number(form.kendaraan_id),
                layanan_ids: form.layanan_ids,
                tanggal_booking: form.tanggal_booking,
                jam_booking:
                    form.jam_booking.length === 5
                        ? `${form.jam_booking}:00`
                        : form.jam_booking,
                keluhan: form.keluhan,
                status: form.status,
            };

            if (editId) {
                await api.put(`/booking/admin/${editId}`, payload);
                Swal.fire("Berhasil", "Data booking berhasil diperbarui", "success");
            } else {
                await api.post("/booking/admin", payload);
                Swal.fire("Berhasil", "Booking berhasil ditambahkan", "success");
            }

            resetForm();
            await loadAllData();
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal menyimpan data booking",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (item, statusBaru) => {
        if (item.status === statusBaru) return;

        const result = await Swal.fire({
            title: "Ubah Status Booking?",
            text: `Ubah status booking ${item.kode_booking} menjadi "${statusBaru}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#564B5E",
            cancelButtonColor: "#937D7A",
            confirmButtonText: "Ya, Ubah",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        try {
            await api.put(`/booking/status/${item.id}`, { status: statusBaru });
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === item.id ? { ...b, status: statusBaru } : b
                )
            );
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Status booking berhasil diperbarui.",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Gagal mengubah status",
                "error"
            );
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Booking Servis?",
            text: `Booking ${item.kode_booking} atas nama ${item.nama} akan dihapus permanen.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#937D7A",
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/booking/admin/${item.id}`);
            setBookings((prev) => prev.filter((b) => b.id !== item.id));
            Swal.fire("Berhasil", "Booking berhasil dihapus", "success");
        } catch (error) {
            Swal.fire(
                "Gagal",
                error.response?.data?.message || "Booking gagal dihapus",
                "error"
            );
        }
    };

    const kendaraanPelanggan = kendaraan.filter(
        (k) => String(k.user_id) === String(form.user_id)
    );

    const estimasiTotalForm = layanan
        .filter((l) => form.layanan_ids.includes(l.id))
        .reduce((sum, l) => sum + Number(l.harga || 0), 0);

    const filteredBookings = bookings.filter((item) => {
        const keyword = search.toLowerCase();
        const cocokSearch =
            item.kode_booking?.toLowerCase().includes(keyword) ||
            item.nama?.toLowerCase().includes(keyword) ||
            item.merk?.toLowerCase().includes(keyword) ||
            item.tipe?.toLowerCase().includes(keyword) ||
            item.plat_nomor?.toLowerCase().includes(keyword) ||
            item.nama_layanan?.toLowerCase().includes(keyword);

        const cocokStatus =
            filterStatus === "Semua" || item.status === filterStatus;

        const stBayar = String(item.status_pembayaran || "belum_bayar").toLowerCase();
        const cocokBayar =
            filterBayar === "Semua" ||
            (filterBayar === "Lunas" && stBayar === "lunas") ||
            (filterBayar === "Belum Lunas" && stBayar !== "lunas");

        const cocokTanggal =
            !filterTanggal || item.tanggal_booking === filterTanggal;

        return cocokSearch && cocokStatus && cocokBayar && cocokTanggal;
    });

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#C6B2AE]/70 rounded-2xl px-5 py-4 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#564B5E] text-[#FADBB2] flex items-center justify-center shadow-xs shrink-0">
                        <FaWrench className="text-sm" />
                    </div>
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#564B5E]">
                            MobiCare
                        </span>
                        <p className="text-xs text-[#937D7A] font-medium">
                            {filteredBookings.length} dari {bookings.length} data booking
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 bg-[#564B5E] hover:bg-[#937D7A] text-[#FADBB2] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer self-start sm:self-auto"
                >
                    <FaPlus className="text-xs" /> Tambah Booking
                </button>
            </div>

            {/* Filter and Table Card */}
            <div className="bg-white border border-[#C6B2AE]/70 rounded-2xl p-5 sm:p-6 shadow-xs">
                {/* Search & Filter Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 mb-5">
                    <div className="relative w-full lg:w-72">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#937D7A] text-xs" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode, plat, nama..."
                            className="w-full pl-9 pr-4 py-2 bg-[#C6B2AE]/15 border border-[#C6B2AE] rounded-xl text-xs sm:text-sm text-[#564B5E] placeholder:text-[#937D7A]/70 outline-none transition-all focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                        {/* Payment Filter */}
                        <select
                            value={filterBayar}
                            onChange={(e) => setFilterBayar(e.target.value)}
                            aria-label="Filter status pembayaran"
                            className="px-3.5 py-2 bg-[#C6B2AE]/15 border border-[#C6B2AE] rounded-xl text-xs sm:text-sm font-medium text-[#564B5E] outline-none transition-all focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10 cursor-pointer"
                        >
                            <option value="Semua">Semua Pembayaran</option>
                            <option value="Lunas">Lunas</option>
                            <option value="Belum Lunas">Berhasil • Belum Lunas</option>
                        </select>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                aria-label="Filter status booking"
                                className="appearance-none pl-3.5 pr-8 py-2 bg-[#C6B2AE]/15 border border-[#C6B2AE] rounded-xl text-xs sm:text-sm font-medium text-[#564B5E] outline-none transition-all focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10 cursor-pointer"
                            >
                                <option value="Semua">Semua Status</option>
                                <option value="Menunggu">Menunggu</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                            <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#937D7A] text-[10px] pointer-events-none" />
                        </div>

                        {/* Date Filter */}
                        <input
                            type="date"
                            value={filterTanggal}
                            onChange={(e) => setFilterTanggal(e.target.value)}
                            className="px-3.5 py-2 bg-[#C6B2AE]/15 border border-[#C6B2AE] rounded-xl text-xs sm:text-sm font-medium text-[#564B5E] outline-none transition-all focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                        />

                        {(search || filterStatus !== "Semua" || filterBayar !== "Semua" || filterTanggal) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setFilterStatus("Semua");
                                    setFilterBayar("Semua");
                                    setFilterTanggal("");
                                }}
                                className="px-3.5 py-2 rounded-xl border border-[#C6B2AE] bg-[#FADBB2]/60 text-xs font-semibold text-[#564B5E] hover:bg-[#FADBB2] transition cursor-pointer"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-[#C6B2AE]/70">
                    <table className="w-full min-w-[1120px] text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="bg-[#C6B2AE]/25 text-[#564B5E] uppercase tracking-wider text-[11px] font-bold border-b border-[#C6B2AE]/70">
                                <th className="px-4 py-3.5">Kode Booking</th>
                                <th className="px-4 py-3.5">Pelanggan</th>
                                <th className="px-4 py-3.5">Kendaraan</th>
                                <th className="px-4 py-3.5">Jadwal Servis</th>
                                <th className="px-4 py-3.5">Layanan</th>
                                <th className="px-4 py-3.5">Total Biaya</th>
                                <th className="px-4 py-3.5">Pembayaran</th>
                                <th className="px-4 py-3.5">Status Pengerjaan</th>
                                <th className="px-4 py-3.5 text-center w-36">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#C6B2AE]/35 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-12 text-[#937D7A]">
                                        <div className="w-6 h-6 border-2 border-[#564B5E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Memuat data booking...
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-12 text-[#937D7A]">
                                        <FaClipboardList className="mx-auto mb-2 text-2xl text-[#C6B2AE]" />
                                        {bookings.length === 0
                                            ? "Belum ada riwayat booking."
                                            : "Data booking tidak ditemukan."}
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((item) => {
                                    const style = getStatusStyle(item.status);
                                    const payInfo = getPaymentInfo(item);

                                    return (
                                        <tr key={item.id} className="hover:bg-[#FADBB2]/20 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="font-mono font-bold text-[#564B5E] bg-[#C6B2AE]/25 px-2.5 py-1 rounded-md border border-[#C6B2AE]">
                                                    {item.kode_booking}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-[#564B5E] text-[#FADBB2] flex items-center justify-center text-xs shrink-0 font-bold">
                                                        {item.nama?.charAt(0).toUpperCase() || <FaUser className="text-[10px]" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#564B5E]">
                                                            {item.nama}
                                                        </p>
                                                        <p className="text-[11px] text-[#937D7A]">
                                                            {item.no_hp}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <p className="font-semibold text-[#564B5E] flex items-center gap-1.5">
                                                    <FaCar className="text-[#937D7A] text-xs" />
                                                    <span>{item.merk} {item.tipe}</span>
                                                </p>
                                                <span className="inline-block mt-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-[#564B5E] text-[#FADBB2] rounded tracking-wider">
                                                    {item.plat_nomor}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <p className="font-medium text-[#564B5E] flex items-center gap-1.5">
                                                    <FaCalendarAlt className="text-[#937D7A] text-[11px]" />
                                                    {item.tanggal_booking}
                                                </p>
                                                <p className="text-[11px] text-[#937D7A] flex items-center gap-1.5 mt-0.5">
                                                    <FaClock className="text-[#C6B2AE] text-[10px]" />
                                                    {item.jam_booking?.slice(0, 5)} WIB
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 text-[#564B5E]/80 max-w-xs">
                                                <span className="line-clamp-2 text-xs leading-relaxed" title={item.nama_layanan}>
                                                    {item.nama_layanan || "-"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 font-extrabold text-[#564B5E] whitespace-nowrap">
                                                {formatRupiah(item.total_harga)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${payInfo.badgeClass}`}
                                                    >
                                                        {payInfo.isLunas ? (
                                                            <FaCheckCircle className="text-[10px]" />
                                                        ) : (
                                                            <FaMoneyBillWave className="text-[10px]" />
                                                        )}
                                                        {payInfo.label}
                                                    </span>

                                                    {payInfo.subLabel && (
                                                        <span className="text-[10px] text-[#937D7A]">
                                                            {payInfo.subLabel}
                                                        </span>
                                                    )}

                                                    {!payInfo.isLunas && payInfo.canConfirm && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleKonfirmasiLunas(item)}
                                                            className="mt-0.5 text-[11px] font-bold text-[#564B5E] hover:text-[#937D7A] underline cursor-pointer"
                                                        >
                                                            Konfirmasi Lunas
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(item, e.target.value)
                                                        }
                                                        aria-label={`Ubah status booking ${item.kode_booking}`}
                                                        className={`inline-flex items-center pl-6 pr-6 py-1 rounded-full border text-xs font-semibold outline-none cursor-pointer transition-colors shadow-2xs ${style.badge}`}
                                                    >
                                                        <option value="Menunggu">Menunggu</option>
                                                        <option value="Diproses">Diproses</option>
                                                        <option value="Selesai">Selesai</option>
                                                    </select>
                                                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${style.dot} pointer-events-none`} />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-1.5">
                                                    <button
                                                        onClick={() => handleViewDetail(item)}
                                                        className="p-2 rounded-lg text-[#564B5E] hover:bg-[#C6B2AE]/30 transition cursor-pointer"
                                                        title="Lihat Struk / Nota"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 rounded-lg text-[#937D7A] hover:bg-[#FADBB2]/60 transition cursor-pointer"
                                                        title="Edit Booking"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="p-2 rounded-lg text-[#564B5E] hover:bg-[#937D7A]/20 transition cursor-pointer"
                                                        title="Hapus Booking"
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

            {/* MODAL FORM CREATE / EDIT BOOKING */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-[#564B5E]/55 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C6B2AE]">
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#C6B2AE]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#C6B2AE]/25 border border-[#C6B2AE] text-[#564B5E] flex items-center justify-center">
                                    <FaClipboardList />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#564B5E]">
                                        {editId ? "Edit Booking Servis" : "Tambah Booking Servis Baru"}
                                    </h2>
                                    <p className="text-xs text-[#937D7A]">
                                        Pilih pelanggan, kendaraan, dan paket servis
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Pelanggan
                                    </label>
                                    <select
                                        required
                                        value={form.user_id}
                                        onChange={(e) => handlePelangganChange(e.target.value)}
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    >
                                        <option value="">Pilih pelanggan</option>
                                        {pelanggan.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nama} ({p.no_hp})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Kendaraan Pelanggan
                                    </label>
                                    <select
                                        required
                                        disabled={!form.user_id}
                                        value={form.kendaraan_id}
                                        onChange={(e) =>
                                            setForm({ ...form, kendaraan_id: e.target.value })
                                        }
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10 disabled:bg-[#C6B2AE]/25 disabled:text-[#937D7A]/60"
                                    >
                                        <option value="">
                                            {!form.user_id
                                                ? "Pilih pelanggan terlebih dahulu"
                                                : kendaraanPelanggan.length === 0
                                                ? "Pelanggan belum punya kendaraan"
                                                : "Pilih kendaraan"}
                                        </option>
                                        {kendaraanPelanggan.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.merk} {k.tipe} - {k.plat_nomor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Tanggal Booking
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        value={form.tanggal_booking}
                                        onChange={(e) =>
                                            setForm({ ...form, tanggal_booking: e.target.value })
                                        }
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Jam Kedatangan
                                    </label>
                                    <input
                                        required
                                        type="time"
                                        value={form.jam_booking}
                                        onChange={(e) =>
                                            setForm({ ...form, jam_booking: e.target.value })
                                        }
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                        Status Pengerjaan
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm({ ...form, status: e.target.value })
                                        }
                                        className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
                                    >
                                        <option value="Menunggu">Menunggu</option>
                                        <option value="Diproses">Diproses</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                </div>
                            </div>

                            {/* Service checklist */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider">
                                        Pilih Paket Layanan (Bisa lebih dari 1)
                                    </label>
                                    <span className="text-xs font-extrabold text-[#564B5E] bg-[#FADBB2] px-2.5 py-0.5 rounded-md border border-[#C6B2AE]">
                                        Estimasi Total: {formatRupiah(estimasiTotalForm)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto border border-[#C6B2AE] rounded-2xl p-3 bg-[#C6B2AE]/15">
                                    {layanan.length === 0 ? (
                                        <p className="text-xs text-[#937D7A] col-span-2 text-center py-4">
                                            Belum ada layanan tersedia.
                                        </p>
                                    ) : (
                                        layanan.map((item) => {
                                            const checked = form.layanan_ids.includes(item.id);
                                            return (
                                                <label
                                                    key={item.id}
                                                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                                                        checked
                                                            ? "bg-[#FADBB2]/55 border-[#564B5E] shadow-2xs"
                                                            : "bg-white border-[#C6B2AE]/80 hover:border-[#937D7A]"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleLayanan(item.id)}
                                                        className="mt-0.5 accent-[#564B5E] rounded"
                                                    />
                                                    <div className="text-xs min-w-0">
                                                        <p className="font-bold text-[#564B5E] truncate">
                                                            {item.nama_layanan}
                                                        </p>
                                                        <p className="text-[#937D7A] font-semibold mt-0.5">
                                                            {formatRupiah(item.harga)}
                                                            {item.estimasi && (
                                                                <span className="text-[#937D7A]/70 font-normal">
                                                                    {" "}• {item.estimasi}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                                    Keluhan atau Catatan Pelanggan (Opsional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={form.keluhan}
                                    onChange={(e) =>
                                        setForm({ ...form, keluhan: e.target.value })
                                    }
                                    placeholder="Contoh: Rem depan bunyi berdecit, tarikan bawah brebet..."
                                    className="w-full border border-[#C6B2AE] bg-[#C6B2AE]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#564B5E] outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10"
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
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-[#564B5E] hover:bg-[#937D7A] disabled:opacity-50 text-[#FADBB2] text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
                                >
                                    {saving ? "Menyimpan..." : "Simpan Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETAIL / NOTA STRUK BUKTI BOOKING */}
            {detailModal && (
                <div className="fixed inset-0 z-50 bg-[#564B5E]/55 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C6B2AE]">
                        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-[#C6B2AE]/50">
                            <span className="text-xs font-semibold text-[#937D7A] uppercase tracking-wider">
                                Pratinjau Nota Servis • MobiCare
                            </span>
                            <button
                                onClick={() => setDetailModal(null)}
                                className="p-2 text-[#937D7A] hover:text-[#564B5E] rounded-lg transition cursor-pointer"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div id="struk-cetak" className="space-y-5 text-[#564B5E]">
                            <div className="border-b-2 border-dashed border-[#C6B2AE] pb-5 text-center">
                                <div className="inline-flex items-center gap-2.5 mb-1">
                                    <div className="w-8 h-8 rounded-lg bg-[#564B5E] text-[#FADBB2] flex items-center justify-center text-sm font-bold">
                                        <FaWrench />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight text-[#564B5E]">
                                        MOBICARE
                                    </h3>
                                </div>
                                <p className="text-xs text-[#937D7A]">
                                    Jl. Pekapuran No. 45, Curug, Cimanggis, Kota Depok
                                </p>
                                <p className="text-xs text-[#937D7A]">
                                    WhatsApp: 0812-3456-7890 • Telp: (021) 874-2980
                                </p>
                            </div>

                            <div className="flex items-center justify-between bg-[#FADBB2]/45 p-4 rounded-xl border border-[#C6B2AE]">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#937D7A]">
                                        No. Booking / Nota
                                    </p>
                                    <p className="text-base font-extrabold text-[#564B5E] font-mono">
                                        {detailModal.kode_booking}
                                    </p>
                                </div>

                                <div className="text-right space-y-1">
                                    <div>
                                        <span
                                            className={`inline-block px-3 py-0.5 rounded-full border text-xs font-bold ${getStatusStyle(
                                                detailModal.status
                                            ).badge}`}
                                        >
                                            {detailModal.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                                                getPaymentInfo(detailModal).badgeClass
                                            }`}
                                        >
                                            {getPaymentInfo(detailModal).label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1.5 p-3 rounded-xl bg-[#C6B2AE]/15 border border-[#C6B2AE]/70">
                                    <p className="font-bold text-[#937D7A] uppercase tracking-wider text-[10px]">
                                        Informasi Pelanggan
                                    </p>
                                    <p className="font-bold text-[#564B5E] text-sm">
                                        {detailModal.nama}
                                    </p>
                                    <p className="text-[#564B5E]/80">
                                        {detailModal.no_hp}
                                    </p>
                                    {detailModal.email && (
                                        <p className="text-[#937D7A] text-[11px] truncate">
                                            {detailModal.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5 p-3 rounded-xl bg-[#C6B2AE]/15 border border-[#C6B2AE]/70">
                                    <p className="font-bold text-[#937D7A] uppercase tracking-wider text-[10px]">
                                        Informasi Kendaraan
                                    </p>
                                    <p className="font-bold text-[#564B5E] text-sm">
                                        {detailModal.merk} {detailModal.tipe}
                                    </p>
                                    <span className="inline-block font-mono font-bold text-xs px-2 py-0.5 bg-[#564B5E] text-[#FADBB2] rounded">
                                        {detailModal.plat_nomor}
                                    </span>
                                    <p className="text-[#937D7A] text-[11px]">
                                        Tahun: {detailModal.tahun} {detailModal.warna ? `• ${detailModal.warna}` : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs p-3 rounded-xl bg-[#C6B2AE]/20 border border-[#C6B2AE] flex items-center justify-between">
                                <span className="text-[#564B5E]/85 font-medium flex items-center gap-1.5">
                                    <FaCalendarAlt className="text-[#937D7A]" />
                                    Jadwal Kedatangan Servis:
                                </span>
                                <span className="font-bold text-[#564B5E]">
                                    {detailModal.tanggal_booking} • {detailModal.jam_booking?.slice(0, 5)} WIB
                                </span>
                            </div>

                            <div>
                                <p className="text-[11px] font-bold text-[#937D7A] uppercase tracking-wider mb-2">
                                    Rincian Paket Layanan
                                </p>
                                <div className="divide-y divide-[#C6B2AE]/60 border border-[#C6B2AE] rounded-xl overflow-hidden">
                                    <div className="flex justify-between px-4 py-2 bg-[#C6B2AE]/25 text-[11px] font-bold text-[#564B5E] uppercase">
                                        <span>Item Layanan</span>
                                        <span>Tarif</span>
                                    </div>
                                    {detailModal.layanan?.map((l) => (
                                        <div
                                            key={l.id}
                                            className="flex items-center justify-between px-4 py-2.5 text-xs bg-white"
                                        >
                                            <div>
                                                <p className="font-semibold text-[#564B5E]">
                                                    {l.nama_layanan}
                                                </p>
                                                {l.estimasi && (
                                                    <p className="text-[11px] text-[#937D7A]">
                                                        Durasi: {l.estimasi}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="font-bold text-[#564B5E]">
                                                {formatRupiah(l.harga)}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between px-4 py-3 bg-[#FADBB2]/65 text-sm font-extrabold text-[#564B5E]">
                                        <span>TOTAL BIAYA ESTIMASI</span>
                                        <span className="text-[#564B5E] text-base">
                                            {formatRupiah(detailModal.total_harga)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {detailModal.keluhan && (
                                <div className="text-xs p-3 rounded-xl bg-[#C6B2AE]/15 border border-[#C6B2AE]">
                                    <p className="font-bold text-[#937D7A] uppercase tracking-wider text-[10px] mb-1">
                                        Keluhan / Permintaan Khusus Pelanggan
                                    </p>
                                    <p className="text-[#564B5E]/85 italic">
                                        &ldquo;{detailModal.keluhan}&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="no-print flex flex-wrap justify-end gap-3 pt-5 mt-5 border-t border-[#C6B2AE]/50">
                            {getPaymentInfo(detailModal).canConfirm && !getPaymentInfo(detailModal).isLunas && (
                                <button
                                    type="button"
                                    onClick={() => handleKonfirmasiLunas(detailModal)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#564B5E] hover:bg-[#937D7A] text-[#FADBB2] text-xs sm:text-sm font-semibold transition cursor-pointer"
                                >
                                    <FaCheckCircle className="text-xs" /> Konfirmasi Lunas
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#937D7A] hover:bg-[#564B5E] text-[#FADBB2] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
                            >
                                <FaPrint className="text-xs" /> Cetak Nota / Struk
                            </button>
                            <button
                                type="button"
                                onClick={() => setDetailModal(null)}
                                className="px-4 py-2.5 rounded-xl border border-[#C6B2AE] text-[#564B5E] hover:bg-[#C6B2AE]/20 text-xs sm:text-sm font-semibold transition cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}