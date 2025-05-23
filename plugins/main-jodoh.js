/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from "node-fetch";

let handler = async (m, { conn, args }) => {
  try {
    if (!m.isGroup) throw "Fitur ini hanya bisa digunakan dalam grup.";

    // Validasi dan mendapatkan pengguna yang ditag
    let users = m.mentionedJid;
    if (users.length < 2)
      throw "Silakan tag dua pengguna untuk cek jodoh, contoh: .cekjodoh @user1 @user2";

    let [user1, user2] = users;
    let name1 = conn.getName(user1);
    let name2 = conn.getName(user2);

    // Mendapatkan URL avatar pengguna atau default
    let avatarURL1 = await conn
      .profilePictureUrl(user1, "image")
      .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
    let avatarURL2 = await conn
      .profilePictureUrl(user2, "image")
      .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    // URL background
    let backgroundURL = "https://i.ibb.co/4YBNyvP/images-76.jpg";

    // Membuat angka acak untuk persentase kecocokan
    let randomPercentage = Math.floor(Math.random() * 101); // 0-100

    // Membuat URL API
    let apiURL = `https://api.siputzx.my.id/api/canvas/ship?avatar1=${encodeURIComponent(
      avatarURL1
    )}&avatar2=${encodeURIComponent(avatarURL2)}&background=${encodeURIComponent(
      backgroundURL
    )}&persen=${randomPercentage}`;
    console.log("API URL:", apiURL); // Debugging

    // Mengambil gambar dari API
    let response = await fetch(apiURL);
    if (!response.ok) throw `Error ${response.status}: ${response.statusText}`;
    let buffer = await response.buffer();

    // Mengirim gambar hasil cek jodoh
    let caption = `
╭――╼ *CEK JODOH*
│❐ Pasangan : *${name1}* ❤️ *${name2}*
│❐ Kecocokan : *${randomPercentage}%*
╰――╼
`.trim();

    await conn.sendFile(m.chat, buffer, "cek-jodoh.jpg", caption, m);
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi kesalahan: ${error.message || error}`);
  }
};

handler.help = ["cekjodoh <@user1> <@user2>"];
handler.tags = ["group"];
handler.command = /^(cekjodoh|ship)$/i;
handler.limit = true
handler.group = true 

export default handler;