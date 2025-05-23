import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { lookup } from 'mime-types';
import { URL_REGEX } from '@adiwajshing/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    text = text.endsWith('SMH') ? text.replace('SMH', '') : text;
    if (!text) throw 'Input Query / Pinterest URL';

    // Send loading message
    await conn.sendMessage(m.chat, { text: 'Loading, please wait...' }, { quoted: m });

    try {
        let results = await pinterest(text); // Get up to 5 images
        let links = await Promise.all(results.map((url) => shortUrl(url)));

        for (let i = 0; i < results.length; i++) {
            await conn.sendMessage(
                m.chat,
                {
                    image: { url: results[i] },
                    caption: `Result ${i + 1}:\n${links[i]}`,
                },
                { quoted: m }
            );
        }

        // Send reaction message
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (err) {
        throw `Error: ${err.message}`;
    }
};

handler.help = ['pinterest'];
handler.tags = ['search'];
handler.command = /^pin(terest)?$/i;

handler.limit = true;
handler.register = true;

export default handler;

async function pinterest(query) {
    if (query.match(URL_REGEX)) {
        let res = await fetch('https://www.expertsphp.com/facebook-video-downloader.php', {
            method: 'POST',
            body: new URLSearchParams({ url: query }),
        });
        let $ = cheerio.load(await res.text());
        let data = $('table[class="table table-condensed table-striped table-bordered"]')
            .find('a')
            .attr('href');
        if (!data) throw new Error("Can't download post");
        return [data]; // Return single URL in array
    } else {
        let res = await fetch(
            `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`
        );
        let json = await res.json();
        let data = json.resource_response.data.results;
        if (!data.length) throw new Error(`Query "${query}" not found`);
        return data
            .slice(0, 5) // Get up to 5 results
            .map((item) => item.images.orig.url);
    }
}

async function shortUrl(url) {
    return await (await fetch(`https://tinyurl.com/api-create.php?url=${url}`)).text();
}