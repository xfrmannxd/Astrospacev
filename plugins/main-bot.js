import fs from 'fs'

let handler = async (m, { conn, isOwner }) => {
    if (isOwner) {
        await conn.sendMessage(m.chat, { 
            text: "Hai owner sayang, aku online ya 💕", 
            mentions: [m.sender]
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { 
            text: "Hai, ada yang bisa aku bantu? 😊", 
            mentions: [m.sender]
        }, { quoted: m });
    }
}

// Custom prefix untuk memanggil bot
handler.customPrefix = /^(bot|sayang|p|oy|cuk|cuy|tes)$/i;
handler.command = new RegExp();

export default handler;