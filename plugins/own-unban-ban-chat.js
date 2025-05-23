const handler = async (m, { conn, args, isROwner, command }) => {
    // Pastikan hanya pemilik bot yang bisa menjalankan perintah
    if (!isROwner) {
        conn.reply(m.chat, 'Perintah ini hanya bisa digunakan oleh pemilik bot.', m);
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

    // Jika bot tidak ada dalam grup manapun
    if (groups.length === 0) {
        conn.reply(m.chat, 'Bot tidak ada dalam grup manapun.', m);
        return;
    }
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Jika command adalah `gcbanchat`, tampilkan daftar grup
    if (command === 'gcbanchat') {
        let groupList = groups.map((g, i) => `${i + 1}. ${g.subject}`).join('\n');
        conn.reply(
            m.chat,
            `Daftar grup yang diikuti bot:\n\n${groupList}\n\nGunakan perintah:\n- *banchat <no>* untuk membisukan grup\n- *unbanchat <no>* untuk mengaktifkan kembali grup`,
            m
        );
        return;
    }

    // Pastikan perintah hanya `banchat` atau `unbanchat`
    if (!['banchat', 'unbanchat'].includes(command)) return;
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Pastikan user memasukkan nomor grup
    let index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= groups.length) {
        conn.reply(m.chat, 'Nomor grup tidak valid. Gunakan *gcbanchat* untuk melihat daftar grup.', m);
        return;
    }

    let groupId = groups[index].id;
    let groupName = groups[index].subject;

    // Status banchat global
    global.db.data.chats[groupId] = global.db.data.chats[groupId] || {};

    if (command === 'banchat') {
        global.db.data.chats[groupId].isBanned = true;
        conn.reply(m.chat, `✅ Grup *${groupName}* telah dibisukan.`, m);
    } else if (command === 'unbanchat') {
        global.db.data.chats[groupId].isBanned = false;
        conn.reply(m.chat, `✅ Grup *${groupName}* telah diaktifkan kembali.`, m);
    }
};

handler.help = ['gcbanchat', 'banchat', 'unbanchat'];
handler.tags = ['owner'];
handler.command = /^(gcbanchat|banchat|unbanchat)$/i;
handler.owner = true;

export default handler;
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/