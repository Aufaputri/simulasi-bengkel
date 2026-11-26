// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import api, { formatRupiah } from "../api/api";

// export default function LayananScreen({ onSelectLayananForBooking }) {
//   const [layananList, setLayananList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [search, setSearch] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const fetchLayanan = async () => {
//     try {
//       setErrorMsg("");
//       const res = await api.get("/layanan");
//       if (res.data && res.data.success) {
//         setLayananList(res.data.data || []);
//       } else {
//         setLayananList(res.data || []);
//       }
//     } catch (err) {
//       console.error("Gagal load layanan:", err);
//       setErrorMsg(
//         err.response?.data?.message ||
//           "Gagal memuat katalog layanan. Periksa koneksi backend."
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchLayanan();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchLayanan();
//   };

//   const filteredLayanan = layananList.filter((item) => {
//     const q = search.toLowerCase();
//     const nama = (item.nama_layanan || "").toLowerCase();
//     const deskripsi = (item.deskripsi || "").toLowerCase();
//     return nama.includes(q) || deskripsi.includes(q);
//   });

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <View style={styles.iconBox}>
//           <Ionicons name="construct" size={22} color="#2563EB" />
//         </View>
//         <View style={styles.headerInfo}>
//           <Text style={styles.serviceTitle}>{item.nama_layanan}</Text>
//           <View style={styles.durationBadge}>
//             <Ionicons name="time-outline" size={13} color="#4B5563" />
//             <Text style={styles.durationText}>
//               {item.estimasi_durasi ? `${item.estimasi_durasi} Menit` : "-"}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {item.deskripsi ? (
//         <Text style={styles.serviceDesc}>{item.deskripsi}</Text>
//       ) : (
//         <Text style={[styles.serviceDesc, styles.italic]}>
//           Tidak ada deskripsi layanan.
//         </Text>
//       )}

//       <View style={styles.cardFooter}>
//         <View>
//           <Text style={styles.priceLabel}>Biaya Layanan</Text>
//           <Text style={styles.priceValue}>{formatRupiah(item.harga)}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.bookButton}
//           onPress={() => onSelectLayananForBooking && onSelectLayananForBooking(item)}
//         >
//           <Text style={styles.bookButtonText}>Pilih & Pesan</Text>
//           <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Katalog Layanan Servis</Text>
//         <Text style={styles.headerSubtitle}>
//           Pilih servis terbaik untuk perawatan prima kendaraan Anda
//         </Text>

//         {/* Search Bar */}
//         <View style={styles.searchWrapper}>
//           <Ionicons name="search-outline" size={18} color="#9CA3AF" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Cari layanan (Ganti Oli, Tune Up, Rem...)"
//             placeholderTextColor="#9CA3AF"
//             value={search}
//             onChangeText={setSearch}
//           />
//           {search.length > 0 && (
//             <TouchableOpacity onPress={() => setSearch("")}>
//               <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Content */}
//       {loading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#2563EB" />
//           <Text style={styles.loadingText}>Memuat layanan...</Text>
//         </View>
//       ) : errorMsg ? (
//         <View style={styles.centerContainer}>
//           <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
//           <Text style={styles.errorText}>{errorMsg}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchLayanan}>
//             <Text style={styles.retryButtonText}>Coba Lagi</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredLayanan}
//           keyExtractor={(item) => String(item.id)}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Ionicons name="file-tray-outline" size={48} color="#9CA3AF" />
//               <Text style={styles.emptyTitle}>Layanan Tidak Ditemukan</Text>
//               <Text style={styles.emptySubtitle}>
//                 {search
//                   ? `Tidak ada layanan yang cocok dengan "${search}"`
//                   : "Belum ada katalog layanan yang tersedia."}
//               </Text>
//             </View>
//           }
//         />
//       )}
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
//     marginBottom: 12,
//   },
//   searchWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 42,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 13,
//     color: "#111827",
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 24,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#F3F4F6",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   iconBox: {
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     backgroundColor: "#EFF6FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   serviceTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#1F2937",
//   },
//   durationBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//     marginTop: 4,
//     gap: 4,
//   },
//   durationText: {
//     fontSize: 11,
//     color: "#4B5563",
//     fontWeight: "500",
//   },
//   serviceDesc: {
//     fontSize: 13,
//     color: "#4B5563",
//     lineHeight: 19,
//     marginBottom: 14,
//   },
//   italic: {
//     fontStyle: "italic",
//     color: "#9CA3AF",
//   },
//   cardFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//     paddingTop: 12,
//   },
//   priceLabel: {
//     fontSize: 11,
//     color: "#6B7280",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   priceValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#2563EB",
//   },
//   bookButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//   },
//   bookButtonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 13,
//     color: "#6B7280",
//   },
//   errorText: {
//     marginTop: 12,
//     fontSize: 13,
//     color: "#EF4444",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: "#2563EB",
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 13,
//   },
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
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
// });


import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api, { formatRupiah } from "../api/api";

// Deteksi jenis kendaraan ('motor' | 'mobil') dari field atau nama/merek
export const detectJenisKendaraan = (obj = {}) => {
  const raw = String(
    obj.jenis_kendaraan || obj.kategori || obj.tipe_kendaraan || ""
  )
    .trim()
    .toLowerCase();
  if (raw === "motor" || raw === "motorcycle" || raw === "roda 2") {
    return "motor";
  }
  if (raw === "mobil" || raw === "car" || raw === "roda 4") {
    return "mobil";
  }

  const text = `${obj.nama_layanan || ""} ${obj.deskripsi || ""} ${
    obj.merk || ""
  } ${obj.tipe || ""}`.toLowerCase();

  const carKeywords = [
    "mobil",
    "avanza",
    "xenia",
    "brio",
    "jazz",
    "yaris",
    "innova",
    "fortuner",
    "pajero",
    "ertiga",
    "ayla",
    "agya",
    "rush",
    "terios",
    "spooring",
    "balancing",
    "ac mobil",
  ];
  if (carKeywords.some((kw) => text.includes(kw))) {
    return "mobil";
  }

  return "motor";
};

export default function LayananScreen({ onSelectLayananForBooking }) {
  const [layananList, setLayananList] = useState([]);
  const [kendaraanList, setKendaraanList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("semua"); // 'semua' | 'motor' | 'mobil'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setErrorMsg("");

      const resLayanan = await api.get("/layanan");
      const lData = resLayanan.data?.data || resLayanan.data || [];
      setLayananList(Array.isArray(lData) ? lData : []);

      try {
        const resKendaraan = await api.get("/kendaraan");
        const kData = resKendaraan.data?.data || resKendaraan.data || [];
        setKendaraanList(Array.isArray(kData) ? kData : []);
      } catch (errKendaraan) {
        if (errKendaraan.response?.status === 401) {
          setKendaraanList([]);
        } else {
          console.warn("Gagal load kendaraan:", errKendaraan.message);
        }
      }
    } catch (err) {
      console.error("Gagal load layanan:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Gagal memuat katalog layanan. Periksa koneksi backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredLayanan = layananList.filter((item) => {
    const jenisItem = detectJenisKendaraan(item);
    const matchJenis =
      selectedFilter === "semua" ? true : jenisItem === selectedFilter;

    const q = search.toLowerCase();
    const nama = (item.nama_layanan || "").toLowerCase();
    const deskripsi = (item.deskripsi || "").toLowerCase();
    const matchSearch = nama.includes(q) || deskripsi.includes(q);

    return matchJenis && matchSearch;
  });

  const renderItem = ({ item }) => {
    const jenisItem = detectJenisKendaraan(item);
    const isMobil = jenisItem === "mobil";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, isMobil && styles.iconBoxMobil]}>
            <Ionicons
              name={isMobil ? "car-sport" : "bicycle"}
              size={22}
              color={isMobil ? "#0D9488" : "#2563EB"}
            />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.serviceTitle} numberOfLines={2}>
                {item.nama_layanan}
              </Text>
              <View
                style={[
                  styles.categoryBadge,
                  isMobil ? styles.badgeMobil : styles.badgeMotor,
                ]}
              >
                <Text
                  style={[
                    styles.categoryBadgeText,
                    isMobil ? styles.badgeTextMobil : styles.badgeTextMotor,
                  ]}
                >
                  {isMobil ? "MOBIL" : "MOTOR"}
                </Text>
              </View>
            </View>
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={13} color="#4B5563" />
              <Text style={styles.durationText}>
                {item.estimasi_durasi ? `${item.estimasi_durasi} Menit` : "-"}
              </Text>
            </View>
          </View>
        </View>

        {item.deskripsi ? (
          <Text style={styles.serviceDesc}>{item.deskripsi}</Text>
        ) : (
          <Text style={[styles.serviceDesc, styles.italic]}>
            Tidak ada deskripsi layanan.
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Biaya Layanan</Text>
            <Text style={styles.priceValue}>{formatRupiah(item.harga)}</Text>
          </View>
          {/* <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              onSelectLayananForBooking && onSelectLayananForBooking(item)
            }
          >
            <Text style={styles.bookButtonText}>Pilih & Pesan</Text>
            <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Katalog Layanan Servis</Text>
        <Text style={styles.headerSubtitle}>
          {kendaraanList.length > 0
            ? "Menampilkan semua layanan (Motor & Mobil) — pilih kategori atau lanjut booking sesuai kendaraan"
            : "Menampilkan semua layanan bengkel untuk Motor & Mobil"}
        </Text>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari layanan (Ganti Oli, Tune Up, Rem...)"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Kategori Motor / Mobil */}
        <View style={styles.filterRow}>
          {[
            { key: "semua", label: "Semua" },
            { key: "motor", label: "Motor" },
            { key: "mobil", label: "Mobil" },
          ].map((tab) => {
            const active = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat layanan...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredLayanan}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Layanan Tidak Ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                {search
                  ? `Tidak ada layanan yang cocok dengan "${search}"`
                  : "Belum ada katalog layanan pada kategori ini."}
              </Text>
            </View>
          }
        />
      )}
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
    paddingBottom: 14,
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
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#111827",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconBoxMobil: {
    backgroundColor: "#F0FDFA",
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeMotor: {
    backgroundColor: "#DBEAFE",
  },
  badgeMobil: {
    backgroundColor: "#CCFBF1",
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeTextMotor: {
    color: "#1D4ED8",
  },
  badgeTextMobil: {
    color: "#0F766E",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  serviceDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    marginBottom: 14,
  },
  italic: {
    fontStyle: "italic",
    color: "#9CA3AF",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
  },
  errorText: {
    marginTop: 12,
    fontSize: 13,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});