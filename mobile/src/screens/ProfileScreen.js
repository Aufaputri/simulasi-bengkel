// import React, { useState, useEffect } from "react";
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
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../context/AuthContext";
// import api, { DEFAULT_API_URL } from "../api/api";

// export default function ProfileScreen() {
//   const { user, logout, apiUrl, updateApiUrl, resetApiUrl } = useAuth();

//   const [kendaraanList, setKendaraanList] = useState([]);
//   const [loadingKendaraan, setLoadingKendaraan] = useState(true);

//   // Modal Tambah Kendaraan
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [merk, setMerk] = useState("");
//   const [tipe, setTipe] = useState("");
//   const [tahun, setTahun] = useState(String(new Date().getFullYear()));
//   const [platNomor, setPlatNomor] = useState("");
//   const [warna, setWarna] = useState("");
//   const [savingKendaraan, setSavingKendaraan] = useState(false);

//   // Modal Setting Server IP
//   const [showServerModal, setShowServerModal] = useState(false);
//   const [customUrlInput, setCustomUrlInput] = useState(apiUrl);

//   const fetchKendaraan = async () => {
//     try {
//       setLoadingKendaraan(true);
//       const res = await api.get("/kendaraan");
//       if (res.data?.success) {
//         setKendaraanList(res.data.data || []);
//       } else {
//         setKendaraanList(res.data || []);
//       }
//     } catch (err) {
//       console.error("Gagal load kendaraan:", err);
//     } finally {
//       setLoadingKendaraan(false);
//     }
//   };

//   useEffect(() => {
//     fetchKendaraan();
//   }, []);

//   const handleAddKendaraan = async () => {
//     if (!merk.trim() || !tipe.trim() || !tahun || !platNomor.trim()) {
//       Alert.alert("Perhatian", "Merek, model/tipe, tahun, dan plat nomor wajib diisi!");
//       return;
//     }

//     setSavingKendaraan(true);
//     try {
//       const res = await api.post("/kendaraan", {
//         merk: merk.trim(),
//         tipe: tipe.trim(),
//         tahun: Number(tahun),
//         plat_nomor: platNomor.trim().toUpperCase(),
//         warna: warna.trim() || null,
//       });

//       if (res.data?.success) {
//         Alert.alert("Sukses", "Kendaraan baru berhasil ditambahkan!");
//         setShowAddModal(false);
//         setMerk("");
//         setTipe("");
//         setPlatNomor("");
//         setWarna("");
//         fetchKendaraan();
//       }
//     } catch (err) {
//       Alert.alert(
//         "Gagal Menyimpan",
//         err.response?.data?.message || err.message || "Gagal menambah kendaraan"
//       );
//     } finally {
//       setSavingKendaraan(false);
//     }
//   };

//   const handleDeleteKendaraan = (id, plat) => {
//     Alert.alert(
//       "Hapus Kendaraan",
//       `Apakah Anda yakin ingin menghapus kendaraan dengan plat "${plat}"?`,
//       [
//         { text: "Batal", style: "cancel" },
//         {
//           text: "Hapus",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const res = await api.delete(`/kendaraan/${id}`);
//               if (res.data?.success) {
//                 Alert.alert("Sukses", "Kendaraan berhasil dihapus.");
//                 fetchKendaraan();
//               }
//             } catch (err) {
//               Alert.alert(
//                 "Gagal Menghapus",
//                 err.response?.data?.message ||
//                   "Kendaraan tidak dapat dihapus jika masih terikat riwayat booking."
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleSaveApiUrl = async () => {
//     if (!customUrlInput.trim()) {
//       Alert.alert("Perhatian", "URL Server tidak boleh kosong!");
//       return;
//     }
//     await updateApiUrl(customUrlInput);
//     setShowServerModal(false);
//     Alert.alert("Sukses", `URL Server berhasil diubah ke:\n${customUrlInput}`);
//   };

//   const handleResetApiUrl = async () => {
//     await resetApiUrl();
//     setCustomUrlInput(DEFAULT_API_URL);
//     setShowServerModal(false);
//     Alert.alert("Sukses", `URL Server direset ke default:\n${DEFAULT_API_URL}`);
//   };

//   const handleLogout = () => {
//     Alert.alert("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar dari akun?", [
//       { text: "Batal", style: "cancel" },
//       {
//         text: "Keluar",
//         style: "destructive",
//         onPress: logout,
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Profil Pelanggan</Text>
//         <Text style={styles.headerSubtitle}>
//           Kelola informasi akun dan kendaraan terdaftar Anda
//         </Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* User Card */}
//         <View style={styles.profileCard}>
//           <View style={styles.avatarCircle}>
//             <Ionicons name="person" size={36} color="#2563EB" />
//           </View>
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>{user?.nama || "Pelanggan"}</Text>
//             <Text style={styles.profileEmail}>{user?.email || "-"}</Text>
//             <View style={styles.badgeRow}>
//               <View style={styles.roleBadge}>
//                 <Ionicons name="shield-checkmark" size={12} color="#1D4ED8" />
//                 <Text style={styles.roleBadgeText}>
//                   {user?.role?.toUpperCase() || "PELANGGAN"}
//                 </Text>
//               </View>
//               {user?.no_hp ? (
//                 <View style={styles.phoneBadge}>
//                   <Ionicons name="call" size={11} color="#4B5563" />
//                   <Text style={styles.phoneBadgeText}>{user.no_hp}</Text>
//                 </View>
//               ) : null}
//             </View>
//           </View>
//         </View>

//         {user?.address ? (
//           <View style={styles.addressBox}>
//             <Ionicons name="location-outline" size={16} color="#6B7280" />
//             <Text style={styles.addressText}>{user.address}</Text>
//           </View>
//         ) : null}

//         {/* Section: Kendaraan Saya */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionTitle}>Kendaraan Saya</Text>
//               <Text style={styles.sectionSub}>
//                 Kendaraan yang terhubung dengan akun Anda
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.addBtn}
//               onPress={() => setShowAddModal(true)}
//             >
//               <Ionicons name="add" size={18} color="#FFFFFF" />
//               <Text style={styles.addBtnText}>Tambah</Text>
//             </TouchableOpacity>
//           </View>

//           {loadingKendaraan ? (
//             <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 12 }} />
//           ) : kendaraanList.length === 0 ? (
//             <View style={styles.emptyBox}>
//               <Ionicons name="car-outline" size={32} color="#9CA3AF" />
//               <Text style={styles.emptyText}>Belum ada kendaraan terdaftar.</Text>
//             </View>
//           ) : (
//             kendaraanList.map((k) => (
//               <View key={k.id} style={styles.kendaraanRow}>
//                 <View style={styles.platBadge}>
//                   <Text style={styles.platText}>{k.plat_nomor}</Text>
//                 </View>
//                 <View style={styles.kendaraanDetail}>
//                   <Text style={styles.kendaraanMerk}>
//                     {k.merk} {k.tipe}
//                   </Text>
//                   <Text style={styles.kendaraanSub}>
//                     Tahun {k.tahun} {k.warna ? `• ${k.warna}` : ""}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.deleteBtn}
//                   onPress={() => handleDeleteKendaraan(k.id, k.plat_nomor)}
//                 >
//                   <Ionicons name="trash-outline" size={18} color="#EF4444" />
//                 </TouchableOpacity>
//               </View>
//             ))
//           )}
//         </View>

//         {/* Section: Pengaturan Koneksi Backend */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionTitle}>Koneksi Backend API</Text>
//               <Text style={styles.sectionSub}>
//                 Ubah IP untuk pengujian HP fisik via Wi-Fi
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.serverEditBtn}
//               onPress={() => {
//                 setCustomUrlInput(apiUrl);
//                 setShowServerModal(true);
//               }}
//             >
//               <Ionicons name="create-outline" size={16} color="#2563EB" />
//               <Text style={styles.serverEditBtnText}>Ubah</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.serverUrlCard}>
//             <Ionicons name="globe-outline" size={18} color="#2563EB" />
//             <Text style={styles.serverUrlText} numberOfLines={1}>
//               {apiUrl}
//             </Text>
//           </View>
//         </View>

//         {/* Section: Tombol Keluar */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//           <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
//         </TouchableOpacity>

//         <Text style={styles.appVersion}>
//           Aplikasi Booking Servis Bengkel • v1.0.0
//         </Text>
//       </ScrollView>

//       {/* MODAL TAMBAH KENDARAAN */}
//       <Modal
//         visible={showAddModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowAddModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Ionicons name="car" size={24} color="#2563EB" />
//               <Text style={styles.modalTitle}>Tambah Kendaraan Baru</Text>
//             </View>

//             <ScrollView>
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
//                   placeholder="Contoh: Vario 160 / Avanza"
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
//                 <Text style={styles.modalInputLabel}>Warna Kendaraan (Opsional)</Text>
//                 <TextInput
//                   style={styles.modalTextInput}
//                   placeholder="Hitam / Merah / Putih"
//                   placeholderTextColor="#9CA3AF"
//                   value={warna}
//                   onChangeText={setWarna}
//                 />
//               </View>
//             </ScrollView>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalCancelBtn}
//                 onPress={() => setShowAddModal(false)}
//               >
//                 <Text style={styles.modalCancelBtnText}>Batal</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSaveBtn}
//                 onPress={handleAddKendaraan}
//                 disabled={savingKendaraan}
//               >
//                 {savingKendaraan ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.modalSaveBtnText}>Simpan Kendaraan</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* MODAL PENGATURAN SERVER IP */}
//       <Modal
//         visible={showServerModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowServerModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Ionicons name="server" size={24} color="#2563EB" />
//               <Text style={styles.modalTitle}>Konfigurasi Server API</Text>
//             </View>

//             <Text style={styles.modalDescription}>
//               Masukkan URL backend Anda. Gunakan IP Wi-Fi PC jika menjalankan aplikasi di HP via Expo Go.
//             </Text>

//             <TextInput
//               style={styles.modalTextInput}
//               value={customUrlInput}
//               onChangeText={setCustomUrlInput}
//               placeholder="http://192.168.x.x:3000"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />

//             <View style={styles.quickSelectContainer}>
//               <Text style={styles.quickSelectLabel}>Pilihan Cepat:</Text>
//               <View style={styles.quickButtonsRow}>
//                 <TouchableOpacity
//                   style={styles.quickBadge}
//                   onPress={() => setCustomUrlInput("http://localhost:3000")}
//                 >
//                   <Text style={styles.quickBadgeText}>Web (localhost)</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.quickBadge}
//                   onPress={() => setCustomUrlInput("http://10.0.2.2:3000")}
//                 >
//                   <Text style={styles.quickBadgeText}>Android Emulator</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalCancelBtn}
//                 onPress={handleResetApiUrl}
//               >
//                 <Text style={styles.modalCancelBtnText}>Reset</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalSaveBtn}
//                 onPress={handleSaveApiUrl}
//               >
//                 <Text style={styles.modalSaveBtnText}>Simpan URL</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={{ alignItems: "center", marginTop: 8 }}
//               onPress={() => setShowServerModal(false)}
//             >
//               <Text style={{ color: "#9CA3AF", fontSize: 13 }}>Tutup</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F3F4F6",
//   },
//   header: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 36,
//   },
//   profileCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   avatarCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#DBEAFE",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 17,
//     fontWeight: "bold",
//     color: "#1F2937",
//   },
//   profileEmail: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginTop: 2,
//   },
//   badgeRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 6,
//     alignItems: "center",
//   },
//   roleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//     gap: 4,
//   },
//   roleBadgeText: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#1D4ED8",
//   },
//   phoneBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//     gap: 4,
//   },
//   phoneBadgeText: {
//     fontSize: 11,
//     color: "#4B5563",
//     fontWeight: "500",
//   },
//   addressBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 14,
//     gap: 8,
//   },
//   addressText: {
//     fontSize: 12,
//     color: "#4B5563",
//     flex: 1,
//   },
//   sectionCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: "#1F2937",
//   },
//   sectionSub: {
//     fontSize: 11,
//     color: "#6B7280",
//   },
//   addBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     gap: 4,
//   },
//   addBtnText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   emptyBox: {
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 8,
//   },
//   emptyText: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     marginTop: 4,
//   },
//   kendaraanRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   platBadge: {
//     backgroundColor: "#1F2937",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginRight: 10,
//   },
//   platText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontSize: 11,
//   },
//   kendaraanDetail: {
//     flex: 1,
//   },
//   kendaraanMerk: {
//     fontSize: 13,
//     fontWeight: "bold",
//     color: "#1F2937",
//   },
//   kendaraanSub: {
//     fontSize: 11,
//     color: "#6B7280",
//     marginTop: 2,
//   },
//   deleteBtn: {
//     padding: 6,
//   },
//   serverEditBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   serverEditBtnText: {
//     color: "#2563EB",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   serverUrlCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EFF6FF",
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//     padding: 12,
//     borderRadius: 10,
//     gap: 10,
//   },
//   serverUrlText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#1D4ED8",
//     flex: 1,
//   },
//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FEE2E2",
//     borderRadius: 10,
//     paddingVertical: 14,
//     marginTop: 6,
//     marginBottom: 16,
//     gap: 8,
//   },
//   logoutButtonText: {
//     color: "#EF4444",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   appVersion: {
//     textAlign: "center",
//     fontSize: 11,
//     color: "#9CA3AF",
//   },
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
//     marginBottom: 14,
//   },
//   modalTitle: {
//     fontSize: 17,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   modalDescription: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginBottom: 12,
//     lineHeight: 16,
//   },
//   inputGroup: {
//     marginBottom: 12,
//   },
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
//   quickSelectContainer: {
//     marginVertical: 12,
//   },
//   quickSelectLabel: {
//     fontSize: 11,
//     color: "#4B5563",
//     marginBottom: 6,
//   },
//   quickButtonsRow: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   quickBadge: {
//     backgroundColor: "#EFF6FF",
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//   },
//   quickBadgeText: {
//     fontSize: 11,
//     color: "#1D4ED8",
//     fontWeight: "600",
//   },
//   modalActions: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 14,
//   },
//   modalCancelBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   modalCancelBtnText: {
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   modalSaveBtn: {
//     flex: 2,
//     backgroundColor: "#2563EB",
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   modalSaveBtnText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
// });


import React, { useState, useEffect } from "react";
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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [kendaraanList, setKendaraanList] = useState([]);
  const [loadingKendaraan, setLoadingKendaraan] = useState(true);

  // Modal Tambah Kendaraan
  const [showAddModal, setShowAddModal] = useState(false);
  const [merk, setMerk] = useState("");
  const [tipe, setTipe] = useState("");
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [platNomor, setPlatNomor] = useState("");
  const [warna, setWarna] = useState("");
  const [savingKendaraan, setSavingKendaraan] = useState(false);

  const fetchKendaraan = async () => {
    try {
      setLoadingKendaraan(true);
      const res = await api.get("/kendaraan");
      if (res.data?.success) {
        setKendaraanList(res.data.data || []);
      } else {
        setKendaraanList(res.data || []);
      }
    } catch (err) {
      console.error("Gagal load kendaraan:", err);
    } finally {
      setLoadingKendaraan(false);
    }
  };

  useEffect(() => {
    fetchKendaraan();
  }, []);

  const handleAddKendaraan = async () => {
    if (!merk.trim() || !tipe.trim() || !tahun || !platNomor.trim()) {
      Alert.alert(
        "Perhatian",
        "Merek, model/tipe, tahun, dan plat nomor wajib diisi!"
      );
      return;
    }

    setSavingKendaraan(true);
    try {
      const res = await api.post("/kendaraan", {
        merk: merk.trim(),
        tipe: tipe.trim(),
        tahun: Number(tahun),
        plat_nomor: platNomor.trim().toUpperCase(),
        warna: warna.trim() || null,
      });

      if (res.data?.success) {
        Alert.alert("Sukses", "Kendaraan baru berhasil ditambahkan!");
        setShowAddModal(false);
        setMerk("");
        setTipe("");
        setPlatNomor("");
        setWarna("");
        fetchKendaraan();
      }
    } catch (err) {
      Alert.alert(
        "Gagal Menyimpan",
        err.response?.data?.message || err.message || "Gagal menambah kendaraan"
      );
    } finally {
      setSavingKendaraan(false);
    }
  };

  const handleDeleteKendaraan = (id, plat) => {
    if (Platform.OS === "web") {
      const yakin = window.confirm(
        `Apakah Anda yakin ingin menghapus kendaraan dengan plat "${plat}"?`
      );
      if (!yakin) return;

      (async () => {
        try {
          const res = await api.delete(`/kendaraan/${id}`);
          if (res.data?.success) {
            window.alert("Kendaraan berhasil dihapus.");
            fetchKendaraan();
          }
        } catch (err) {
          window.alert(
            err.response?.data?.message ||
              "Kendaraan tidak dapat dihapus jika masih terikat riwayat booking."
          );
        }
      })();
      return;
    }

    Alert.alert(
      "Hapus Kendaraan",
      `Apakah Anda yakin ingin menghapus kendaraan dengan plat "${plat}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await api.delete(`/kendaraan/${id}`);
              if (res.data?.success) {
                Alert.alert("Sukses", "Kendaraan berhasil dihapus.");
                fetchKendaraan();
              }
            } catch (err) {
              Alert.alert(
                "Gagal Menghapus",
                err.response?.data?.message ||
                  "Kendaraan tidak dapat dihapus jika masih terikat riwayat booking."
              );
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const yakin = window.confirm("Apakah Anda yakin ingin keluar dari akun?");
      if (yakin) {
        await logout();
      }
      return;
    }

    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Pelanggan</Text>
        <Text style={styles.headerSubtitle}>
          Kelola informasi akun dan kendaraan terdaftar Anda
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color="#2563EB" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.nama || "Pelanggan"}</Text>
            <Text style={styles.profileEmail}>{user?.email || "-"}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#1D4ED8" />
                <Text style={styles.roleBadgeText}>
                  {user?.role?.toUpperCase() || "PELANGGAN"}
                </Text>
              </View>
              {user?.no_hp ? (
                <View style={styles.phoneBadge}>
                  <Ionicons name="call" size={11} color="#4B5563" />
                  <Text style={styles.phoneBadgeText}>{user.no_hp}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {user?.address ? (
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.addressText}>{user.address}</Text>
          </View>
        ) : null}

        {/* Section: Kendaraan Saya */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Kendaraan Saya</Text>
              <Text style={styles.sectionSub}>
                Kendaraan yang terhubung dengan akun Anda
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addBtnText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {loadingKendaraan ? (
            <ActivityIndicator
              size="small"
              color="#2563EB"
              style={{ marginVertical: 12 }}
            />
          ) : kendaraanList.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="car-outline" size={32} color="#9CA3AF" />
              <Text style={styles.emptyText}>Belum ada kendaraan terdaftar.</Text>
            </View>
          ) : (
            kendaraanList.map((k) => (
              <View key={k.id} style={styles.kendaraanRow}>
                <View style={styles.platBadge}>
                  <Text style={styles.platText}>{k.plat_nomor}</Text>
                </View>
                <View style={styles.kendaraanDetail}>
                  <Text style={styles.kendaraanMerk}>
                    {k.merk} {k.tipe}
                  </Text>
                  <Text style={styles.kendaraanSub}>
                    Tahun {k.tahun} {k.warna ? `• ${k.warna}` : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteKendaraan(k.id, k.plat_nomor)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Section: Tombol Keluar */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>
          Aplikasi Booking Servis Bengkel • v1.0.0
        </Text>
      </ScrollView>

      {/* MODAL TAMBAH KENDARAAN */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="car" size={24} color="#2563EB" />
              <Text style={styles.modalTitle}>Tambah Kendaraan Baru</Text>
            </View>

            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Nomor Polisi (Plat) *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="B 1234 XYZ"
                  placeholderTextColor="#9CA3AF"
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
                  placeholderTextColor="#9CA3AF"
                  value={merk}
                  onChangeText={setMerk}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Tipe / Model *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Contoh: Vario 160 / Avanza"
                  placeholderTextColor="#9CA3AF"
                  value={tipe}
                  onChangeText={setTipe}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.modalInputLabel}>Tahun Pembuatan *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="2022"
                  placeholderTextColor="#9CA3AF"
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
                  placeholder="Hitam / Merah / Putih"
                  placeholderTextColor="#9CA3AF"
                  value={warna}
                  onChangeText={setWarna}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddKendaraan}
                disabled={savingKendaraan}
              >
                {savingKendaraan ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSaveBtnText}>Simpan Kendaraan</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1F2937",
  },
  profileEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    alignItems: "center",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1D4ED8",
  },
  phoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  phoneBadgeText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  addressText: {
    fontSize: 12,
    color: "#4B5563",
    flex: 1,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
  },
  sectionSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyBox: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  kendaraanRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  platBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  platText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 11,
  },
  kendaraanDetail: {
    flex: 1,
  },
  kendaraanMerk: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
  },
  kendaraanSub: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 16,
    gap: 8,
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "bold",
  },
  appVersion: {
    textAlign: "center",
    fontSize: 11,
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },
  inputGroup: {
    marginBottom: 12,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCancelBtnText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalSaveBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});