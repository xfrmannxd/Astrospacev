/* JANGAN HAPUS INI
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://www.threads.net/@kalekkl/post/C8bhQGPyKEm/`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        let url = encodeURIComponent(text);
        const threadsRes = await fetch(`https://api.agatz.xyz/api/threads?url=${url}`);
        const threadsData = await threadsRes.json();

        if (threadsData.status !== 200 || (!threadsData.data?.image_urls.length && !threadsData.data?.video_urls.length)) {
            throw 'Tidak ada foto atau video yang dapat diunduh.';
        }

        const { image_urls, video_urls } = threadsData.data;

        if (image_urls.length) {
            for (let imgUrl of image_urls) {
                await conn.sendFile(m.chat, imgUrl, 'threads.jpg', '📸 Foto Threads berhasil diunduh.', m);
            }
        }

        if (video_urls.length) {
            for (let vidUrl of video_urls) {
                await conn.sendFile(m.chat, vidUrl, 'threads.mp4', '🎥 Video Threads berhasil diunduh.', m);
            }
        }
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['threads'];
handler.tags = ['downloader'];
handler.command = /^(threads|thrd|thrdl)$/i;
handler.premium = false;

export default handler;