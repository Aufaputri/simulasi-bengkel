"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
    FaPlus,
    FaSearch,
    FaCar,
    FaEdit,
    FaTrash,
    FaUser,
    FaTimes,
    FaCalendarAlt,
    FaPalette,
} from "react-icons/fa";

export default function KendaraanPage() {
    const [kendaraan, setKendaraan] = useState([]);
    const [pelanggan, setPelanggan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        user_id: "",
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
            confirmButtonColor: "#ef4444",
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

    const filteredKendaraan = kendaraan.filter((item) => {
        const keyword = search.toLowerCase();
        return (
            item.nama_pelanggan?.toLowerCase().includes(keyword) ||
            item.merk?.toLowerCase().includes(keyword) ||
            item.tipe?.toLowerCase().includes(keyword) ||
            item.plat_nomor?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                        Manajemen Kendaraan
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Kelola data armada sepeda motor dan mobil milik pelanggan bengkel.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer self-start sm:self-auto"
                >
                    <FaPlus className="text-xs" /> Tambah Kendaraan
                </button>
            </div>

            {/* Content Table Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                {/* Search & Counter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                            Daftar Kendaraan Terdaftar
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Menampilkan {filteredKendaraan.length} dari {kendaraan.length} unit kendaraan
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kendaraan, plat, atau pemilik..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                    <table className="w-full min-w-[850px] text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80">
                                <th className="px-4 py-3.5 text-center w-12">No</th>
                                <th className="px-4 py-3.5">Pemilik Kendaraan</th>
                                <th className="px-4 py-3.5">Merek & Tipe</th>
                                <th className="px-4 py-3.5">Nomor Polisi (Plat)</th>
                                <th className="px-4 py-3.5">Tahun</th>
                                <th className="px-4 py-3.5">Warna</th>
                                <th className="px-4 py-3.5 text-center w-28">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-slate-400">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Memuat data kendaraan...
                                    </td>
                                </tr>
                            ) : filteredKendaraan.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-slate-400">
                                        <FaCar className="mx-auto mb-2 text-2xl text-slate-300" />
                                        {kendaraan.length === 0
                                            ? "Belum ada kendaraan yang ditambahkan."
                                            : "Data kendaraan tidak ditemukan."}
                                    </td>
                                </tr>
                            ) : (
                                filteredKendaraan.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-4 text-center font-medium text-slate-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                                                    {item.nama_pelanggan?.charAt(0).toUpperCase() || <FaUser className="text-[10px]" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">
                                                        {item.nama_pelanggan}
                                                    </p>
                                                    {item.no_hp && (
                                                        <p className="text-[11px] text-slate-400">
                                                            {item.no_hp}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 font-semibold text-slate-800">
                                                <FaCar className="text-slate-400 text-xs shrink-0" />
                                                <span>{item.merk} {item.tipe}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="inline-block font-mono font-bold text-xs px-2.5 py-1 bg-slate-900 text-white rounded-md tracking-wider shadow-2xs border border-slate-700">
                                                {item.plat_nomor}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium">
                                                <FaCalendarAlt className="text-slate-400 text-[10px]" />
                                                {item.tahun}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                                            {item.warna ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                                    <FaPalette className="text-slate-400 text-[10px]" />
                                                    {item.warna}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-1.5">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                                                    title="Edit Kendaraan"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                                    title="Hapus Kendaraan"
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
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FaCar />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editId ? "Edit Kendaraan" : "Tambah Kendaraan Pelanggan"}
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Lengkapi data spesifikasi kendaraan
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
                                    Pemilik Kendaraan (Pelanggan)
                                </label>
                                <select
                                    required
                                    value={form.user_id}
                                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="">Pilih pelanggan pemilik</option>
                                    {pelanggan.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama} ({item.no_hp})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Merek Kendaraan
                                    </label>
                                    <input
                                        required
                                        value={form.merk}
                                        onChange={(e) => setForm({ ...form, merk: e.target.value })}
                                        placeholder="Contoh: Honda / Toyota"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Tipe / Model
                                    </label>
                                    <input
                                        required
                                        value={form.tipe}
                                        onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                                        placeholder="Contoh: Vario 160 / Avanza"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nomor Polisi (Plat)
                                    </label>
                                    <input
                                        required
                                        value={form.plat_nomor}
                                        onChange={(e) => setForm({ ...form, plat_nomor: e.target.value })}
                                        placeholder="B 1234 XYZ"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold uppercase outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Warna Kendaraan (Opsional)
                                </label>
                                <input
                                    value={form.warna}
                                    onChange={(e) => setForm({ ...form, warna: e.target.value })}
                                    placeholder="Contoh: Hitam Glossy / Merah Doff"
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
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition cursor-pointer"
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
