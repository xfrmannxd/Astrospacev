import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) 
    return await conn.sendMessage(m.chat, { text: 'Silakan masukkan URL story Instagram setelah perintah .sgdl.' }, { quoted: m });

  const url = args[0];
  try {
    // Kirim respons loading
    await conn.sendMessage(m.chat, { text: '⏳ Sedang memproses, harap tunggu...' }, { quoted: m });

    // Panggil API untuk mengunduh story
    const apiKey = global.api.btch; // API Key dari global.api.btch
    const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${encodeURIComponent(url)}&apikey=${global.api.btch}`);
    const data = await response.json();

    if (data.status && data.result.length > 0) {
      for (const story of data.result) {
        await conn.sendMessage(m.chat, {
          image: { url: story.thumbnail },
          caption: `📥 *Story Downloaded*\n\nWatermark: ${story.wm}\n[Download Media]( ${story.url} )`,
        }, { quoted: m });
      }
    } else {
      await conn.sendMessage(m.chat, { text: 'Gagal mendapatkan data story. Pastikan URL benar.' }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat memproses permintaan. Coba lagi nanti.' }, { quoted: m });
  }
};

handler.help = ['sgdl'];
handler.tags = ['downloader'];
handler.command = /^sgdl|storyig$/i;
handler.register = true;

export default handler;