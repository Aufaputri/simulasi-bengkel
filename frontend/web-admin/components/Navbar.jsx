"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { FaUser, FaShieldAlt, FaTools, FaBars, FaChevronRight } from "react-icons/fa";

const emptySubscribe = () => () => {};

const pageTitles = {
    "/dashboard": { breadcrumb: "Dashboard", title: "Ringkasan Operasional" },
    "/booking": { breadcrumb: "Booking Servis", title: "Manajemen Booking Servis" },
    "/layanan": { breadcrumb: "Layanan Bengkel", title: "Katalog & Tarif Layanan" },
    "/kendaraan": { breadcrumb: "Data Kendaraan", title: "Kendaraan Pelanggan" },
    "/pelanggan": { breadcrumb: "Data Pelanggan", title: "Manajemen Pelanggan" },
};

export default function Navbar({ onMenuClick }) {
    const pathname = usePathname();
    const savedUser = useSyncExternalStore(
        emptySubscribe,
        () => localStorage.getItem("user"),
        () => null
    );

    let user = null;
    if (savedUser) {
        try {
            user = JSON.parse(savedUser);
        } catch {
            user = null;
        }
    }

    const currentPage = pageTitles[pathname] || {
        breadcrumb: "Dashboard",
        title: "Dashboard Admin",
    };

    const nama = user?.nama || "Admin";
    const inisial = nama.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
            <div className="flex items-center justify-between gap-4">

                {/* Left side: Mobile Toggle & Page Info */}
                <div className="flex items-center gap-3.5">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                        aria-label="Buka menu"
                    >
                        <FaBars className="text-base" />
                    </button>

                    <div>
                        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                            <span className="flex items-center gap-1 text-slate-500 font-medium">
                                <FaTools className="text-blue-600 text-[11px]" />
                                Bengkel
                            </span>
                            <FaChevronRight className="text-[9px] text-slate-300" />
                            <span className="text-blue-600 font-semibold">
                                {currentPage.breadcrumb}
                            </span>
                        </nav>

                        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                            {currentPage.title}
                        </h1>
                    </div>
                </div>

                {/* Right side: User Profile Chip */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 pl-4 py-1 pr-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-xs">
                        <div className="text-right">
                            <p className="font-semibold text-xs text-slate-800 leading-tight">
                                {nama}
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-0.5">
                                <FaShieldAlt className="text-blue-600 text-[10px]" />
                                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                    {user?.role || "Admin"}
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                                {user ? inisial : <FaUser className="text-xs" />}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                    </div>

                    {/* Mobile avatar */}
                    <div className="sm:hidden relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user ? inisial : <FaUser className="text-xs" />}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                </div>

            </div>
        </header>
    );
}
