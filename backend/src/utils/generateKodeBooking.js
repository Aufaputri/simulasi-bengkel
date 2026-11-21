import crypto from "crypto";

export const generateKodeBooking = () => {
    const now = new Date();
    const tahun = now.getFullYear();
    const bulan = String(now.getMonth() + 1).padStart(2, "0");
    const tanggal = String(now.getDate()).padStart(2, "0");
    const random = crypto.randomInt(1000, 10000);

    return `BK-${tahun}${bulan}${tanggal}-${random}`;
};