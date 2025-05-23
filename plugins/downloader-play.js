import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw 'Enter Title / Link From YouTube!';
    try {
        const look = await ytSearch(text);
        const convert = look.videos[0];
        if (!convert) throw 'Video/Audio Tidak Ditemukan';
        if (convert.seconds >= 3600) {
            return conn.reply(m.chat, 'Video is longer than 1 hour!', m);
        } else {
            let audioUrl;
            try {
                const res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${convert.url}&apikey=${global.api.btch}`);
                const data = await res.json();
                if (!data.result || !data.result.mp3) throw 'Audio not found!';
                audioUrl = data.result.mp3;
            } catch (e) {
                conn.reply(m.chat, 'Error fetching audio!', m);
                return;
            }

            let caption = '';
            caption += `∘ Title : ${convert.title}\n`;
            caption += `∘ Ext : Search\n`;
            caption += `∘ ID : ${convert.videoId}\n`;
            caption += `∘ Duration : ${convert.timestamp}\n`;
            caption += `∘ Viewers : ${convert.views}\n`;
            caption += `∘ Upload At : ${convert.ago}\n`;
            caption += `∘ Author : ${convert.author.name}\n`;
            caption += `∘ Channel : ${convert.author.url}\n`;
            caption += `∘ Url : ${convert.url}\n`;
            caption += `∘ Description : ${convert.description}\n`;
            caption += `∘ Thumbnail : ${convert.image}`;

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: caption,
                    contextInfo: {
                        externalAdReply: {
                            title: convert.title,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: convert.image,
                            sourceUrl: audioUrl
                        }
                    },
                    mentions: [m.sender]
                }
            }, {});

            await conn.sendMessage(m.chat, {
                audio: {
                    url: audioUrl
                },
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: convert.title,
                        body: "",
                        thumbnailUrl: convert.image,
                        sourceUrl: audioUrl,
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: m
            });
        }
    } catch (e) {
        conn.reply(m.chat, 'An error occurred!', m);
    }
};

handler.command = handler.help = ['play', 'song', 'ds'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

export default handler;