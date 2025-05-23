/*
        ••JANGAN HAPUS INI••
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 

• Menerima pembuatan script bot
• Menerima perbaikan script atau fitur bot
• Menerima pembuatan fitur bot
• Menerima semua kebutuhan bot
• Menerima Jadi Bot

ℹ️ Information

• Pembayaran bisa dicicil
• Bisa bayar di awal atau akhir
• Pembayaran melalu QRIS Only
• Testimoni Banyak

Aturan:
1. Dilarang memperjualbelikan script ini.
2. Hak cipta milik Vynaa Valerie.

“Dan janganlah kamu makan harta di antara kamu dengan jalan yang batil, dan janganlah kamu membunuh dirimu sendiri. Sesungguhnya Allah adalah Maha Penyayang kepadamu.” (QS. Al-Baqarah: 188)
*/
/*
        ••JANGAN HAPUS INI••
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 

• Menerima pembuatan script bot
• Menerima perbaikan script atau fitur bot
• Menerima pembuatan fitur bot
• Menerima semua kebutuhan bot
• Menerima Jadi Bot

ℹ️ Information

• Pembayaran bisa dicicil
• Bisa bayar di awal atau akhir
• Pembayaran melalu QRIS Only
• Testimoni Banyak

Aturan:
1. Dilarang memperjualbelikan script ini.
2. Hak cipta milik Vynaa Valerie.

“Dan janganlah kamu makan harta di antara kamu dengan jalan yang batil, dan janganlah kamu membunuh dirimu sendiri. Sesungguhnya Allah adalah Maha Penyayang kepadamu.” (QS. Al-Baqarah: 188)
*/
/*
        ••JANGAN HAPUS INI••
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 

• Menerima pembuatan script bot
• Menerima perbaikan script atau fitur bot
• Menerima pembuatan fitur bot
• Menerima semua kebutuhan bot
• Menerima Jadi Bot

ℹ️ Information

• Pembayaran bisa dicicil
• Bisa bayar di awal atau akhir
• Pembayaran melalu QRIS Only
• Testimoni Banyak

Aturan:
1. Dilarang memperjualbelikan script ini.
2. Hak cipta milik Vynaa Valerie.

“Dan janganlah kamu makan harta di antara kamu dengan jalan yang batil, dan janganlah kamu membunuh dirimu sendiri. Sesungguhnya Allah adalah Maha Penyayang kepadamu.” (QS. Al-Baqarah: 188)
*/
import { WAMessageStubType } from '@adiwajshing/baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
  const senderJid = m.sender;
  const chatJid = m.chat;

  const _name = await conn.getName(senderJid);
  const sender = formatPhone(senderJid) + (_name ? ` ~ ${_name}` : '');
  const chatName = await conn.getName(chatJid);
  const me = formatPhone(conn.user?.jid) + ` ~ ${conn.user?.name || 'Bot'}`;
  const time = new Date((m.messageTimestamp?.low || m.messageTimestamp) * 1000 || Date.now()).toLocaleTimeString();

  const filesize = getFileSize(m);
  const user = global.DATABASE.data.users[senderJid] || {};
  const img = await getImageIfAvailable(m);

  console.log(chalk.gray('\n─'.repeat(3)));
  console.log(`${chalk.bold('Me')}         : ${chalk.green(me)}`);
  console.log(`${chalk.bold('Time')}       : ${chalk.yellow(time)}`);
  if (m.messageStubType)
    console.log(`${chalk.bold('Message')}    : ${chalk.bgGreen.black(WAMessageStubType[m.messageStubType])}`);
  console.log(`${chalk.bold('Size')}       : ${chalk.magenta(`${filesize.bytes} [${filesize.human}]`)}`);
  console.log(`${chalk.bold('Sender')}     : ${chalk.cyan(sender)}`);
  console.log(`${chalk.bold('User EXP')}   : ${chalk.gray(`${m?.exp || '?'} | ${user.exp || '?'} | ${user.limit || '?'} | lvl ${user.level || '?'}`)}`);
  console.log(`${chalk.bold('Chat')}       : ${chalk.cyan(chatJid + (chatName ? ` ~ ${chatName}` : ''))}`);
  console.log(`${chalk.bold('Type')}       : ${chalk.blueBright(m.mtype?.replace(/message$/i, '').replace('audio', m.msg?.ptt ? 'PTT' : 'Audio') || '-')}`);
  console.log(chalk.gray('─'.repeat(60)));

  if (img) console.log(img.trimEnd());

  if (typeof m.text === 'string' && m.text) {
    let log = formatMessageText(m, conn);
    console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);
  }

  if (m.messageStubParameters) {
    const mentions = await formatMentionedUsers(m.messageStubParameters, conn);
    console.log(chalk.gray('Mentioned:'), mentions);
  }

  if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`);
  if (/ContactsArray/i.test(m.mtype)) console.log('👨‍👩‍👧‍👦 Contacts');
  if (/contact/i.test(m.mtype)) console.log(`👤 ${m.msg.displayName || 'Contact'}`);
  if (/audio/i.test(m.mtype)) {
    const duration = m.msg?.seconds || 0;
    console.log(`${m.msg?.ptt ? '🎤 (PTT)' : '🎵 (Audio)'} Duration: ${formatDuration(duration)}`);
  }

  console.log();
}

function formatPhone(jid) {
  return PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
}

function getFileSize(m) {
  const size = m?.msg?.vcard?.length || m?.msg?.fileLength?.low || m?.msg?.fileLength || m?.text?.length || 0;
  const units = ['', 'K', 'M', 'G', 'T', 'P'];
  const i = Math.floor(Math.log(size) / Math.log(1000)) || 0;
  const human = (size / 1000 ** i).toFixed(1) + ' ' + units[i] + 'B';
  return { bytes: size, human };
}

async function getImageIfAvailable(m) {
  try {
    if (global.opts['img'] && /sticker|image/gi.test(m.mtype)) {
      return await terminalImage.buffer(await m.download());
    }
  } catch (e) {
    console.error(chalk.red('Image Error:'), e);
  }
  return null;
}

function formatMessageText(m, conn) {
  let log = m.text.replace(/\u200e+/g, '');
  const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
  const mdFormat = (depth = 4) => (_, type, text, mono) => {
    const types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
    text = text || mono;
    const formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
    return formatted;
  };

  if (log.length < 4096) {
    log = log.replace(urlRegex, (url, i, text) => {
      const end = url.length + i;
      return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1]))
        ? chalk.blueBright(url)
        : url;
    });
  }

  log = log.replace(mdRegex, mdFormat(4));
  if (m.mentionedJid) {
    for (let jid of m.mentionedJid) {
      const name = conn.getName(jid);
      log = log.replace('@' + jid.split('@')[0], chalk.blueBright('@' + name));
    }
  }
  return log;
}

async function formatMentionedUsers(jids, conn) {
  return (await Promise.all(jids.map(async jid => {
    const name = await conn.getName(conn.decodeJid(jid));
    return formatPhone(jid) + (name ? ` ~ ${name}` : '');
  }))).join(', ');
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Hot reload
let file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.redBright("Update detected: 'lib/print.js'"));
});