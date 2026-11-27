// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";
// import api from "@/services/api";

// import {
//   FaWrench,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaArrowRight,
//   FaShieldAlt,
//   FaCheckCircle,
// } from "react-icons/fa";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       Swal.fire({
//         icon: "warning",
//         title: "Perhatian",
//         text: "Email dan password harus diisi!",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       // Hanya admin yang boleh masuk dashboard
//       if (user.role !== "admin") {
//         Swal.fire({
//           icon: "error",
//           title: "Akses Ditolak",
//           text: "Halaman ini hanya dapat diakses oleh admin.",
//         });
//         return;
//       }

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       await Swal.fire({
//         icon: "success",
//         title: "Login Berhasil!",
//         text: "Selamat datang di panel admin bengkel.",
//         timer: 1400,
//         showConfirmButton: false,
//       });

//       router.replace("/dashboard");
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Login Gagal",
//         text:
//           error.response?.data?.message ||
//           "Email atau password tidak sesuai.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 lg:p-8">
//       <div className="w-full max-w-5xl min-h-[640px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

//         {/* PANEL KIRI - BRANDING */}
//         <section className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-12 text-white border-r border-slate-800/80">
//           {/* Decorative background glows */}
//           <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
//           <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

//           <div className="relative z-10">
//             {/* Logo */}
//             <div className="flex items-center gap-3.5">
//               <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/15">
//                 <FaWrench className="text-xl text-white transform -rotate-12" />
//               </div>

//               <div>
//                 <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
//                   AutoServis
//                   <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
//                     PRO
//                   </span>
//                 </h1>
//                 <p className="text-blue-200/70 text-xs font-medium">
//                   Sistem Manajemen Bengkel
//                 </p>
//               </div>
//             </div>

//             {/* Ilustrasi Center */}
//             <div className="my-16 flex justify-center">
//               <div className="relative w-56 h-56 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xs">
//                 <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 flex items-center justify-center border border-white/10">
//                   <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 transform -rotate-6">
//                     <FaWrench className="text-4xl" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="max-w-md">
//               <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
//                 Kelola Bengkel Jadi Lebih Modern & Praktis
//               </h2>

//               <p className="mt-3.5 text-slate-300 text-sm leading-relaxed">
//                 Pantau antrean booking servis, cetak bukti nota transaksi, kelola armada
//                 kendaraan, dan data pelanggan dalam satu dashboard terpusat.
//               </p>
//             </div>
//           </div>

//           {/* Fitur Highlights */}
//           <div className="relative z-10 space-y-2.5 mt-8 pt-6 border-t border-white/10 text-xs text-slate-300">
//             <div className="flex items-center gap-2.5">
//               <FaCheckCircle className="text-emerald-400 text-sm shrink-0" />
//               <span>Manajemen data pelanggan & armada kendaraan</span>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <FaCheckCircle className="text-emerald-400 text-sm shrink-0" />
//               <span>Pencatatan & status booking servis real-time</span>
//             </div>

//             <div className="flex items-center gap-2.5">
//               <FaCheckCircle className="text-emerald-400 text-sm shrink-0" />
//               <span>Cetak struk nota resmi dan laporan operasional</span>
//             </div>
//           </div>
//         </section>

//         {/* PANEL KANAN - LOGIN FORM */}
//         <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14 bg-white">
//           {/* Logo untuk layar mobile */}
//           <div className="lg:hidden text-center mb-8">
//             <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
//               <FaWrench className="text-xl transform -rotate-12" />
//             </div>

//             <h1 className="text-xl font-bold text-slate-900 mt-3">
//               AutoServis PRO
//             </h1>

//             <p className="text-xs text-slate-500 mt-0.5">
//               Panel Administrator Bengkel
//             </p>
//           </div>

//           <div className="w-full max-w-sm mx-auto">
//             {/* Header Form */}
//             <div className="mb-8">
//               <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
//                 <FaShieldAlt className="text-lg" />
//               </div>

//               <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
//                 Masuk ke Akun Admin
//               </h2>

//               <p className="text-slate-500 mt-1.5 text-xs sm:text-sm">
//                 Gunakan kredensial akun administrator Anda untuk melanjutkan.
//               </p>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleLogin} className="space-y-4">
//               {/* Email */}
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                   Alamat Email
//                 </label>

//                 <div className="relative">
//                   <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="admin@example.com"
//                     className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-800 text-xs sm:text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
//                   Kata Sandi
//                 </label>

//                 <div className="relative">
//                   <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-800 text-xs sm:text-sm outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
//                     aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
//                   >
//                     {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all duration-150 cursor-pointer pt-0.5 mt-2"
//               >
//                 {loading ? "Memverifikasi Akun..." : "Masuk ke Dashboard"}
//                 {!loading && <FaArrowRight className="text-xs" />}
//               </button>
//             </form>

//             {/* Info Box */}
//             <div className="mt-6 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
//               <FaShieldAlt className="text-blue-600 shrink-0 text-xs mt-0.5" />
//               <span>
//                 Area khusus petugas bengkel & administrator resmi. Hak akses dibatasi.
//               </span>
//             </div>

//             <p className="text-center text-[11px] text-slate-400 mt-8">
//               © 2026 AutoServis Bengkel. Hak Cipta Dilindungi.
//             </p>
//           </div>
//         </section>

//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import api from "@/services/api";

import {
  FaWrench,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Email dan password harus diisi!",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Hanya admin yang boleh masuk dashboard
      if (user.role !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Halaman ini hanya dapat diakses oleh admin.",
        });
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang di panel admin bengkel.",
        timer: 1400,
        showConfirmButton: false,
      });

      router.replace("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text:
          error.response?.data?.message ||
          "Email atau password tidak sesuai.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#C6B2AE]/25 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl min-h-[580px] bg-white rounded-3xl shadow-xl shadow-[#564B5E]/15 border border-[#C6B2AE] overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* PANEL KIRI - BRANDING */}
        <section className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#564B5E] via-[#564B5E] to-[#937D7A] p-12 text-white border-r border-[#C6B2AE]/30">
          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FADBB2] text-[#564B5E] flex items-center justify-center shadow-md ring-1 ring-white/15">
                <FaWrench className="text-xl transform -rotate-12" />
              </div>

              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  MobiCare
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FADBB2]/20 text-[#FADBB2] border border-[#FADBB2]/35">
                    ADMIN
                  </span>
                </h1>
                <p className="text-[#C6B2AE] text-xs font-medium">
                  Sistem Manajemen Bengkel
                </p>
              </div>
            </div>

            <div className="max-w-md pt-4">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FADBB2]/15 text-[#FADBB2] border border-[#FADBB2]/30 mb-4">
                MobiCare Workshop
              </span>

              <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                Kelola Bengkel Jadi Lebih Modern & Praktis
              </h2>

              <p className="mt-3.5 text-[#FADBB2]/85 text-sm leading-relaxed">
                Pantau antrean booking servis, cetak bukti nota transaksi, kelola armada
                kendaraan, dan data pelanggan dalam satu dashboard terpusat.
              </p>
            </div>
          </div>

          {/* Fitur Highlights */}
          {/* <div className="relative z-10 space-y-2.5 mt-8 pt-6 border-t border-[#C6B2AE]/30 text-xs text-[#FADBB2]/90">
            <div className="flex items-center gap-2.5">
              <FaCheckCircle className="text-[#FADBB2] text-sm shrink-0" />
              <span>Manajemen data pelanggan & armada kendaraan</span>
            </div>

            <div className="flex items-center gap-2.5">
              <FaCheckCircle className="text-[#FADBB2] text-sm shrink-0" />
              <span>Pencatatan & status booking servis real-time</span>
            </div>

            <div className="flex items-center gap-2.5">
              <FaCheckCircle className="text-[#FADBB2] text-sm shrink-0" />
              <span>Cetak struk nota resmi dan laporan operasional</span>
            </div>
          </div> */}
        </section>

        {/* PANEL KANAN - LOGIN FORM */}
        <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14 bg-white">
          {/* Logo untuk layar mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#564B5E] flex items-center justify-center text-[#FADBB2] shadow-md">
              <FaWrench className="text-xl transform -rotate-12" />
            </div>

            <h1 className="text-xl font-extrabold text-[#564B5E] mt-3">
              MobiCare
            </h1>

            <p className="text-xs text-[#937D7A] mt-0.5">
            Administrator Bengkel
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto">
            {/* Header Form */}
            <div className="mb-8">
              <div className="w-11 h-11 rounded-xl bg-[#C6B2AE]/25 text-[#564B5E] flex items-center justify-center mb-4 border border-[#C6B2AE]">
                <FaShieldAlt className="text-lg" />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-[#564B5E]">
                Masuk ke Akun Admin
              </h2>

              <p className="text-[#937D7A] mt-1.5 text-xs sm:text-sm">
                Gunakan kredensial akun administrator Anda untuk melanjutkan.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                  Alamat Email
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#937D7A] text-xs" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#C6B2AE] bg-[#C6B2AE]/15 text-[#564B5E] text-xs sm:text-sm outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10 placeholder:text-[#937D7A]/70"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#564B5E] uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>

                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#937D7A] text-xs" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#C6B2AE] bg-[#C6B2AE]/15 text-[#564B5E] text-xs sm:text-sm outline-none transition focus:bg-white focus:border-[#564B5E] focus:ring-4 focus:ring-[#564B5E]/10 placeholder:text-[#937D7A]/70"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#937D7A] hover:text-[#564B5E] transition cursor-pointer p-1"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#564B5E] hover:bg-[#937D7A] disabled:opacity-50 text-[#FADBB2] rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer pt-0.5 mt-2"
              >
                {loading ? "Memverifikasi Akun..." : "Masuk ke Dashboard"}
                {!loading && <FaArrowRight className="text-xs" />}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-3.5 rounded-xl bg-[#FADBB2]/45 border border-[#C6B2AE] text-xs text-[#564B5E] leading-relaxed flex items-start gap-2.5">
              <FaShieldAlt className="text-[#564B5E] shrink-0 text-xs mt-0.5" />
              <span>
                Area khusus petugas bengkel & administrator resmi. Hak akses dibatasi.
              </span>
            </div>

            <p className="text-center text-[11px] text-[#937D7A] mt-8">
              © 2026 MobiCare Bengkel. Hak Cipta Dilindungi.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}