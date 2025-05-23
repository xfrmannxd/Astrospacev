import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const validateToken = async () => {
    if (!global.info.token) {
        console.log('Token tidak ditemukan! masukkan token di config.js global.info.token. lalu upload kembali!!!);
        const configPath = path.resolve('config.js');
        if (fs.existsSync(configPath)) {
            fs.unlinkSync(configPath);
            console.log('Token tidak ditemukan! masukkan token di config.js global.info.token. lalu upload kembali!!!');
        }
        throw new Error('Token tidak ditemukan! masukkan token di config.js global.info.token. lalu upload kembali!!!.');
    }
    const url = 'https://tokens-eight.vercel.app/p/I/N/A/token.json';
    let tokenData;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Gagal mengambil data dari ${url}`);
        tokenData = await res.json();
    } catch (err) {
        throw new Error(`Terjadi kesalahan saat memeriksa token: ${err.message}`);
    }

    if (!tokenData.includes(global.info.token)) {
        throw new Error('Token tidak ditemukan! masukkan token di config.js global.info.token. lalu upload kembali!!!');
    }

    console.log('TOKEN BENER ☺️ TERIMAKASIH TELAH AMANAH');
};
await validateToken();

export default validateToken;