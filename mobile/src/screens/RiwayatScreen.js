
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
//   Modal,
//   ScrollView,
//   Alert,
//   Platform,
//   Linking,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as WebBrowser from "expo-web-browser";
// import api, { formatRupiah } from "../api/api";

// const STATUS_FILTERS = ["Semua", "Menunggu", "Diproses", "Selesai"];
// const JAM_TUTUP_MENIT = 19 * 60; // 19:00

// const getJakartaDateTimeParts = (date = new Date()) => {
//   const formatter = new Intl.DateTimeFormat("en-CA", {
//     timeZone: "Asia/Jakarta",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
//   const parts = formatter.formatToParts(date);
//   const map = {};
//   for (const p of parts) {
//     if (p.type !== "literal") map[p.type] = p.value;
//   }
//   return {
//     todayStr: `${map.year}-${map.month}-${map.day}`,
//     currentMinutes: Number(map.hour) * 60 + Number(map.minute),
//   };
// };

// const isBookingExpired = (item) => {
//   if (!item?.tanggal_booking) return false;
//   const pStatus = String(item.status_pembayaran || "belum_bayar").toLowerCase();
//   if (pStatus === "lunas") return false;

//   const bookingDateStr = String(item.tanggal_booking).slice(0, 10);
//   const { todayStr, currentMinutes } = getJakartaDateTimeParts(new Date());

//   if (todayStr > bookingDateStr) return true;
//   if (todayStr === bookingDateStr && currentMinutes > JAM_TUTUP_MENIT) return true;
//   return false;
// };

// export default function RiwayatScreen({
//   onNavigateToBooking,
//   isActiveTab,
//   refreshKey,
// }) {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("Semua");

//   // Modal Detail
//   const [detailModalVisible, setDetailModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   // Modal Pilih Metode Pembayaran (Cash / Midtrans TF)
//   const [payModalVisible, setPayModalVisible] = useState(false);
//   const [bookingToPay, setBookingToPay] = useState(null);
//   const [payingLoading, setPayingLoading] = useState(false);

//   const fetchBookings = useCallback(async (showSpinner = false) => {
//     try {
//       if (showSpinner) setLoading(true);
//       const res = await api.get("/booking");
//       const list = res.data?.success ? res.data.data || [] : res.data || [];
//       setBookings(Array.isArray(list) ? list : []);

//       setSelectedBooking((prev) => {
//         if (!prev) return null;
//         const updated = (Array.isArray(list) ? list : []).find(
//           (b) => b.id === prev.id
//         );
//         return updated || prev;
//       });
//     } catch (err) {
//       console.error("Gagal load riwayat:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBookings(true);
//   }, [fetchBookings]);

//   useEffect(() => {
//     if (isActiveTab) {
//       fetchBookings(false);
//     }
//   }, [isActiveTab, refreshKey, fetchBookings]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchBookings(false);
//   };

//   const openPaymentModal = (booking) => {
//     if (payingLoading) return;
//     if (isBookingExpired(booking)) {
//       Alert.alert(
//         "Pembayaran Kedaluwarsa",
//         "Batas pembayaran hanya berlaku sampai bengkel tutup (19:00) pada hari jadwal booking. Silakan buat booking ulang."
//       );
//       return;
//     }
//     setBookingToPay(booking);
//     setPayModalVisible(true);
//   };

//   const handleSelectCash = async () => {
//     if (!bookingToPay || payingLoading) return;
//     setPayingLoading(true);
//     try {
//       const res = await api.post("/pembayaran/bayar", {
//         booking_id: bookingToPay.id,
//         metode: "cash",
//       });
//       if (res.data?.success) {
//         setPayModalVisible(false);
//         Alert.alert(
//           "Pembayaran Cash Dipilih",
//           "Silakan lakukan pembayaran di bengkel untuk dikonfirmasi oleh admin."
//         );
//         await fetchBookings(false);
//       } else {
//         Alert.alert("Gagal", res.data?.message || "Gagal memilih Cash");
//       }
//     } catch (err) {
//       Alert.alert(
//         "Gagal",
//         err.response?.data?.message || err.message || "Terjadi kesalahan"
//       );
//     } finally {
//       setPayingLoading(false);
//     }
//   };

//   const handleSelectMidtrans = async () => {
//     if (!bookingToPay || payingLoading) return;
//     setPayingLoading(true);
//     try {
//       const res = await api.post("/pembayaran/bayar", {
//         booking_id: bookingToPay.id,
//         metode: "midtrans",
//       });

//       const redirectUrl = res.data?.data?.redirect_url;
//       if (res.data?.success && redirectUrl) {
//         setPayModalVisible(false);

//         if (Platform.OS === "web" && typeof window !== "undefined") {
//           const opened = window.open(redirectUrl, "_blank");
//           if (!opened) {
//             window.location.href = redirectUrl;
//           }
//         } else {
//           try {
//             await WebBrowser.openBrowserAsync(redirectUrl);
//           } catch {
//             await Linking.openURL(redirectUrl);
//           }
//         }

//         await fetchBookings(false);
//       } else {
//         Alert.alert(
//           "Gagal",
//           res.data?.message || "Gagal membuat transaksi Midtrans"
//         );
//       }
//     } catch (err) {
//       Alert.alert(
//         "Gagal Midtrans",
//         err.response?.data?.message ||
//           err.message ||
//           "Gagal menghubungi server pembayaran"
//       );
//     } finally {
//       setPayingLoading(false);
//     }
//   };

//   const filteredBookings = bookings.filter((item) => {
//     if (selectedFilter === "Semua") return true;
//     return (item.status || "").toLowerCase() === selectedFilter.toLowerCase();
//   });

//   const getStatusBadgeStyle = (status) => {
//     const s = (status || "").toLowerCase();
//     if (s === "selesai") {
//       return {
//         bg: "#DCFCE7",
//         text: "#15803D",
//         icon: "checkmark-circle",
//         label: "Selesai",
//       };
//     }
//     if (s === "diproses") {
//       return {
//         bg: "#DBEAFE",
//         text: "#1D4ED8",
//         icon: "time",
//         label: "Diproses",
//       };
//     }
//     return {
//       bg: "#FEF3C7",
//       text: "#B45309",
//       icon: "hourglass-outline",
//       label: "Menunggu",
//     };
//   };

//   const getPayBadge = (item) => {
//     const pStatus = (item.status_pembayaran || "belum_bayar").toLowerCase();
//     const metode = (item.metode_pembayaran || "").toUpperCase();

//     if (pStatus === "lunas") {
//       return {
//         bg: "#DCFCE7",
//         color: "#15803D",
//         text: `LUNAS${metode ? ` (${metode})` : ""}`,
//         hint: "Pembayaran sudah dikonfirmasi LUNAS oleh admin",
//       };
//     }

//     if (isBookingExpired(item) || pStatus === "kadaluarsa") {
//       return {
//         bg: "#FEE2E2",
//         color: "#B91C1C",
//         text: "KEDALUWARSA",
//         hint: "Batas bayar sampai jam 19:00 di hari booking telah lewat. Silakan buat booking ulang.",
//       };
//     }

//     if (pStatus === "pending") {
//       return {
//         bg: "#FEF3C7",
//         color: "#B45309",
//         text: `MENUNGGU KONFIRMASI${metode ? ` (${metode})` : ""}`,
//         hint: "Selesaikan pembayaran sebelum jam 19:00 hari ini lalu tunggu konfirmasi admin",
//       };
//     }

//     if (pStatus === "gagal") {
//       return {
//         bg: "#FEE2E2",
//         color: "#B91C1C",
//         text: `GAGAL${metode ? ` (${metode})` : ""}`,
//         hint: "Transaksi gagal. Silakan klik Bayar untuk membuat transaksi baru.",
//       };
//     }

//     return {
//       bg: "#FEE2E2",
//       color: "#B91C1C",
//       text: "BELUM BAYAR",
//       hint: "Wajib dibayar pada hari booking sampai jam 19:00 (TF Midtrans / Cash)",
//     };
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     try {
//       const d = new Date(dateStr);
//       return d.toLocaleDateString("id-ID", {
//         weekday: "short",
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       });
//     } catch {
//       return dateStr;
//     }
//   };

//   const renderItem = ({ item }) => {
//     const badge = getStatusBadgeStyle(item.status);
//     const payBadge = getPayBadge(item);
//     const layananList = item.layanan || item.layanan_list || [];
//     const isLunas = (item.status_pembayaran || "").toLowerCase() === "lunas";
//     const expired = isBookingExpired(item);

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         activeOpacity={0.85}
//         onPress={() => {
//           setSelectedBooking(item);
//           setDetailModalVisible(true);
//         }}
//       >
//         <View style={styles.cardTop}>
//           <View>
//             <Text style={styles.kodeBooking}>
//               {item.kode_booking || `#${item.id}`}
//             </Text>
//             <Text style={styles.tglJamText}>
//               {formatDate(item.tanggal_booking)} • {item.jam_booking || "-"}
//             </Text>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
//             <Ionicons name={badge.icon} size={13} color={badge.text} />
//             <Text style={[styles.statusText, { color: badge.text }]}>
//               {badge.label}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.payStatusBlock}>
//           <View style={[styles.payPill, { backgroundColor: payBadge.bg }]}>
//             <Ionicons
//               name={
//                 isLunas
//                   ? "checkmark-done"
//                   : expired
//                   ? "alert-circle-outline"
//                   : "time-outline"
//               }
//               size={14}
//               color={payBadge.color}
//             />
//             <Text style={[styles.payPillText, { color: payBadge.color }]}>
//               {payBadge.text}
//             </Text>
//           </View>
//           <Text style={styles.payHintText}>{payBadge.hint}</Text>
//         </View>

//         <View style={styles.cardMid}>
//           <View style={styles.vehicleRow}>
//             <View style={styles.platBadge}>
//               <Text style={styles.platText}>{item.plat_nomor || "-"}</Text>
//             </View>
//             <Text style={styles.vehicleDesc}>
//               {item.merk} {item.tipe} {item.tahun ? `(${item.tahun})` : ""}
//             </Text>
//           </View>

//           {layananList.length > 0 && (
//             <View style={styles.layananPreview}>
//               <Ionicons name="construct-outline" size={14} color="#6B7280" />
//               <Text style={styles.layananPreviewText} numberOfLines={1}>
//                 {layananList.map((l) => l.nama_layanan || l).join(", ")}
//               </Text>
//             </View>
//           )}

//           {item.keluhan ? (
//             <Text style={styles.keluhanPreview} numberOfLines={1}>
//               <Text style={styles.keluhanLabel}>Keluhan: </Text>
//               {item.keluhan}
//             </Text>
//           ) : null}
//         </View>

//         <View style={styles.cardBottom}>
//           <View>
//             <Text style={styles.totalLabel}>Total Biaya</Text>
//             <Text style={styles.totalValue}>
//               {formatRupiah(item.total_harga || 0)}
//             </Text>
//           </View>

//           <View style={styles.bottomActions}>
//             {!isLunas && !expired && (
//               <TouchableOpacity
//                 style={styles.payNowBtn}
//                 onPress={() => openPaymentModal(item)}
//               >
//                 <Ionicons name="wallet-outline" size={14} color="#FFFFFF" />
//                 <Text style={styles.payNowBtnText}>Bayar</Text>
//               </TouchableOpacity>
//             )}
//             {!isLunas && expired && onNavigateToBooking && (
//               <TouchableOpacity
//                 style={styles.rebookBtn}
//                 onPress={() => onNavigateToBooking()}
//               >
//                 <Ionicons name="refresh" size={14} color="#B91C1C" />
//                 <Text style={styles.rebookBtnText}>Booking Ulang</Text>
//               </TouchableOpacity>
//             )}
//             <View style={styles.detailLink}>
//               <Text style={styles.detailLinkText}>Detail</Text>
//               <Ionicons name="chevron-forward" size={14} color="#2563EB" />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Riwayat Servis Saya</Text>
//         <Text style={styles.headerSubtitle}>
//           Pembayaran berlaku di hari booking sampai bengkel tutup (19:00)
//         </Text>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterScroll}
//         >
//           {STATUS_FILTERS.map((f) => {
//             const isActive = selectedFilter === f;
//             return (
//               <TouchableOpacity
//                 key={f}
//                 style={[styles.filterChip, isActive && styles.filterChipActive]}
//                 onPress={() => setSelectedFilter(f)}
//               >
//                 <Text
//                   style={[
//                     styles.filterChipText,
//                     isActive && styles.filterChipTextActive,
//                   ]}
//                 >
//                   {f}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>

//       {loading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#2563EB" />
//           <Text style={styles.loadingText}>Memuat riwayat booking...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredBookings}
//           keyExtractor={(item) => String(item.id)}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Ionicons name="calendar-outline" size={54} color="#9CA3AF" />
//               <Text style={styles.emptyTitle}>Belum Ada Booking</Text>
//               <Text style={styles.emptySubtitle}>
//                 {selectedFilter !== "Semua"
//                   ? `Tidak ada transaksi servis dengan status "${selectedFilter}".`
//                   : "Anda belum pernah memesan booking servis."}
//               </Text>
//               <TouchableOpacity
//                 style={styles.newBookingBtn}
//                 onPress={() => onNavigateToBooking && onNavigateToBooking()}
//               >
//                 <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
//                 <Text style={styles.newBookingBtnText}>Pesan Servis Sekarang</Text>
//               </TouchableOpacity>
//             </View>
//           }
//         />
//       )}

//       {/* MODAL PILIH METODE PEMBAYARAN (TF MIDTRANS / CASH) */}
//       <Modal
//         visible={payModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => !payingLoading && setPayModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalTop}>
//               <View>
//                 <Text style={styles.modalKode}>Pilih Metode Pembayaran</Text>
//                 <Text style={styles.modalSubKode}>
//                   {bookingToPay?.kode_booking} •{" "}
//                   {formatRupiah(bookingToPay?.total_harga || 0)}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 onPress={() => !payingLoading && setPayModalVisible(false)}
//                 style={styles.modalCloseIcon}
//               >
//                 <Ionicons name="close" size={22} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             {payingLoading ? (
//               <View style={{ paddingVertical: 24, alignItems: "center" }}>
//                 <ActivityIndicator size="large" color="#2563EB" />
//                 <Text style={styles.loadingText}>Memproses pembayaran...</Text>
//               </View>
//             ) : (
//               <View style={{ gap: 12 }}>
//                 <TouchableOpacity
//                   style={styles.methodCard}
//                   onPress={handleSelectMidtrans}
//                   disabled={payingLoading}
//                 >
//                   <View style={styles.methodIconBlue}>
//                     <Ionicons name="card" size={22} color="#2563EB" />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.methodTitle}>
//                       Transfer / Midtrans (TF)
//                     </Text>
//                     <Text style={styles.methodDesc}>
//                       Buka halaman pembayaran Midtrans untuk selesaikan transaksi.
//                     </Text>
//                   </View>
//                   <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.methodCard}
//                   onPress={handleSelectCash}
//                   disabled={payingLoading}
//                 >
//                   <View style={styles.methodIconGreen}>
//                     <Ionicons name="cash" size={22} color="#059669" />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.methodTitle}>Cash (Bayar di Bengkel)</Text>
//                     <Text style={styles.methodDesc}>
//                       Bayar tunai di kasir bengkel saat servis.
//                     </Text>
//                   </View>
//                   <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* MODAL DETAIL BOOKING */}
//       <Modal
//         visible={detailModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setDetailModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {selectedBooking && (
//               <>
//                 <View style={styles.modalTop}>
//                   <View>
//                     <Text style={styles.modalKode}>
//                       {selectedBooking.kode_booking}
//                     </Text>
//                     <Text style={styles.modalSubKode}>
//                       Detail Pemesanan Servis
//                     </Text>
//                   </View>
//                   <TouchableOpacity
//                     onPress={() => setDetailModalVisible(false)}
//                     style={styles.modalCloseIcon}
//                   >
//                     <Ionicons name="close" size={22} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <ScrollView style={styles.modalBody}>
//                   {(() => {
//                     const badge = getStatusBadgeStyle(selectedBooking.status);
//                     const payBadge = getPayBadge(selectedBooking);
//                     return (
//                       <View
//                         style={[
//                           styles.modalStatusBanner,
//                           { backgroundColor: badge.bg },
//                         ]}
//                       >
//                         <Ionicons
//                           name={badge.icon}
//                           size={20}
//                           color={badge.text}
//                         />
//                         <View style={{ flex: 1 }}>
//                           <Text
//                             style={[
//                               styles.modalStatusTitle,
//                               { color: badge.text },
//                             ]}
//                           >
//                             Status: {badge.label} • Bayar: {payBadge.text}
//                           </Text>
//                           <Text style={styles.modalStatusHint}>
//                             {payBadge.hint}
//                           </Text>
//                         </View>
//                       </View>
//                     );
//                   })()}

//                   <View style={styles.infoCard}>
//                     <Text style={styles.infoCardTitle}>Data Kendaraan</Text>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>Plat Nomor</Text>
//                       <View style={styles.platBadgeSm}>
//                         <Text style={styles.platTextSm}>
//                           {selectedBooking.plat_nomor}
//                         </Text>
//                       </View>
//                     </View>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>Kendaraan</Text>
//                       <Text style={styles.infoValue}>
//                         {selectedBooking.merk} {selectedBooking.tipe}{" "}
//                         {selectedBooking.tahun ? `(${selectedBooking.tahun})` : ""}
//                       </Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>Jadwal Kedatangan</Text>
//                       <Text style={styles.infoValue}>
//                         {formatDate(selectedBooking.tanggal_booking)} • Jam{" "}
//                         {selectedBooking.jam_booking}
//                       </Text>
//                     </View>
//                   </View>

//                   {selectedBooking.keluhan && (
//                     <View style={styles.infoCard}>
//                       <Text style={styles.infoCardTitle}>
//                         Keluhan / Catatan Kendaraan
//                       </Text>
//                       <Text style={styles.keluhanTextFull}>
//                         {selectedBooking.keluhan}
//                       </Text>
//                     </View>
//                   )}

//                   <View style={styles.infoCard}>
//                     <Text style={styles.infoCardTitle}>Layanan Dipesan</Text>
//                     <Text style={styles.keluhanTextFull}>
//                       {selectedBooking.nama_layanan || "-"}
//                     </Text>
//                     <View style={styles.serviceTotalRow}>
//                       <Text style={styles.serviceTotalLabel}>Total Biaya</Text>
//                       <Text style={styles.serviceTotalValue}>
//                         {formatRupiah(selectedBooking.total_harga || 0)}
//                       </Text>
//                     </View>
//                   </View>
//                 </ScrollView>

//                 {(selectedBooking.status_pembayaran || "").toLowerCase() !==
//                   "lunas" &&
//                   !isBookingExpired(selectedBooking) && (
//                     <TouchableOpacity
//                       style={styles.modalPayBtn}
//                       onPress={() => {
//                         setDetailModalVisible(false);
//                         openPaymentModal(selectedBooking);
//                       }}
//                     >
//                       <Text style={styles.modalPayBtnText}>
//                         Bayar Sekarang (
//                         {formatRupiah(selectedBooking.total_harga || 0)})
//                       </Text>
//                     </TouchableOpacity>
//                   )}

//                 {(selectedBooking.status_pembayaran || "").toLowerCase() !==
//                   "lunas" &&
//                   isBookingExpired(selectedBooking) &&
//                   onNavigateToBooking && (
//                     <TouchableOpacity
//                       style={styles.modalPayBtn}
//                       onPress={() => {
//                         setDetailModalVisible(false);
//                         onNavigateToBooking();
//                       }}
//                     >
//                       <Text style={styles.modalPayBtnText}>
//                         Buat Booking Ulang
//                       </Text>
//                     </TouchableOpacity>
//                   )}

//                 <TouchableOpacity
//                   style={styles.modalCloseBtn}
//                   onPress={() => setDetailModalVisible(false)}
//                 >
//                   <Text style={styles.modalCloseBtnText}>Tutup</Text>
//                 </TouchableOpacity>
//               </>
//             )}
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
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
//   headerSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//     marginBottom: 12,
//   },
//   filterScroll: { gap: 8, paddingBottom: 4 },
//   filterChip: {
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: "#F3F4F6",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   filterChipActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
//   filterChipText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },
//   filterChipTextActive: { color: "#FFFFFF" },
//   listContent: { padding: 16, paddingBottom: 28 },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   cardTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   kodeBooking: { fontSize: 15, fontWeight: "bold", color: "#1F2937" },
//   tglJamText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   statusText: { fontSize: 11, fontWeight: "bold" },
//   payStatusBlock: {
//     marginBottom: 10,
//     gap: 3,
//   },
//   payPill: {
//     flexDirection: "row",
//     alignSelf: "flex-start",
//     alignItems: "center",
//     gap: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   payPillText: { fontSize: 11, fontWeight: "700" },
//   payHintText: { fontSize: 11, color: "#6B7280", marginLeft: 2 },
//   cardMid: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 12,
//   },
//   vehicleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 6,
//   },
//   platBadge: {
//     backgroundColor: "#1F2937",
//     paddingHorizontal: 7,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   platText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 11 },
//   vehicleDesc: { fontSize: 13, color: "#374151", fontWeight: "500" },
//   layananPreview: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 4,
//   },
//   layananPreviewText: { fontSize: 12, color: "#4B5563", flex: 1 },
//   keluhanPreview: { fontSize: 12, color: "#6B7280", marginTop: 4 },
//   keluhanLabel: { fontWeight: "bold", color: "#4B5563" },
//   cardBottom: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//     paddingTop: 10,
//   },
//   totalLabel: { fontSize: 11, color: "#6B7280", textTransform: "uppercase" },
//   totalValue: { fontSize: 15, fontWeight: "bold", color: "#2563EB" },
//   bottomActions: { flexDirection: "row", alignItems: "center", gap: 10 },
//   payNowBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//     borderRadius: 8,
//   },
//   payNowBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
//   rebookBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#FECACA",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   rebookBtnText: { color: "#B91C1C", fontSize: 11, fontWeight: "700" },
//   detailLink: { flexDirection: "row", alignItems: "center", gap: 2 },
//   detailLinkText: { fontSize: 12, fontWeight: "600", color: "#2563EB" },
//   centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   loadingText: { marginTop: 10, fontSize: 13, color: "#6B7280" },
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 60,
//   },
//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#374151",
//     marginTop: 12,
//   },
//   emptySubtitle: {
//     fontSize: 13,
//     color: "#9CA3AF",
//     marginTop: 4,
//     marginBottom: 16,
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   newBookingBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//     gap: 6,
//   },
//   newBookingBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
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
//   modalTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 14,
//   },
//   modalKode: { fontSize: 18, fontWeight: "bold", color: "#111827" },
//   modalSubKode: { fontSize: 12, color: "#6B7280" },
//   modalCloseIcon: { padding: 4 },
//   modalBody: { marginBottom: 12 },
//   modalStatusBanner: {
//     flexDirection: "row",
//     padding: 12,
//     borderRadius: 10,
//     gap: 10,
//     marginBottom: 14,
//     alignItems: "flex-start",
//   },
//   modalStatusTitle: { fontSize: 13, fontWeight: "bold" },
//   modalStatusHint: { fontSize: 11, color: "#4B5563", marginTop: 2 },
//   infoCard: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   infoCardTitle: {
//     fontSize: 13,
//     fontWeight: "bold",
//     color: "#1F2937",
//     marginBottom: 8,
//   },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   infoLabel: { fontSize: 12, color: "#6B7280" },
//   infoValue: { fontSize: 12, fontWeight: "600", color: "#111827" },
//   platBadgeSm: {
//     backgroundColor: "#1F2937",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   platTextSm: { color: "#FFFFFF", fontWeight: "bold", fontSize: 11 },
//   keluhanTextFull: { fontSize: 12, color: "#374151", lineHeight: 18 },
//   serviceTotalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 8,
//     marginTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },
//   serviceTotalLabel: { fontSize: 13, fontWeight: "bold", color: "#1F2937" },
//   serviceTotalValue: { fontSize: 15, fontWeight: "bold", color: "#2563EB" },
//   methodCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     padding: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     backgroundColor: "#F9FAFB",
//   },
//   methodIconBlue: {
//     width: 42,
//     height: 42,
//     borderRadius: 10,
//     backgroundColor: "#EFF6FF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   methodIconGreen: {
//     width: 42,
//     height: 42,
//     borderRadius: 10,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   methodTitle: { fontSize: 14, fontWeight: "bold", color: "#111827" },
//   methodDesc: { fontSize: 11, color: "#6B7280", marginTop: 2 },
//   modalPayBtn: {
//     backgroundColor: "#2563EB",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   modalPayBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
//   modalCloseBtn: {
//     backgroundColor: "#F3F4F6",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   modalCloseBtnText: { color: "#374151", fontWeight: "bold", fontSize: 13 },
// });

import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import api, { formatRupiah } from "../api/api";

const STATUS_FILTERS = ["Semua", "Menunggu", "Diproses", "Selesai"];
const JAM_TUTUP_MENIT = 19 * 60; // 19:00

const getJakartaDateTimeParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const map = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return {
    todayStr: `${map.year}-${map.month}-${map.day}`,
    currentMinutes: Number(map.hour) * 60 + Number(map.minute),
  };
};

const isBookingExpired = (item) => {
  if (!item?.tanggal_booking) return false;
  const pStatus = String(item.status_pembayaran || "belum_bayar").toLowerCase();
  if (pStatus === "lunas") return false;

  const bookingDateStr = String(item.tanggal_booking).slice(0, 10);
  const { todayStr, currentMinutes } = getJakartaDateTimeParts(new Date());

  if (todayStr > bookingDateStr) return true;
  if (todayStr === bookingDateStr && currentMinutes > JAM_TUTUP_MENIT) return true;
  return false;
};

export default function RiwayatScreen({
  onNavigateToBooking,
  isActiveTab,
  refreshKey,
}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  // Modal Detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Modal Pilih Metode Pembayaran (Cash / Midtrans TF)
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [bookingToPay, setBookingToPay] = useState(null);
  const [payingLoading, setPayingLoading] = useState(false);

  const fetchBookings = useCallback(async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      const res = await api.get("/booking");
      const list = res.data?.success ? res.data.data || [] : res.data || [];
      setBookings(Array.isArray(list) ? list : []);

      setSelectedBooking((prev) => {
        if (!prev) return null;
        const updated = (Array.isArray(list) ? list : []).find(
          (b) => b.id === prev.id
        );
        return updated || prev;
      });
    } catch (err) {
      console.error("Gagal load riwayat:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  useEffect(() => {
    if (isActiveTab) {
      fetchBookings(false);
    }
  }, [isActiveTab, refreshKey, fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(false);
  };

  const openPaymentModal = (booking) => {
    if (payingLoading) return;
    if (isBookingExpired(booking)) {
      Alert.alert(
        "Pembayaran Kedaluwarsa",
        "Batas pembayaran hanya berlaku sampai bengkel tutup (19:00) pada hari jadwal booking. Silakan buat booking ulang."
      );
      return;
    }
    setBookingToPay(booking);
    setPayModalVisible(true);
  };

  const handleSelectCash = async () => {
    if (!bookingToPay || payingLoading) return;
    setPayingLoading(true);
    try {
      const res = await api.post("/pembayaran/bayar", {
        booking_id: bookingToPay.id,
        metode: "cash",
      });
      if (res.data?.success) {
        setPayModalVisible(false);
        Alert.alert(
          "Pembayaran Cash Dipilih",
          "Silakan lakukan pembayaran di bengkel untuk dikonfirmasi oleh admin."
        );
        await fetchBookings(false);
      } else {
        Alert.alert("Gagal", res.data?.message || "Gagal memilih Cash");
      }
    } catch (err) {
      Alert.alert(
        "Gagal",
        err.response?.data?.message || err.message || "Terjadi kesalahan"
      );
    } finally {
      setPayingLoading(false);
    }
  };

  const handleSelectMidtrans = async () => {
    if (!bookingToPay || payingLoading) return;
    setPayingLoading(true);
    try {
      const res = await api.post("/pembayaran/bayar", {
        booking_id: bookingToPay.id,
        metode: "midtrans",
      });

      const redirectUrl = res.data?.data?.redirect_url;
      if (res.data?.success && redirectUrl) {
        setPayModalVisible(false);

        if (Platform.OS === "web" && typeof window !== "undefined") {
          const opened = window.open(redirectUrl, "_blank");
          if (!opened) {
            window.location.href = redirectUrl;
          }
        } else {
          try {
            await WebBrowser.openBrowserAsync(redirectUrl);
          } catch {
            await Linking.openURL(redirectUrl);
          }
        }

        await fetchBookings(false);
      } else {
        Alert.alert(
          "Gagal",
          res.data?.message || "Gagal membuat transaksi Midtrans"
        );
      }
    } catch (err) {
      Alert.alert(
        "Gagal Midtrans",
        err.response?.data?.message ||
          err.message ||
          "Gagal menghubungi server pembayaran"
      );
    } finally {
      setPayingLoading(false);
    }
  };

  const filteredBookings = bookings.filter((item) => {
    if (selectedFilter === "Semua") return true;
    return (item.status || "").toLowerCase() === selectedFilter.toLowerCase();
  });

  const getStatusBadgeStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "selesai") {
      return {
        bg: "#DCFCE7",
        text: "#15803D",
        icon: "checkmark-circle",
        label: "Selesai",
      };
    }
    if (s === "diproses") {
      return {
        bg: "#FADBB2",
        text: "#564B5E",
        icon: "time",
        label: "Diproses",
      };
    }
    return {
      bg: "#F5EFEA",
      text: "#937D7A",
      icon: "hourglass-outline",
      label: "Menunggu",
    };
  };

  const getPayBadge = (item) => {
    const pStatus = (item.status_pembayaran || "belum_bayar").toLowerCase();
    const metode = (item.metode_pembayaran || "").toUpperCase();

    if (pStatus === "lunas") {
      return {
        bg: "#DCFCE7",
        color: "#15803D",
        text: `LUNAS${metode ? ` (${metode})` : ""}`,
        hint: "Pembayaran sudah dikonfirmasi LUNAS oleh admin",
      };
    }

    if (isBookingExpired(item) || pStatus === "kadaluarsa") {
      return {
        bg: "#EFE6DE",
        color: "#564B5E",
        text: "KEDALUWARSA",
        hint: "Batas bayar sampai jam 19:00 di hari booking telah lewat. Silakan buat booking ulang.",
      };
    }

    if (pStatus === "pending") {
      return {
        bg: "#FADBB2",
        color: "#564B5E",
        text: `MENUNGGU KONFIRMASI${metode ? ` (${metode})` : ""}`,
        hint: "Selesaikan pembayaran sebelum jam 19:00 hari ini lalu tunggu konfirmasi admin",
      };
    }

    if (pStatus === "gagal") {
      return {
        bg: "#EFE6DE",
        color: "#564B5E",
        text: `GAGAL${metode ? ` (${metode})` : ""}`,
        hint: "Transaksi gagal. Silakan klik Bayar untuk membuat transaksi baru.",
      };
    }

    return {
      bg: "#EFE6DE",
      color: "#937D7A",
      text: "BELUM BAYAR",
      hint: "Wajib dibayar pada hari booking sampai jam 19:00 (TF Midtrans / Cash)",
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderItem = ({ item }) => {
    const badge = getStatusBadgeStyle(item.status);
    const payBadge = getPayBadge(item);
    const layananList = item.layanan || item.layanan_list || [];
    const isLunas = (item.status_pembayaran || "").toLowerCase() === "lunas";
    const expired = isBookingExpired(item);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => {
          setSelectedBooking(item);
          setDetailModalVisible(true);
        }}
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.kodeBooking}>
              {item.kode_booking || `#${item.id}`}
            </Text>
            <Text style={styles.tglJamText}>
              {formatDate(item.tanggal_booking)} • {item.jam_booking || "-"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon} size={13} color={badge.text} />
            <Text style={[styles.statusText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        <View style={styles.payStatusBlock}>
          <View style={[styles.payPill, { backgroundColor: payBadge.bg }]}>
            <Ionicons
              name={
                isLunas
                  ? "checkmark-done"
                  : expired
                  ? "alert-circle-outline"
                  : "time-outline"
              }
              size={14}
              color={payBadge.color}
            />
            <Text style={[styles.payPillText, { color: payBadge.color }]}>
              {payBadge.text}
            </Text>
          </View>
          <Text style={styles.payHintText}>{payBadge.hint}</Text>
        </View>

        <View style={styles.cardMid}>
          <View style={styles.vehicleRow}>
            <View style={styles.platBadge}>
              <Text style={styles.platText}>{item.plat_nomor || "-"}</Text>
            </View>
            <Text style={styles.vehicleDesc}>
              {item.merk} {item.tipe} {item.tahun ? `(${item.tahun})` : ""}
            </Text>
          </View>

          {layananList.length > 0 && (
            <View style={styles.layananPreview}>
              <Ionicons name="construct-outline" size={14} color="#937D7A" />
              <Text style={styles.layananPreviewText} numberOfLines={1}>
                {layananList.map((l) => l.nama_layanan || l).join(", ")}
              </Text>
            </View>
          )}

          {item.keluhan ? (
            <Text style={styles.keluhanPreview} numberOfLines={1}>
              <Text style={styles.keluhanLabel}>Keluhan: </Text>
              {item.keluhan}
            </Text>
          ) : null}
        </View>

        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.totalLabel}>Total Biaya</Text>
            <Text style={styles.totalValue}>
              {formatRupiah(item.total_harga || 0)}
            </Text>
          </View>

          <View style={styles.bottomActions}>
            {!isLunas && !expired && (
              <TouchableOpacity
                style={styles.payNowBtn}
                onPress={() => openPaymentModal(item)}
                activeOpacity={0.85}
              >
                <Ionicons name="wallet-outline" size={14} color="#FADBB2" />
                <Text style={styles.payNowBtnText}>Bayar</Text>
              </TouchableOpacity>
            )}
            {!isLunas && expired && onNavigateToBooking && (
              <TouchableOpacity
                style={styles.rebookBtn}
                onPress={() => onNavigateToBooking()}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={14} color="#564B5E" />
                <Text style={styles.rebookBtnText}>Booking Ulang</Text>
              </TouchableOpacity>
            )}
            <View style={styles.detailLink}>
              <Text style={styles.detailLinkText}>Detail</Text>
              <Ionicons name="chevron-forward" size={14} color="#564B5E" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandTag}>
          <Ionicons name="receipt-outline" size={12} color="#564B5E" />
          <Text style={styles.brandTagText}>MOBICARE</Text>
        </View>
        <Text style={styles.headerTitle}>Riwayat Servis Saya</Text>
        <Text style={styles.headerSubtitle}>
          Pembayaran berlaku di hari booking sampai bengkel tutup (19:00)
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {STATUS_FILTERS.map((f) => {
            const isActive = selectedFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#564B5E" />
          <Text style={styles.loadingText}>Memuat riwayat booking...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#564B5E"
              colors={["#564B5E"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={54} color="#937D7A" />
              <Text style={styles.emptyTitle}>Belum Ada Booking</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter !== "Semua"
                  ? `Tidak ada transaksi servis dengan status "${selectedFilter}".`
                  : "Anda belum pernah memesan booking servis."}
              </Text>
              <TouchableOpacity
                style={styles.newBookingBtn}
                onPress={() => onNavigateToBooking && onNavigateToBooking()}
                activeOpacity={0.85}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FADBB2" />
                <Text style={styles.newBookingBtnText}>Pesan Servis Sekarang</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* MODAL PILIH METODE PEMBAYARAN (TF MIDTRANS / CASH) */}
      <Modal
        visible={payModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !payingLoading && setPayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <View>
                <Text style={styles.modalKode}>Pilih Metode Pembayaran</Text>
                <Text style={styles.modalSubKode}>
                  {bookingToPay?.kode_booking} •{" "}
                  {formatRupiah(bookingToPay?.total_harga || 0)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => !payingLoading && setPayModalVisible(false)}
                style={styles.modalCloseIcon}
                activeOpacity={0.75}
              >
                <Ionicons name="close" size={22} color="#564B5E" />
              </TouchableOpacity>
            </View>

            {payingLoading ? (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#564B5E" />
                <Text style={styles.loadingText}>Memproses pembayaran...</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  style={styles.methodCard}
                  onPress={handleSelectMidtrans}
                  disabled={payingLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodIconPlum}>
                    <Ionicons name="card" size={22} color="#FADBB2" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>
                      Transfer / Midtrans (TF)
                    </Text>
                    <Text style={styles.methodDesc}>
                      Buka halaman pembayaran Midtrans untuk selesaikan transaksi.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#937D7A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.methodCard}
                  onPress={handleSelectCash}
                  disabled={payingLoading}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodIconPeach}>
                    <Ionicons name="cash" size={22} color="#564B5E" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>Cash (Bayar di Bengkel)</Text>
                    <Text style={styles.methodDesc}>
                      Bayar tunai di kasir bengkel saat servis.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#937D7A" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL DETAIL BOOKING */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBooking && (
              <>
                <View style={styles.modalTop}>
                  <View>
                    <Text style={styles.modalKode}>
                      {selectedBooking.kode_booking}
                    </Text>
                    <Text style={styles.modalSubKode}>
                      Detail Pemesanan Servis
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setDetailModalVisible(false)}
                    style={styles.modalCloseIcon}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="close" size={22} color="#564B5E" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                >
                  {(() => {
                    const badge = getStatusBadgeStyle(selectedBooking.status);
                    const payBadge = getPayBadge(selectedBooking);
                    return (
                      <View
                        style={[
                          styles.modalStatusBanner,
                          { backgroundColor: badge.bg },
                        ]}
                      >
                        <Ionicons
                          name={badge.icon}
                          size={20}
                          color={badge.text}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.modalStatusTitle,
                              { color: badge.text },
                            ]}
                          >
                            Status: {badge.label} • Bayar: {payBadge.text}
                          </Text>
                          <Text style={styles.modalStatusHint}>
                            {payBadge.hint}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}

                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Data Kendaraan</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Plat Nomor</Text>
                      <View style={styles.platBadgeSm}>
                        <Text style={styles.platTextSm}>
                          {selectedBooking.plat_nomor}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Kendaraan</Text>
                      <Text style={styles.infoValue}>
                        {selectedBooking.merk} {selectedBooking.tipe}{" "}
                        {selectedBooking.tahun ? `(${selectedBooking.tahun})` : ""}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Jadwal Kedatangan</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(selectedBooking.tanggal_booking)} • Jam{" "}
                        {selectedBooking.jam_booking}
                      </Text>
                    </View>
                  </View>

                  {selectedBooking.keluhan && (
                    <View style={styles.infoCard}>
                      <Text style={styles.infoCardTitle}>
                        Keluhan / Catatan Kendaraan
                      </Text>
                      <Text style={styles.keluhanTextFull}>
                        {selectedBooking.keluhan}
                      </Text>
                    </View>
                  )}

                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Layanan Dipesan</Text>
                    <Text style={styles.keluhanTextFull}>
                      {selectedBooking.nama_layanan || "-"}
                    </Text>
                    <View style={styles.serviceTotalRow}>
                      <Text style={styles.serviceTotalLabel}>Total Biaya</Text>
                      <Text style={styles.serviceTotalValue}>
                        {formatRupiah(selectedBooking.total_harga || 0)}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                {(selectedBooking.status_pembayaran || "").toLowerCase() !==
                  "lunas" &&
                  !isBookingExpired(selectedBooking) && (
                    <TouchableOpacity
                      style={styles.modalPayBtn}
                      onPress={() => {
                        setDetailModalVisible(false);
                        openPaymentModal(selectedBooking);
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modalPayBtnText}>
                        Bayar Sekarang (
                        {formatRupiah(selectedBooking.total_harga || 0)})
                      </Text>
                    </TouchableOpacity>
                  )}

                {(selectedBooking.status_pembayaran || "").toLowerCase() !==
                  "lunas" &&
                  isBookingExpired(selectedBooking) &&
                  onNavigateToBooking && (
                    <TouchableOpacity
                      style={styles.modalPayBtn}
                      onPress={() => {
                        setDetailModalVisible(false);
                        onNavigateToBooking();
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modalPayBtnText}>
                        Buat Booking Ulang
                      </Text>
                    </TouchableOpacity>
                  )}

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setDetailModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCloseBtnText}>Tutup</Text>
                </TouchableOpacity>
              </>
            )}
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
    paddingBottom: 12,
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
  headerSubtitle: {
    fontSize: 12,
    color: "#937D7A",
    marginTop: 2,
    marginBottom: 12,
  },
  filterScroll: { gap: 8, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FAF6F2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  filterChipActive: { backgroundColor: "#564B5E", borderColor: "#564B5E" },
  filterChipText: { fontSize: 12, fontWeight: "700", color: "#564B5E" },
  filterChipTextActive: { color: "#FADBB2" },
  listContent: { padding: 16, paddingBottom: 28 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  kodeBooking: { fontSize: 15, fontWeight: "800", color: "#564B5E" },
  tglJamText: { fontSize: 12, color: "#937D7A", marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: { fontSize: 11, fontWeight: "800" },
  payStatusBlock: {
    marginBottom: 10,
    gap: 3,
  },
  payPill: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payPillText: { fontSize: 11, fontWeight: "800" },
  payHintText: { fontSize: 11, color: "#937D7A", marginLeft: 2 },
  cardMid: {
    backgroundColor: "#FAF6F2",
    borderRadius: 12,
    padding: 11,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFE6DE",
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  platBadge: {
    backgroundColor: "#564B5E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platText: { color: "#FADBB2", fontWeight: "800", fontSize: 11 },
  vehicleDesc: { fontSize: 13, color: "#564B5E", fontWeight: "600" },
  layananPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  layananPreviewText: { fontSize: 12, color: "#564B5E", flex: 1 },
  keluhanPreview: { fontSize: 12, color: "#937D7A", marginTop: 4 },
  keluhanLabel: { fontWeight: "700", color: "#564B5E" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EFE6DE",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 10,
    color: "#937D7A",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  totalValue: { fontSize: 15, fontWeight: "800", color: "#564B5E", marginTop: 2 },
  bottomActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  payNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#564B5E",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
  },
  payNowBtnText: { color: "#FADBB2", fontSize: 12, fontWeight: "800" },
  rebookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FADBB2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  rebookBtnText: { color: "#564B5E", fontSize: 11, fontWeight: "700" },
  detailLink: { flexDirection: "row", alignItems: "center", gap: 2 },
  detailLinkText: { fontSize: 12, fontWeight: "700", color: "#564B5E" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5EFEA",
  },
  loadingText: { marginTop: 10, fontSize: 13, color: "#937D7A", fontWeight: "500" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#564B5E",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#937D7A",
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  newBookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#564B5E",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  newBookingBtnText: { color: "#FADBB2", fontWeight: "800", fontSize: 13 },
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
  modalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  modalKode: { fontSize: 18, fontWeight: "800", color: "#564B5E" },
  modalSubKode: { fontSize: 12, color: "#937D7A" },
  modalCloseIcon: { padding: 4 },
  modalBody: { marginBottom: 12 },
  modalStatusBanner: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 14,
    alignItems: "flex-start",
  },
  modalStatusTitle: { fontSize: 13, fontWeight: "800" },
  modalStatusHint: { fontSize: 11, color: "#564B5E", marginTop: 2 },
  infoCard: {
    backgroundColor: "#FAF6F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#564B5E",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  infoLabel: { fontSize: 12, color: "#937D7A" },
  infoValue: { fontSize: 12, fontWeight: "700", color: "#564B5E" },
  platBadgeSm: {
    backgroundColor: "#564B5E",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  platTextSm: { color: "#FADBB2", fontWeight: "800", fontSize: 11 },
  keluhanTextFull: { fontSize: 12, color: "#564B5E", lineHeight: 18 },
  serviceTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#C6B2AE",
  },
  serviceTotalLabel: { fontSize: 13, fontWeight: "800", color: "#564B5E" },
  serviceTotalValue: { fontSize: 15, fontWeight: "800", color: "#564B5E" },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    backgroundColor: "#FAF6F2",
  },
  methodIconPlum: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#564B5E",
    alignItems: "center",
    justifyContent: "center",
  },
  methodIconPeach: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FADBB2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    alignItems: "center",
    justifyContent: "center",
  },
  methodTitle: { fontSize: 14, fontWeight: "800", color: "#564B5E" },
  methodDesc: { fontSize: 11, color: "#937D7A", marginTop: 2 },
  modalPayBtn: {
    backgroundColor: "#564B5E",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  modalPayBtnText: { color: "#FADBB2", fontWeight: "800", fontSize: 13 },
  modalCloseBtn: {
    backgroundColor: "#FAF6F2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseBtnText: { color: "#564B5E", fontWeight: "700", fontSize: 13 },
});