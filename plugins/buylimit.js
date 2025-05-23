let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let limitPrice = 200000; // Harga per limit

    if (user.money >= limitPrice) {
        user.money -= limitPrice;
        user.limit += 1;
        await conn.sendMessage(m.chat, { text: `Sukses membeli 1 limit seharga ${limitPrice}! Sisa uang kamu: ${user.money}` }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { text: `Uang kamu tidak cukup untuk membeli limit. Kamu butuh ${limitPrice - user.money} lagi.` }, { quoted: m });
    }
};

handler.help = ['buylimit'];
handler.tags = ['info'];
handler.command = /^(buylimit)$/i;

export default handler;
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/