import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api, { formatRupiah } from "../api/api";

const STATUS_FILTERS = ["Semua", "Menunggu", "Diproses", "Selesai"];

export default function RiwayatScreen({ onNavigateToBooking }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  // Modal Detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/booking");
      if (res.data?.success) {
        setBookings(res.data.data || []);
      } else {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error("Gagal load riwayat:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
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
        bg: "#DBEAFE",
        text: "#1D4ED8",
        icon: "time",
        label: "Diproses",
      };
    }
    return {
      bg: "#FEF3C7",
      text: "#B45309",
      icon: "hourglass-outline",
      label: "Menunggu",
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
    const layananList = item.layanan || item.layanan_list || [];

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedBooking(item);
          setDetailModalVisible(true);
        }}
      >
        {/* Top: Kode & Status */}
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.kodeBooking}>{item.kode_booking || `#${item.id}`}</Text>
            <Text style={styles.tglJamText}>
              📅 {formatDate(item.tanggal_booking)} • ⏰ {item.jam_booking || "-"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon} size={13} color={badge.text} />
            <Text style={[styles.statusText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* Mid: Kendaraan & Layanan */}
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
              <Ionicons name="construct-outline" size={14} color="#6B7280" />
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

        {/* Bottom: Total & Action */}
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.totalLabel}>Estimasi Biaya</Text>
            <Text style={styles.totalValue}>
              {formatRupiah(item.total_harga || 0)}
            </Text>
          </View>
          <View style={styles.detailLink}>
            <Text style={styles.detailLinkText}>Lihat Detail</Text>
            <Ionicons name="chevron-forward" size={14} color="#2563EB" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Servis Saya</Text>
        <Text style={styles.headerSubtitle}>
          Pantau proses dan histori perawatan kendaraan Anda secara real-time
        </Text>

        {/* Status Filters */}
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

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat riwayat booking...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={54} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Belum Ada Booking</Text>
              <Text style={styles.emptySubtitle}>
                {selectedFilter !== "Semua"
                  ? `Tidak ada transaksi servis dengan status "${selectedFilter}".`
                  : "Anda belum pernah memesan booking servis."}
              </Text>
              <TouchableOpacity
                style={styles.newBookingBtn}
                onPress={() => onNavigateToBooking && onNavigateToBooking()}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.newBookingBtnText}>Pesan Servis Sekarang</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

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
                  >
                    <Ionicons name="close" size={22} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {/* Status Banner */}
                  {(() => {
                    const badge = getStatusBadgeStyle(selectedBooking.status);
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
                            Status: {badge.label}
                          </Text>
                          <Text style={styles.modalStatusHint}>
                            {selectedBooking.status === "Menunggu"
                              ? "Menunggu kedatangan dan konfirmasi montir bengkel."
                              : selectedBooking.status === "Diproses"
                              ? "Kendaraan sedang dalam pengerjaan oleh tim mekanik."
                              : "Pengerjaan servis selesai. Kendaraan siap diambil."}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}

                  {/* Info Jadwal & Kendaraan */}
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

                  {/* Keluhan */}
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

                  {/* Rincian Layanan */}
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Layanan Dipesan</Text>
                    {(
                      selectedBooking.layanan ||
                      selectedBooking.layanan_list ||
                      []
                    ).map((lay, idx) => (
                      <View key={idx} style={styles.serviceItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.serviceItemName}>
                            {lay.nama_layanan || lay}
                          </Text>
                          {lay.estimasi_durasi ? (
                            <Text style={styles.serviceItemDur}>
                              Estimasi {lay.estimasi_durasi} Menit
                            </Text>
                          ) : null}
                        </View>
                        <Text style={styles.serviceItemPrice}>
                          {formatRupiah(lay.harga || 0)}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.serviceTotalRow}>
                      <Text style={styles.serviceTotalLabel}>Total Biaya</Text>
                      <Text style={styles.serviceTotalValue}>
                        {formatRupiah(selectedBooking.total_harga || 0)}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setDetailModalVisible(false)}
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
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
  filterScroll: {
    gap: 8,
    paddingBottom: 4,
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
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  kodeBooking: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
  },
  tglJamText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  cardMid: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  platBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 11,
  },
  vehicleDesc: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  layananPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  layananPreviewText: {
    fontSize: 12,
    color: "#4B5563",
    flex: 1,
  },
  keluhanPreview: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  keluhanLabel: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB",
  },
  detailLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
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
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  newBookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  newBookingBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
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
  modalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  modalKode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  modalSubKode: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalCloseIcon: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 16,
  },
  modalStatusBanner: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 14,
    alignItems: "flex-start",
  },
  modalStatusTitle: {
    fontSize: 13,
    fontWeight: "bold",
  },
  modalStatusHint: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  platBadgeSm: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platTextSm: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 11,
  },
  keluhanTextFull: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
  serviceItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  serviceItemName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
  },
  serviceItemDur: {
    fontSize: 10,
    color: "#6B7280",
  },
  serviceItemPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563EB",
  },
  serviceTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    marginTop: 4,
  },
  serviceTotalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
  },
  serviceTotalValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB",
  },
  modalCloseBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 13,
  },
});
