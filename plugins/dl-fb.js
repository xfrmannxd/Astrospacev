/* JANGAN HAPUS INI
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://www.facebook.com/reel/947495549897838`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        let url = encodeURIComponent(text);
        const fbRes = await fetch(`https://api.agatz.xyz/api/facebook?url=${url}`);
        const fbData = await fbRes.json();

        if (fbData.status !== 200 || !fbData.data?.hd) throw 'Gagal mendownload video Facebook.';

        const { hd, title } = fbData.data;

        await conn.sendFile(m.chat, hd, 'facebook.mp4', `🎥 Judul: ${title}`, m);
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['facebook'];
handler.tags = ['downloader'];
handler.command = /^(fb|fbdown|fbdl|facebook)$/i;
handler.premium = false;

export default handler;