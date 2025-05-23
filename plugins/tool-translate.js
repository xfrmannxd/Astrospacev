
/* JANGAN HAPUS INI
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/

import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    let err = `
Contoh:
${usedPrefix + command} <lang> <pesan kamu>
${usedPrefix + command} id Halo Apa Kabar

Daftar bahasa yang didukung: https://cloud.google.com/translate/docs/languages
`.trim();
    
    if (!args[0]) throw err;
    
    try {
        let txt = (args.length > 1 ? args.slice(1).join(' ') : '') || '';
        let msg = m.quoted ? m.quoted.text : txt;
        
        let lang = args[0];
        let url = `https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(msg)}&source=auto&target=${lang}`;
        
        let response = await fetch(url);
        let result = await response.json();
        
        if (!result.success) {
            throw 'Terjadi kesalahan dalam proses terjemahan.';
        }
        
        await m.reply(result.translatedText);
    } catch (e) {
        throw err;
    }
};

handler.help = ['translate'];
handler.tags = ['tools'];
handler.command = /^(tr|translate)$/i;
handler.limit = true;

export default handler;