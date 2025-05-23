const handler = async (m, { conn, args, isROwner, command }) => {
    // Pastikan hanya pemilik bot yang bisa menjalankan perintah
    if (!isROwner) {
        conn.reply(m.chat, '❌ Perintah ini hanya bisa digunakan oleh pemilik bot.', m);
        return;
    }

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    
    // Ambil semua grup yang diikuti bot
    let groups = Object.values(await conn.groupFetchAllParticipating());

    if (groups.length === 0) {
        conn.reply(m.chat, '⚠️ Bot tidak ada dalam grup manapun.', m);
        return;
    }

    // Jika command adalah `.blacklistgc`, tampilkan daftar grup
    if (command === 'blacklistgc') {
        let groupList = groups.map((g, i) => `${i + 1}. ${g.subject}`).join('\n');
        conn.reply(
            m.chat,
            `📌 *Daftar grup yang diikuti bot:*\n\n${groupList}\n\nGunakan perintah:\n- *.blacklistgc <no>* untuk membisukan grup\n- *.unblacklist <no>* untuk mengaktifkan kembali grup`,
            m
        );
        return;
    }

    // Pastikan perintah hanya `blacklistgc` atau `unblacklist`
    if (!['blacklistgc', 'unblacklist'].includes(command)) return;

    // Pastikan user memasukkan nomor grup
    let index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= groups.length) {
        conn.reply(m.chat, '❌ Nomor grup tidak valid. Gunakan *.blacklistgc* untuk melihat daftar grup.', m);
        return;
    }

    let groupId = groups[index].id;
    let groupName = groups[index].subject;

    // Status blacklist global
    global.db.data.chats[groupId] = global.db.data.chats[groupId] || {};

    if (command === 'blacklistgc') {
        global.db.data.chats[groupId].isBlacklisted = true;
        conn.reply(m.chat, `✅ Grup *${groupName}* telah di-*blacklist* dan bot tidak akan merespons di grup ini.`, m);
    } else if (command === 'unblacklist') {
        global.db.data.chats[groupId].isBlacklisted = false;
        conn.reply(m.chat, `✅ Grup *${groupName}* telah diaktifkan kembali dan bot akan merespons seperti biasa.`, m);
    }
};

// Middleware untuk mencegah bot merespons di grup yang sudah di-blacklist
const blockBlacklistedGroups = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat] || {};
    if (chat.isBlacklisted) {
        conn.reply(m.chat, '⚠️ Grup ini telah di-*blacklist* oleh pemilik bot.', m);
        return false;
    }
    return true;
};

handler.help = ['blacklistgc', 'unblacklist'];
handler.tags = ['owner'];
handler.command = /^(blacklistgc|unblacklist)$/i;
handler.owner = true;

// Middleware handler agar bot tidak merespons di grup yang di-blacklist
handler.before = blockBlacklistedGroups;

export default handler;

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/