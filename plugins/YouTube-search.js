import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let query = text.trim();
  if (!query) throw `*Contoh penggunaan:* ${usedPrefix}${command} ⧼query⧽`;

  try {
    let searchResults = await yts(query);

    if (!searchResults || !searchResults.videos.length) {
      throw 'Tidak ada hasil ditemukan untuk pencarian ini.';
    }

    let caption = `— *YouTube Search Results*

_Here are some videos based on your search for "${query}":_\n\n`;

    searchResults.videos.slice(0, 5).forEach((video, index) => {
      caption += `• *Video ${index + 1}:* ${video.title}\n`;
      caption += `  Channel: ${video.author.name}\n`;
      caption += `  Duration: ${video.timestamp}\n`;
      caption += `  Views: ${video.views.toLocaleString()} views\n`;
      caption += `  Uploaded: ${video.ago}\n`;
      caption += `  Watch: ${video.url}\n\n`;
    });

    m.reply(caption);
  } catch (err) {
    m.reply(`Error: ${err.message}`);
  }
};

handler.help = ['yts'];
handler.tags = ['search'];
handler.command = /^(yts|ytsearch)$/i;
handler.register = true;
handler.premium = false;
handler.limit = true;

export default handler;

/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/