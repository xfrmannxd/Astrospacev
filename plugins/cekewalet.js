import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    // Validasi input
    if (!text) return m.reply('Format salah. Gunakan:\n.cekewalet NamaEwallet|Nomor\nContoh:\n.cekewalet DANA|082389924037');
    let [namaEwallet, nomor] = text.split('|');
    if (!namaEwallet || !nomor) return m.reply('Format salah. Gunakan:\n.cekewalet NamaEwallet|Nomor\nContoh:\n.cekewalet DANA|082389924037');

    // Mengirim permintaan ke API
    let url = `https://api-rekening.lfourr.com/getEwalletAccount?bankCode=${namaEwallet}&accountNumber=${nomor}`;
    try {
        let res = await fetch(url);
        if (!res.ok) throw await res.text();
        let json = await res.json();

        if (json.status && json.data) {
            let { bankcode, accountname, accountnumber } = json.data;
            let hasil = `🔍 *Cek E-Wallet*\n\n🌐 Nama Bank: ${bankcode}\n📱 Nomor: ${accountnumber}\n👤 Nama: ${accountname || 'Tidak ditemukan'}`;
            conn.reply(m.chat, hasil, m);
        } else {
            m.reply(`❌ Gagal mengambil data. Pesan: ${json.msg}`);
        }
    } catch (err) {
        console.error(err);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan.');
    }
};

handler.help = ['cekewalet'];
handler.tags = ['premium'];
handler.command = /^(cekewalet)$/i;
handler.premium = true;

export default handler;