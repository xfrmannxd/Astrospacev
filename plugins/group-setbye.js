let handler = async (m, { conn, text, isROwner, isOwner, isAdmin, usedPrefix, command }) => {
  if (text) {
    global.db.data.chats[m.chat].sBye = text
    m.reply('Goodbye message berhasil diatur\n@user (Mention)\n@subject (Judul Grup)\n@desc (Deskripsi Grup)')
  } else throw `Teksnya mana?\n\ncontoh:\n${usedPrefix + command} sampai jumpa, @user!\nSemoga sukses di luar grup @subject\n\n@desc`
}

handler.help = ['setbye <teks>']
handler.tags = ['group', 'adminry']
handler.command = /^(setbye|setb)$/i
handler.group = true
handler.admin = true

export default handler

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
