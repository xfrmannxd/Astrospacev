import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    // Validasi input
    if (!text) return m.reply('Format salah. Gunakan:\n.cekbank code|no\nContoh:\n.cekbank 002|178001000296507');
    let [bankCode, accountNumber] = text.split('|');
    if (!bankCode || !accountNumber) return m.reply('Format salah. Gunakan:\n.cekbank code|no\nContoh:\n.cekbank 002|178001000296507');

    // Mengirim permintaan ke API
    let url = `https://api-rekening.lfourr.com/getBankAccount?bankCode=${bankCode}&accountNumber=${accountNumber}`;
    try {
        let res = await fetch(url);
        if (!res.ok) throw await res.text();
        let json = await res.json();

        if (json.status && json.data) {
            let { bankcode, bankname, accountnumber, accountname } = json.data;
            let hasil = `🔍 *Cek Bank*\n\n🏦 Nama Bank: ${bankname} (${bankcode})\n📋 Nomor Rekening: ${accountnumber}\n👤 Nama Pemilik: ${accountname || 'Tidak ditemukan'}`;
            conn.reply(m.chat, hasil, m);
        } else {
            m.reply(`❌ Gagal mengambil data. Pesan: ${json.msg}`);
        }
    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan.');
    }
};

handler.help = ['cekbank'];
handler.tags = ['premium'];
handler.command = /^(cekbank)$/i;

export default handler;