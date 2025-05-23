import fetch from "node-fetch"; 
import crypto from "crypto"; 
import { FormData, Blob } from "formdata-node";

let handler = async (m, { conn, usedPrefix, command, text }) => { 
    const q = m.quoted || m; 
    const mime = (q.msg || q).mimetype || q.mediaType || "";
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Jika tidak ada gambar atau teks, berikan contoh penggunaan
    if (!mime && !text) { 
        return conn.reply(m.chat, `Contoh: balas/kirim gambar dengan keterangan *${usedPrefix + command}*`, m); 
    }
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Jika ada gambar, upload gambar tersebut
    const image = mime ? await uploadImage(await q.download()) : "";

    // Ambil daftar grup yang terdaftar dalam sewa
    const groupIds = Object.keys(global.db.data.chats).filter(
        id => id.endsWith("@g.us") && global.db.data.chats[id].sewa
    );

    conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groupIds.length} grup yang terdaftar dalam sewa_`, m);

    // Looping untuk mengirim pesan ke setiap grup yang terdaftar dalam sewa
    for (const id of groupIds) { 
        await delay(2000); // Delay agar tidak terkena spam
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
        const options = image 
            ? { image: { url: image }, caption: text || '' } // Jika ada gambar, gunakan sebagai caption
            : { text: text.trim() }; // Jika hanya teks, kirim teks saja

        try {
            await conn.sendMessage(id, options, { quoted: null });
        } catch (err) {
            console.error(`Gagal mengirim pesan ke grup ${id}:`, err);
        }
    }

    conn.reply(m.chat, "Broadcast selesai", m); 
};

// Fungsi delay agar bot tidak terkena spam
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk mengunggah gambar ke server catbox.moe
async function uploadImage(content) { 
    const formData = new FormData(); 
    formData.append("reqtype", "fileupload"); 
    formData.append("fileToUpload", new Blob([content.toArrayBuffer()], { type: "image/png" }), crypto.randomBytes(5).toString("hex") + ".png");

    const response = await fetch("https://catbox.moe/user/api.php", { 
        method: "POST", 
        body: formData 
    }); 
    
    return await response.text(); 
}

handler.help = ['bcgcsewa']; 
handler.tags = ['owner']; 
handler.command = /^(bcgcsewa)$/i; 
handler.rowner = true; 
handler.group = false;

export default handler;
    
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/