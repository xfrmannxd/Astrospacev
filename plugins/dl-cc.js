/* JANGAN HAPUS INI
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://www.capcut.com/t/Zs8Sw9wsE/`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        let url = encodeURIComponent(text);
        const ccRes = await fetch(`https://api.siputzx.my.id/api/d/capcut?url=${url}`);
        const ccData = await ccRes.json();

        if (!ccData.status || !ccData.data?.originalVideoUrl) throw 'Gagal mendownload video CapCut.';

        const { originalVideoUrl, title, description, coverUrl } = ccData.data;

        await conn.sendFile(m.chat, originalVideoUrl, 'capcut.mp4', `🎥 *Judul:* ${title}\n📝 *Deskripsi:* ${description}`, m, { thumbnail: coverUrl });
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['capcut'];
handler.tags = ['downloader'];
handler.command = /^(cc|ccdl|capcutdl)$/i;
handler.premium = false;

export default handler;