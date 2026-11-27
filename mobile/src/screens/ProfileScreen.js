
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
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/api";

// export default function ProfileScreen() {
//   const { user, logout } = useAuth();

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
//       Alert.alert(
//         "Perhatian",
//         "Merek, model/tipe, tahun, dan plat nomor wajib diisi!"
//       );
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
//     if (Platform.OS === "web") {
//       const yakin = window.confirm(
//         `Apakah Anda yakin ingin menghapus kendaraan dengan plat "${plat}"?`
//       );
//       if (!yakin) return;

//       (async () => {
//         try {
//           const res = await api.delete(`/kendaraan/${id}`);
//           if (res.data?.success) {
//             window.alert("Kendaraan berhasil dihapus.");
//             fetchKendaraan();
//           }
//         } catch (err) {
//           window.alert(
//             err.response?.data?.message ||
//               "Kendaraan tidak dapat dihapus jika masih terikat riwayat booking."
//           );
//         }
//       })();
//       return;
//     }

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

//   const handleLogout = async () => {
//     if (Platform.OS === "web") {
//       const yakin = window.confirm("Apakah Anda yakin ingin keluar dari akun?");
//       if (yakin) {
//         await logout();
//       }
//       return;
//     }

//     Alert.alert(
//       "Konfirmasi Keluar",
//       "Apakah Anda yakin ingin keluar dari akun?",
//       [
//         { text: "Batal", style: "cancel" },
//         {
//           text: "Keluar",
//           style: "destructive",
//           onPress: async () => {
//             await logout();
//           },
//         },
//       ]
//     );
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
//             <ActivityIndicator
//               size="small"
//               color="#2563EB"
//               style={{ marginVertical: 12 }}
//             />
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
//                 <Text style={styles.modalInputLabel}>
//                   Warna Kendaraan (Opsional)
//                 </Text>
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
        <View style={styles.brandTag}>
          <Ionicons name="person-circle-outline" size={12} color="#564B5E" />
          <Text style={styles.brandTagText}>MOBICARE</Text>
        </View>
        <Text style={styles.headerTitle}>Profil Pelanggan</Text>
        <Text style={styles.headerSubtitle}>
          Kelola informasi akun dan kendaraan terdaftar Anda
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#FADBB2" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {user?.nama || "Pelanggan"}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {user?.email || "-"}
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={11} color="#564B5E" />
                <Text style={styles.roleBadgeText}>
                  {user?.role?.toUpperCase() || "PELANGGAN"}
                </Text>
              </View>
              {user?.no_hp ? (
                <View style={styles.phoneBadge}>
                  <Ionicons name="call" size={11} color="#564B5E" />
                  <Text style={styles.phoneBadgeText}>{user.no_hp}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {user?.address ? (
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={16} color="#937D7A" />
            <Text style={styles.addressText}>{user.address}</Text>
          </View>
        ) : null}

        {/* Section: Kendaraan Saya */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>Kendaraan Saya</Text>
              <Text style={styles.sectionSub}>
                Kendaraan yang terhubung ke akun Anda
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={16} color="#FADBB2" />
              <Text style={styles.addBtnText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {loadingKendaraan ? (
            <ActivityIndicator
              size="small"
              color="#564B5E"
              style={{ marginVertical: 14 }}
            />
          ) : kendaraanList.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="car-outline" size={32} color="#937D7A" />
              <Text style={styles.emptyText}>Belum ada kendaraan terdaftar.</Text>
            </View>
          ) : (
            kendaraanList.map((k, idx) => (
              <View
                key={k.id}
                style={[
                  styles.kendaraanRow,
                  idx === kendaraanList.length - 1 && styles.kendaraanRowLast,
                ]}
              >
                <View style={styles.platBadge}>
                  <Text style={styles.platText}>{k.plat_nomor}</Text>
                </View>
                <View style={styles.kendaraanDetail}>
                  <Text style={styles.kendaraanMerk}>{k.merk} {k.tipe}</Text>
                  <Text style={styles.kendaraanSub}>
                    Tahun {k.tahun} {k.warna ? `• ${k.warna}` : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteKendaraan(k.id, k.plat_nomor)}
                  activeOpacity={0.75}
                >
                  <Ionicons name="trash-outline" size={17} color="#937D7A" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Section: Tombol Keluar */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={19} color="#564B5E" />
          <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>
          MobiCare • Aplikasi Booking Servis Bengkel • v1.0.0
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
              <Ionicons name="car" size={24} color="#564B5E" />
              <Text style={styles.modalTitle}>Tambah Kendaraan Baru</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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
                  placeholder="Contoh: Vario 160 / Avanza"
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
                  placeholder="Hitam / Merah / Putih"
                  placeholderTextColor="#937D7A"
                  value={warna}
                  onChangeText={setWarna}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddKendaraan}
                disabled={savingKendaraan}
                activeOpacity={0.85}
              >
                {savingKendaraan ? (
                  <ActivityIndicator color="#FADBB2" size="small" />
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
    backgroundColor: "#F5EFEA",
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#564B5E",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#937D7A",
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#564B5E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#937D7A",
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#564B5E",
  },
  profileEmail: {
    fontSize: 13,
    color: "#937D7A",
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FADBB2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#564B5E",
  },
  phoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF6F2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    gap: 4,
  },
  phoneBadgeText: {
    fontSize: 11,
    color: "#564B5E",
    fontWeight: "600",
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#C6B2AE",
  },
  addressText: {
    fontSize: 12,
    color: "#564B5E",
    flex: 1,
    lineHeight: 17,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionHeaderTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#564B5E",
  },
  sectionSub: {
    fontSize: 11,
    color: "#937D7A",
    marginTop: 2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#564B5E",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
    flexShrink: 0,
  },
  addBtnText: {
    color: "#FADBB2",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyBox: {
    alignItems: "center",
    padding: 18,
    backgroundColor: "#FAF6F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFE6DE",
  },
  emptyText: {
    fontSize: 12,
    color: "#937D7A",
    marginTop: 6,
  },
  kendaraanRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE6DE",
    gap: 10,
  },
  kendaraanRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },
  platBadge: {
    backgroundColor: "#564B5E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
  platText: {
    color: "#FADBB2",
    fontWeight: "800",
    fontSize: 11,
  },
  kendaraanDetail: {
    flex: 1,
    minWidth: 0,
  },
  kendaraanMerk: {
    fontSize: 13,
    fontWeight: "800",
    color: "#564B5E",
  },
  kendaraanSub: {
    fontSize: 11,
    color: "#937D7A",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 9,
    backgroundColor: "#FAF6F2",
    borderWidth: 1,
    borderColor: "#EFE6DE",
    flexShrink: 0,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FADBB2",
    borderWidth: 1,
    borderColor: "#937D7A",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 16,
    gap: 8,
  },
  logoutButtonText: {
    color: "#564B5E",
    fontSize: 14,
    fontWeight: "800",
  },
  appVersion: {
    textAlign: "center",
    fontSize: 11,
    color: "#937D7A",
    fontWeight: "500",
  },
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#564B5E",
  },
  inputGroup: {
    marginBottom: 12,
  },
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
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    backgroundColor: "#FAF6F2",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  modalCancelBtnText: {
    color: "#564B5E",
    fontWeight: "700",
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: "#564B5E",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  modalSaveBtnText: {
    color: "#FADBB2",
    fontWeight: "800",
  },
});