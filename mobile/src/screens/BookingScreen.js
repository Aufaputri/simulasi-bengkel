
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   Linking,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import api, { formatRupiah } from "../api/api";

// const JAM_BUKA = "07:30";
// const JAM_TUTUP = "19:00";

// // Sesuaikan detail lokasi bengkel kamu di sini
// const LOKASI_BENGKEL = {
//   nama: "Bengkel MobiCare",
//   alamat: "Jl. Pekapuran, RT.02/RW.06, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16953",
//   patokan: "Depan Sekolah, tersedia parkiran motor mobil",
//   mapsUrl: "https://www.google.com/maps/place/SMK+Taruna+Bhakti+Depok/@-6.3844792,106.8674124,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ebaff005f277:0x9fcd41028665eea8!8m2!3d-6.3844792!4d106.8699873!16s%2Fg%2F11qq76gtsm?entry=ttu&g_ep=EgoyMDI2MTEyMy4wIKXMDSoASAFQAw%3D%3D",
// };

// const parseJamToMinutes = (rawJam) => {
//   if (typeof rawJam !== "string") return null;
//   const match = rawJam.trim().match(/^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/);
//   if (!match) return null;
//   const hours = Number(match[1]);
//   const minutes = Number(match[2]);
//   return hours * 60 + minutes;
// };

// const formatMinutesToHHMM = (totalMinutes) => {
//   const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
//   const mm = String(totalMinutes % 60).padStart(2, "0");
//   return `${hh}:${mm}`;
// };

// const MIN_MINUTES = parseJamToMinutes(JAM_BUKA);
// const MAX_MINUTES = parseJamToMinutes(JAM_TUTUP);

// const detectJenis = (item) => {
//   const raw = String(
//     item?.jenis_kendaraan || item?.kategori || item?.jenis || ""
//   )
//     .toLowerCase()
//     .trim();
//   if (raw.includes("mobil") || raw.includes("car") || raw.includes("roda 4")) {
//     return "mobil";
//   }
//   if (raw.includes("motor") || raw.includes("bike") || raw.includes("roda 2")) {
//     return "motor";
//   }

//   const text = `${item?.nama_layanan || ""} ${item?.deskripsi || ""} ${
//     item?.merk || ""
//   } ${item?.tipe || ""}`.toLowerCase();
//   if (
//     /\b(mobil|avanza|xenia|brio|ayla|agya|jazz|yaris|ertiga|xpander|innova|civic|br-v|brv|hr-v|hrv|pajero|fortuner|calya|sigra)\b/.test(
//       text
//     )
//   ) {
//     return "mobil";
//   }
//   return "motor";
// };

// export default function BookingScreen({
//   initialSelectedLayananId,
//   onBookingSuccess,
// }) {
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // Data dari API
//   const [kendaraanList, setKendaraanList] = useState([]);
//   const [layananList, setLayananList] = useState([]);

//   // Form State
//   const [selectedKendaraanId, setSelectedKendaraanId] = useState(null);
//   const [selectedLayananIds, setSelectedLayananIds] = useState([]);
//   const [tanggalBooking, setTanggalBooking] = useState("");
//   const [jamBooking, setJamBooking] = useState("08:30");
//   const [keluhan, setKeluhan] = useState("");

//   // State Antrian pada Tanggal & Jam terpilih
//   const [loadingAntrian, setLoadingAntrian] = useState(false);
//   const [antrianInfo, setAntrianInfo] = useState({
//     jumlah_antrian: 0,
//     daftar_kendaraan: [],
//   });

//   // Modal Tambah / Edit Kendaraan
//   const [showVehicleModal, setShowVehicleModal] = useState(false);
//   const [editingVehicleId, setEditingVehicleId] = useState(null);
//   const [jenisKendaraan, setJenisKendaraan] = useState("motor");
//   const [merk, setMerk] = useState("");
//   const [tipe, setTipe] = useState("");
//   const [tahun, setTahun] = useState(String(new Date().getFullYear()));
//   const [platNomor, setPlatNomor] = useState("");
//   const [warna, setWarna] = useState("");
//   const [savingVehicle, setSavingVehicle] = useState(false);

//   useEffect(() => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const yyyy = tomorrow.getFullYear();
//     const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
//     const dd = String(tomorrow.getDate()).padStart(2, "0");
//     setTanggalBooking(`${yyyy}-${mm}-${dd}`);
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [resKendaraan, resLayanan] = await Promise.all([
//         api.get("/kendaraan"),
//         api.get("/layanan"),
//       ]);

//       const kData = resKendaraan.data?.data || resKendaraan.data || [];
//       const lData = resLayanan.data?.data || resLayanan.data || [];

//       setKendaraanList(kData);
//       setLayananList(lData);

//       if (kData.length > 0) {
//         const stillExists = kData.some((k) => k.id === selectedKendaraanId);
//         if (!stillExists) {
//           setSelectedKendaraanId(kData[0].id);
//         }
//       } else {
//         setSelectedKendaraanId(null);
//       }

//       if (initialSelectedLayananId) {
//         setSelectedLayananIds([initialSelectedLayananId]);
//       }
//     } catch (err) {
//       console.error("Gagal load data booking:", err);
//       Alert.alert(
//         "Koneksi Bermasalah",
//         "Gagal memuat data kendaraan & layanan. Periksa server backend."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Cek antrian di tanggal & jam yang diisi pelanggan
//   const fetchAntrianJadwal = useCallback(async (tgl, jamText) => {
//     const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test((tgl || "").trim());
//     const mins = parseJamToMinutes(jamText);

//     if (!isValidDate || mins === null) {
//       setAntrianInfo({ jumlah_antrian: 0, daftar_kendaraan: [] });
//       return;
//     }

//     const jamFormatted = formatMinutesToHHMM(mins);
//     setLoadingAntrian(true);
//     try {
//       const res = await api.get("/booking/antrian", {
//         params: { tanggal: tgl.trim(), jam: jamFormatted },
//       });
//       const payload = res.data?.data || {};
//       setAntrianInfo({
//         jumlah_antrian: Number(payload.jumlah_antrian || 0),
//         daftar_kendaraan: Array.isArray(payload.daftar_kendaraan)
//           ? payload.daftar_kendaraan
//           : [],
//       });
//     } catch (err) {
//       console.error("Gagal cek antrian:", err);
//     } finally {
//       setLoadingAntrian(false);
//     }
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchAntrianJadwal(tanggalBooking, jamBooking);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [tanggalBooking, jamBooking, fetchAntrianJadwal]);

//   const selectedKendaraan = useMemo(
//     () => kendaraanList.find((k) => k.id === selectedKendaraanId) || null,
//     [kendaraanList, selectedKendaraanId]
//   );

//   const activeJenisKendaraan = useMemo(() => {
//     if (!selectedKendaraan) return null;
//     return detectJenis(selectedKendaraan);
//   }, [selectedKendaraan]);

//   const availableLayanan = useMemo(() => {
//     if (!activeJenisKendaraan) return layananList;
//     return layananList.filter(
//       (item) => detectJenis(item) === activeJenisKendaraan
//     );
//   }, [layananList, activeJenisKendaraan]);

//   useEffect(() => {
//     if (!activeJenisKendaraan) return;
//     setSelectedLayananIds((prev) =>
//       prev.filter((id) => {
//         const found = layananList.find((l) => l.id === id);
//         return found ? detectJenis(found) === activeJenisKendaraan : false;
//       })
//     );
//   }, [activeJenisKendaraan, layananList]);

//   useEffect(() => {
//     if (!initialSelectedLayananId) return;
//     const found = layananList.find((l) => l.id === initialSelectedLayananId);
//     if (
//       found &&
//       (!activeJenisKendaraan || detectJenis(found) === activeJenisKendaraan)
//     ) {
//       setSelectedLayananIds((prev) =>
//         prev.includes(initialSelectedLayananId)
//           ? prev
//           : [...prev, initialSelectedLayananId]
//       );
//     }
//   }, [initialSelectedLayananId, activeJenisKendaraan, layananList]);

//   const openAddVehicleModal = () => {
//     setEditingVehicleId(null);
//     setJenisKendaraan("motor");
//     setMerk("");
//     setTipe("");
//     setTahun(String(new Date().getFullYear()));
//     setPlatNomor("");
//     setWarna("");
//     setShowVehicleModal(true);
//   };

//   const openEditVehicleModal = (vehicle) => {
//     setEditingVehicleId(vehicle.id);
//     setJenisKendaraan(detectJenis(vehicle));
//     setMerk(vehicle.merk || "");
//     setTipe(vehicle.tipe || "");
//     setTahun(String(vehicle.tahun || new Date().getFullYear()));
//     setPlatNomor(vehicle.plat_nomor || "");
//     setWarna(vehicle.warna || "");
//     setShowVehicleModal(true);
//   };

//   const toggleLayanan = (id) => {
//     if (selectedLayananIds.includes(id)) {
//       setSelectedLayananIds(selectedLayananIds.filter((item) => item !== id));
//     } else {
//       setSelectedLayananIds([...selectedLayananIds, id]);
//     }
//   };

//   const selectedLayananObjects = availableLayanan.filter((item) =>
//     selectedLayananIds.includes(item.id)
//   );

//   const totalHarga = selectedLayananObjects.reduce(
//     (sum, item) => sum + Number(item.harga || 0),
//     0
//   );

//   const totalDurasi = selectedLayananObjects.reduce(
//     (sum, item) => sum + Number(item.estimasi_durasi || 0),
//     0
//   );

//   const handleSaveKendaraan = async () => {
//     if (!merk.trim() || !tipe.trim() || !tahun || !platNomor.trim()) {
//       Alert.alert("Perhatian", "Merek, tipe, tahun, dan plat nomor wajib diisi!");
//       return;
//     }

//     setSavingVehicle(true);
//     try {
//       const payload = {
//         jenis_kendaraan: jenisKendaraan,
//         merk: merk.trim(),
//         tipe: tipe.trim(),
//         tahun: Number(tahun),
//         plat_nomor: platNomor.trim().toUpperCase(),
//         warna: warna.trim() || null,
//       };

//       const isEdit = Boolean(editingVehicleId);
//       const res = isEdit
//         ? await api.put(`/kendaraan/${editingVehicleId}`, payload)
//         : await api.post("/kendaraan", payload);

//       if (res.data?.success) {
//         Alert.alert(
//           "Sukses",
//           isEdit
//             ? `Data kendaraan (${jenisKendaraan.toUpperCase()}) berhasil diperbarui!`
//             : `Kendaraan (${jenisKendaraan.toUpperCase()}) berhasil ditambahkan!`
//         );
//         setShowVehicleModal(false);
//         setSelectedLayananIds([]);

//         const resK = await api.get("/kendaraan");
//         const kData = resK.data?.data || resK.data || [];
//         setKendaraanList(kData);

//         if (isEdit) {
//           setSelectedKendaraanId(editingVehicleId);
//         } else if (res.data.data?.id) {
//           setSelectedKendaraanId(res.data.data.id);
//         } else if (kData.length > 0) {
//           setSelectedKendaraanId(kData[0].id);
//         }
//       }
//     } catch (err) {
//       Alert.alert(
//         "Gagal Menyimpan Kendaraan",
//         err.response?.data?.message || err.message || "Terjadi kesalahan."
//       );
//     } finally {
//       setSavingVehicle(false);
//     }
//   };

//   const handleSubmitBooking = async () => {
//     if (!selectedKendaraanId) {
//       Alert.alert(
//         "Pilih Kendaraan",
//         "Silakan pilih kendaraan yang akan diservis atau tambahkan kendaraan baru."
//       );
//       return;
//     }

//     if (selectedLayananIds.length === 0) {
//       Alert.alert(
//         "Pilih Layanan",
//         "Pilih minimal satu layanan servis yang diinginkan."
//       );
//       return;
//     }

//     if (!tanggalBooking.trim()) {
//       Alert.alert("Pilih Tanggal", "Silakan masukkan tanggal servis (YYYY-MM-DD).");
//       return;
//     }

//     const mins = parseJamToMinutes(jamBooking);
//     if (mins === null) {
//       Alert.alert(
//         "Format Jam Tidak Valid",
//         "Isi jam kedatangan dengan format HH:MM (contoh: 08:30 atau 14:00)."
//       );
//       return;
//     }

//     if (mins < MIN_MINUTES || mins > MAX_MINUTES) {
//       Alert.alert(
//         "Di Luar Jam Operasional",
//         `Bengkel buka jam ${JAM_BUKA} - ${JAM_TUTUP}. Silakan isi jam di dalam rentang tersebut.`
//       );
//       return;
//     }

//     const formattedJam = formatMinutesToHHMM(mins);
//     setJamBooking(formattedJam);

//     setSubmitting(true);
//     try {
//       const payload = {
//         kendaraan_id: Number(selectedKendaraanId),
//         layanan_ids: selectedLayananIds,
//         tanggal_booking: tanggalBooking.trim(),
//         jam_booking: formattedJam,
//         keluhan: keluhan.trim() || null,
//       };

//       const res = await api.post("/booking", payload);

//       if (res.data?.success) {
//         const kode = res.data.data?.kode_booking || "-";
//         Alert.alert(
//           "Booking Berhasil!",
//           `Pesanan servis Anda berhasil dibuat dengan Kode: ${kode} (Jam ${formattedJam}).\n\nSilakan datang ke bengkel sesuai jadwal yang ditentukan.`,
//           [
//             {
//               text: "Lihat Riwayat",
//               onPress: () => {
//                 setSelectedLayananIds([]);
//                 setKeluhan("");
//                 if (onBookingSuccess) onBookingSuccess();
//               },
//             },
//           ]
//         );
//       } else {
//         Alert.alert("Booking Gagal", res.data?.message || "Gagal membuat booking");
//       }
//     } catch (err) {
//       console.error("Error submit booking:", err);
//       Alert.alert(
//         "Booking Gagal",
//         err.response?.data?.message || err.message || "Gagal menghubungi server"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleOpenMaps = async () => {
//     try {
//       await Linking.openURL(LOKASI_BENGKEL.mapsUrl);
//     } catch {
//       Alert.alert("Info Lokasi", LOKASI_BENGKEL.alamat);
//     }
//   };

//   const jamMinutes = parseJamToMinutes(jamBooking);
//   const jamValid = jamMinutes !== null;
//   const diLuarJamBuka =
//     jamValid && (jamMinutes < MIN_MINUTES || jamMinutes > MAX_MINUTES);

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#2563EB" />
//         <Text style={styles.loadingText}>Menyiapkan formulir booking...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Formulir Booking Servis</Text>
//         <Text style={styles.headerSubtitle}>
//           Jam Operasional Bengkel: {JAM_BUKA} – {JAM_TUTUP} WIB
//         </Text>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* LOKASI DETAIL BENGKEL */}
//         <View style={styles.locationCard}>
//           <View style={styles.locationHeader}>
//             <Ionicons name="location" size={20} color="#2563EB" />
//             <Text style={styles.locationTitle}>Lokasi Detail Bengkel</Text>
//           </View>
//           <Text style={styles.locationName}>{LOKASI_BENGKEL.nama}</Text>
//           <Text style={styles.locationAddress}>{LOKASI_BENGKEL.alamat}</Text>
//           <Text style={styles.locationNote}>Patokan: {LOKASI_BENGKEL.patokan}</Text>
//           <TouchableOpacity style={styles.mapsBtn} onPress={handleOpenMaps}>
//             <Ionicons name="navigate-outline" size={15} color="#2563EB" />
//             <Text style={styles.mapsBtnText}>Buka di Google Maps</Text>
//           </TouchableOpacity>
//         </View>

//         {/* LANGKAH 1: PILIH / EDIT KENDARAAN */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.stepBadge}>
//               <Text style={styles.stepBadgeText}>1</Text>
//             </View>
//             <Text style={styles.sectionTitle}>Pilih Kendaraan Anda</Text>
//           </View>

//           {kendaraanList.length === 0 ? (
//             <View style={styles.emptyKendaraanBox}>
//               <Ionicons name="car-outline" size={36} color="#9CA3AF" />
//               <Text style={styles.emptyKendaraanText}>
//                 Anda belum mendaftarkan data kendaraan. Tambah kendaraan dulu agar
//                 layanan menyesuaikan jenis kendaraan Anda.
//               </Text>
//               <TouchableOpacity
//                 style={styles.addKendaraanBtn}
//                 onPress={openAddVehicleModal}
//               >
//                 <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
//                 <Text style={styles.addKendaraanBtnText}>
//                   + Tambah Kendaraan Sekarang
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.vehicleScroll}
//               >
//                 {kendaraanList.map((k) => {
//                   const isSelected = selectedKendaraanId === k.id;
//                   const kJenis = detectJenis(k);
//                   return (
//                     <TouchableOpacity
//                       key={k.id}
//                       style={[
//                         styles.vehicleCard,
//                         isSelected && styles.vehicleCardActive,
//                       ]}
//                       onPress={() => setSelectedKendaraanId(k.id)}
//                     >
//                       <View style={styles.vehicleCardTop}>
//                         <View style={styles.platBadge}>
//                           <Text style={styles.platText}>{k.plat_nomor}</Text>
//                         </View>
//                         <View style={styles.vehicleTopRight}>
//                           <TouchableOpacity
//                             style={styles.editVehicleBtn}
//                             onPress={() => openEditVehicleModal(k)}
//                           >
//                             <Ionicons
//                               name="create-outline"
//                               size={13}
//                               color="#2563EB"
//                             />
//                             <Text style={styles.editVehicleBtnText}>Edit</Text>
//                           </TouchableOpacity>
//                           {isSelected && (
//                             <Ionicons
//                               name="checkmark-circle"
//                               size={20}
//                               color="#2563EB"
//                             />
//                           )}
//                         </View>
//                       </View>
//                       <Text style={styles.vehicleName}>
//                         {k.merk} {k.tipe}
//                       </Text>
//                       <Text style={styles.vehicleSub}>
//                         {kJenis === "mobil" ? "Mobil" : "Motor"} • {k.tahun}{" "}
//                         {k.warna ? `• ${k.warna}` : ""}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>

//               <TouchableOpacity
//                 style={styles.secondaryAddBtn}
//                 onPress={openAddVehicleModal}
//               >
//                 <Ionicons name="add" size={16} color="#2563EB" />
//                 <Text style={styles.secondaryAddBtnText}>
//                   Tambah Kendaraan Lain
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* LANGKAH 2: PILIH LAYANAN */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.stepBadge}>
//               <Text style={styles.stepBadgeText}>2</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.sectionTitle}>Pilih Layanan Servis</Text>
//               <Text style={styles.sectionSub}>
//                 {activeJenisKendaraan
//                   ? `Khusus ${
//                       activeJenisKendaraan === "mobil" ? "Mobil" : "Motor"
//                     } (${selectedKendaraan?.merk} ${
//                       selectedKendaraan?.tipe
//                     }) • Bisa pilih lebih dari 1`
//                   : "Semua layanan Motor & Mobil • Bisa pilih lebih dari 1"}
//               </Text>
//             </View>
//           </View>

//           {availableLayanan.length === 0 ? (
//             <View style={styles.emptyKendaraanBox}>
//               <Text style={styles.emptyKendaraanText}>
//                 Belum ada layanan tersedia untuk kategori{" "}
//                 {activeJenisKendaraan === "mobil" ? "Mobil" : "Motor"}.
//               </Text>
//             </View>
//           ) : (
//             availableLayanan.map((layanan) => {
//               const isChecked = selectedLayananIds.includes(layanan.id);
//               const lJenis = detectJenis(layanan);
//               return (
//                 <TouchableOpacity
//                   key={layanan.id}
//                   style={[
//                     styles.serviceRow,
//                     isChecked && styles.serviceRowActive,
//                   ]}
//                   onPress={() => toggleLayanan(layanan.id)}
//                 >
//                   <View
//                     style={[
//                       styles.checkbox,
//                       isChecked && styles.checkboxActive,
//                     ]}
//                   >
//                     {isChecked && (
//                       <Ionicons name="checkmark" size={14} color="#FFFFFF" />
//                     )}
//                   </View>
//                   <View style={styles.serviceRowDetails}>
//                     <Text
//                       style={[
//                         styles.serviceRowName,
//                         isChecked && styles.serviceRowNameActive,
//                       ]}
//                     >
//                       {layanan.nama_layanan}
//                     </Text>
//                     <Text style={styles.serviceRowDur}>
//                       {lJenis === "mobil" ? "Mobil" : "Motor"} • ⏱{" "}
//                       {layanan.estimasi_durasi || 30} menit
//                     </Text>
//                   </View>
//                   <Text style={styles.serviceRowPrice}>
//                     {formatRupiah(layanan.harga)}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })
//           )}
//         </View>

//         {/* LANGKAH 3: JADWAL KEDATANGAN (INPUT JAM MANDIRI + CEK ANTRIAN) */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.stepBadge}>
//               <Text style={styles.stepBadgeText}>3</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.sectionTitle}>Jadwal Kedatangan Servis</Text>
//               <Text style={styles.sectionSub}>
//                 Buka {JAM_BUKA} – Tutup {JAM_TUTUP} • Ketik jam kedatangan sendiri
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Tanggal Booking (YYYY-MM-DD)</Text>
//             <View style={styles.inputFieldWrapper}>
//               <Ionicons
//                 name="calendar-outline"
//                 size={18}
//                 color="#6B7280"
//                 style={styles.fieldIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={tanggalBooking}
//                 onChangeText={setTanggalBooking}
//                 placeholder="2026-11-28"
//                 placeholderTextColor="#9CA3AF"
//               />
//             </View>
//             <View style={styles.quickDateRow}>
//               <TouchableOpacity
//                 style={styles.quickDateChip}
//                 onPress={() => {
//                   const today = new Date();
//                   const y = today.getFullYear();
//                   const m = String(today.getMonth() + 1).padStart(2, "0");
//                   const d = String(today.getDate()).padStart(2, "0");
//                   setTanggalBooking(`${y}-${m}-${d}`);
//                 }}
//               >
//                 <Text style={styles.quickDateChipText}>Hari Ini</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickDateChip}
//                 onPress={() => {
//                   const tmrw = new Date();
//                   tmrw.setDate(tmrw.getDate() + 1);
//                   const y = tmrw.getFullYear();
//                   const m = String(tmrw.getMonth() + 1).padStart(2, "0");
//                   const d = String(tmrw.getDate()).padStart(2, "0");
//                   setTanggalBooking(`${y}-${m}-${d}`);
//                 }}
//               >
//                 <Text style={styles.quickDateChipText}>Besok</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.quickDateChip}
//                 onPress={() => {
//                   const lusa = new Date();
//                   lusa.setDate(lusa.getDate() + 2);
//                   const y = lusa.getFullYear();
//                   const m = String(lusa.getMonth() + 1).padStart(2, "0");
//                   const d = String(lusa.getDate()).padStart(2, "0");
//                   setTanggalBooking(`${y}-${m}-${d}`);
//                 }}
//               >
//                 <Text style={styles.quickDateChipText}>Lusa</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>
//               Isi Jam Kedatangan (Format HH:MM, {JAM_BUKA} - {JAM_TUTUP})
//             </Text>
//             <View style={styles.inputFieldWrapper}>
//               <Ionicons
//                 name="time-outline"
//                 size={18}
//                 color="#6B7280"
//                 style={styles.fieldIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={jamBooking}
//                 onChangeText={setJamBooking}
//                 placeholder="Contoh: 08:30 atau 13:15"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="numbers-and-punctuation"
//                 maxLength={5}
//               />
//             </View>
//             {diLuarJamBuka && (
//               <Text style={styles.warningText}>
//                 Jam di luar jam operasional bengkel ({JAM_BUKA} – {JAM_TUTUP}).
//               </Text>
//             )}
//           </View>

//           {/* Info Antrian & Kendaraan/Motor pada Jam Tersebut */}
//           <View style={styles.queueBox}>
//             <View style={styles.queueHeader}>
//               <View style={styles.queueHeaderLeft}>
//                 <Ionicons name="people-outline" size={17} color="#1D4ED8" />
//                 <Text style={styles.queueTitle}>
//                   Antrian di Jam {jamValid ? formatMinutesToHHMM(jamMinutes) : jamBooking || "--:--"}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 onPress={() => fetchAntrianJadwal(tanggalBooking, jamBooking)}
//               >
//                 <Ionicons name="refresh" size={16} color="#1D4ED8" />
//               </TouchableOpacity>
//             </View>

//             {loadingAntrian ? (
//               <View style={styles.queueLoadingRow}>
//                 <ActivityIndicator size="small" color="#2563EB" />
//                 <Text style={styles.queueSubText}>Mengecek antrian...</Text>
//               </View>
//             ) : !jamValid ? (
//               <Text style={styles.queueSubText}>
//                 Masukkan format jam valid (contoh: 09:00) untuk melihat antrian.
//               </Text>
//             ) : (
//               <>
//                 <Text style={styles.queueCountText}>
//                   Jumlah antrian aktif: {antrianInfo.jumlah_antrian} kendaraan
//                 </Text>

//                 {antrianInfo.daftar_kendaraan.length === 0 ? (
//                   <Text style={styles.queueSubText}>
//                     Belum ada motor/kendaraan lain yang mengisi jam ini.
//                   </Text>
//                 ) : (
//                   <View style={styles.queueVehicleList}>
//                     {antrianInfo.daftar_kendaraan.map((item, idx) => (
//                       <View key={item.id || idx} style={styles.queueVehicleItem}>
//                         <Text style={styles.queueVehicleMain}>
//                           {idx + 1}. {item.merk} {item.tipe} ({item.plat_nomor})
//                         </Text>
//                         <Text style={styles.queueVehicleStatus}>
//                           {item.status}
//                         </Text>
//                       </View>
//                     ))}
//                   </View>
//                 )}
//               </>
//             )}
//           </View>
//         </View>

//         {/* LANGKAH 4: KELUHAN / CATATAN */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.stepBadge}>
//               <Text style={styles.stepBadgeText}>4</Text>
//             </View>
//             <Text style={styles.sectionTitle}>Keluhan / Catatan Kendaraan</Text>
//           </View>

//           <TextInput
//             style={styles.textArea}
//             multiline
//             numberOfLines={4}
//             placeholder="Tuliskan keluhan atau gejala kendala pada kendaraan Anda..."
//             placeholderTextColor="#9CA3AF"
//             value={keluhan}
//             onChangeText={setKeluhan}
//           />
//         </View>

//         {/* RINGKASAN & SUBMIT */}
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Ringkasan Booking</Text>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Kendaraan:</Text>
//             <Text style={styles.summaryValue}>
//               {selectedKendaraan
//                 ? `${selectedKendaraan.merk} ${selectedKendaraan.tipe} (${
//                     activeJenisKendaraan === "mobil" ? "Mobil" : "Motor"
//                   })`
//                 : "-"}
//             </Text>
//           </View>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Jadwal Kedatangan:</Text>
//             <Text style={styles.summaryValue}>
//               {tanggalBooking || "-"} •{" "}
//               {jamValid ? formatMinutesToHHMM(jamMinutes) : jamBooking || "-"}
//             </Text>
//           </View>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Total Layanan Dipilih:</Text>
//             <Text style={styles.summaryValue}>
//               {selectedLayananObjects.length} Layanan
//             </Text>
//           </View>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Estimasi Durasi Kerja:</Text>
//             <Text style={styles.summaryValue}>~{totalDurasi} Menit</Text>
//           </View>

//           <View style={[styles.summaryRow, styles.summaryTotalRow]}>
//             <Text style={styles.summaryTotalLabel}>Total Estimasi Biaya:</Text>
//             <Text style={styles.summaryTotalValue}>
//               {formatRupiah(totalHarga)}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               submitting && styles.submitButtonDisabled,
//             ]}
//             onPress={handleSubmitBooking}
//             disabled={submitting}
//           >
//             {submitting ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <>
//                 <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
//                 <Text style={styles.submitButtonText}>
//                   Kirim Booking Sekarang
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* MODAL TAMBAH / EDIT KENDARAAN */}
//       <Modal
//         visible={showVehicleModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowVehicleModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Ionicons name="car" size={24} color="#2563EB" />
//               <Text style={styles.modalTitle}>
//                 {editingVehicleId ? "Edit Data Kendaraan" : "Tambah Kendaraan Baru"}
//               </Text>
//             </View>

//             <ScrollView>
//               <View style={styles.inputGroup}>
//                 <Text style={styles.modalInputLabel}>Jenis Kendaraan *</Text>
//                 <View style={styles.jenisRow}>
//                   <TouchableOpacity
//                     style={[
//                       styles.jenisBtn,
//                       jenisKendaraan === "motor" && styles.jenisBtnActive,
//                     ]}
//                     onPress={() => setJenisKendaraan("motor")}
//                   >
//                     <Text
//                       style={[
//                         styles.jenisBtnText,
//                         jenisKendaraan === "motor" && styles.jenisBtnTextActive,
//                       ]}
//                     >
//                       Motor
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.jenisBtn,
//                       jenisKendaraan === "mobil" && styles.jenisBtnActive,
//                     ]}
//                     onPress={() => setJenisKendaraan("mobil")}
//                   >
//                     <Text
//                       style={[
//                         styles.jenisBtnText,
//                         jenisKendaraan === "mobil" && styles.jenisBtnTextActive,
//                       ]}
//                     >
//                       Mobil
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.modalInputLabel}>Nomor Polisi (Plat) *</Text>
//                 <TextInput
//                   style={styles.modalTextInput}
//                   placeholder="B 1234 XYZ"
//                   placeholderTextColor="#9CA3AF"
//                   value={platNomor}
//                   onChangeText={setPlatNomor}
//                   autoCapitalize="characters"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.modalInputLabel}>Merek Kendaraan *</Text>
//                 <TextInput
//                   style={styles.modalTextInput}
//                   placeholder="Contoh: Honda / Toyota / Yamaha"
//                   placeholderTextColor="#9CA3AF"
//                   value={merk}
//                   onChangeText={setMerk}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.modalInputLabel}>Tipe / Model *</Text>
//                 <TextInput
//                   style={styles.modalTextInput}
//                   placeholder="Contoh: Vario 160 / Avanza Veloz"
//                   placeholderTextColor="#9CA3AF"
//                   value={tipe}
//                   onChangeText={setTipe}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.modalInputLabel}>Tahun Pembuatan *</Text>
//                 <TextInput
//                   style={styles.modalTextInput}
//                   placeholder="2022"
//                   placeholderTextColor="#9CA3AF"
//                   value={tahun}
//                   onChangeText={setTahun}
//                   keyboardType="number-pad"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.modalInputLabel}>
//                   Warna Kendaraan (Opsional)
//                 </Text>
//                 <TextInput
//                   style={styles.modalTextInput}
//                   placeholder="Hitam Metalik / Putih"
//                   placeholderTextColor="#9CA3AF"
//                   value={warna}
//                   onChangeText={setWarna}
//                 />
//               </View>
//             </ScrollView>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalCancelBtn}
//                 onPress={() => setShowVehicleModal(false)}
//               >
//                 <Text style={styles.modalCancelBtnText}>Batal</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSaveBtn}
//                 onPress={handleSaveKendaraan}
//                 disabled={savingVehicle}
//               >
//                 {savingVehicle ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.modalSaveBtnText}>
//                     {editingVehicleId ? "Simpan Perubahan" : "Simpan Kendaraan"}
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F3F4F6" },
//   header: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
//   headerSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//   scrollContent: { padding: 16, paddingBottom: 36 },
//   locationCard: {
//     backgroundColor: "#EFF6FF",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//   },
//   locationHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 4,
//   },
//   locationTitle: { fontSize: 14, fontWeight: "bold", color: "#1E3A8A" },
//   locationName: { fontSize: 13, fontWeight: "700", color: "#111827" },
//   locationAddress: { fontSize: 12, color: "#374151", marginTop: 2 },
//   locationNote: { fontSize: 11, color: "#4B5563", marginTop: 4 },
//   mapsBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     gap: 5,
//     marginTop: 8,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#93C5FD",
//   },
//   mapsBtnText: { fontSize: 12, fontWeight: "600", color: "#2563EB" },
//   sectionCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 14,
//     gap: 10,
//   },
//   stepBadge: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "#2563EB",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stepBadgeText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
//   sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
//   sectionSub: { fontSize: 11, color: "#6B7280" },
//   vehicleScroll: { gap: 12, paddingVertical: 4 },
//   vehicleCard: {
//     width: 185,
//     borderWidth: 2,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: "#F9FAFB",
//   },
//   vehicleCardActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
//   vehicleCardTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   vehicleTopRight: { flexDirection: "row", alignItems: "center", gap: 6 },
//   editVehicleBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 3,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   editVehicleBtnText: { fontSize: 10, fontWeight: "700", color: "#2563EB" },
//   platBadge: {
//     backgroundColor: "#1F2937",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   platText: {
//     color: "#F9FAFB",
//     fontWeight: "bold",
//     fontSize: 11,
//     letterSpacing: 0.5,
//   },
//   vehicleName: { fontSize: 13, fontWeight: "bold", color: "#1F2937" },
//   vehicleSub: { fontSize: 11, color: "#6B7280", marginTop: 2 },
//   emptyKendaraanBox: {
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderStyle: "dashed",
//   },
//   emptyKendaraanText: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginVertical: 8,
//     textAlign: "center",
//   },
//   addKendaraanBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//     marginTop: 4,
//   },
//   addKendaraanBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "bold" },
//   secondaryAddBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-end",
//     marginTop: 10,
//     gap: 4,
//   },
//   secondaryAddBtnText: { color: "#2563EB", fontSize: 12, fontWeight: "600" },
//   serviceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   serviceRowActive: { backgroundColor: "#F8FAFC" },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   checkboxActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
//   serviceRowDetails: { flex: 1 },
//   serviceRowName: { fontSize: 14, color: "#374151", fontWeight: "500" },
//   serviceRowNameActive: { fontWeight: "bold", color: "#1F2937" },
//   serviceRowDur: { fontSize: 11, color: "#6B7280", marginTop: 2 },
//   serviceRowPrice: { fontSize: 13, fontWeight: "bold", color: "#2563EB" },
//   inputGroup: { marginBottom: 14 },
//   inputLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 6,
//   },
//   inputFieldWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 12,
//     height: 42,
//   },
//   fieldIcon: { marginRight: 8 },
//   textInput: { flex: 1, fontSize: 13, color: "#111827" },
//   warningText: {
//     fontSize: 11,
//     color: "#DC2626",
//     fontWeight: "600",
//     marginTop: 5,
//   },
//   quickDateRow: { flexDirection: "row", gap: 8, marginTop: 8 },
//   quickDateChip: {
//     backgroundColor: "#EFF6FF",
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 16,
//   },
//   quickDateChipText: { fontSize: 11, color: "#1D4ED8", fontWeight: "600" },
//   queueBox: {
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 10,
//     padding: 12,
//   },
//   queueHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   queueHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
//   queueTitle: { fontSize: 13, fontWeight: "700", color: "#1E3A8A" },
//   queueLoadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   queueCountText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 6,
//   },
//   queueSubText: { fontSize: 12, color: "#6B7280" },
//   queueVehicleList: { gap: 6, marginTop: 2 },
//   queueVehicleItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 7,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   queueVehicleMain: { fontSize: 12, color: "#1F2937", fontWeight: "500" },
//   queueVehicleStatus: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#2563EB",
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: "#F9FAFB",
//     fontSize: 13,
//     color: "#111827",
//     textAlignVertical: "top",
//     minHeight: 80,
//   },
//   summaryCard: {
//     backgroundColor: "#1E293B",
//     borderRadius: 16,
//     padding: 18,
//     marginTop: 4,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#F8FAFC",
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   summaryLabel: { fontSize: 13, color: "#94A3B8" },
//   summaryValue: { fontSize: 13, color: "#F1F5F9", fontWeight: "500" },
//   summaryTotalRow: {
//     borderTopWidth: 1,
//     borderTopColor: "#334155",
//     paddingTop: 10,
//     marginTop: 4,
//     marginBottom: 16,
//   },
//   summaryTotalLabel: { fontSize: 14, fontWeight: "bold", color: "#FFFFFF" },
//   summaryTotalValue: { fontSize: 18, fontWeight: "bold", color: "#38BDF8" },
//   submitButton: {
//     backgroundColor: "#2563EB",
//     paddingVertical: 14,
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   submitButtonDisabled: { backgroundColor: "#475569" },
//   submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
//   centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   loadingText: { marginTop: 10, fontSize: 13, color: "#6B7280" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     maxHeight: "85%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 16,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
//   jenisRow: { flexDirection: "row", gap: 10 },
//   jenisBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//   },
//   jenisBtnActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
//   jenisBtnText: { fontSize: 13, fontWeight: "600", color: "#374151" },
//   jenisBtnTextActive: { color: "#FFFFFF" },
//   modalInputLabel: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 4,
//   },
//   modalTextInput: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 13,
//     backgroundColor: "#F9FAFB",
//     color: "#111827",
//   },
//   modalActions: { flexDirection: "row", gap: 10, marginTop: 16 },
//   modalCancelBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   modalCancelBtnText: { color: "#6B7280", fontWeight: "600" },
//   modalSaveBtn: {
//     flex: 2,
//     backgroundColor: "#2563EB",
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   modalSaveBtnText: { color: "#FFFFFF", fontWeight: "bold" },
// });

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api, { formatRupiah } from "../api/api";

const JAM_BUKA = "07:30";
const JAM_TUTUP = "19:00";

// Sesuaikan detail lokasi bengkel kamu di sini
const LOKASI_BENGKEL = {
  nama: "Bengkel MobiCare",
  alamat: "Jl. Pekapuran, RT.02/RW.06, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16953",
  patokan: "Depan Sekolah, tersedia parkiran motor mobil",
  mapsUrl: "https://www.google.com/maps/place/SMK+Taruna+Bhakti+Depok/@-6.3844792,106.8674124,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ebaff005f277:0x9fcd41028665eea8!8m2!3d-6.3844792!4d106.8699873!16s%2Fg%2F11qq76gtsm?entry=ttu&g_ep=EgoyMDI2MTEyMy4wIKXMDSoASAFQAw%3D%3D",
};

const parseJamToMinutes = (rawJam) => {
  if (typeof rawJam !== "string") return null;
  const match = rawJam.trim().match(/^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
};

const formatMinutesToHHMM = (totalMinutes) => {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

const MIN_MINUTES = parseJamToMinutes(JAM_BUKA);
const MAX_MINUTES = parseJamToMinutes(JAM_TUTUP);

const detectJenis = (item) => {
  const raw = String(
    item?.jenis_kendaraan || item?.kategori || item?.jenis || ""
  )
    .toLowerCase()
    .trim();
  if (raw.includes("mobil") || raw.includes("car") || raw.includes("roda 4")) {
    return "mobil";
  }
  if (raw.includes("motor") || raw.includes("bike") || raw.includes("roda 2")) {
    return "motor";
  }

  const text = `${item?.nama_layanan || ""} ${item?.deskripsi || ""} ${
    item?.merk || ""
  } ${item?.tipe || ""}`.toLowerCase();
  if (
    /\b(mobil|avanza|xenia|brio|ayla|agya|jazz|yaris|ertiga|xpander|innova|civic|br-v|brv|hr-v|hrv|pajero|fortuner|calya|sigra)\b/.test(
      text
    )
  ) {
    return "mobil";
  }
  return "motor";
};

export default function BookingScreen({
  initialSelectedLayananId,
  onBookingSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data dari API
  const [kendaraanList, setKendaraanList] = useState([]);
  const [layananList, setLayananList] = useState([]);

  // Form State
  const [selectedKendaraanId, setSelectedKendaraanId] = useState(null);
  const [selectedLayananIds, setSelectedLayananIds] = useState([]);
  const [tanggalBooking, setTanggalBooking] = useState("");
  const [jamBooking, setJamBooking] = useState("08:30");
  const [keluhan, setKeluhan] = useState("");

  // State Antrian pada Tanggal & Jam terpilih
  const [loadingAntrian, setLoadingAntrian] = useState(false);
  const [antrianInfo, setAntrianInfo] = useState({
    jumlah_antrian: 0,
    daftar_kendaraan: [],
  });

  // Modal Tambah / Edit Kendaraan
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [jenisKendaraan, setJenisKendaraan] = useState("motor");
  const [merk, setMerk] = useState("");
  const [tipe, setTipe] = useState("");
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [platNomor, setPlatNomor] = useState("");
  const [warna, setWarna] = useState("");
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setTanggalBooking(`${yyyy}-${mm}-${dd}`);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resKendaraan, resLayanan] = await Promise.all([
        api.get("/kendaraan"),
        api.get("/layanan"),
      ]);

      const kData = resKendaraan.data?.data || resKendaraan.data || [];
      const lData = resLayanan.data?.data || resLayanan.data || [];

      setKendaraanList(kData);
      setLayananList(lData);

      if (kData.length > 0) {
        const stillExists = kData.some((k) => k.id === selectedKendaraanId);
        if (!stillExists) {
          setSelectedKendaraanId(kData[0].id);
        }
      } else {
        setSelectedKendaraanId(null);
      }

      if (initialSelectedLayananId) {
        setSelectedLayananIds([initialSelectedLayananId]);
      }
    } catch (err) {
      console.error("Gagal load data booking:", err);
      Alert.alert(
        "Koneksi Bermasalah",
        "Gagal memuat data kendaraan & layanan. Periksa server backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cek antrian di tanggal & jam yang diisi pelanggan
  const fetchAntrianJadwal = useCallback(async (tgl, jamText) => {
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test((tgl || "").trim());
    const mins = parseJamToMinutes(jamText);

    if (!isValidDate || mins === null) {
      setAntrianInfo({ jumlah_antrian: 0, daftar_kendaraan: [] });
      return;
    }

    const jamFormatted = formatMinutesToHHMM(mins);
    setLoadingAntrian(true);
    try {
      const res = await api.get("/booking/antrian", {
        params: { tanggal: tgl.trim(), jam: jamFormatted },
      });
      const payload = res.data?.data || {};
      setAntrianInfo({
        jumlah_antrian: Number(payload.jumlah_antrian || 0),
        daftar_kendaraan: Array.isArray(payload.daftar_kendaraan)
          ? payload.daftar_kendaraan
          : [],
      });
    } catch (err) {
      console.error("Gagal cek antrian:", err);
    } finally {
      setLoadingAntrian(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAntrianJadwal(tanggalBooking, jamBooking);
    }, 300);
    return () => clearTimeout(timer);
  }, [tanggalBooking, jamBooking, fetchAntrianJadwal]);

  const selectedKendaraan = useMemo(
    () => kendaraanList.find((k) => k.id === selectedKendaraanId) || null,
    [kendaraanList, selectedKendaraanId]
  );

  const activeJenisKendaraan = useMemo(() => {
    if (!selectedKendaraan) return null;
    return detectJenis(selectedKendaraan);
  }, [selectedKendaraan]);

  const availableLayanan = useMemo(() => {
    if (!activeJenisKendaraan) return layananList;
    return layananList.filter(
      (item) => detectJenis(item) === activeJenisKendaraan
    );
  }, [layananList, activeJenisKendaraan]);

  useEffect(() => {
    if (!activeJenisKendaraan) return;
    setSelectedLayananIds((prev) =>
      prev.filter((id) => {
        const found = layananList.find((l) => l.id === id);
        return found ? detectJenis(found) === activeJenisKendaraan : false;
      })
    );
  }, [activeJenisKendaraan, layananList]);

  useEffect(() => {
    if (!initialSelectedLayananId) return;
    const found = layananList.find((l) => l.id === initialSelectedLayananId);
    if (
      found &&
      (!activeJenisKendaraan || detectJenis(found) === activeJenisKendaraan)
    ) {
      setSelectedLayananIds((prev) =>
        prev.includes(initialSelectedLayananId)
          ? prev
          : [...prev, initialSelectedLayananId]
      );
    }
  }, [initialSelectedLayananId, activeJenisKendaraan, layananList]);

  const openAddVehicleModal = () => {
    setEditingVehicleId(null);
    setJenisKendaraan("motor");
    setMerk("");
    setTipe("");
    setTahun(String(new Date().getFullYear()));
    setPlatNomor("");
    setWarna("");
    setShowVehicleModal(true);
  };

  const openEditVehicleModal = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setJenisKendaraan(detectJenis(vehicle));
    setMerk(vehicle.merk || "");
    setTipe(vehicle.tipe || "");
    setTahun(String(vehicle.tahun || new Date().getFullYear()));
    setPlatNomor(vehicle.plat_nomor || "");
    setWarna(vehicle.warna || "");
    setShowVehicleModal(true);
  };

  const toggleLayanan = (id) => {
    if (selectedLayananIds.includes(id)) {
      setSelectedLayananIds(selectedLayananIds.filter((item) => item !== id));
    } else {
      setSelectedLayananIds([...selectedLayananIds, id]);
    }
  };

  const selectedLayananObjects = availableLayanan.filter((item) =>
    selectedLayananIds.includes(item.id)
  );

  const totalHarga = selectedLayananObjects.reduce(
    (sum, item) => sum + Number(item.harga || 0),
    0
  );

  const totalDurasi = selectedLayananObjects.reduce(
    (sum, item) => sum + Number(item.estimasi_durasi || 0),
    0
  );

  const handleSaveKendaraan = async () => {
    if (!merk.trim() || !tipe.trim() || !tahun || !platNomor.trim()) {
      Alert.alert("Perhatian", "Merek, tipe, tahun, dan plat nomor wajib diisi!");
      return;
    }

    setSavingVehicle(true);
    try {
      const payload = {
        jenis_kendaraan: jenisKendaraan,
        merk: merk.trim(),
        tipe: tipe.trim(),
        tahun: Number(tahun),
        plat_nomor: platNomor.trim().toUpperCase(),
        warna: warna.trim() || null,
      };

      const isEdit = Boolean(editingVehicleId);
      const res = isEdit
        ? await api.put(`/kendaraan/${editingVehicleId}`, payload)
        : await api.post("/kendaraan", payload);

      if (res.data?.success) {
        Alert.alert(
          "Sukses",
          isEdit
            ? `Data kendaraan (${jenisKendaraan.toUpperCase()}) berhasil diperbarui!`
            : `Kendaraan (${jenisKendaraan.toUpperCase()}) berhasil ditambahkan!`
        );
        setShowVehicleModal(false);
        setSelectedLayananIds([]);

        const resK = await api.get("/kendaraan");
        const kData = resK.data?.data || resK.data || [];
        setKendaraanList(kData);

        if (isEdit) {
          setSelectedKendaraanId(editingVehicleId);
        } else if (res.data.data?.id) {
          setSelectedKendaraanId(res.data.data.id);
        } else if (kData.length > 0) {
          setSelectedKendaraanId(kData[0].id);
        }
      }
    } catch (err) {
      Alert.alert(
        "Gagal Menyimpan Kendaraan",
        err.response?.data?.message || err.message || "Terjadi kesalahan."
      );
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedKendaraanId) {
      Alert.alert(
        "Pilih Kendaraan",
        "Silakan pilih kendaraan yang akan diservis atau tambahkan kendaraan baru."
      );
      return;
    }

    if (selectedLayananIds.length === 0) {
      Alert.alert(
        "Pilih Layanan",
        "Pilih minimal satu layanan servis yang diinginkan."
      );
      return;
    }

    if (!tanggalBooking.trim()) {
      Alert.alert("Pilih Tanggal", "Silakan masukkan tanggal servis (YYYY-MM-DD).");
      return;
    }

    const mins = parseJamToMinutes(jamBooking);
    if (mins === null) {
      Alert.alert(
        "Format Jam Tidak Valid",
        "Isi jam kedatangan dengan format HH:MM (contoh: 08:30 atau 14:00)."
      );
      return;
    }

    if (mins < MIN_MINUTES || mins > MAX_MINUTES) {
      Alert.alert(
        "Di Luar Jam Operasional",
        `Bengkel buka jam ${JAM_BUKA} - ${JAM_TUTUP}. Silakan isi jam di dalam rentang tersebut.`
      );
      return;
    }

    const formattedJam = formatMinutesToHHMM(mins);
    setJamBooking(formattedJam);

    setSubmitting(true);
    try {
      const payload = {
        kendaraan_id: Number(selectedKendaraanId),
        layanan_ids: selectedLayananIds,
        tanggal_booking: tanggalBooking.trim(),
        jam_booking: formattedJam,
        keluhan: keluhan.trim() || null,
      };

      const res = await api.post("/booking", payload);

      if (res.data?.success) {
        const kode = res.data.data?.kode_booking || "-";
        Alert.alert(
          "Booking Berhasil!",
          `Pesanan servis Anda berhasil dibuat dengan Kode: ${kode} (Jam ${formattedJam}).\n\nSilakan datang ke bengkel sesuai jadwal yang ditentukan.`,
          [
            {
              text: "Lihat Riwayat",
              onPress: () => {
                setSelectedLayananIds([]);
                setKeluhan("");
                if (onBookingSuccess) onBookingSuccess();
              },
            },
          ]
        );
      } else {
        Alert.alert("Booking Gagal", res.data?.message || "Gagal membuat booking");
      }
    } catch (err) {
      console.error("Error submit booking:", err);
      Alert.alert(
        "Booking Gagal",
        err.response?.data?.message || err.message || "Gagal menghubungi server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenMaps = async () => {
    try {
      await Linking.openURL(LOKASI_BENGKEL.mapsUrl);
    } catch {
      Alert.alert("Info Lokasi", LOKASI_BENGKEL.alamat);
    }
  };

  const jamMinutes = parseJamToMinutes(jamBooking);
  const jamValid = jamMinutes !== null;
  const diLuarJamBuka =
    jamValid && (jamMinutes < MIN_MINUTES || jamMinutes > MAX_MINUTES);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#564B5E" />
        <Text style={styles.loadingText}>Menyiapkan formulir booking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandTag}>
          <Ionicons name="construct" size={12} color="#564B5E" />
          <Text style={styles.brandTagText}>MOBICARE</Text>
        </View>
        <Text style={styles.headerTitle}>Formulir Booking Servis</Text>
        <Text style={styles.headerSubtitle}>
          Jam Operasional Bengkel: {JAM_BUKA} – {JAM_TUTUP} WIB
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* LOKASI DETAIL BENGKEL */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={19} color="#564B5E" />
            <Text style={styles.locationTitle}>Lokasi Detail Bengkel</Text>
          </View>
          <Text style={styles.locationName}>{LOKASI_BENGKEL.nama}</Text>
          <Text style={styles.locationAddress}>{LOKASI_BENGKEL.alamat}</Text>
          <Text style={styles.locationNote}>Patokan: {LOKASI_BENGKEL.patokan}</Text>
          <TouchableOpacity
            style={styles.mapsBtn}
            onPress={handleOpenMaps}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate-outline" size={15} color="#564B5E" />
            <Text style={styles.mapsBtnText}>Buka di Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* LANGKAH 1: PILIH / EDIT KENDARAAN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Pilih Kendaraan Anda</Text>
          </View>

          {kendaraanList.length === 0 ? (
            <View style={styles.emptyKendaraanBox}>
              <Ionicons name="car-outline" size={36} color="#937D7A" />
              <Text style={styles.emptyKendaraanText}>
                Anda belum mendaftarkan data kendaraan. Tambah kendaraan dulu agar
                layanan menyesuaikan jenis kendaraan Anda.
              </Text>
              <TouchableOpacity
                style={styles.addKendaraanBtn}
                onPress={openAddVehicleModal}
                activeOpacity={0.85}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FADBB2" />
                <Text style={styles.addKendaraanBtnText}>
                  + Tambah Kendaraan Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.vehicleScroll}
              >
                {kendaraanList.map((k) => {
                  const isSelected = selectedKendaraanId === k.id;
                  const kJenis = detectJenis(k);
                  return (
                    <TouchableOpacity
                      key={k.id}
                      style={[
                        styles.vehicleCard,
                        isSelected && styles.vehicleCardActive,
                      ]}
                      onPress={() => setSelectedKendaraanId(k.id)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.vehicleCardTop}>
                        <View style={styles.platBadge}>
                          <Text style={styles.platText}>{k.plat_nomor}</Text>
                        </View>
                        <View style={styles.vehicleTopRight}>
                          <TouchableOpacity
                            style={styles.editVehicleBtn}
                            onPress={() => openEditVehicleModal(k)}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name="create-outline"
                              size={13}
                              color="#564B5E"
                            />
                            <Text style={styles.editVehicleBtnText}>Edit</Text>
                          </TouchableOpacity>
                          {isSelected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#564B5E"
                            />
                          )}
                        </View>
                      </View>
                      <Text style={styles.vehicleName}>
                        {k.merk} {k.tipe}
                      </Text>
                      <Text style={styles.vehicleSub}>
                        {kJenis === "mobil" ? "Mobil" : "Motor"} • {k.tahun}{" "}
                        {k.warna ? `• ${k.warna}` : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                style={styles.secondaryAddBtn}
                onPress={openAddVehicleModal}
                activeOpacity={0.75}
              >
                <Ionicons name="add" size={16} color="#564B5E" />
                <Text style={styles.secondaryAddBtnText}>
                  Tambah Kendaraan Lain
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* LANGKAH 2: PILIH LAYANAN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Pilih Layanan Servis</Text>
              <Text style={styles.sectionSub}>
                {activeJenisKendaraan
                  ? `Khusus ${
                      activeJenisKendaraan === "mobil" ? "Mobil" : "Motor"
                    } (${selectedKendaraan?.merk} ${
                      selectedKendaraan?.tipe
                    }) • Bisa pilih lebih dari 1`
                  : "Semua layanan Motor & Mobil • Bisa pilih lebih dari 1"}
              </Text>
            </View>
          </View>

          {availableLayanan.length === 0 ? (
            <View style={styles.emptyKendaraanBox}>
              <Text style={styles.emptyKendaraanText}>
                Belum ada layanan tersedia untuk kategori{" "}
                {activeJenisKendaraan === "mobil" ? "Mobil" : "Motor"}.
              </Text>
            </View>
          ) : (
            availableLayanan.map((layanan) => {
              const isChecked = selectedLayananIds.includes(layanan.id);
              const lJenis = detectJenis(layanan);
              return (
                <TouchableOpacity
                  key={layanan.id}
                  style={[
                    styles.serviceRow,
                    isChecked && styles.serviceRowActive,
                  ]}
                  onPress={() => toggleLayanan(layanan.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxActive,
                    ]}
                  >
                    {isChecked && (
                      <Ionicons name="checkmark" size={14} color="#FADBB2" />
                    )}
                  </View>
                  <View style={styles.serviceRowDetails}>
                    <Text
                      style={[
                        styles.serviceRowName,
                        isChecked && styles.serviceRowNameActive,
                      ]}
                    >
                      {layanan.nama_layanan}
                    </Text>
                    <Text style={styles.serviceRowDur}>
                      {lJenis === "mobil" ? "Mobil" : "Motor"} • ⏱{" "}
                      {layanan.estimasi_durasi || 30} menit
                    </Text>
                  </View>
                  <Text style={styles.serviceRowPrice}>
                    {formatRupiah(layanan.harga)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* LANGKAH 3: JADWAL KEDATANGAN (INPUT JAM MANDIRI + CEK ANTRIAN) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Jadwal Kedatangan Servis</Text>
              <Text style={styles.sectionSub}>
                Buka {JAM_BUKA} – Tutup {JAM_TUTUP} • Ketik jam kedatangan sendiri
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tanggal Booking (YYYY-MM-DD)</Text>
            <View style={styles.inputFieldWrapper}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#937D7A"
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                value={tanggalBooking}
                onChangeText={setTanggalBooking}
                placeholder="2026-11-28"
                placeholderTextColor="#937D7A"
              />
            </View>
            <View style={styles.quickDateRow}>
              <TouchableOpacity
                style={styles.quickDateChip}
                onPress={() => {
                  const today = new Date();
                  const y = today.getFullYear();
                  const m = String(today.getMonth() + 1).padStart(2, "0");
                  const d = String(today.getDate()).padStart(2, "0");
                  setTanggalBooking(`${y}-${m}-${d}`);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.quickDateChipText}>Hari Ini</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickDateChip}
                onPress={() => {
                  const tmrw = new Date();
                  tmrw.setDate(tmrw.getDate() + 1);
                  const y = tmrw.getFullYear();
                  const m = String(tmrw.getMonth() + 1).padStart(2, "0");
                  const d = String(tmrw.getDate()).padStart(2, "0");
                  setTanggalBooking(`${y}-${m}-${d}`);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.quickDateChipText}>Besok</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickDateChip}
                onPress={() => {
                  const lusa = new Date();
                  lusa.setDate(lusa.getDate() + 2);
                  const y = lusa.getFullYear();
                  const m = String(lusa.getMonth() + 1).padStart(2, "0");
                  const d = String(lusa.getDate()).padStart(2, "0");
                  setTanggalBooking(`${y}-${m}-${d}`);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.quickDateChipText}>Lusa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Isi Jam Kedatangan (Format HH:MM, {JAM_BUKA} - {JAM_TUTUP})
            </Text>
            <View style={styles.inputFieldWrapper}>
              <Ionicons
                name="time-outline"
                size={18}
                color="#937D7A"
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                value={jamBooking}
                onChangeText={setJamBooking}
                placeholder="Contoh: 08:30 atau 13:15"
                placeholderTextColor="#937D7A"
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
            </View>
            {diLuarJamBuka && (
              <Text style={styles.warningText}>
                Jam di luar jam operasional bengkel ({JAM_BUKA} – {JAM_TUTUP}).
              </Text>
            )}
          </View>

          {/* Info Antrian & Kendaraan/Motor pada Jam Tersebut */}
          <View style={styles.queueBox}>
            <View style={styles.queueHeader}>
              <View style={styles.queueHeaderLeft}>
                <Ionicons name="people-outline" size={17} color="#564B5E" />
                <Text style={styles.queueTitle}>
                  Antrian di Jam {jamValid ? formatMinutesToHHMM(jamMinutes) : jamBooking || "--:--"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => fetchAntrianJadwal(tanggalBooking, jamBooking)}
                activeOpacity={0.75}
              >
                <Ionicons name="refresh" size={16} color="#564B5E" />
              </TouchableOpacity>
            </View>

            {loadingAntrian ? (
              <View style={styles.queueLoadingRow}>
                <ActivityIndicator size="small" color="#564B5E" />
                <Text style={styles.queueSubText}>Mengecek antrian...</Text>
              </View>
            ) : !jamValid ? (
              <Text style={styles.queueSubText}>
                Masukkan format jam valid (contoh: 09:00) untuk melihat antrian.
              </Text>
            ) : (
              <>
                <Text style={styles.queueCountText}>
                  Jumlah antrian aktif: {antrianInfo.jumlah_antrian} kendaraan
                </Text>

                {antrianInfo.daftar_kendaraan.length === 0 ? (
                  <Text style={styles.queueSubText}>
                    Belum ada motor/kendaraan lain yang mengisi jam ini.
                  </Text>
                ) : (
                  <View style={styles.queueVehicleList}>
                    {antrianInfo.daftar_kendaraan.map((item, idx) => (
                      <View key={item.id || idx} style={styles.queueVehicleItem}>
                        <Text style={styles.queueVehicleMain}>
                          {idx + 1}. {item.merk} {item.tipe} ({item.plat_nomor})
                        </Text>
                        <Text style={styles.queueVehicleStatus}>
                          {item.status}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* LANGKAH 4: KELUHAN / CATATAN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Keluhan / Catatan Kendaraan</Text>
          </View>

          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Tuliskan keluhan atau gejala kendala pada kendaraan Anda..."
            placeholderTextColor="#937D7A"
            value={keluhan}
            onChangeText={setKeluhan}
          />
        </View>

        {/* RINGKASAN & SUBMIT */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Booking</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kendaraan:</Text>
            <Text style={styles.summaryValue}>
              {selectedKendaraan
                ? `${selectedKendaraan.merk} ${selectedKendaraan.tipe} (${
                    activeJenisKendaraan === "mobil" ? "Mobil" : "Motor"
                  })`
                : "-"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Jadwal Kedatangan:</Text>
            <Text style={styles.summaryValue}>
              {tanggalBooking || "-"} •{" "}
              {jamValid ? formatMinutesToHHMM(jamMinutes) : jamBooking || "-"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Layanan Dipilih:</Text>
            <Text style={styles.summaryValue}>
              {selectedLayananObjects.length} Layanan
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimasi Durasi Kerja:</Text>
            <Text style={styles.summaryValue}>~{totalDurasi} Menit</Text>
          </View>

          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total Estimasi Biaya:</Text>
            <Text style={styles.summaryTotalValue}>
              {formatRupiah(totalHarga)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitBooking}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#564B5E" />
            ) : (
              <>
                <Ionicons name="paper-plane" size={18} color="#564B5E" />
                <Text style={styles.submitButtonText}>
                  Kirim Booking Sekarang
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL TAMBAH / EDIT KENDARAAN */}
      <Modal
        visible={showVehicleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="car" size={24} color="#564B5E" />
              <Text style={styles.modalTitle}>
                {editingVehicleId ? "Edit Data Kendaraan" : "Tambah Kendaraan Baru"}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Jenis Kendaraan *</Text>
                <View style={styles.jenisRow}>
                  <TouchableOpacity
                    style={[
                      styles.jenisBtn,
                      jenisKendaraan === "motor" && styles.jenisBtnActive,
                    ]}
                    onPress={() => setJenisKendaraan("motor")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.jenisBtnText,
                        jenisKendaraan === "motor" && styles.jenisBtnTextActive,
                      ]}
                    >
                      Motor
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.jenisBtn,
                      jenisKendaraan === "mobil" && styles.jenisBtnActive,
                    ]}
                    onPress={() => setJenisKendaraan("mobil")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.jenisBtnText,
                        jenisKendaraan === "mobil" && styles.jenisBtnTextActive,
                      ]}
                    >
                      Mobil
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Nomor Polisi (Plat) *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="B 1234 XYZ"
                  placeholderTextColor="#937D7A"
                  value={platNomor}
                  onChangeText={setPlatNomor}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Merek Kendaraan *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Contoh: Honda / Toyota / Yamaha"
                  placeholderTextColor="#937D7A"
                  value={merk}
                  onChangeText={setMerk}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Tipe / Model *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Contoh: Vario 160 / Avanza Veloz"
                  placeholderTextColor="#937D7A"
                  value={tipe}
                  onChangeText={setTipe}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Tahun Pembuatan *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="2022"
                  placeholderTextColor="#937D7A"
                  value={tahun}
                  onChangeText={setTahun}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>
                  Warna Kendaraan (Opsional)
                </Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Hitam Metalik / Putih"
                  placeholderTextColor="#937D7A"
                  value={warna}
                  onChangeText={setWarna}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowVehicleModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveKendaraan}
                disabled={savingVehicle}
                activeOpacity={0.85}
              >
                {savingVehicle ? (
                  <ActivityIndicator color="#FADBB2" size="small" />
                ) : (
                  <Text style={styles.modalSaveBtnText}>
                    {editingVehicleId ? "Simpan Perubahan" : "Simpan Kendaraan"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5EFEA" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#C6B2AE",
  },
  brandTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "#FADBB2",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    marginBottom: 6,
  },
  brandTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#564B5E",
    letterSpacing: 0.8,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#564B5E" },
  headerSubtitle: { fontSize: 12, color: "#937D7A", marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 36 },
  locationCard: {
    backgroundColor: "#FADBB2",
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  locationTitle: { fontSize: 14, fontWeight: "800", color: "#564B5E" },
  locationName: { fontSize: 13, fontWeight: "700", color: "#564B5E" },
  locationAddress: { fontSize: 12, color: "#564B5E", marginTop: 2, lineHeight: 17 },
  locationNote: { fontSize: 11, color: "#937D7A", marginTop: 4, fontWeight: "500" },
  mapsBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#937D7A",
  },
  mapsBtnText: { fontSize: 12, fontWeight: "700", color: "#564B5E" },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#564B5E",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: "#FADBB2", fontWeight: "800", fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#564B5E" },
  sectionSub: { fontSize: 11, color: "#937D7A", marginTop: 1 },
  vehicleScroll: { gap: 12, paddingVertical: 4 },
  vehicleCard: {
    width: 188,
    borderWidth: 1.5,
    borderColor: "#C6B2AE",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#FAF6F2",
  },
  vehicleCardActive: {
    borderColor: "#564B5E",
    backgroundColor: "#FADBB2",
  },
  vehicleCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vehicleTopRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  editVehicleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#937D7A",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  editVehicleBtnText: { fontSize: 10, fontWeight: "700", color: "#564B5E" },
  platBadge: {
    backgroundColor: "#564B5E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platText: {
    color: "#FADBB2",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  vehicleName: { fontSize: 13, fontWeight: "700", color: "#564B5E" },
  vehicleSub: { fontSize: 11, color: "#937D7A", marginTop: 2 },
  emptyKendaraanBox: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FAF6F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    borderStyle: "dashed",
  },
  emptyKendaraanText: {
    fontSize: 13,
    color: "#937D7A",
    marginVertical: 8,
    textAlign: "center",
    lineHeight: 18,
  },
  addKendaraanBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#564B5E",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  addKendaraanBtnText: { color: "#FADBB2", fontSize: 13, fontWeight: "700" },
  secondaryAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    gap: 4,
    backgroundColor: "#FAF6F2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  secondaryAddBtnText: { color: "#564B5E", fontSize: 12, fontWeight: "700" },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE6DE",
    borderRadius: 10,
  },
  serviceRowActive: { backgroundColor: "#FAF6F2" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#937D7A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: { backgroundColor: "#564B5E", borderColor: "#564B5E" },
  serviceRowDetails: { flex: 1 },
  serviceRowName: { fontSize: 14, color: "#564B5E", fontWeight: "600" },
  serviceRowNameActive: { fontWeight: "800", color: "#564B5E" },
  serviceRowDur: { fontSize: 11, color: "#937D7A", marginTop: 2 },
  serviceRowPrice: { fontSize: 13, fontWeight: "800", color: "#564B5E" },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#564B5E",
    marginBottom: 6,
  },
  inputFieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    borderRadius: 12,
    backgroundColor: "#FAF6F2",
    paddingHorizontal: 12,
    height: 44,
  },
  fieldIcon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 13, color: "#564B5E", fontWeight: "500" },
  warningText: {
    fontSize: 11,
    color: "#937D7A",
    fontWeight: "700",
    marginTop: 5,
  },
  quickDateRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  quickDateChip: {
    backgroundColor: "#FADBB2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  quickDateChipText: { fontSize: 11, color: "#564B5E", fontWeight: "700" },
  queueBox: {
    backgroundColor: "#FAF6F2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    borderRadius: 12,
    padding: 12,
  },
  queueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  queueHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  queueTitle: { fontSize: 13, fontWeight: "800", color: "#564B5E" },
  queueLoadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  queueCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#564B5E",
    marginBottom: 6,
  },
  queueSubText: { fontSize: 12, color: "#937D7A" },
  queueVehicleList: { gap: 6, marginTop: 2 },
  queueVehicleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  queueVehicleMain: { fontSize: 12, color: "#564B5E", fontWeight: "600" },
  queueVehicleStatus: {
    fontSize: 11,
    fontWeight: "700",
    color: "#937D7A",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#C6B2AE",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FAF6F2",
    fontSize: 13,
    color: "#564B5E",
    textAlignVertical: "top",
    minHeight: 84,
  },
  summaryCard: {
    backgroundColor: "#564B5E",
    borderRadius: 18,
    padding: 18,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#937D7A",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FADBB2",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 13, color: "#C6B2AE" },
  summaryValue: { fontSize: 13, color: "#FFFFFF", fontWeight: "600" },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#937D7A",
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  summaryTotalLabel: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },
  summaryTotalValue: { fontSize: 18, fontWeight: "800", color: "#FADBB2" },
  submitButton: {
    backgroundColor: "#FADBB2",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: { backgroundColor: "#937D7A" },
  submitButtonText: { color: "#564B5E", fontSize: 15, fontWeight: "800" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5EFEA",
  },
  loadingText: { marginTop: 10, fontSize: 13, color: "#937D7A", fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(86, 75, 94, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#564B5E" },
  jenisRow: { flexDirection: "row", gap: 10 },
  jenisBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    alignItems: "center",
    backgroundColor: "#FAF6F2",
  },
  jenisBtnActive: { backgroundColor: "#564B5E", borderColor: "#564B5E" },
  jenisBtnText: { fontSize: 13, fontWeight: "700", color: "#564B5E" },
  jenisBtnTextActive: { color: "#FADBB2" },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#564B5E",
    marginBottom: 5,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: "#C6B2AE",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    backgroundColor: "#FAF6F2",
    color: "#564B5E",
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    backgroundColor: "#FAF6F2",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  modalCancelBtnText: { color: "#564B5E", fontWeight: "700" },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: "#564B5E",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  modalSaveBtnText: { color: "#FADBB2", fontWeight: "800" },
});