import { tmpdir } from 'os'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

let handler = async (m, { conn }) => {
  conn.reply(m.chat, 'Success!', m)

  const sessionPaths = ['/system/sessions', tmpdir()] // Sesuaikan jalur sesi
  const deletedFiles = []

  sessionPaths.forEach(dir => {
    if (!existsSync(dir)) return

    readdirSync(dir).forEach(file => {
      const filePath = join(dir, file)
      if (path.basename(filePath) === 'creds.json') return

      try {
        const stats = statSync(filePath)
        if (stats.isFile()) {
          unlinkSync(filePath)
          deletedFiles.push(filePath)
        }
      } catch (err) {
        console.error(`Error deleting ${filePath}:`, err)
      }
    })
  })

  console.log('Deleted files:', deletedFiles)
}

handler.help = ['clearsession']
handler.tags = ['owner']
handler.command = /^(clearsesi|clearsession)$/i
handler.rowner = true

export default handler