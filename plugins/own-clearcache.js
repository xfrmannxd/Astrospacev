let handler = async (m, { usedPrefix, command, conn, text }) => {
  let noReg = Object.values(global.db.data.users).filter(user => user.registered == false)
  let user = db.data.users
  for (let data in user) {
  if (user[data].registered === false) {
    delete user[data];
  } 
  }
  conn.reply(m.chat, `*Sukses membersihkan user yang tidak Registrasi* [ \`\`\`${noReg.length }\`\`\` ]`, fkon)
}

handler.help = ['clearcache']
handler.tags = ['main']
handler.command = /^(clearcache)$/i
handler.rowner = true

export default handler
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/