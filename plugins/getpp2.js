

import fetch from "node-fetch";

let handler = async (m, { conn, command, args }) => {
	try {
		let who;

		if (m.isGroup) {
			who = m.mentionedJid[0] 
				? m.mentionedJid[0] 
				: m.quoted 
					? m.quoted.sender 
					: args[0] 
						? args[0].replace(/[^0-9]/g, '').replace(/\s+/g, '') + '@s.whatsapp.net' 
						: m.sender;
		} else {
			who = m.quoted 
				? m.quoted.sender 
				: args[0] 
					? args[0].replace(/[^0-9]/g, '').replace(/\s+/g, '') + '@s.whatsapp.net' 
					: m.sender;
		}
		let pp = await conn
			.profilePictureUrl(who, "image")
			.catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
		conn.sendFile(m.chat, pp, "nih bang.png", "Selesai....", m, {
			jpegThumbnail: await (await fetch(pp)).buffer(),
		});
	} catch {
		let sender = m.sender;
		let pp = await conn
			.profilePictureUrl(sender, "image")
			.catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
		conn.sendFile(m.chat, pp, "ppsad.png", "Selesai....", m, {
			jpegThumbnail: await (await fetch(pp)).buffer(),
		});
	}
};

handler.help = ["getpp2"];
handler.tags = ["group"];
handler.command = /^(getpp2)$/i;
handler.premium = true 

export default handler;
