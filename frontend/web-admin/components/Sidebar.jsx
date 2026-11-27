// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import Swal from "sweetalert2";
// import {
//     FaTachometerAlt,
//     FaTools,
//     FaCar,
//     FaClipboardList,
//     FaSignOutAlt,
//     FaUsers,
//     FaWrench,
//     FaTimes,
//     FaCircle,
// } from "react-icons/fa";

// const menuItems = [
//     { href: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
//     { href: "/booking", label: "Booking Servis", icon: FaClipboardList },
//     { href: "/layanan", label: "Layanan Bengkel", icon: FaTools },
//     { href: "/kendaraan", label: "Kendaraan", icon: FaCar },
//     { href: "/pelanggan", label: "Pelanggan", icon: FaUsers },
// ];

// export default function Sidebar({ isOpen = false, onClose }) {
//     const pathname = usePathname();
//     const router = useRouter();

//     const handleLogout = async () => {
//         const result = await Swal.fire({
//             title: "Konfirmasi Logout",
//             text: "Apakah Anda yakin ingin keluar dari panel admin?",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#ef4444",
//             cancelButtonColor: "#64748b",
//             confirmButtonText: "Ya, Keluar",
//             cancelButtonText: "Batal",
//         });

//         if (!result.isConfirmed) return;

//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         await Swal.fire({
//             icon: "success",
//             title: "Berhasil Logout",
//             timer: 1000,
//             showConfirmButton: false,
//         });

//         router.replace("/login");
//     };

//     return (
//         <>
//             {isOpen && (
//                 <div
//                     onClick={onClose}
//                     className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
//                 />
//             )}

//             <aside
//                 className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-68 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-5 flex flex-col justify-between border-r border-slate-800/60 shadow-2xl lg:shadow-none transition-transform duration-200 ease-in-out ${
//                     isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//                 }`}
//             >
//                 <div>
//                     {/* Header Brand */}
//                     <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
//                         <div className="flex items-center gap-3.5">
//                             <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/10">
//                                 <FaWrench className="text-xl text-white transform -rotate-12" />
//                             </div>
//                             <div>
//                                 <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
//                                     AutoServis
//                                     <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
//                                         PRO
//                                     </span>
//                                 </h1>
//                                 <p className="text-xs text-slate-400 font-medium">
//                                     Admin Bengkel
//                                 </p>
//                             </div>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition"
//                             aria-label="Tutup menu"
//                         >
//                             <FaTimes className="text-base" />
//                         </button>
//                     </div>

//                     {/* Navigation */}
//                     <div className="mb-3 px-2">
//                         <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
//                             Menu Utama
//                         </p>
//                     </div>

//                     <nav className="space-y-1.5">
//                         {menuItems.map((item) => {
//                             const Icon = item.icon;
//                             const isActive =
//                                 pathname === item.href ||
//                                 pathname?.startsWith(`${item.href}/`);

//                             return (
//                                 <Link
//                                     key={item.href}
//                                     href={item.href}
//                                     onClick={onClose}
//                                     className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
//                                         isActive
//                                             ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-semibold"
//                                             : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
//                                     }`}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <Icon className={`text-base transition-colors ${
//                                             isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
//                                         }`} />
//                                         <span>{item.label}</span>
//                                     </div>

//                                     {isActive && (
//                                         <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
//                                     )}
//                                 </Link>
//                             );
//                         })}
//                     </nav>
//                 </div>

//                 {/* Footer Section */}
//                 <div className="space-y-3 pt-4 border-t border-slate-800/80">
//                     {/* Status Pill */}
//                     <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60">
//                         <div className="flex items-center gap-2">
//                             <span className="relative flex h-2 w-2">
//                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                             </span>
//                             <span className="text-xs text-slate-300 font-medium">
//                                 Sistem Online
//                             </span>
//                         </div>
//                         <span className="text-[10px] text-slate-400 font-mono">
//                             v1.0
//                         </span>
//                     </div>

//                     {/* Logout Button */}
//                     <button
//                         type="button"
//                         onClick={handleLogout}
//                         className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-transparent w-full transition-all duration-150 cursor-pointer shadow-xs"
//                     >
//                         <FaSignOutAlt className="text-sm" />
//                         <span>Logout</span>
//                     </button>
//                 </div>
//             </aside>
//         </>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
    FaTachometerAlt,
    FaTools,
    FaCar,
    FaClipboardList,
    FaSignOutAlt,
    FaUsers,
    FaWrench,
    FaTimes,
} from "react-icons/fa";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { href: "/booking", label: "Booking Servis", icon: FaClipboardList },
    { href: "/layanan", label: "Layanan Bengkel", icon: FaTools },
    { href: "/kendaraan", label: "Kendaraan", icon: FaCar },
    { href: "/pelanggan", label: "Pelanggan", icon: FaUsers },
];

export default function Sidebar({ isOpen = false, onClose }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Konfirmasi Logout",
            text: "Apakah Anda yakin ingin keluar dari panel admin?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#564B5E",
            cancelButtonColor: "#937D7A",
            confirmButtonText: "Ya, Keluar",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        await Swal.fire({
            icon: "success",
            title: "Berhasil Logout",
            timer: 1000,
            showConfirmButton: false,
        });

        router.replace("/login");
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-[#564B5E]/55 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-68 h-screen bg-gradient-to-b from-[#564B5E] via-[#564B5E] to-[#937D7A] text-white p-5 flex flex-col justify-between border-r border-[#C6B2AE]/35 shadow-2xl lg:shadow-none transition-transform duration-200 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div>
                    {/* Header Brand */}
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#C6B2AE]/30">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-[#FADBB2] text-[#564B5E] flex items-center justify-center shadow-md ring-1 ring-white/15">
                                <FaWrench className="text-xl transform -rotate-12" />
                            </div>
                            <div>
                                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                                    MobiCare
                                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FADBB2]/20 text-[#FADBB2] border border-[#FADBB2]/35">
                                        ADMIN
                                    </span>
                                </h1>
                              
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="lg:hidden text-[#C6B2AE] hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            aria-label="Tutup menu"
                        >
                            <FaTimes className="text-base" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="mb-3 px-2">
                        <p className="text-[11px] font-semibold tracking-wider text-[#C6B2AE] uppercase">
                            Menu Utama
                        </p>
                    </div>

                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                pathname === item.href ||
                                pathname?.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? "bg-[#FADBB2] text-[#564B5E] shadow-md font-bold"
                                            : "text-[#FADBB2]/85 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`text-base transition-colors ${
                                                isActive
                                                    ? "text-[#564B5E]"
                                                    : "text-[#C6B2AE] group-hover:text-[#FADBB2]"
                                            }`}
                                        />
                                        <span>{item.label}</span>
                                    </div>

                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#564B5E]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Section */}
                <div className="space-y-3 pt-4 border-t border-[#C6B2AE]/30">
                    {/* Status Pill */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 border border-[#C6B2AE]/30">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FADBB2] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FADBB2]"></span>
                            </span>
                            <span className="text-xs text-[#FADBB2] font-medium">
                                Sistem Online
                            </span>
                        </div>
                        
                    </div>

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#FADBB2] hover:text-white bg-[#564B5E]/65 hover:bg-[#564B5E] border border-[#C6B2AE]/35 w-full transition-all duration-150 cursor-pointer shadow-xs"
                    >
                        <FaSignOutAlt className="text-sm" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}