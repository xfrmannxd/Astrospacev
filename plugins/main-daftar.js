import { createHash } from 'crypto';
import fetch from 'node-fetch';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

let handler = async function (m, { text, usedPrefix, command }) {
    // Mendapatkan nama pengguna
    let namae = conn.getName(m.sender);

    // Mengakses database
    let user = global.db.data.users[m.sender];

    // Mendapatkan foto profil pengguna
    const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

    // Memeriksa apakah sudah terdaftar
    if (user.registered === true) throw `Kamu sudah terdaftar di database! Jika ingin mendaftar ulang, gunakan perintah *${usedPrefix}unreg*`;

    // Validasi input pengguna
    if (!Reg.test(text)) return m.reply(`Masukkan Nama.Umur kamu\nContoh: ${usedPrefix}daftar Tio.17`);
    let [_, name, splitter, age] = text.match(Reg);
    if (!name) throw 'Nama tidak boleh kosong!';
    if (!age) throw 'Umur tidak boleh kosong!';
    age = parseInt(age);
    if (age > 30) throw 'Tua banget amjir -_-';
    if (age < 5) throw 'Terlalu bocil ;!';

    // Menyimpan data pengguna ke database
    user.name = name.trim();
    user.age = age;
    user.regTime = +new Date();
    user.registered = true;

    // Membuat Serial Number
    let sn = createHash('md5').update(m.sender).digest('hex');

    // Format pesan untuk pengguna
    let cap = `
╭━━「 *Informasi Pendaftaran* 」
│• *Nama:* ${name}
│• *Umur:* ${age} Tahun
│• *Status:* _Berhasil_
│• *Serial Number:* ${sn}
╰━━━━━━━━━━━━━━━━━━━
    `;
    
    // Mengirim pesan ke pengguna
    await conn.sendMessage(m.chat, {
        text: cap,
        contextInfo: {
            "externalAdReply": {
                "title": "✔️ Pendaftaran Berhasil",
                "body": "",
                "showAdAttribution": true,
                "mediaType": 1,
                "sourceUrl": '',
                "thumbnailUrl": pp,
                "renderLargerThumbnail": true
            }
        }
    }, m);

    // Mengirim notifikasi ke channel WhatsApp dengan foto profil
    const idChannel = '@newsletter'; // Ganti dengan ID channel Anda
    let notificationCaption = `
@${m.sender.split('@')[0]} telah berhasil terdaftar ✅
Selamat datang, nikmati fitur saya!`;
    
    await conn.sendMessage(idChannel, {
        image: { url: pp },
        caption: notificationCaption,
        mentions: [m.sender]
    });

    // Log sukses
    console.log(`Notifikasi dengan foto dikirim ke channel untuk user: ${m.sender}`);
};

handler.help = ['daftar'];
handler.tags = ['main'];
handler.command = /^(daftar|verify|reg(ister)?)$/i;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
