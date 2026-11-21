"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaCar, FaUser } from "react-icons/fa";

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(angka || 0));

export default function BookingTable({ onStatusUpdated }) {
    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");

    useEffect(() => {
        let active = true;
        api.get("/booking/admin")
            .then((response) => {
                if (active) setBooking(response.data.data || []);
            })
            .catch((error) => {
                console.error("Gagal mengambil booking:", error);
                if (active) {
                    setError(
                        error.response?.data?.message ||
                        "Gagal mengambil data booking"
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

    const getStatusStyle = (status) => {
        switch (status) {
            case "Menunggu":
                return {
                    badge: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/60",
                    dot: "bg-amber-500",
                };
            case "Diproses":
                return {
                    badge: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/60",
                    dot: "bg-blue-600 animate-pulse",
                };
            case "Selesai":
                return {
                    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/60",
                    dot: "bg-emerald-600",
                };
            default:
                return {
                    badge: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/60",
                    dot: "bg-slate-400",
                };
        }
    };

    const handleStatusChange = async (item, statusBaru) => {
        if (item.status === statusBaru) return;

        const result = await Swal.fire({
            title: "Ubah Status Booking?",
            text: `Ubah status booking ${item.kode_booking} menjadi "${statusBaru}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Ubah Status",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        try {
            await api.put(`/booking/status/${item.id}`, {
                status: statusBaru,
            });

            setBooking((prev) =>
                prev.map((bookingItem) =>
                    bookingItem.id === item.id
                        ? { ...bookingItem, status: statusBaru }
                        : bookingItem
                )
            );

            if (typeof onStatusUpdated === "function") {
                onStatusUpdated();
            }

            Swal.fire({
                icon: "success",
                title: "Status Diperbarui!",
                text: `Status booking diubah menjadi ${statusBaru}.`,
                timer: 1400,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Gagal mengubah status:", error);

            Swal.fire(
                "Gagal!",
                error.response?.data?.message ||
                "Status booking gagal diubah.",
                "error"
            );
        }
    };

    const filteredBooking = booking.filter((item) => {
        const keyword = search.toLowerCase();

        const cocokSearch =
            item.kode_booking?.toLowerCase().includes(keyword) ||
            item.nama?.toLowerCase().includes(keyword) ||
            item.merk?.toLowerCase().includes(keyword) ||
            item.tipe?.toLowerCase().includes(keyword) ||
            item.plat_nomor?.toLowerCase().includes(keyword) ||
            item.nama_layanan?.toLowerCase().includes(keyword);

        const cocokStatus =
            filterStatus === "Semua" ||
            item.status === filterStatus;

        return cocokSearch && cocokStatus;
    });

    return (
        <div className="overflow-hidden">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between pb-5">
                <div className="relative w-full sm:w-88">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                        type="text"
                        placeholder="Cari kode, pelanggan, plat, layanan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            aria-label="Filter status booking"
                            className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Menunggu">Menunggu</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                        </select>
                        <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full min-w-[850px] text-xs sm:text-sm text-left">
                    <thead>
                        <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80">
                            <th className="px-4 py-3.5">Kode Booking</th>
                            <th className="px-4 py-3.5">Pelanggan</th>
                            <th className="px-4 py-3.5">Kendaraan</th>
                            <th className="px-4 py-3.5">Jadwal Servis</th>
                            <th className="px-4 py-3.5">Layanan</th>
                            <th className="px-4 py-3.5">Total Biaya</th>
                            <th className="px-4 py-3.5">Status Pengerjaan</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-12 text-slate-400">
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    Memuat data booking...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-rose-500 font-medium">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredBooking.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-12 text-slate-400">
                                    <FaCalendarAlt className="mx-auto mb-2 text-2xl text-slate-300" />
                                    {booking.length === 0
                                        ? "Belum ada riwayat booking."
                                        : "Tidak ada booking yang cocok dengan filter."}
                                </td>
                            </tr>
                        ) : (
                            filteredBooking.map((item) => {
                                const style = getStatusStyle(item.status);
                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-4 py-3.5 font-bold text-blue-600 whitespace-nowrap">
                                            <span className="font-mono bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                                {item.kode_booking}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs shrink-0 font-bold">
                                                    {item.nama?.charAt(0).toUpperCase() || <FaUser className="text-[10px]" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">
                                                        {item.nama}
                                                    </p>
                                                    {item.no_hp && (
                                                        <p className="text-[11px] text-slate-400">
                                                            {item.no_hp}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <p className="font-medium text-slate-700 flex items-center gap-1.5">
                                                <FaCar className="text-slate-400 text-xs" />
                                                <span>{item.merk} {item.tipe}</span>
                                            </p>
                                            <span className="inline-block mt-1 font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded tracking-wider shadow-2xs">
                                                {item.plat_nomor}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <p className="font-medium text-slate-700 flex items-center gap-1.5">
                                                <FaCalendarAlt className="text-slate-400 text-[11px]" />
                                                {item.tanggal_booking}
                                            </p>
                                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                <FaClock className="text-slate-300 text-[10px]" />
                                                {item.jam_booking?.slice(0, 5)} WIB
                                            </p>
                                        </td>

                                        <td className="px-4 py-3.5 text-slate-600 max-w-xs">
                                            <span className="line-clamp-2 text-xs leading-relaxed" title={item.nama_layanan}>
                                                {item.nama_layanan || "-"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                                            {formatRupiah(item.total_harga)}
                                        </td>

                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="relative inline-block">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            item,
                                                            e.target.value
                                                        )
                                                    }
                                                    aria-label={`Ubah status ${item.kode_booking}`}
                                                    className={`inline-flex items-center pl-6 pr-6 py-1 rounded-full border text-xs font-semibold outline-none cursor-pointer transition-colors shadow-2xs ${style.badge}`}
                                                >
                                                    <option value="Menunggu">Menunggu</option>
                                                    <option value="Diproses">Diproses</option>
                                                    <option value="Selesai">Selesai</option>
                                                </select>
                                                <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${style.dot} pointer-events-none`} />
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
    );
}
