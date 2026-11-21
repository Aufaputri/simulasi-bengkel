"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const emptySubscribe = () => () => {};

const getAuthSnapshot = () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) return "unauth";
    try {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser?.role === "admin" ? "admin" : "unauth";
    } catch {
        return "unauth";
    }
};

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const authState = useSyncExternalStore(
        emptySubscribe,
        getAuthSnapshot,
        () => "loading"
    );

    useEffect(() => {
        if (authState === "unauth") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
        }
    }, [authState, router]);

    if (authState !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-500 font-medium">
                        Memverifikasi sesi admin...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 min-w-0 bg-slate-100 min-h-screen">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}