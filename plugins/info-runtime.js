let handler = async (m, { conn }) => {
    let _muptime = process.uptime() * 1000; // Menggunakan process.uptime() untuk mendapatkan uptime dalam milidetik
    let muptime = clockString(_muptime);
    
    await conn.relayMessage(m.chat, { 
        reactionMessage: { key: m.key, text: '✅' }
    }, { 
        messageId: m.key.id 
    });

    await conn.sendMessage(m.chat, {
        text: `✨ *Bot Status* ✨\n\n` +
              `📅 *Uptime*: ${muptime}\n` +
              `📡 *Kondisi*: Stabil ✅\n` +
              `⚡ *Respon Cepat*: Siap melayani!\n\n` +
              `_Terima kasih telah menggunakan bot ini!_`
    });
};

handler.help = ['runtime'];
handler.tags = ['info'];
handler.command = ['runtime', 'rt'];

export default handler;

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, ' hari 🌞\n', h, ' jam 🕒\n', m, ' menit ⏱️\n', s, ' detik ⏲️'].map(v => v.toString().padStart(2, 0)).join('');
}