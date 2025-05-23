import { fileTypeFromBuffer } from 'file-type';
import FormData from 'form-data';
const catbox = async (buffer) => {
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType) throw new Error('File type tidak dikenali');
  const ext = fileType.ext; // Ekstensi file
  const bodyForm = new FormData();
  bodyForm.append("fileToUpload", buffer, `file.${ext}`);
  bodyForm.append("reqtype", "fileupload");
  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: bodyForm,
  });
  const data = await res.text();
  return data;
};
const handler = async (m) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime) {
    return m.reply('Mana medianya? Balas dengan media apa saja!');
  }

  const media = await q.download();
  m.reply('🔄 Loading, mohon tunggu...');

  try {
    // Upload ke Catbox.moe
    const urlCatbox = await catbox(media);

    m.reply(`
🌐 *Uploaded File Link:*
📤 *Catbox.moe:* ${urlCatbox}
    `);
  } catch (error) {
    console.error('Error uploading:', error);
    m.reply('Terjadi kesalahan saat mengunggah file.');
  }
};

handler.help = ['tourl (reply media)'];
handler.tags = ['tools'];
handler.command = /^(tourl|upload)$/i;

export default handler;


/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/