/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from "node-fetch";

let handler = async (m, { conn }) => {
  try {
    let who = m.isGroup
      ? m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : m.sender
      : m.sender;
    let name = conn.getName(who);

    // URL avatar pengguna atau default
    let avatarURL = await conn
      .profilePictureUrl(who, "image")
      .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    // Membuat angka acak untuk "gay percentage"
    let randomPercentage = Math.floor(Math.random() * 101); // 0-100

    // Membuat URL API
    let apiURL = `https://api.siputzx.my.id/api/canvas/gay?nama=${encodeURIComponent(
      name
    )}&avatar=${encodeURIComponent(avatarURL)}&num=${randomPercentage}`;
    console.log("API URL:", apiURL); // Debugging

    // Mengambil gambar dari API
    let response = await fetch(apiURL);
    if (!response.ok) throw `Error ${response.status}: ${response.statusText}`;
    let buffer = await response.buffer();

    // Mengirim gambar hasil cek "gay percentage"
    let caption = `
╭――╼ *GAY CHECK*
│❐ Nama : *${name}*
│❐ Persentase : *${randomPercentage}%*
╰――╼
`.trim();

    await conn.sendFile(m.chat, buffer, "gay-check.jpg", caption, m);
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi kesalahan: ${error.message || error}`);
  }
};

handler.help = ["gaycheck <@tag/reply>"];
handler.tags = ["main"];
handler.command = /^(gaycheck|gay)$/i;
handler.premium = true
handler.register = true 
handler.group = true
export default handler;

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/