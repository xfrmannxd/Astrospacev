import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

global.setting = {
  autoclear: false,
  addReply: true,
};

// Owner Information
global.owner = [
  ['19419318284', 'xFrmannJS', true],
];

// Bot Information
global.info = {
  nomerbot: '62857059457516',
  pairingNumber: '62857059457516',
  nameown: 'xFrmannJS',
  nomerown: '19419318284',
  token: 'VynaaMD1a2b3c', // Token harus diisi agar bot dapat berjalan
  packname: 'sticker by',
  author: 'xFrmannJS',
  namebot: 'AstroTech MD',
  wm: 'made by xFrmannJS',
  stickpack: 'Sticker by',
  stickauth: 'AstroTech MD',
};

global.wait = '_M O H O N - T U N G G U_'; // Pesan saat menunggu
global.maxwarn = 5;

// URLs
global.url = {
  profil: 'https://files.catbox.moe/f3gawf.jpeg',
  did: 'https://files.catbox.moe/kbmwf1.jpg',
  rules: 'https://files.catbox.moe/1nu52l.jpg',
  thumbnail: 'https://files.catbox.moe/lrpqh8.jpeg',
  thumb: 'https://files.catbox.moe/lrpqh8.jpeg',
  logo: 'https://files.catbox.moe/f3gawf.jpeg',
  unReg: 'https://files.catbox.moe/lrpqh8.jpeg',
  registrasi: 'https://files.catbox.moe/lrpqh8.jpeg',
  confess: 'https://telegra.ph/file/03cabea082a122abfa5be.jpg',
  akses: 'https://files.catbox.moe/l0xgxn.jpg',
  wel: 'https://files.catbox.moe/ackvor.mp4', // menu GIF
  bye: 'https://files.catbox.moe/ackvor.mp4', // Goodbye GIF
  sound: 'https://files.catbox.moe/g9o0no.mp3', // Audio menu
  sig: 'https://astro.build',
  sgh: 'https://astro.build',
  sgc: 'https://whatsapp.com/channel/0029VaVguZr5q08f0z5C8g1u',
};

// Payment Information
global.payment = {
  psaweria: 'https://saweria.co/',
  ptrakterr: '-',
  pdana: '',
};

// API Configuration
global.api = {
  btch: 'Ganti_apimu',
  rose: 'Ganti_apimu',
};
global.APIs = {
  btch: 'https://api.botcahx.eu.org',
  rose: 'https://api.itsrose.rest',
};
global.APIKeys = {
  'https://api.botcahx.eu.org': 'Ganti_apimu',
  'https://api.itsrose.rest': 'Ganti_apimu',
};

/*============== WATERMARK ==============*/
global.wm = 'Astrobot RPG' //Main Watermark
global.author = 'xFrmannJS'

/*============== TEXT ==============*/
global.wait = '*_Proses Ya Kak..._* '

/*=========== TYPE DOCUMENT ===========*/
global.doc = {
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    rtf: 'text/rtf'
}

/*========== HIASAN ===========*/
global.decor = {
	menut: '❏═┅═━–〈',
	menub: '┊•',
	menub2: '┊',
	menuf: '┗––––––––––✦',
	hiasan: '꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷',

	menut: '––––––『',
    menuh: '』––––––',
    menub: '┊☃︎ ',
    menuf: '┗━═┅═━––––––๑\n',
	menua: '',
	menus: '☃︎',

	htki: '––––––『',
	htka: '』––––––',
	haki: '┅━━━═┅═❏',
	haka: '❏═┅═━━━┅',
	lopr: 'Ⓟ',
	lolm: 'Ⓛ',
	htjava: '❃'
}

global.elainajpg = [
    'https://telegra.ph/file/3e43fcfaea6dc1ba95617.jpg',
    'https://telegra.ph/file/4018167852aef19651f46.jpg'
]
global.flaaa = [
    //'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
    //'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
    //'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
    'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
    'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text='
]
global.hwaifu = [
    'https://i.pinimg.com/originals/ed/34/f8/ed34f88af161e6278993e1598c29a621.jpg',
    'https://i.pinimg.com/originals/fd/21/41/fd21419275236bb153de3c8dcbbf3bf9.jpg',
    'https://i.pinimg.com/originals/80/4f/1a/804f1a05f9996c96a2d492b4854b7fd5.jpg'
]

/*============== STICKER WM ==============*/
global.stickpack = 'AstroTECH MD'
global.stickauth = 'by xFrmannJS'

// ================ RPG gausah di ubah apa apa nanti eror =============
global.multiplier = 69
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
      let emot = {
      agility: '🤸‍♂️',
      arc: '🏹',
      armor: '🥼',
      bank: '🏦',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      bow: '🏹',
      bull: '🐃',
      cat: '🐈',
      chicken: '🐓',
      common: '📦',
      cow: '🐄',
      crystal: '🔮',
      darkcrystal: '♠️',
      diamond: '💎',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      emerald: '💚',
      exp: '✉️',
      fishingrod: '🎣',
      fox: '🦊',
      gems: '🍀',
      giraffe: '🦒',
      gold: '👑',
      health: '❤️',
      horse: '🐎',
      intelligence: '🧠',
      iron: '⛓️',
      keygold: '🔑',
      keyiron: '🗝️',
      knife: '🔪',
      legendary: '🗃️',
      level: '🧬',
      limit: '🌌',
      lion: '🦁',
      magicwand: '⚕️',
      mana: '🪄',
      money: '💵',
      mythic: '🗳️',
      pet: '🎁',
      petFood: '🍖',
      pickaxe: '⛏️',
      pointxp: '📧',
      potion: '🥤',
      rock: '🪨',
      snake: '🐍',
      stamina: '⚡',
      strength: '🦹‍♀️',
      string: '🕸️',
      superior: '💼',
      sword: '⚔️',
      tiger: '🐅',
      trash: '🗑',
      uncommon: '🎁',
      upgrader: '🧰',
      wood: '🪵'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string));
    if (!results.length) return '';
    else return emot[results[0][0]];
  }
}

// Watch for File Changes
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});