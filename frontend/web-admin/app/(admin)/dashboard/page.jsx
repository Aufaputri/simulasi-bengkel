"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import api from "@/services/api";

const emptySubscribe = () => () => {};

import {
  FaUsers,
  FaClipboardList,
  FaTools,
  FaClock,
  FaCog,
  FaCheckCircle,
  FaCalendarAlt,
  FaCar,
  FaMoneyBillWave,
  FaArrowRight,
  FaPlus,
  FaShieldAlt,
} from "react-icons/fa";

import StatCard from "@/components/StatCard";
import BookingTable from "@/components/BookingTable";
import Loading from "@/components/Loading";

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(angka || 0));

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    total_user: 0,
    total_kendaraan: 0,
    total_booking: 0,
    total_layanan: 0,
    menunggu: 0,
    diproses: 0,
    selesai: 0,
    total_pendapatan: 0,
  });

  const [loading, setLoading] = useState(true);
  const savedUser = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem("user"),
    () => null
  );

  let admin = null;
  if (savedUser) {
    try {
      admin = JSON.parse(savedUser);
    } catch {
      admin = null;
    }
  }

  const getDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api
      .get("/dashboard")
      .then((response) => {
        if (active) setDashboard(response.data.data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data dashboard:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  const todayLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const stats = [
    {
      title: "Total Pelanggan",
      value: dashboard.total_user,
      icon: <FaUsers />,
      color: "bg-blue-600",
      description: "Pelanggan terdaftar",
    },
    {
      title: "Total Kendaraan",
      value: dashboard.total_kendaraan,
      icon: <FaCar />,
      color: "bg-indigo-600",
      description: "Kendaraan pelanggan",
    },
    {
      title: "Total Layanan",
      value: dashboard.total_layanan,
      icon: <FaTools />,
      color: "bg-cyan-600",
      description: "Layanan aktif",
    },
    {
      title: "Total Booking",
      value: dashboard.total_booking,
      icon: <FaClipboardList />,
      color: "bg-violet-600",
      description: "Seluruh booking",
    },
    {
      title: "Menunggu",
      value: dashboard.menunggu,
      icon: <FaClock />,
      color: "bg-amber-500",
      description: "Menunggu konfirmasi",
    },
    {
      title: "Diproses",
      value: dashboard.diproses,
      icon: <FaCog />,
      color: "bg-blue-500",
      description: "Sedang dikerjakan",
    },
    {
      title: "Selesai",
      value: dashboard.selesai,
      icon: <FaCheckCircle />,
      color: "bg-emerald-600",
      description: "Servis telah selesai",
    },
    {
      title: "Pendapatan Selesai",
      value: formatRupiah(dashboard.total_pendapatan),
      icon: <FaMoneyBillWave />,
      color: "bg-teal-600",
      description: "Total servis lunas",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
              Panel Administrator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Dashboard Utama
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selamat datang kembali,{" "}
            <span className="font-semibold text-slate-800">
              {admin?.nama || "Admin"}
            </span>
            . Berikut rangkuman performa bengkel hari ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-2xs self-start sm:self-auto">
          <FaCalendarAlt className="text-blue-600 text-sm" />
          <span className="text-xs sm:text-sm text-slate-700 font-semibold">
            {todayLabel}
          </span>
        </div>
      </div>

      {/* WELCOME BANNER WITH QUICK SHORTCUTS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 border border-slate-800/80">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-blue-200 font-medium mb-4">
            <FaShieldAlt className="text-blue-400" />
            Sistem Manajemen Booking Bengkel
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Pantau Seluruh Aktivitas Servis Secara Real-Time
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-xl">
            Kelola antrean servis pelanggan, atur tarif layanan, cek riwayat pengerjaan,
            dan cetak nota booking dengan mudah melalui satu panel terpadu.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-2">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all duration-150"
            >
              <FaPlus className="text-xs" /> Booking Baru
            </Link>
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/10 transition-all duration-150"
            >
              <FaTools className="text-xs text-blue-300" /> Kelola Layanan
            </Link>
          </div>
        </div>

        <FaTools className="hidden md:block absolute right-6 bottom-[-20px] text-white/5 text-[180px] rotate-12 pointer-events-none" />
      </div>

      {/* METRIC STATS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              Statistik Bengkel
            </h2>
            <p className="text-xs text-slate-500">
              Ringkasan data pelanggan, operasional kendaraan, dan status servis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* RECENT BOOKING TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Aktivitas Booking Terkini
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar servis terbaru dari pelanggan yang memerlukan perhatian
            </p>
          </div>

          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3.5 py-2 rounded-xl transition"
          >
            Buka Halaman Booking <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <BookingTable onStatusUpdated={getDashboard} />
      </div>

    </div>
  );
}
