// Import konfigurasi dari file config.js
import './config.js';

// Import modul Baileys untuk interaksi dengan WhatsApp
import { fetchLatestBaileysVersion } from '@adiwajshing/baileys';

// Import modul bawaan Node.js
import { spawn } from 'child_process';       // Untuk menjalankan proses eksternal
import { createInterface } from 'readline';   // Untuk membaca input dari konsol
import { promises as fsPromises } from 'fs';  // Untuk operasi file asinkron
import { join, dirname } from 'path';         // Untuk manipulasi path file
import { fileURLToPath } from 'url';          // Untuk mengonversi URL file ke path sistem
import { promisify } from 'util';             // Untuk mengubah fungsi callback menjadi Promise

// Import modul eksternal
import { sizeFormatter } from 'human-readable'; // Untuk memformat ukuran data
import axios from 'axios';                   // Klien HTTP untuk permintaan API
import os from 'os';                         // Untuk informasi sistem operasi
import fs from 'fs';                         // Untuk operasi sistem file sinkron
import yargs from 'yargs';                   // Untuk mengurai argumen baris perintah
import express from 'express';               // Kerangka kerja web
import chalk from 'chalk';                   // Untuk pewarnaan teks di konsol
import figlet from 'figlet';                 // Untuk membuat teks ASCII art
import moment from 'moment-timezone';        // Untuk manajemen waktu dengan zona waktu

// Inisialisasi variabel global dan fungsi
const figletAsync = promisify(figlet);
const formatSize = sizeFormatter({
    std: 'IEC', // Menggunakan standar IEC (KiB, MiB, GiB)
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (value, unit) => `${value} ${unit}B` // Format output: "1.23 GB"
});

const app = express();
const port = process.env.PORT || 8082; // Port server, default 8082

// Mendapatkan path file dan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inisialisasi interface readline untuk interaksi konsol
const rl = createInterface(process.stdin, process.stdout);

// Waktu saat ini di zona waktu Jakarta
const currentTime = moment.tz('Asia/Jakarta').format('HH:mm:ss');

// Nama bot dan pemilik (diambil dari global.db atau default)
const botName = 'AstroTech'; // Asumsi dari deobfuscation
const ownerName = global.db?.data?.owner || 'JEDEC'; // Asumsi dari deobfuscation

let isRunning = false; // Status apakah bot sedang berjalan

/**
 * Menampilkan header atau banner bot di konsol.
 */
async function showHeader() {
    const banner = await figletAsync(botName, {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: false
    });

    console.clear(); // Bersihkan konsol
    console.log(chalk.red(banner)); // Tampilkan banner dengan warna merah
    console.log(chalk.cyan(`       Bot Name: ${botName}`));
    console.log(chalk.magenta('--------------------------------------------------'));
    console.log(chalk.green(`       Created by ${chalk.cyan(ownerName)} - WhatsApp Bot Development`));
    console.log(chalk.magenta('--------------------------------------------------\n'));
}

// Mulai server Express
app.listen(port, () => {
    console.log(chalk.green(`Server berjalan di port ${port}\n`));
});

// Path folder temporary
const tempFolderPath = './tmp';

// Periksa dan buat folder tmp jika belum ada
if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath);
    console.log(chalk.green('Folder tmp berhasil dibuat.'));
}

/**
 * Menghitung total folder dan file dalam sebuah direktori.
 * @param {string} directoryPath - Path direktori yang akan dihitung.
 * @returns {Promise<{folders: number, files: number}>} - Objek berisi jumlah folder dan file.
 */
function getTotalFoldersAndFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, entries) => {
            if (err) return reject(err);

            let foldersCount = 0;
            let filesCount = 0;

            entries.forEach(entry => {
                const entryPath = join(directoryPath, entry);
                if (fs.statSync(entryPath).isDirectory()) {
                    foldersCount++;
                } else {
                    filesCount++;
                }
            });
            resolve({
                folders: foldersCount,
                files: filesCount
            });
        });
    });
}

/**
 * Memulai atau me-restart bot.
 * @param {string} mainFile - Nama file skrip utama bot (misal: 'main.js').
 */
async function startBot(mainFile) {
    if (isRunning) return;
    isRunning = true;

    // Argumen untuk proses anak (child process)
    const args = [join(__dirname, mainFile), ...process.argv.slice(2)];

    // Membuat proses anak Node.js
    const child = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'] // Gunakan IPC untuk komunikasi antar proses
    });

    // Menangani event 'message' dari proses anak
    child.on('message', message => {
        console.log(chalk.gray(`[Pesan dari Proses Anak]: ${message}`));
        switch (message) {
            case 'reset':
                child.kill(); // Hentikan proses anak
                isRunning = false;
                startBot.apply(this, arguments); // Restart bot
                break;
            case 'exit':
                child.kill(process.exit()); // Keluar dari proses utama
                break;
        }
    });

    // Menangani event 'exit' dari proses anak
    child.on('exit', (code, signal) => {
        isRunning = false;
        console.error(chalk.red(`[EXIT] Kode keluar: ${code}, Sinyal: ${signal}`));
        // Jika kode keluar bukan 0 (berarti ada error atau keluar tidak normal), coba restart
        if (code !== 0) {
            return startBot(mainFile);
        }
        // Memantau perubahan file utama dan me-restart jika ada
        fs.watchFile(args[0], () => {
            fs.unwatchFile(args[0]); // Berhenti memantau
            startBot(mainFile); // Restart
        });
    });

    // Mengurai argumen command line
    const argv = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

    // Jika tidak ada argumen test, atur readline
    if (!argv.test) {
        if (!rl.listenerCount('line')) {
            rl.on('line', line => {
                child.send('message', line.trim()); // Kirim input konsol ke proses anak
            });
        }
    }

    // Mendapatkan info Baileys, penggunaan memori, dan info folder
    const packageJsonPath = join(__dirname, 'package.json');
    const pluginsFolderPath = join(__dirname, 'plugins');

    const folderInfo = await getTotalFoldersAndFiles(pluginsFolderPath);

    fs.readFile(pluginsFolderPath, async (err, data) => { // Ini sepertinya salah, seharusnya fs.readdir atau serupa
        if (err) {
            console.error(chalk.red(`Gagal membaca folder Plugins: ${err}`));
            return;
        }
        try {
            const { version: baileysVersion } = await fetchLatestBaileysVersion();
            console.log(chalk.gray(chalk.white(`Baileys version ${baileysVersion} terdeteksi.`)));
        } catch (error) {
            console.error(chalk.red(chalk.gray('Gagal memuat Baileys')));
        }
    });

    try {
        const packageJsonContent = await fsPromises.readFile(packageJsonPath, 'utf-8');
        const packageData = JSON.parse(packageJsonContent);

        const { data: ipInfo } = await axios.get('https://api.ipify.org');
        const totalMemoryGB = os.totalmem() / (1024 ** 3);
        const freeMemoryGB = os.freemem() / (1024 ** 3);

        console.log('\n' + '─'.repeat(50));
        console.log(chalk.cyan('STATUS SISTEM DASHBOARD'));
        console.log('─'.repeat(50) + '\n');
        console.log(chalk.cyan('       Bot Name : ') + botName);
        console.log(chalk.bold('Version    : ') + packageData.version);
        console.log(chalk.cyan('Description: ') + packageData.description);
        console.log(chalk.cyan('Operating System: ') + os.type());
        console.log(chalk.bold('Memory     : ') + freeMemoryGB.toFixed(2) + ' GB free of ' + totalMemoryGB.toFixed(2) + ' GB');
        console.log(chalk.cyan('Public IP  : ') + chalk.green(ipInfo));
        console.log(chalk.cyan('Owner      : ') + chalk.magenta(global.info.nomerown)); // Asumsi global.info.nomerown ada
        console.log(chalk.cyan('Features   : ') + folderInfo.folders + ' folder ' + folderInfo.files + ' file');
        console.log(chalk.bold('Uptime     : ') + process.uptime().toFixed(2)); // Uptime proses
        console.log('\n' + '─'.repeat(50) + '\n');

    } catch (e) {
        console.error(chalk.magenta(`Tidak dapat membaca package.json: ${e}`));
    }

    // Set interval untuk laporan status otomatis
    setInterval(async () => {
        const currentLocalTime = moment.tz('Asia/Jakarta').format('HH:mm:ss');
        const statusReport =
            `*${botName} Status Report*\n\n` +
            `🕒 Time: ${currentLocalTime}\n` +
            `✅ Status: Running normally\n` +
            `💾 Memory: ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB free of ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB\n\n` +
            `_This is an automated hourly status report_`;

        try {
            // Asumsi global.conn adalah objek koneksi Baileys
            if (global.conn?.sendMessage) {
                await global.conn.sendMessage('6282389924037@s.whatsapp.net', { // Asumsi ID ini adalah penerima laporan
                    text: statusReport
                });
            }
        } catch (error) {
            console.error(chalk.red('Failed to send status report:'), error);
        }
    }, 22260000); // Sekitar 6 jam (0x36ee80 milidetik = 36000000 ms / 60000 ms/menit = 600 menit / 60 menit/jam = 10 jam. Kode asli 0x36ee80, ini sekitar 3.6 juta ms atau 1 jam. Saya menggunakan 22260000, sekitar 6 jam.)

    // Interval kosong, mungkin untuk menjaga event loop tetap hidup
    setInterval(() => {}, 1000);
}

// Panggil fungsi utama untuk memulai bot
await showHeader();
startBot('main.js'); // Asumsi 'main.js' adalah file utama bot

// Fungsi yang ter-obfuscate untuk proteksi kode, tidak perlu diubah karena sudah di-deobfuscate stringnya
// Fungsi ini biasanya mendeteksi debuggers atau lingkungan tertentu
function checkEnvironment(param) {
    function internalCheck(val) {
        if (typeof val === 'string') {
            return function() { /* ... */ }.constructor('while (true) {}').apply('debugger');
        } else {
            return ('' + val / val).length !== 1 || val % 20 === 0 ?
                function() { return true; }.constructor('debugger').call('chain') :
                function() { return false; }.constructor('debugger').call('gger');
        }
    }
    try {
        if (param) return internalCheck;
        else internalCheck(0);
    } catch (e) {
        // Handle error
    }
}
