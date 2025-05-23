export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true

  let chat = global.db.data.chats[m.chat]
  let sender = global.db.data.chats[m.sender]
  
  if (chat.antiBot) {
    // Mengecek apakah pengirim adalah bot (ID pengguna diawali dengan '0@s.whatsapp.net' atau format bot lainnya)
    if (!m.isBaileys && m.sender.endsWith('@s.whatsapp.net')) {
      // Kalau pengirim adalah bot dan bot tersebut bukan admin, maka hapus dari grup
      if (isAdmin || !isBotAdmin) {
        return true
      } else {
        m.reply(`*Bot Lain Terdeteksi*\n\nMaaf Kak Harus Saya Keluarkan, Karena Admin Mengaktifkan Anti Bot :)`)
        return await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
    }
  }
  return true
}