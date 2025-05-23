let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  
  // List of all available commands
  let cmdList = `
╭─❒ *LIST OPTIONS* ❒
│
├❒ *GROUP SETTINGS*
│├◦ ${usedPrefix}enable acc
│├◦ ${usedPrefix}enable antiViewOnce
│├◦ ${usedPrefix}enable modeadmin
│├◦ ${usedPrefix}enable antinsfw
│├◦ ${usedPrefix}enable welcome
│├◦ ${usedPrefix}enable bye
│├◦ ${usedPrefix}enable autodelvn
│├◦ ${usedPrefix}enable antiaudio
│├◦ ${usedPrefix}enable antibadword
│├◦ ${usedPrefix}enable antibot
│├◦ ${usedPrefix}enable anticall
│├◦ ${usedPrefix}enable antilink
│├◦ ${usedPrefix}enable antidelete
│├◦ ${usedPrefix}enable antispam
│├◦ ${usedPrefix}enable antisticker
│├◦ ${usedPrefix}enable autoreply
│├◦ ${usedPrefix}enable antitoxic
│
├❒ *OWNER SETTINGS*
│├◦ ${usedPrefix}enable autobio
│├◦ ${usedPrefix}enable autobackup
│├◦ ${usedPrefix}enable joinonly
│├◦ ${usedPrefix}enable onlyprem
│├◦ ${usedPrefix}enable public
│├◦ ${usedPrefix}enable simi
│├◦ ${usedPrefix}enable simi2
│├◦ ${usedPrefix}enable simivoice
│├◦ ${usedPrefix}enable autoai
│├◦ ${usedPrefix}enable autojoin
│├◦ ${usedPrefix}enable autolevelup
│├◦ ${usedPrefix}enable bcjoin
│├◦ ${usedPrefix}enable detect
│├◦ ${usedPrefix}enable whitelist
│├◦ ${usedPrefix}enable restrict
│├◦ ${usedPrefix}enable game
│├◦ ${usedPrefix}enable rpg
│├◦ ${usedPrefix}enable nyimak
│├◦ ${usedPrefix}enable pconly
│├◦ ${usedPrefix}enable gconly
│├◦ ${usedPrefix}enable swonly
│├◦ ${usedPrefix}enable freply
│├◦ ${usedPrefix}enable clear
│├◦ ${usedPrefix}enable desc
│├◦ ${usedPrefix}enable viewstory
│├◦ ${usedPrefix}enable getmsg
│
╰❒ *Example:*
${usedPrefix}enable welcome
${usedPrefix}disable welcome
`.trim()

  if (!args[0]) {
    return conn.reply(m.chat, cmdList, m)
  }

  switch (type) {
    // Owner commands
    case 'freply':
    case 'fakereply':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.freply = isEnable
      break
    case 'autobackup':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.backup = isEnable
      break
    case 'autobio':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.autoBio = isEnable
      break
    case 'allakses':
    case 'joinonly':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.allakses = isEnable
      break
    case 'onlyprem':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.onlyprem = isEnable
      break
    case 'public':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = !isEnable
      break
    case 'simi':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.simi = isEnable
      break
    case 'autoai':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoAi = isEnable
      break
    case 'simi2':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.simiC = isEnable
      break
    case 'simivoice':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.simivoice = isEnable
      break
    case 'autoreply':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoReply = isEnable
      break
    case 'autosticker':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoSticker = isEnable
      break
    case 'autojoin':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      chat.autoJoin = isEnable
      break
    case 'clear':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.clear = isEnable
      break
    case 'restrict':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      global.opts['restrict'] = isEnable
      break
    case 'game':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      chat.games = isEnable
      break
    case 'rpg':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      chat.rpgs = isEnable
      break
    case 'nyimak':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['nyimak'] = isEnable
      break
    case 'autoread':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.autoread = isEnable
      break
    case 'pconly':
    case 'privateonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['pconly'] = isEnable
      break
    case 'gconly':
    case 'grouponly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['gconly'] = isEnable
      break
    case 'swonly':
    case 'statusonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['swonly'] = isEnable
      break
    case 'viewstory':
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.viewStory = isEnable
      break
    case 'whitelist':
    case 'whitelistcontact':
    case 'whitelistcontacts':
    case 'whitelistmycontact':
    case 'whitelistmycontacts':
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      conn.callWhitelistMode = isEnable
      break
      
    // Group commands
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break
    case 'bye':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bye = isEnable
      break
    case 'antinsfw':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiNsfw = isEnable
      break
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break
    case 'viewonce':
    case 'antiviewonce':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.viewonce = isEnable
      break
    case 'desc':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.descUpdate = isEnable
      break
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = isEnable
      break
    case 'autodelvn':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autodelvn = isEnable
      break
    case 'bcjoin':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.bcjoin = isEnable
      break
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break
    case 'antifoto':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiFoto = isEnable
      break
    case 'antiaudio':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiAudio = isEnable
      break
    case 'antivideo':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiVideo = isEnable
      break
    case 'antibot':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break
    case 'acc':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.acc = isEnable
      break
    case 'anticall':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      bot.antiCall = isEnable
      break
    case 'antisticker':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSticker = isEnable
      break
    case 'antitoxic':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = isEnable
      break
    case 'antibadword':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBadword = isEnable
      break
    case 'antispam':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiSpam = isEnable
      break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    case 'adminonly':
      isAll = true
      if (!isAdmin) {
        global.dfail('owner', m, conn)
        throw false
      }
      chat.adminonly = isEnable
      break
    case 'getmsg':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
      }
      chat.getmsg = isEnable
      break
    default:
      return conn.reply(m.chat, `❌ Unknown option, please select from the list:\n\n${cmdList}`, m)
  }

  // Custom status message with better UI
  let statusMsg = `
╭─❒ *STATUS UPDATE* ❒
│
├❒ *Type:* ${type}
├❒ *Status:* ${isEnable ? '✅ Activated' : '❌ Deactivated'}
├❒ *Scope:* ${isAll ? 'Entire Bot' : isUser ? 'User' : 'This Chat'}
│
╰❒ *${isEnable ? 'Feature has been activated!' : 'Feature has been deactivated!'}*
`.trim()

  conn.reply(m.chat, statusMsg, m, {
    contextInfo: {
      externalAdReply: {
        title: `${isEnable ? 'ACTIVATED' : 'DEACTIVATED'}`,
        body: global.namebot,
        thumbnailUrl: global.thumb,
        sourceUrl: global.sgc,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  })
}

handler.help = ['enable', 'disable'].map(v => v + ' <option>')
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

export default handler