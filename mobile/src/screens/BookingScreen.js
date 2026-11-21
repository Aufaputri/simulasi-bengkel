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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api, { formatRupiah } from "../api/api";

export default function BookingScreen({
  initialSelectedLayananId,
  onBookingSuccess,
  onNavigateToKendaraan,
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
  const [jamBooking, setJamBooking] = useState("09:00");
  const [keluhan, setKeluhan] = useState("");

  // Modal Tambah Kendaraan Cepat
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [merk, setMerk] = useState("");
  const [tipe, setTipe] = useState("");
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [platNomor, setPlatNomor] = useState("");
  const [warna, setWarna] = useState("");
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Inisialisasi tanggal default (Besok)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setTanggalBooking(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Fetch kendaraan dan layanan
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

      // Pilih kendaraan pertama secara otomatis jika tersedia
      if (kData.length > 0 && !selectedKendaraanId) {
        setSelectedKendaraanId(kData[0].id);
      }

      // Jika ada initial layanan dari LayananScreen
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

  // Sync initialSelectedLayananId jika berubah
  useEffect(() => {
    if (initialSelectedLayananId) {
      setSelectedLayananIds((prev) =>
        prev.includes(initialSelectedLayananId)
          ? prev
          : [...prev, initialSelectedLayananId]
      );
    }
  }, [initialSelectedLayananId]);

  // Toggle checklist layanan
  const toggleLayanan = (id) => {
    if (selectedLayananIds.includes(id)) {
      setSelectedLayananIds(selectedLayananIds.filter((item) => item !== id));
    } else {
      setSelectedLayananIds([...selectedLayananIds, id]);
    }
  };

  // Hitung total harga & estimasi durasi
  const selectedLayananObjects = layananList.filter((item) =>
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

  // Handle Tambah Kendaraan Baru
  const handleSaveKendaraan = async () => {
    if (!merk.trim() || !tipe.trim() || !tahun || !platNomor.trim()) {
      Alert.alert("Perhatian", "Merek, tipe, tahun, dan plat nomor wajib diisi!");
      return;
    }

    setSavingVehicle(true);
    try {
      const res = await api.post("/kendaraan", {
        merk: merk.trim(),
        tipe: tipe.trim(),
        tahun: Number(tahun),
        plat_nomor: platNomor.trim().toUpperCase(),
        warna: warna.trim() || null,
      });

      if (res.data?.success) {
        Alert.alert("Sukses", "Kendaraan berhasil ditambahkan!");
        setShowAddVehicleModal(false);
        setMerk("");
        setTipe("");
        setPlatNomor("");
        setWarna("");

        // Refresh list kendaraan dan pilih yang baru
        const resK = await api.get("/kendaraan");
        const kData = resK.data?.data || resK.data || [];
        setKendaraanList(kData);
        if (res.data.data?.id) {
          setSelectedKendaraanId(res.data.data.id);
        } else if (kData.length > 0) {
          setSelectedKendaraanId(kData[kData.length - 1].id);
        }
      }
    } catch (err) {
      Alert.alert(
        "Gagal Menambah Kendaraan",
        err.response?.data?.message || err.message || "Terjadi kesalahan."
      );
    } finally {
      setSavingVehicle(false);
    }
  };

  // Handle Submit Booking
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

    if (!jamBooking.trim()) {
      Alert.alert("Pilih Jam", "Silakan pilih jam kedatangan servis.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        kendaraan_id: Number(selectedKendaraanId),
        layanan_ids: selectedLayananIds,
        tanggal_booking: tanggalBooking.trim(),
        jam_booking: jamBooking.trim(),
        keluhan: keluhan.trim() || null,
      };

      const res = await api.post("/booking", payload);

      if (res.data?.success) {
        const kode = res.data.data?.kode_booking || "-";
        Alert.alert(
          "Booking Berhasil!",
          `Pesanan servis Anda berhasil dibuat dengan Kode: ${kode}.\n\nSilakan datang ke bengkel sesuai jadwal yang ditentukan.`,
          [
            {
              text: "Lihat Riwayat",
              onPress: () => {
                // Reset form
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

  // Slot jam operasional
  const jamSlots = [
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Menyiapkan formulir booking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Formulir Booking Servis</Text>
        <Text style={styles.headerSubtitle}>
          Daftarkan jadwal servis berkala atau perbaikan kendaraan Anda
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* LANGKAH 1: PILIH KENDARAAN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Pilih Kendaraan Anda</Text>
          </View>

          {kendaraanList.length === 0 ? (
            <View style={styles.emptyKendaraanBox}>
              <Ionicons name="car-outline" size={36} color="#9CA3AF" />
              <Text style={styles.emptyKendaraanText}>
                Anda belum mendaftarkan data kendaraan.
              </Text>
              <TouchableOpacity
                style={styles.addKendaraanBtn}
                onPress={() => setShowAddVehicleModal(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
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
                  return (
                    <TouchableOpacity
                      key={k.id}
                      style={[
                        styles.vehicleCard,
                        isSelected && styles.vehicleCardActive,
                      ]}
                      onPress={() => setSelectedKendaraanId(k.id)}
                    >
                      <View style={styles.vehicleCardTop}>
                        <View style={styles.platBadge}>
                          <Text style={styles.platText}>{k.plat_nomor}</Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#2563EB"
                          />
                        )}
                      </View>
                      <Text style={styles.vehicleName}>
                        {k.merk} {k.tipe}
                      </Text>
                      <Text style={styles.vehicleSub}>
                        {k.tahun} {k.warna ? `• ${k.warna}` : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                style={styles.secondaryAddBtn}
                onPress={() => setShowAddVehicleModal(true)}
              >
                <Ionicons name="add" size={16} color="#2563EB" />
                <Text style={styles.secondaryAddBtnText}>
                  Tambah Kendaraan Lain
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* LANGKAH 2: PILIH LAYANAN (MULTI-SELECT) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View>
              <Text style={styles.sectionTitle}>Pilih Layanan Servis</Text>
              <Text style={styles.sectionSub}>Bisa memilih lebih dari 1</Text>
            </View>
          </View>

          {layananList.map((layanan) => {
            const isChecked = selectedLayananIds.includes(layanan.id);
            return (
              <TouchableOpacity
                key={layanan.id}
                style={[
                  styles.serviceRow,
                  isChecked && styles.serviceRowActive,
                ]}
                onPress={() => toggleLayanan(layanan.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isChecked && styles.checkboxActive,
                  ]}
                >
                  {isChecked && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
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
                    ⏱ {layanan.estimasi_durasi || 30} menit
                  </Text>
                </View>
                <Text style={styles.serviceRowPrice}>
                  {formatRupiah(layanan.harga)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LANGKAH 3: JADWAL KEDATANGAN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Jadwal Kedatangan Servis</Text>
          </View>

          {/* Tanggal */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tanggal Booking (YYYY-MM-DD)</Text>
            <View style={styles.inputFieldWrapper}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#6B7280"
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                value={tanggalBooking}
                onChangeText={setTanggalBooking}
                placeholder="2026-11-25"
                placeholderTextColor="#9CA3AF"
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
              >
                <Text style={styles.quickDateChipText}>Lusa</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Jam Kedatangan */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pilih Jam Kedatangan</Text>
            <View style={styles.timeSlotGrid}>
              {jamSlots.map((slot) => {
                const isSelected = jamBooking === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlotChip,
                      isSelected && styles.timeSlotChipActive,
                    ]}
                    onPress={() => setJamBooking(slot)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        isSelected && styles.timeSlotTextActive,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
            placeholder="Tuliskan keluhan atau gejala kendala pada kendaraan Anda (contoh: Rem bunyi berdecit saat diinjak, tarikan mesin kurang bertenaga)..."
            placeholderTextColor="#9CA3AF"
            value={keluhan}
            onChangeText={setKeluhan}
          />
        </View>

        {/* RINGKASAN & SUBMIT */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Booking</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Layanan Dipilih:</Text>
            <Text style={styles.summaryValue}>
              {selectedLayananIds.length} Layanan
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
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  Kirim Booking Sekarang
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL TAMBAH KENDARAAN */}
      <Modal
        visible={showAddVehicleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddVehicleModal(false)}
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
                  placeholder="Contoh: Vario 160 / Avanza Veloz"
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
                <Text style={styles.modalInputLabel}>Warna Kendaraan (Opsional)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Hitam Metalik / Putih"
                  placeholderTextColor="#9CA3AF"
                  value={warna}
                  onChangeText={setWarna}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddVehicleModal(false)}
              >
                <Text style={styles.modalCancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveKendaraan}
                disabled={savingVehicle}
              >
                {savingVehicle ? (
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
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  sectionSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  vehicleScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  vehicleCard: {
    width: 170,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  vehicleCardActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  vehicleCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  platBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  platText: {
    color: "#F9FAFB",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
  },
  vehicleSub: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  emptyKendaraanBox: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyKendaraanText: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 8,
    textAlign: "center",
  },
  addKendaraanBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  addKendaraanBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  secondaryAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    gap: 4,
  },
  secondaryAddBtnText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  serviceRowActive: {
    backgroundColor: "#F8FAFC",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  serviceRowDetails: {
    flex: 1,
  },
  serviceRowName: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  serviceRowNameActive: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  serviceRowDur: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  serviceRowPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2563EB",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  inputFieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    height: 42,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
  },
  quickDateRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  quickDateChip: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  quickDateChipText: {
    fontSize: 11,
    color: "#1D4ED8",
    fontWeight: "600",
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlotChip: {
    width: "22%",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  timeSlotChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  timeSlotText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  timeSlotTextActive: {
    color: "#FFFFFF",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    fontSize: 13,
    color: "#111827",
    textAlignVertical: "top",
    minHeight: 80,
  },
  summaryCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#94A3B8",
  },
  summaryValue: {
    fontSize: 13,
    color: "#F1F5F9",
    fontWeight: "500",
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#38BDF8",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#475569",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
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
    marginTop: 16,
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
