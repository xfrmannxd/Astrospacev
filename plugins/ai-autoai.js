/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import axios from 'axios';

let handler = async (m, { conn, text }) => {
    conn.vynaGPT = conn.vynaGPT ? conn.vynaGPT : {};

    if (!text) throw `*Contoh:* .autoai *[on/off]*`;

    if (text === "on") {
        conn.vynaGPT[m.sender] = {
            messages: []
        };
        m.reply("[ ✓ ] Berhasil mengaktifkan bot VynaGPT");
    } else if (text === "off") {
        delete conn.vynaGPT[m.sender];
        m.reply("[ ✓ ] Berhasil menonaktifkan bot VynaGPT");
    }
};

handler.before = async (m, { conn }) => {
    conn.vynaGPT = conn.vynaGPT ? conn.vynaGPT : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.vynaGPT[m.sender]) return;

    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (conn.vynaGPT[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});

        const apiUrl = `https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(m.text)}`;

        try {
            const response = await axios.get(apiUrl, {
                headers: { 'accept': 'application/json' }
            });

            const responseData = response.data;
            const answer = responseData.data;
            await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});
            m.reply(answer);
            conn.vynaGPT[m.sender].messages = [
                { role: "system", content: `Halo, saya VynaGPT, dikembangkan oleh Vynaa Valerie. Anda sedang berbicara dengan ${name}` },
                { role: "user", content: m.text }
            ];
        } catch (error) {
            console.error("Error fetching data:", error);
            m.reply("Maaf, terjadi kesalahan saat memproses permintaan Anda.");
        }
    }
};

handler.command = ['autoai'];
handler.tags = ["ai"];
handler.help = ['autoai'].map(a => a + " *[on/off]*");

export default handler;