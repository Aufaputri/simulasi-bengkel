
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";

// import { AuthProvider, useAuth } from "./src/context/AuthContext";
// import AuthScreen from "./src/screens/AuthScreen";
// import LayananScreen from "./src/screens/LayananScreen";
// import BookingScreen from "./src/screens/BookingScreen";
// import RiwayatScreen from "./src/screens/RiwayatScreen";
// import ProfileScreen from "./src/screens/ProfileScreen";

// function MainApp() {
//   const { user, token, loading } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [activeTab, setActiveTab] = useState("layanan");
//   const [preselectedLayananId, setPreselectedLayananId] = useState(null);
//   const [riwayatRefreshKey, setRiwayatRefreshKey] = useState(0);
//   const [toastMessage, setToastMessage] = useState("");

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2563EB" />
//         <Text style={styles.loadingText}>Memuat aplikasi...</Text>
//       </View>
//     );
//   }

//   // Jika belum login, tampilkan layar Auth
//   if (!user || !token) {
//     return <AuthScreen />;
//   }

//   const triggerToast = (msg) => {
//     setToastMessage(msg);
//     setTimeout(() => {
//       setToastMessage((prev) => (prev === msg ? "" : prev));
//     }, 3500);
//   };

//   const handleSelectLayananForBooking = (layanan) => {
//     setPreselectedLayananId(layanan.id);
//     setActiveTab("booking");
//   };

//   const handleBookingSuccess = (kodeBooking) => {
//     setPreselectedLayananId(null);
//     setRiwayatRefreshKey((prev) => prev + 1);
//     setActiveTab("riwayat");
//     triggerToast(
//       kodeBooking
//         ? `Booking berhasil dibuat! Kode: ${kodeBooking}`
//         : "Booking berhasil dibuat! Data riwayat diperbarui."
//     );
//   };

//   const renderActiveScreen = () => {
//     switch (activeTab) {
//       case "layanan":
//         return (
//           <LayananScreen
//             onSelectLayananForBooking={handleSelectLayananForBooking}
//           />
//         );
//       case "booking":
//         return (
//           <BookingScreen
//             initialSelectedLayananId={preselectedLayananId}
//             onBookingSuccess={handleBookingSuccess}
//           />
//         );
//       case "riwayat":
//         return (
//           <RiwayatScreen
//             isActiveTab={activeTab === "riwayat"}
//             refreshKey={riwayatRefreshKey}
//             onNavigateToBooking={() => setActiveTab("booking")}
//           />
//         );
//       case "profil":
//         return <ProfileScreen />;
//       default:
//         return <LayananScreen />;
//     }
//   };

//   return (
//     <View
//       style={[
//         styles.mainContainer,
//         { paddingTop: Platform.OS === "android" ? insets.top : 0 },
//       ]}
//     >
//       <StatusBar style="dark" />

//       {/* Banner Notifikasi Sukses */}
//       {toastMessage ? (
//         <View style={styles.toastBanner}>
//           <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
//           <Text style={styles.toastText}>{toastMessage}</Text>
//         </View>
//       ) : null}

//       {/* Main Screen Content */}
//       <View style={styles.contentArea}>{renderActiveScreen()}</View>

//       {/* Bottom Navigation Bar */}
//       <View
//         style={[
//           styles.bottomNav,
//           { paddingBottom: Math.max(insets.bottom, 10) },
//         ]}
//       >
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => setActiveTab("layanan")}
//         >
//           <Ionicons
//             name={activeTab === "layanan" ? "speedometer" : "speedometer-outline"}
//             size={22}
//             color={activeTab === "layanan" ? "#2563EB" : "#6B7280"}
//           />
//           <Text
//             style={[
//               styles.navLabel,
//               activeTab === "layanan" && styles.navLabelActive,
//             ]}
//           >
//             Layanan
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => {
//             setPreselectedLayananId(null);
//             setActiveTab("booking");
//           }}
//         >
//           <Ionicons
//             name={activeTab === "booking" ? "calendar" : "calendar-outline"}
//             size={22}
//             color={activeTab === "booking" ? "#2563EB" : "#6B7280"}
//           />
//           <Text
//             style={[
//               styles.navLabel,
//               activeTab === "booking" && styles.navLabelActive,
//             ]}
//           >
//             Booking
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => {
//             setRiwayatRefreshKey((prev) => prev + 1);
//             setActiveTab("riwayat");
//           }}
//         >
//           <Ionicons
//             name={activeTab === "riwayat" ? "receipt" : "receipt-outline"}
//             size={22}
//             color={activeTab === "riwayat" ? "#2563EB" : "#6B7280"}
//           />
//           <Text
//             style={[
//               styles.navLabel,
//               activeTab === "riwayat" && styles.navLabelActive,
//             ]}
//           >
//             Riwayat
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => setActiveTab("profil")}
//         >
//           <Ionicons
//             name={activeTab === "profil" ? "person" : "person-outline"}
//             size={22}
//             color={activeTab === "profil" ? "#2563EB" : "#6B7280"}
//           />
//           <Text
//             style={[
//               styles.navLabel,
//               activeTab === "profil" && styles.navLabelActive,
//             ]}
//           >
//             Profil
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <MainApp />
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   mainContainer: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   toastBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#15803D",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   toastText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//     flex: 1,
//   },
//   contentArea: {
//     flex: 1,
//   },
//   bottomNav: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//     paddingTop: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 8,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navLabel: {
//     fontSize: 11,
//     color: "#6B7280",
//     marginTop: 3,
//     fontWeight: "500",
//   },
//   navLabelActive: {
//     color: "#2563EB",
//     fontWeight: "bold",
//   },
// });

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
  const [riwayatRefreshKey, setRiwayatRefreshKey] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#564B5E" />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  // Jika belum login, tampilkan layar Auth
  if (!user || !token) {
    return <AuthScreen />;
  }

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? "" : prev));
    }, 3500);
  };

  const handleSelectLayananForBooking = (layanan) => {
    setPreselectedLayananId(layanan.id);
    setActiveTab("booking");
  };

  const handleBookingSuccess = (kodeBooking) => {
    setPreselectedLayananId(null);
    setRiwayatRefreshKey((prev) => prev + 1);
    setActiveTab("riwayat");
    triggerToast(
      kodeBooking
        ? `Booking berhasil dibuat! Kode: ${kodeBooking}`
        : "Booking berhasil dibuat! Data riwayat diperbarui."
    );
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
            isActiveTab={activeTab === "riwayat"}
            refreshKey={riwayatRefreshKey}
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

      {/* Banner Notifikasi Sukses */}
      {toastMessage ? (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#FADBB2" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

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
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.navIconWrap,
              activeTab === "layanan" && styles.navIconWrapActive,
            ]}
          >
            <Ionicons
              name={activeTab === "layanan" ? "speedometer" : "speedometer-outline"}
              size={20}
              color={activeTab === "layanan" ? "#FADBB2" : "#937D7A"}
            />
          </View>
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
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.navIconWrap,
              activeTab === "booking" && styles.navIconWrapActive,
            ]}
          >
            <Ionicons
              name={activeTab === "booking" ? "calendar" : "calendar-outline"}
              size={20}
              color={activeTab === "booking" ? "#FADBB2" : "#937D7A"}
            />
          </View>
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
          onPress={() => {
            setRiwayatRefreshKey((prev) => prev + 1);
            setActiveTab("riwayat");
          }}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.navIconWrap,
              activeTab === "riwayat" && styles.navIconWrapActive,
            ]}
          >
            <Ionicons
              name={activeTab === "riwayat" ? "receipt" : "receipt-outline"}
              size={20}
              color={activeTab === "riwayat" ? "#FADBB2" : "#937D7A"}
            />
          </View>
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
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.navIconWrap,
              activeTab === "profil" && styles.navIconWrapActive,
            ]}
          >
            <Ionicons
              name={activeTab === "profil" ? "person" : "person-outline"}
              size={20}
              color={activeTab === "profil" ? "#FADBB2" : "#937D7A"}
            />
          </View>
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
    backgroundColor: "#F5EFEA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#937D7A",
    fontWeight: "500",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#564B5E",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#937D7A",
  },
  toastText: {
    color: "#FADBB2",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#C6B2AE",
    paddingTop: 8,
    shadowColor: "#564B5E",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconWrap: {
    width: 38,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconWrapActive: {
    backgroundColor: "#564B5E",
  },
  navLabel: {
    fontSize: 11,
    color: "#937D7A",
    marginTop: 3,
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#564B5E",
    fontWeight: "800",
  },
});