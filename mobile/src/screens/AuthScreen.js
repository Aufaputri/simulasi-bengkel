// // import React, { useState } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TextInput,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Modal,
// //   Alert,
// //   ScrollView,
// //   KeyboardAvoidingView,
// //   Platform,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useAuth } from "../context/AuthContext";
// // import { DEFAULT_API_URL } from "../api/api";

// // export default function AuthScreen() {
// //   const { login, register, apiUrl, updateApiUrl, resetApiUrl } = useAuth();

// //   const [isLoginTab, setIsLoginTab] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);

// //   // Form states
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [nama, setNama] = useState("");
// //   const [noHp, setNoHp] = useState("");
// //   const [address, setAddress] = useState("");

// //   // Modal Setting Server IP
// //   const [showServerModal, setShowServerModal] = useState(false);
// //   const [inputUrl, setInputUrl] = useState(apiUrl);

// //   const handleLogin = async () => {
// //     if (!email.trim() || !password) {
// //       Alert.alert("Perhatian", "Email dan kata sandi wajib diisi!");
// //       return;
// //     }

// //     setLoading(true);
// //     const result = await login(email, password);
// //     setLoading(false);

// //     if (!result.success) {
// //       Alert.alert("Login Gagal", result.message);
// //     }
// //   };

// //   const handleRegister = async () => {
// //     if (!nama.trim() || !email.trim() || !password || !noHp.trim()) {
// //       Alert.alert(
// //         "Perhatian",
// //         "Nama lengkap, email, kata sandi, dan nomor HP wajib diisi!"
// //       );
// //       return;
// //     }

// //     if (password.length < 6) {
// //       Alert.alert("Perhatian", "Kata sandi minimal 6 karakter!");
// //       return;
// //     }

// //     setLoading(true);
// //     const result = await register({
// //       nama,
// //       email,
// //       password,
// //       no_hp: noHp,
// //       address,
// //     });
// //     setLoading(false);

// //     if (!result.success) {
// //       Alert.alert("Registrasi Gagal", result.message);
// //     } else {
// //       Alert.alert("Berhasil", "Akun berhasil dibuat! Selamat datang.");
// //     }
// //   };

// //   const handleSaveServerUrl = async () => {
// //     if (!inputUrl.trim()) {
// //       Alert.alert("Perhatian", "URL Server tidak boleh kosong");
// //       return;
// //     }
// //     await updateApiUrl(inputUrl);
// //     setShowServerModal(false);
// //     Alert.alert("Sukses", `URL Server diubah ke:\n${inputUrl}`);
// //   };

// //   const handleResetServerUrl = async () => {
// //     await resetApiUrl();
// //     setInputUrl(DEFAULT_API_URL);
// //     setShowServerModal(false);
// //     Alert.alert("Sukses", `URL Server direset ke default:\n${DEFAULT_API_URL}`);
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       style={styles.container}
// //       behavior={Platform.OS === "ios" ? "padding" : undefined}
// //     >
// //       <ScrollView
// //         contentContainerStyle={styles.scrollContent}
// //         keyboardShouldPersistTaps="handled"
// //       >
// //         {/* Header Bar dengan Tombol Konfigurasi Server */}
// //         <View style={styles.topBar}>
// //           <TouchableOpacity
// //             style={styles.serverButton}
// //             onPress={() => {
// //               setInputUrl(apiUrl);
// //               setShowServerModal(true);
// //             }}
// //           >
// //             <Ionicons name="server-outline" size={16} color="#4B5563" />
// //             <Text style={styles.serverButtonText} numberOfLines={1}>
// //               {apiUrl.replace("http://", "")}
// //             </Text>
// //             <Ionicons name="settings-outline" size={14} color="#6B7280" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Brand / Logo Section */}
// //         <View style={styles.header}>
// //           <View style={styles.iconCircle}>
// //             <Ionicons name="car-sport" size={42} color="#2563EB" />
// //           </View>
// //           <Text style={styles.title}>Bengkel Mandiri Motor</Text>
// //           <Text style={styles.subtitle}>
// //             Aplikasi Booking Servis Kendaraan Cepat & Terpercaya
// //           </Text>
// //         </View>

// //         {/* Tab Toggle: Masuk / Daftar */}
// //         <View style={styles.tabContainer}>
// //           <TouchableOpacity
// //             style={[styles.tabButton, isLoginTab && styles.tabButtonActive]}
// //             onPress={() => setIsLoginTab(true)}
// //           >
// //             <Text
// //               style={[styles.tabText, isLoginTab && styles.tabTextActive]}
// //             >
// //               Masuk
// //             </Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             style={[styles.tabButton, !isLoginTab && styles.tabButtonActive]}
// //             onPress={() => setIsLoginTab(false)}
// //           >
// //             <Text
// //               style={[styles.tabText, !isLoginTab && styles.tabTextActive]}
// //             >
// //               Daftar Akun
// //             </Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Form Card */}
// //         <View style={styles.card}>
// //           {!isLoginTab && (
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.label}>Nama Lengkap *</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Ionicons
// //                   name="person-outline"
// //                   size={20}
// //                   color="#9CA3AF"
// //                   style={styles.inputIcon}
// //                 />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Contoh: Budi Santoso"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={nama}
// //                   onChangeText={setNama}
// //                   autoCapitalize="words"
// //                 />
// //               </View>
// //             </View>
// //           )}

// //           <View style={styles.inputGroup}>
// //             <Text style={styles.label}>Alamat Email *</Text>
// //             <View style={styles.inputWrapper}>
// //               <Ionicons
// //                 name="mail-outline"
// //                 size={20}
// //                 color="#9CA3AF"
// //                 style={styles.inputIcon}
// //               />
// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="nama@email.com"
// //                 placeholderTextColor="#9CA3AF"
// //                 value={email}
// //                 onChangeText={setEmail}
// //                 keyboardType="email-address"
// //                 autoCapitalize="none"
// //               />
// //             </View>
// //           </View>

// //           {!isLoginTab && (
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.label}>Nomor WhatsApp / HP *</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Ionicons
// //                   name="call-outline"
// //                   size={20}
// //                   color="#9CA3AF"
// //                   style={styles.inputIcon}
// //                 />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="08123456789"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={noHp}
// //                   onChangeText={setNoHp}
// //                   keyboardType="phone-pad"
// //                 />
// //               </View>
// //             </View>
// //           )}

// //           {!isLoginTab && (
// //             <View style={styles.inputGroup}>
// //               <Text style={styles.label}>Alamat Domisili (Opsional)</Text>
// //               <View style={styles.inputWrapper}>
// //                 <Ionicons
// //                   name="location-outline"
// //                   size={20}
// //                   color="#9CA3AF"
// //                   style={styles.inputIcon}
// //                 />
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="Jl. Merdeka No. 10, Jakarta"
// //                   placeholderTextColor="#9CA3AF"
// //                   value={address}
// //                   onChangeText={setAddress}
// //                 />
// //               </View>
// //             </View>
// //           )}

// //           <View style={styles.inputGroup}>
// //             <Text style={styles.label}>Kata Sandi *</Text>
// //             <View style={styles.inputWrapper}>
// //               <Ionicons
// //                 name="lock-closed-outline"
// //                 size={20}
// //                 color="#9CA3AF"
// //                 style={styles.inputIcon}
// //               />
// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Minimal 6 karakter"
// //                 placeholderTextColor="#9CA3AF"
// //                 value={password}
// //                 onChangeText={setPassword}
// //                 secureTextEntry={!showPassword}
// //               />
// //               <TouchableOpacity
// //                 onPress={() => setShowPassword(!showPassword)}
// //                 style={styles.eyeIcon}
// //               >
// //                 <Ionicons
// //                   name={showPassword ? "eye-off-outline" : "eye-outline"}
// //                   size={20}
// //                   color="#6B7280"
// //                 />
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           <TouchableOpacity
// //             style={[styles.submitButton, loading && styles.submitButtonDisabled]}
// //             onPress={isLoginTab ? handleLogin : handleRegister}
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <ActivityIndicator color="#FFFFFF" />
// //             ) : (
// //               <Text style={styles.submitButtonText}>
// //                 {isLoginTab ? "Masuk Sekarang" : "Daftar Akun Baru"}
// //               </Text>
// //             )}
// //           </TouchableOpacity>
// //         </View>

// //         {/* Quick hint */}
// //         <View style={styles.footer}>
// //           <Text style={styles.footerText}>
// //             Uji Level RPL SMK Taruna Bhakti 2026/2027
// //           </Text>
// //         </View>
// //       </ScrollView>

// //       {/* Modal Pengaturan Server IP */}
// //       <Modal
// //         visible={showServerModal}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={() => setShowServerModal(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <View style={styles.modalHeader}>
// //               <Ionicons name="server" size={24} color="#2563EB" />
// //               <Text style={styles.modalTitle}>Pengaturan IP Server</Text>
// //             </View>

// //             <Text style={styles.modalDescription}>
// //               Jika menggunakan HP fisik via Expo Go, ubah URL ke IP Wi-Fi
// //               komputer Anda (contoh: http://192.168.1.5:3000).
// //             </Text>

// //             <TextInput
// //               style={styles.modalInput}
// //               value={inputUrl}
// //               onChangeText={setInputUrl}
// //               placeholder="http://192.168.x.x:3000"
// //               autoCapitalize="none"
// //               autoCorrect={false}
// //             />

// //             <View style={styles.quickSelectContainer}>
// //               <Text style={styles.quickSelectLabel}>Pilihan Cepat:</Text>
// //               <View style={styles.quickButtonsRow}>
// //                 <TouchableOpacity
// //                   style={styles.quickBadge}
// //                   onPress={() => setInputUrl("http://localhost:3000")}
// //                 >
// //                   <Text style={styles.quickBadgeText}>Web (localhost)</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={styles.quickBadge}
// //                   onPress={() => setInputUrl("http://10.0.2.2:3000")}
// //                 >
// //                   <Text style={styles.quickBadgeText}>Android Emulator</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>

// //             <View style={styles.modalActions}>
// //               <TouchableOpacity
// //                 style={styles.modalResetButton}
// //                 onPress={handleResetServerUrl}
// //               >
// //                 <Text style={styles.modalResetText}>Reset Default</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={styles.modalSaveButton}
// //                 onPress={handleSaveServerUrl}
// //               >
// //                 <Text style={styles.modalSaveText}>Simpan</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <TouchableOpacity
// //               style={styles.modalCloseButton}
// //               onPress={() => setShowServerModal(false)}
// //             >
// //               <Text style={styles.modalCloseText}>Tutup</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F3F4F6",
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     paddingHorizontal: 20,
// //     paddingTop: Platform.OS === "android" ? 40 : 20,
// //     paddingBottom: 30,
// //     justifyContent: "center",
// //   },
// //   topBar: {
// //     flexDirection: "row",
// //     justifyContent: "flex-end",
// //     marginBottom: 10,
// //   },
// //   serverButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#E5E7EB",
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     gap: 6,
// //     maxWidth: "80%",
// //   },
// //   serverButtonText: {
// //     fontSize: 12,
// //     color: "#374151",
// //     fontWeight: "500",
// //   },
// //   header: {
// //     alignItems: "center",
// //     marginBottom: 24,
// //   },
// //   iconCircle: {
// //     width: 76,
// //     height: 76,
// //     borderRadius: 38,
// //     backgroundColor: "#DBEAFE",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 12,
// //   },
// //   title: {
// //     fontSize: 22,
// //     fontWeight: "bold",
// //     color: "#1F2937",
// //     textAlign: "center",
// //   },
// //   subtitle: {
// //     fontSize: 13,
// //     color: "#6B7280",
// //     textAlign: "center",
// //     marginTop: 4,
// //     paddingHorizontal: 20,
// //   },
// //   tabContainer: {
// //     flexDirection: "row",
// //     backgroundColor: "#E5E7EB",
// //     borderRadius: 12,
// //     padding: 4,
// //     marginBottom: 20,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     paddingVertical: 10,
// //     alignItems: "center",
// //     borderRadius: 10,
// //   },
// //   tabButtonActive: {
// //     backgroundColor: "#FFFFFF",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   tabText: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: "#6B7280",
// //   },
// //   tabTextActive: {
// //     color: "#2563EB",
// //   },
// //   card: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     padding: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 5,
// //     elevation: 3,
// //   },
// //   inputGroup: {
// //     marginBottom: 14,
// //   },
// //   label: {
// //     fontSize: 13,
// //     fontWeight: "600",
// //     color: "#374151",
// //     marginBottom: 6,
// //   },
// //   inputWrapper: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#D1D5DB",
// //     borderRadius: 10,
// //     backgroundColor: "#F9FAFB",
// //     paddingHorizontal: 12,
// //   },
// //   inputIcon: {
// //     marginRight: 8,
// //   },
// //   eyeIcon: {
// //     padding: 6,
// //   },
// //   input: {
// //     flex: 1,
// //     paddingVertical: 10,
// //     fontSize: 14,
// //     color: "#111827",
// //   },
// //   submitButton: {
// //     backgroundColor: "#2563EB",
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     marginTop: 10,
// //     shadowColor: "#2563EB",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 5,
// //     elevation: 4,
// //   },
// //   submitButtonDisabled: {
// //     backgroundColor: "#93C5FD",
// //   },
// //   submitButtonText: {
// //     color: "#FFFFFF",
// //     fontSize: 15,
// //     fontWeight: "bold",
// //   },
// //   footer: {
// //     marginTop: 24,
// //     alignItems: "center",
// //   },
// //   footerText: {
// //     fontSize: 11,
// //     color: "#9CA3AF",
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     padding: 20,
// //   },
// //   modalContent: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     padding: 20,
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     color: "#111827",
// //   },
// //   modalDescription: {
// //     fontSize: 13,
// //     color: "#6B7280",
// //     marginBottom: 14,
// //     lineHeight: 18,
// //   },
// //   modalInput: {
// //     borderWidth: 1,
// //     borderColor: "#D1D5DB",
// //     borderRadius: 8,
// //     padding: 10,
// //     fontSize: 14,
// //     color: "#111827",
// //     backgroundColor: "#F9FAFB",
// //     marginBottom: 12,
// //   },
// //   quickSelectContainer: {
// //     marginBottom: 16,
// //   },
// //   quickSelectLabel: {
// //     fontSize: 12,
// //     color: "#4B5563",
// //     marginBottom: 6,
// //     fontWeight: "500",
// //   },
// //   quickButtonsRow: {
// //     flexDirection: "row",
// //     gap: 8,
// //   },
// //   quickBadge: {
// //     backgroundColor: "#EFF6FF",
// //     borderWidth: 1,
// //     borderColor: "#BFDBFE",
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     borderRadius: 8,
// //   },
// //   quickBadgeText: {
// //     fontSize: 11,
// //     color: "#1D4ED8",
// //     fontWeight: "600",
// //   },
// //   modalActions: {
// //     flexDirection: "row",
// //     gap: 10,
// //     marginBottom: 10,
// //   },
// //   modalResetButton: {
// //     flex: 1,
// //     paddingVertical: 10,
// //     borderWidth: 1,
// //     borderColor: "#D1D5DB",
// //     borderRadius: 8,
// //     alignItems: "center",
// //   },
// //   modalResetText: {
// //     color: "#4B5563",
// //     fontWeight: "600",
// //     fontSize: 13,
// //   },
// //   modalSaveButton: {
// //     flex: 1,
// //     backgroundColor: "#2563EB",
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //     alignItems: "center",
// //   },
// //   modalSaveText: {
// //     color: "#FFFFFF",
// //     fontWeight: "bold",
// //     fontSize: 13,
// //   },
// //   modalCloseButton: {
// //     alignItems: "center",
// //     paddingVertical: 8,
// //   },
// //   modalCloseText: {
// //     color: "#9CA3AF",
// //     fontSize: 13,
// //   },
// // });


// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../context/AuthContext";

// export default function AuthScreen() {
//   const { login, register } = useAuth();

//   const [isLoginTab, setIsLoginTab] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Form states
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [nama, setNama] = useState("");
//   const [noHp, setNoHp] = useState("");
//   const [address, setAddress] = useState("");

//   const handleLogin = async () => {
//     if (!email.trim() || !password) {
//       Alert.alert("Perhatian", "Email dan kata sandi wajib diisi!");
//       return;
//     }

//     setLoading(true);
//     const result = await login(email, password);
//     setLoading(false);

//     if (!result.success) {
//       Alert.alert("Login Gagal", result.message);
//     }
//   };

//   const handleRegister = async () => {
//     if (!nama.trim() || !email.trim() || !password || !noHp.trim()) {
//       Alert.alert(
//         "Perhatian",
//         "Nama lengkap, email, kata sandi, dan nomor HP wajib diisi!"
//       );
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert("Perhatian", "Kata sandi minimal 6 karakter!");
//       return;
//     }

//     setLoading(true);
//     const result = await register({
//       nama,
//       email,
//       password,
//       no_hp: noHp,
//       address,
//     });
//     setLoading(false);

//     if (!result.success) {
//       Alert.alert("Registrasi Gagal", result.message);
//     } else {
//       // Kosongkan field registrasi dan arahkan ke tab Masuk (Login)
//       setNama("");
//       setNoHp("");
//       setAddress("");
//       setPassword("");
//       setIsLoginTab(true);
//       Alert.alert(
//         "Registrasi Berhasil",
//         "Akun Anda sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda."
//       );
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Brand / Logo Section */}
//         <View style={styles.header}>
//           <View style={styles.iconCircle}>
//             <Ionicons name="car-sport" size={42} color="#2563EB" />
//           </View>
//           <Text style={styles.title}>Bengkel Mandiri Motor</Text>
//           <Text style={styles.subtitle}>
//             Aplikasi Booking Servis Kendaraan Cepat & Terpercaya
//           </Text>
//         </View>

//         {/* Tab Toggle: Masuk / Daftar */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tabButton, isLoginTab && styles.tabButtonActive]}
//             onPress={() => setIsLoginTab(true)}
//           >
//             <Text
//               style={[styles.tabText, isLoginTab && styles.tabTextActive]}
//             >
//               Masuk
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tabButton, !isLoginTab && styles.tabButtonActive]}
//             onPress={() => setIsLoginTab(false)}
//           >
//             <Text
//               style={[styles.tabText, !isLoginTab && styles.tabTextActive]}
//             >
//               Daftar Akun
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Form Card */}
//         <View style={styles.card}>
//           {!isLoginTab && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Nama Lengkap *</Text>
//               <View style={styles.inputWrapper}>
//                 <Ionicons
//                   name="person-outline"
//                   size={20}
//                   color="#9CA3AF"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Contoh: Budi Santoso"
//                   placeholderTextColor="#9CA3AF"
//                   value={nama}
//                   onChangeText={setNama}
//                   autoCapitalize="words"
//                 />
//               </View>
//             </View>
//           )}

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Alamat Email *</Text>
//             <View style={styles.inputWrapper}>
//               <Ionicons
//                 name="mail-outline"
//                 size={20}
//                 color="#9CA3AF"
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="nama@email.com"
//                 placeholderTextColor="#9CA3AF"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//             </View>
//           </View>

//           {!isLoginTab && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Nomor WhatsApp / HP *</Text>
//               <View style={styles.inputWrapper}>
//                 <Ionicons
//                   name="call-outline"
//                   size={20}
//                   color="#9CA3AF"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="08123456789"
//                   placeholderTextColor="#9CA3AF"
//                   value={noHp}
//                   onChangeText={setNoHp}
//                   keyboardType="phone-pad"
//                 />
//               </View>
//             </View>
//           )}

//           {!isLoginTab && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Alamat Domisili (Opsional)</Text>
//               <View style={styles.inputWrapper}>
//                 <Ionicons
//                   name="location-outline"
//                   size={20}
//                   color="#9CA3AF"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Jl. Merdeka No. 10, Jakarta"
//                   placeholderTextColor="#9CA3AF"
//                   value={address}
//                   onChangeText={setAddress}
//                 />
//               </View>
//             </View>
//           )}

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Kata Sandi *</Text>
//             <View style={styles.inputWrapper}>
//               <Ionicons
//                 name="lock-closed-outline"
//                 size={20}
//                 color="#9CA3AF"
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Minimal 6 karakter"
//                 placeholderTextColor="#9CA3AF"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeIcon}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye-off-outline" : "eye-outline"}
//                   size={20}
//                   color="#6B7280"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.submitButton, loading && styles.submitButtonDisabled]}
//             onPress={isLoginTab ? handleLogin : handleRegister}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 {isLoginTab ? "Masuk Sekarang" : "Daftar Akun Baru"}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Quick hint */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Uji Level RPL SMK Taruna Bhakti 2026/2027
//           </Text>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F3F4F6",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === "android" ? 40 : 20,
//     paddingBottom: 30,
//     justifyContent: "center",
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   iconCircle: {
//     width: 76,
//     height: 76,
//     borderRadius: 38,
//     backgroundColor: "#DBEAFE",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#1F2937",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 13,
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 4,
//     paddingHorizontal: 20,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#E5E7EB",
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 20,
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: "center",
//     borderRadius: 10,
//   },
//   tabButtonActive: {
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#6B7280",
//   },
//   tabTextActive: {
//     color: "#2563EB",
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.08,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   inputGroup: {
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 6,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 10,
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 12,
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   eyeIcon: {
//     padding: 6,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: "#111827",
//   },
//   submitButton: {
//     backgroundColor: "#2563EB",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#2563EB",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   submitButtonDisabled: {
//     backgroundColor: "#93C5FD",
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "bold",
//   },
//   footer: {
//     marginTop: 24,
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 11,
//     color: "#9CA3AF",
//   },
// });

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen() {
  const { login, register } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [address, setAddress] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Perhatian", "Email dan kata sandi wajib diisi!");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Login Gagal", result.message);
    }
  };

  const handleRegister = async () => {
    if (!nama.trim() || !email.trim() || !password || !noHp.trim()) {
      Alert.alert(
        "Perhatian",
        "Nama lengkap, email, kata sandi, dan nomor HP wajib diisi!"
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Perhatian", "Kata sandi minimal 6 karakter!");
      return;
    }

    setLoading(true);
    const result = await register({
      nama,
      email,
      password,
      no_hp: noHp,
      address,
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert("Registrasi Gagal", result.message);
    } else {
      // Kosongkan field registrasi dan arahkan ke tab Masuk (Login)
      setNama("");
      setNoHp("");
      setAddress("");
      setPassword("");
      setIsLoginTab(true);
      Alert.alert(
        "Registrasi Berhasil",
        "Akun Anda sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand / Logo Section */}
        <View style={styles.header}>
          <View style={styles.badgePill}>
            <Ionicons name="shield-checkmark" size={13} color="#564B5E" />
            <Text style={styles.badgePillText}>MOBICARE</Text>
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="car-sport" size={38} color="#FADBB2" />
          </View>
          <Text style={styles.title}>MobiCare</Text>
          <Text style={styles.subtitle}>
            Aplikasi Booking Servis Kendaraan Cepat & Terpercaya
          </Text>
        </View>

        {/* Tab Toggle: Masuk / Daftar */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, isLoginTab && styles.tabButtonActive]}
            onPress={() => setIsLoginTab(true)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.tabText, isLoginTab && styles.tabTextActive]}
            >
              Masuk
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, !isLoginTab && styles.tabButtonActive]}
            onPress={() => setIsLoginTab(false)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.tabText, !isLoginTab && styles.tabTextActive]}
            >
              Daftar Akun
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {!isLoginTab && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#937D7A"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Budi Santoso"
                  placeholderTextColor="#937D7A"
                  value={nama}
                  onChangeText={setNama}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Email *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={19}
                color="#937D7A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="nama@email.com"
                placeholderTextColor="#937D7A"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {!isLoginTab && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor WhatsApp / HP *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={19}
                  color="#937D7A"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="08123456789"
                  placeholderTextColor="#937D7A"
                  value={noHp}
                  onChangeText={setNoHp}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          {!isLoginTab && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alamat Domisili (Opsional)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="location-outline"
                  size={19}
                  color="#937D7A"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Jl. Merdeka No. 10, Jakarta"
                  placeholderTextColor="#937D7A"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#937D7A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#937D7A"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={19}
                  color="#564B5E"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={isLoginTab ? handleLogin : handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FADBB2" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLoginTab ? "Masuk Sekarang" : "Daftar Akun Baru"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick hint */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            MobiCare • Uji Level RPL SMK Taruna Bhakti 2026/2027
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFEA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 42 : 24,
    paddingBottom: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 22,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FADBB2",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#564B5E",
    letterSpacing: 1,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#564B5E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#937D7A",
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#564B5E",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "#937D7A",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 19,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#C6B2AE",
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#937D7A",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#564B5E",
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#564B5E",
  },
  tabTextActive: {
    color: "#FADBB2",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#C6B2AE",
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#564B5E",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C6B2AE",
    borderRadius: 12,
    backgroundColor: "#FAF6F2",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    padding: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: "#564B5E",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#564B5E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#937D7A",
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#937D7A",
    opacity: 0.75,
  },
  submitButtonText: {
    color: "#FADBB2",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 22,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#937D7A",
    fontWeight: "500",
  },
});