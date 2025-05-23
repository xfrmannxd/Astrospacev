let handler = async (m, { conn, text, quoted, isBigboss }) => {
  try {
    // Cek apakah pengguna adalah admin atau bigboss
    if (!isBigboss) return replyboss(mess.boss);

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Ambil teks dan id grup dari input pengguna
    let [id, ...teksArray] = text.split(' ');
    let teks = teksArray.join(' ');

    // Validasi input
    if (!id || !teks) {
      return replyboss(`Example: ${prefix + command} <group_id> Hello`);
    }

    // Variabel untuk menyimpan konten media dan opsi pesan
    let mediaContent = null;
    let msgOptions = {};

    // Warna latar belakang acak untuk status
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    const BackgroundColor = ['#f68ac9', '#6cace4', '#f44336', '#4caf50', '#ffeb3b', '#9c27b0', '#0d47a1', '#03a9f4', '#9e9e9e', '#ff9800', '#000000', '#ffffff', '#008080', '#FFC0CB', '#A52A2A', '#FFA07A', '#FF00FF', '#D2B48C', '#F5DEB3', '#FF1493', '#B22222', '#00BFFF', '#1E90FF', '#FF69B4', '#87CEEB', '#20B2AA', '#8B0000', '#FF4500', '#48D1CC', '#BA55D3', '#00FF7F', '#008000', '#191970', '#FF8C00', '#9400D3', '#FF00FF', '#8B008B', '#2F4F4F', '#FFDAB9', '#BDB76B', '#DC143C', '#DAA520', '#696969', '#483D8B', '#FFD700', '#C0C0C0'];
    const pickedColor = BackgroundColor[Math.floor(Math.random() * BackgroundColor.length)];

    // Daftar ID yang akan di-tag
    const jids = [m.sender, id];

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Cek apakah ada quoted message
    if (quoted) {
      const mime = quoted.mtype || quoted.mediaType;
      if (mime?.includes('image')) {
        mediaContent = await m.quoted.download();
        msgOptions = {
          image: mediaContent,
          caption: teks || m.quoted.text || '',
        };
      } else if (mime?.includes('video')) {
        mediaContent = await m.quoted.download();
        msgOptions = {
          video: mediaContent,
          caption: teks || m.quoted.text || '',
        };
      } else {
        msgOptions = {
          text: teks || m.quoted.text || '',
        };
      }
    } else {
      msgOptions = {
        text: teks,
      };
    }

    // Kirim pesan ke grup dengan men-tag semua anggota
    await conn.sendMessage(id, {
      ...msgOptions,
      mentions: (await conn.groupMetadata(id)).participants.map((a) => a.id),
    });

    // Beri tahu pengguna bahwa pesan telah berhasil dikirim
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    m.reply("_Successfully tagged all members in the group._");
  } catch (error) {
    console.error(error);
    await conn.sendMessage(
      m.chat,
      { text: 'Terjadi kesalahan. Coba lagi nanti!' },
      { quoted: m }
    );
  }
};

handler.help = ['tagsw <group_id> <text>'];
handler.tags = ['group'];
handler.command = /^tagsw$/i;
handler.register = true;
handler.isBigboss = true;

export default handler;
