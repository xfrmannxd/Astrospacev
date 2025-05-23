/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from "node-fetch";

let handler = async (m, { conn, text, command }) => {
  try {
    // Pastikan input memiliki format yang benar
    if (!text.includes("|")) throw "Harap gunakan format: `.xximg @tag|text`";

    // Pisahkan input menjadi tag dan teks
    let [tag, taggedText] = text.split("|").map((v) => v.trim());
    if (!taggedText) throw "Harap masukkan teks setelah `|`.";
    let who;
    if (m.isGroup) {
      if (m.mentionedJid && m.mentionedJid[0]) {
        who = m.mentionedJid[0];
      } else if (m.quoted) {
        who = m.quoted.sender;
      } else {
        who = m.sender;
      }
    } else {
      who = m.sender;
    }

    // Mendapatkan URL avatar
    let avatarURL = await conn
      .profilePictureUrl(who, "image")
      .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    // Membuat URL API
    let apiURL = `https://api.siputzx.my.id/api/canvas/xnxx?title=${encodeURIComponent(
      taggedText
    )}&image=${encodeURIComponent(avatarURL)}`;

    console.log("API URL:", apiURL); // Debugging

    // Ambil gambar dari API
    let response = await fetch(apiURL);
    if (!response.ok) throw `Error ${response.status}: ${response.statusText}`;
    let buffer = await response.buffer();

    // Kirim hasil gambar
    let caption = `
`.trim();

    await conn.sendFile(m.chat, buffer, "xximg.jpg", caption, m);
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi kesalahan: ${error.message || error}`);
  }
};

handler.help = ["xximg <@tag|text>"];
handler.tags = ["main"];
handler.command = /^(xximg)$/i;
handler.premium = true;
handler.register = true;
handler.group = true;

export default handler;