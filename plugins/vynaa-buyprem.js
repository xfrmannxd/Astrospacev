import fetch from 'node-fetch';
import { paymentConfig } from './vynaapay-config.js';

// Fungsi untuk mengecek pembayaran Saweria
const checkSaweriaPayment = async (userID, nominal, conn, m, user) => {
    let maxChecks = 5; // Cek pembayaran maksimal 5 kali
    let attempts = 0;
    let isChecking = false;

    const interval = setInterval(async () => {
        if (attempts >= maxChecks) {
            clearInterval(interval);
            delete user.payment; // Hapus data jika gagal
            conn.reply(m.chat, '❌ Verifikasi pembayaran gagal. Silakan coba lagi nanti.', m);
            return;
        }

        attempts++;
        if (isChecking) return;
        isChecking = true;

        try {
            console.log(`🔍 Cek pembayaran (${attempts}/${maxChecks}) untuk refID: ${user.payment?.refID}`);

            const response = await fetch(`https://itzpire.com/saweria/check-payment?id=${user.payment?.refID}&user_id=${userID}`);
            if (!response.ok) throw new Error('Gagal menerima respons dari server.');

            const checkJson = await response.json();
            console.log(`📄 Respons API:`, checkJson);

            if (checkJson.status === "success" && checkJson.data?.status === "success") {
                clearInterval(interval);

                // Hitung durasi premium
                const duration = getPremiumDurationFromNominal(nominal);
                if (!duration) {
                    conn.reply(m.chat, '❌ Nominal tidak valid untuk aktivasi premium.', m);
                    return;
                }

                // Update status premium user
                const now = Date.now();
                user.premium = true;
                user.premiumTime = user.premiumTime > now ? user.premiumTime + duration : now + duration;
                delete user.payment;

                const successMessage = `✅ *Pembayaran Berhasil!*\n\n💰 *Nominal:* Rp${nominal}\n⏳ *Premium Aktif Selama:* ${duration / 86400000} Hari`;
                await conn.sendMessage(m.chat, { text: successMessage }, { quoted: m });
                return;
            }

            if (checkJson.data?.status === "failed") {
                clearInterval(interval);
                delete user.payment;
                conn.reply(m.chat, '❌ Pembayaran gagal. Silakan coba lagi.', m);
            } else {
                console.log(`Status pembayaran: ${checkJson.data?.status || 'pending'}. Proses berlanjut...`);
            }
        } catch (error) {
            console.error(`❌ Kesalahan Verifikasi Pembayaran:`, error.message);
        } finally {
            isChecking = false;
        }
    }, 20000); // Cek setiap 20 detik
};

// Fungsi untuk mendapatkan durasi premium dari nominal
const getPremiumDurationFromNominal = (nominal) => {
    const days = Object.entries(paymentConfig.prices).find(([_, price]) => price === nominal)?.[0];
    return days ? parseInt(days) * 86400000 : null;
};

// Handler utama untuk pembelian premium
const handler = async (m, { conn, text }) => {
    const jumlahHari = parseInt(text);
    
    if (!jumlahHari || isNaN(jumlahHari) || jumlahHari < 3) {
        return conn.reply(m.chat, '*📋 Daftar Harga Premium*\n\n' +
            Object.entries(paymentConfig.prices).map(([days, price]) => `• ${days} Hari: Rp${price}`).join('\n') +
            '\n\nKetik *.buyprem <jumlah hari>* untuk membeli premium. Contoh: *.buyprem 90*', m);
    }

    const nominal = paymentConfig.prices[jumlahHari];
    if (!nominal) {
        return conn.reply(m.chat, '❌ Jumlah hari tidak valid. Silakan pilih dari daftar harga yang tersedia.', m);
    }

    const { email, userID, name } = paymentConfig;
    const message = `Pembayaran sebesar Rp${nominal}`;

    await conn.reply(m.chat, `⏳ Anda akan membeli premium Rp${nominal} untuk ${jumlahHari} hari. QR code akan muncul nanti.`, m);

    try {
        // Buat pembayaran Saweria
        const response = await fetch(`https://itzpire.com/saweria/payment/create?amount=${nominal}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&user_id=${userID}&msg=${encodeURIComponent(message)}`);
        if (!response.ok) throw new Error('Gagal membuat pembayaran.');

        const paymentJson = await response.json();
        if (paymentJson.status !== "success") throw new Error(paymentJson.error_msg || 'Kesalahan tidak diketahui.');

        const { qr_image: qrImage, url: paymentUrl, id: refID } = paymentJson.data;

        let user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { saldo: 0 });

        user.payment = { refID, amount: nominal, status: 'pending', qrImage, paymentUrl };

        await conn.sendMessage(m.chat, {
            image: { url: qrImage },
            caption: `🎉 *Pembelian Premium*\n\n💰 *Total:* Rp${nominal}\n⏳ *Durasi:* ${jumlahHari} Hari\n\n📌 *Cara Bayar:*\n1. Scan QR code.\n2. Pastikan nominalnya benar (Rp${nominal}).\n3. Tunggu verifikasi (maks 5 menit).\n\n> © VL-CODER`,
        }, { quoted: m });

        checkSaweriaPayment(userID, nominal, conn, m, user);
    } catch (error) {
        console.error("Kesalahan API:", error);
        conn.reply(m.chat, `Kesalahan saat membuat QR pembayaran. ${error.message}`, m);
    }
};

handler.help = ['buyprem <jumlah hari>'];
handler.tags = ['general'];
handler.command = /^(buyprem)$/i;
handler.register = true;
handler.private = true;

export default handler;