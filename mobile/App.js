import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthScreen from "./src/screens/AuthScreen";
import LayananScreen from "./src/screens/LayananScreen";
import BookingScreen from "./src/screens/BookingScreen";
import RiwayatScreen from "./src/screens/RiwayatScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

function MainApp() {
  const { user, token, loading } = useAuth();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("layanan");
  const [preselectedLayananId, setPreselectedLayananId] = useState(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  // Jika belum login, tampilkan layar Auth
  if (!user || !token) {
    return <AuthScreen />;
  }

  const handleSelectLayananForBooking = (layanan) => {
    setPreselectedLayananId(layanan.id);
    setActiveTab("booking");
  };

  const handleBookingSuccess = () => {
    setPreselectedLayananId(null);
    setActiveTab("riwayat");
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "layanan":
        return (
          <LayananScreen
            onSelectLayananForBooking={handleSelectLayananForBooking}
          />
        );
      case "booking":
        return (
          <BookingScreen
            initialSelectedLayananId={preselectedLayananId}
            onBookingSuccess={handleBookingSuccess}
          />
        );
      case "riwayat":
        return (
          <RiwayatScreen
            onNavigateToBooking={() => setActiveTab("booking")}
          />
        );
      case "profil":
        return <ProfileScreen />;
      default:
        return <LayananScreen />;
    }
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { paddingTop: Platform.OS === "android" ? insets.top : 0 },
      ]}
    >
      <StatusBar style="dark" />

      {/* Main Screen Content */}
      <View style={styles.contentArea}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("layanan")}
        >
          <Ionicons
            name={activeTab === "layanan" ? "speedometer" : "speedometer-outline"}
            size={22}
            color={activeTab === "layanan" ? "#2563EB" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "layanan" && styles.navLabelActive,
            ]}
          >
            Layanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setPreselectedLayananId(null);
            setActiveTab("booking");
          }}
        >
          <Ionicons
            name={activeTab === "booking" ? "calendar" : "calendar-outline"}
            size={22}
            color={activeTab === "booking" ? "#2563EB" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "booking" && styles.navLabelActive,
            ]}
          >
            Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("riwayat")}
        >
          <Ionicons
            name={activeTab === "riwayat" ? "receipt" : "receipt-outline"}
            size={22}
            color={activeTab === "riwayat" ? "#2563EB" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "riwayat" && styles.navLabelActive,
            ]}
          >
            Riwayat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profil")}
        >
          <Ionicons
            name={activeTab === "profil" ? "person" : "person-outline"}
            size={22}
            color={activeTab === "profil" ? "#2563EB" : "#6B7280"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "profil" && styles.navLabelActive,
            ]}
          >
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentArea: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#2563EB",
    fontWeight: "bold",
  },
});
