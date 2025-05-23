import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let name = conn.getName(who);
  
  // Ambil data dari API
  try {
    let response = await fetch('https://api.agatz.xyz/api/hentaivid');
    if (!response.ok) throw new Error('Gagal mengambil data dari API');
    let { data } = await response.json();

    // Pilih video secara acak
    let randomVideo = pickRandom(data);
    let message = `Nih *${name}* video hentai-nya:\n\n*Judul*: ${randomVideo.title}\n*Kategori*: ${randomVideo.category}\n*Views*: ${randomVideo.views_count}\n*Link*: [Klik disini](${randomVideo.link})`;

    // Kirim video
    await conn.sendFile(m.chat, randomVideo.video_1, null, message, m);
  } catch (error) {
    console.error(error);
    m.reply('Maaf, terjadi kesalahan saat mengambil video.');
  }
};

handler.help = ['randomhentai'];
handler.tags = ['premium'];
handler.command = /^(randomhentai|hentai)$/i;

handler.premium = true;
handler.limit = false;

export default handler;

// Fungsi untuk memilih item secara acak dari array
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}