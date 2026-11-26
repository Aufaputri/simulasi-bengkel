// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// // Default IP backend:
// // - Di Web Browser / iOS Simulator: localhost:3000
// // - Di Android Emulator: 10.0.2.2:3000
// // - Di HP Fisik (Expo Go): bisa disesuaikan lewat menu pengaturan aplikasi
// export const DEFAULT_API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000"
//     : "http://localhost:3000";

// const api = axios.create({
//   baseURL: DEFAULT_API_URL,
//   timeout: 10000,
// });

// // Interceptor untuk menyisipkan Token JWT dan membaca custom Base URL
// api.interceptors.request.use(async (config) => {
//   try {
//     const customUrl = await AsyncStorage.getItem("custom_api_url");
//     if (customUrl) {
//       config.baseURL = customUrl;
//     }

//     const token = await AsyncStorage.getItem("user_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.error("Error membaca konfigurasi auth:", error);
//   }
//   return config;
// });

// export const formatRupiah = (number) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(Number(number || 0));
// };

// export default api;

import { Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IPv4 Wi-Fi laptop untuk koneksi dari HP fisik / Expo Go ke backend Express
export const DEFAULT_API_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.1.22:3000";

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
});

// Interceptor untuk menyisipkan Token JWT dan membaca custom Base URL jika ada
api.interceptors.request.use(async (config) => {
  try {
    const customUrl = await AsyncStorage.getItem("custom_api_url");
    if (customUrl && customUrl.trim()) {
      config.baseURL = customUrl.trim();
    }

    const rawToken = await AsyncStorage.getItem("user_token");
    if (rawToken && rawToken.trim()) {
      const cleanToken = rawToken.trim().replace(/^Bearer\s+/i, "");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
  } catch (error) {
    console.error("Error membaca konfigurasi auth:", error);
  }
  return config;
});

export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number || 0));
};

export default api;