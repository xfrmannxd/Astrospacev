import fs from 'fs';
import moment from 'moment-timezone';

// Set locale to Bahasa Indonesia
moment.locale('id');

let menuFormat = {
  header: '┏━━━✦ ${category} ✦━━━┓', // Header baru
  body: '┃ ✦ %cmd', // Body baru
  footer: '┗━━━━━━━━━━━━━━━┛', // Footer baru
  after: '© ' + global.info.namebot,
};

let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {
  // Current date and time in Asia/Jakarta timezone
  const time = moment().tz('Asia/Jakarta');
  const displayDate = time.format('dddd, DD MMMM YYYY'); // Date in Indonesian
  const displayTime = `Waktu: ${time.format('HH:mm:ss')}`;

  // Define categories
  let tags = {
    general: 'G E N E R A L',
    premium: 'P R E M I U M',
    main: 'M A I N',
    fun: 'F U N',
    pushkontak: 'P U S H',
    ai: 'A I',
    downloader: 'D O W N L O A D E R',
    search: 'S E A R C H',
    store: 'S T O R E',
    owner: 'O W N E R',
    islami: 'I S L A M I',
    game: 'G A M E',
    rpg: 'R P G',
    group: 'G R O U P',
    tools: 'T O O L S',
    info: 'I N F O',
  };

  // Calculate the number of tags (categories)
  let tagCount = Object.keys(tags).length;

  // Assume data is stored in global.db, if not, you need to adjust to your database method
  let data = global.db.data.users[m.sender] || { limit: 0, money: 0 }; // Default empty values if data not available

  // Define 'fitur' as the list of all available commands (assuming 'help' contains these)
  let fitur = Object.values(global.plugins)
    .filter((plugin) => plugin.help)
    .map((plugin) => plugin.help).flat(); // Flatten the array in case of multiple commands per plugin

  // Calculate total users
  let tUser = Object.keys(global.db.data.users).length; // Counting all registered users

  // Get total hits or interactions, stored in global.db.data.stats (you can change this based on your data structure)
  let totalHit = global.db.data.stats.totalHits || 0; // Default to 0 if not defined

  // Calculate total registered users (you can adjust based on your database setup)
  let userReg = Object.keys(global.db.data.users).length;

  // Event Dates (diasumsikan tahun 2025 untuk semua event karena tanggal sekarang 2025)
  const tanggalLebaran = moment("2025-03-30");
  const tanggalPuasa = moment("2025-02-27");
  const tanggalIdulAdha = moment("2025-06-05");
  const tanggalNatal = moment("2025-12-25");
  
  // Countdown to events
  const mundurLebaran = tanggalLebaran.diff(time, 'days');
  const mundurPuasa = tanggalPuasa.diff(time, 'days');
  const mundurIdulAdha = tanggalIdulAdulAdha.diff(time, 'days');
  const mundurNatal = tanggalNatal.diff(time, 'days');
  
  // Handle `.menulist` command
  if (command === 'menulist') {
    let menuListText = `
*╭━━━✦ BOT INFORMATION ✦━━━╮*
*┃ ${global.info.namebot}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ USER INFORMATION ✦━━━╮*
*┃ Nama: ${m.pushName || 'Unknown'}*
*┃ Tgl: ${displayDate}*
*┃ ${displayTime}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ DASHBOARD ✦━━━╮*
*┃ Limit: ${data.limit}*
*┃ Uang: ${data.money}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ BOT STATUS ✦━━━╮*
*┃ Mode: ${global.opts['self'] ? 'Self' : 'Public'}*
*┃ Total Menu: ${tagCount}*
*┃ Total Fitur: ${fitur.length}*
*┃ Total User: ${tUser}*
*┃ Total Hit: ${totalHit}*
*┃ Total Register: ${userReg}*
*┃ Owner: ${global.info.nomerown}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ EVENT COUNTDOWN ✦━━━╮*
*┃ Lebaran: ${mundurLebaran} hari lagi*
*┃ Puasa: ${mundurPuasa} hari lagi*
*┃ Idul Adha: ${mundurIdulAdha} hari lagi*
*┃ Natal: ${mundurNatal} hari lagi*
*╰━━━━━━━━━━━━━━━╯*\n
*╭━━━✦ MENU LIST ✦━━━╮*
`;

    menuListText += Object.keys(tags)
      .map((tag) => `*┃ » ${_p}menu ${tag}*`)
      .join('\n');
    
    menuListText += `\n*╰━━━━━━━━━━━━━━━╯*\n${menuFormat.after}`;

    // Send menu list
    return conn.sendMessage(m.chat, {
      text: menuListText,
      contextInfo: {
        externalAdReply: {
          title: 'M E N U',
          body: global.info.namebot,
          thumbnailUrl: global.url.thumbnail,
          sourceUrl: global.info.sgc,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });
  }

  // Default `.menu` functionality
  let help = Object.values(global.plugins)
    .filter((plugin) => plugin.tags && plugin.help)
    .map((plugin) => ({
      help: plugin.help,
      tags: plugin.tags,
      command: plugin.command,
    }));

  // Determine requested tag
  let requestedTag = args[0] ? args[0].toLowerCase() : null;

  // Build menu text
  let menuText = `
*╭━━━✦ BOT INFORMATION ✦━━━╮*
*┃ ${global.info.namebot}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ USER INFORMATION ✦━━━╮*
*┃ Nama: ${m.pushName || 'Unknown'}*
*┃ Tgl: ${displayDate}*
*┃ ${displayTime}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ DASHBOARD ✦━━━╮*
*┃ Limit: ${data.limit}*
*┃ Uang: ${data.money}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ BOT STATUS ✦━━━╮*
*┃ Mode: ${global.opts['self'] ? 'Self' : 'Public'}*
*┃ Total Menu: ${tagCount}*
*┃ Total Fitur: ${fitur.length}*
*┃ Total User: ${tUser}*
*┃ Total Hit: ${totalHit}*
*┃ Total Register: ${userReg}*
*┃ Owner: ${global.info.nomerown}*
*╰━━━━━━━━━━━━━━━╯*

*╭━━━✦ EVENT COUNTDOWN ✦━━━╮*
*┃ Lebaran: ${mundurLebaran} hari lagi*
*┃ Puasa: ${mundurPuasa} hari lagi*
*┃ Idul Adha: ${mundurIdulAdha} hari lagi*
*┃ Natal: ${mundurNatal} hari lagi*
*╰━━━━━━━━━━━━━━━╯*\n
`;

  if (requestedTag && tags[requestedTag]) {
    // If a specific tag is requested
    let categoryHeader = menuFormat.header.replace('${category}', tags[requestedTag]); // Menggunakan ${category} bukan %category

    // Filter commands by tag
    let commands = help
      .filter((plugin) => plugin.tags.includes(requestedTag))
      .map((plugin) => {
        if (Array.isArray(plugin.help)) {
          return plugin.help
            .map((h) => menuFormat.body.replace('%cmd', `${_p}${h}`))
            .join('\n');
        } else {
          return menuFormat.body.replace('%cmd', `${_p}${plugin.help}`);
        }
      })
      .join('\n');

    menuText += `${categoryHeader}\n${commands}\n${menuFormat.footer}`; // Tambahkan footer
  } else {
    // Build menu for all tags
    menuText += Object.keys(tags)
      .map((tag) => {
        let categoryHeader = menuFormat.header.replace('${category}', tags[tag]); // Menggunakan ${category}

        let commands = help
          .filter((plugin) => plugin.tags.includes(tag))
          .map((plugin) => {
            if (Array.isArray(plugin.help)) {
              return plugin.help
                .map((h) => menuFormat.body.replace('%cmd', `${_p}${h}`))
                .join('\n');
            } else {
              return menuFormat.body.replace('%cmd', `${_p}${plugin.help}`);
            }
          })
          .join('\n');

        // Pastikan tidak ada kategori kosong yang ditampilkan
        return [categoryHeader, commands].filter((v) => v).join('\n') + `\n${menuFormat.footer}`;
      })
      .join('\n\n'); // Separate categories with double newline
  }

  // Add final text
  menuText += `\n${menuFormat.after}`;

  // Send menu to user
  await conn.sendMessage(m.chat, {
    text: menuText,
    contextInfo: {
      externalAdReply: {
        title: global.info.namebot,
        body: global.info.author,
        thumbnailUrl: global.url.thumbnail,
        sourceUrl: global.info.sgc,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  });

  // Hapus bagian pengiriman audio
  /*
  const audioFiles = [
    './system/pinaa1.mp3',
    './system/pinaa2.mp3',
    './system/pinaa3.mp3',
  ];

  const randomAudioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

  await conn.sendFile(m.chat, randomAudioFile, 'audio.mp3', null, m, true, {
    type: 'audioMessage',
    ptt: true,
  });
  */
};

// Metadata handler
handler.help = ['menulist'];
handler.tags = ['general'];
handler.command = /^(menu|allmenu|menulist)$/i;
handler.register = true;

export default handler;
