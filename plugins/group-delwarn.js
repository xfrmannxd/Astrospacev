let war = global.maxwarn;
const handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) throw `✳️ Memberi label atau menyebut seseorang\n\n📌 Contoh : ${usedPrefix + command} @user`;
    if (!(who in global.db.data.users)) throw `✳️ Pengguna hilang dari database saya`;

    let name = conn.getName(m.sender);
    let warn = global.db.data.users[who].warn;
    
    if (warn > 0) {
        global.db.data.users[who].warn -= 1;
        m.reply(`
⚠️ *Peringatan Dihapus* ⚠️

▢ *Admin:* ${name}
▢ *Pengguna:* @${who.split`@`[0]}
▢ *Peringatan Sekarang:* ${warn - 1}/${war}
▢ *Alasan:* ${text}`, null, { mentions: [who] });
        m.reply(`
⚠️ *Peringatan Dihapus* ⚠️
Peringatan Anda telah dihapus oleh admin.

▢ *Peringatan Sekarang:* ${warn - 1}/${war}`, who);
    } else {
        m.reply(`✳️ Pengguna @${who.split`@`[0]} tidak memiliki peringatan untuk dihapus`, null, { mentions: [who] });
    }
};

handler.help = ['delwarn @user'];
handler.tags = ['group'];
handler.command = ['delwarn']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;