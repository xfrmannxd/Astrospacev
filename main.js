// Fungsi anti-debugging/anti-tampering yang ter-obfuscate.
// Tujuannya adalah untuk mencegah analisis atau modifikasi kode.
// Tidak perlu diubah untuk fungsionalitas normal.
const antiTamperingCheck = function() {
    let initialized = true;
    return function(context, func) {
        const checker = initialized ? function() {
            if (func) {
                const result = func.apply(context, arguments);
                func = null;
                return result;
            }
        } : function() {};
        initialized = false;
        return checker;
    };
}();

// Bagian ini juga terkait anti-debugging/anti-tampering.
// Memeriksa lingkungan eksekusi untuk tanda-tanda debugging.
(function() {
    antiTamperingCheck(this, function() {
        const funcRegex = new RegExp("function *\\( *\\)");
        const propRegex = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
        const envCheck = getEnvironmentChecker("init"); // Fungsi yang di-obfuscate
        if (!funcRegex.test(envCheck + "chain") || !propRegex.test(envCheck + "input")) {
            envCheck("0");
        } else {
            getEnvironmentChecker();
        }
    })();
})();

// --- Modul Import ---
import "./config.js"; // Konfigurasi bot

// Modul Path dan Proses
import path, { join } from "path";
import { platform } from "process";

// Modul Chalk untuk pewarnaan konsol
import chalk from "chalk";

// Modul URL dan Module untuk path dinamis
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

// Definisi global.__filename, global.__dirname, global.__require untuk kompatibilitas
global.__filename = function getFilename(url = import.meta.url, windowsPath = platform !== "win32") {
    return windowsPath ? /file:\/\/\//.test(url) ? fileURLToPath(url) : url : pathToFileURL(url).toString();
};
global.__dirname = function getDirname(url) {
    return path.dirname(global.__filename(url, true));
};
global.__require = function getRequire(url = import.meta.url) {
    return createRequire(url);
};

// Modul lainnya
import * as WebSocket from "ws"; // Untuk WebSocket (digunakan oleh Baileys)
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from "fs"; // Operasi sistem file
import yargs from "yargs"; // Parsing argumen command line
import {
    spawn
} from "child_process"; // Menjalankan proses eksternal
import _ from "lodash"; // Utilitas (seperti 'chain')
import syntaxError from "syntax-error"; // Deteksi error sintaks
import {
    tmpdir
} from "os"; // Direktori temporary sistem
import pino from "pino"; // Logger
import {
    format
} from "util"; // Utilitas format string

// Baileys dan Simple.js
import {
    makeWASocket,
    protoType,
    serialize
} from "./lib/simple.js"; // Wrapper Baileys kustom (simple.js)
import {
    Low
} from "lowdb"; // Database sederhana
import fsPromises from "fs/promises"; // Kembali ke fs/promises
import {
    JSONFile
} from "lowdb/node"; // Adapter JSON File untuk LowDB
import qrcodeTerminal from "qrcode-terminal"; // Menampilkan QR Code di terminal
import Store from "./lib/store2.js"; // Store kustom (kemungkinan untuk menyimpan pesan/kontak)

const store = Store.makeInMemoryStore(); // Inisialisasi in-memory store

// Destructuring dari Baileys
const {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    Browsers
} = await (await import("@adiwajshing/baileys")).default;

// Modul Readline
import readline from "readline";

// Inisialisasi Lodash chain
const {
    chain
} = _;

// Inisialisasi Readline Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk mendapatkan input dari pengguna (berbasis Promise)
const question = prompt => new Promise(resolve => rl.question(prompt, resolve));

// Node Cache untuk retry counter pesan
import NodeCache from "node-cache";
const msgRetryCounterCache = new NodeCache();
const msgRetryCounterMap = (id) => {}; // Fungsi stub untuk msgRetryCounterMap

// Dapatkan versi Baileys terbaru
const {
    version
} = await fetchLatestBaileysVersion();

// Panggil fungsi inisialisasi dari simple.js
protoType();
serialize();

// --- Variabel Global ---
global.API = (name, path = "/", query = {}, apiKeyName) => {
    const baseUrl = global.APIs && global.APIs[name] ? global.APIs[name] : name;
    const params = new URLSearchParams(Object.entries({
        ...query,
        ...(apiKeyName ? {
            [apiKeyName]: global.APIKeys[baseUrl]
        } : {})
    }));
    return `${baseUrl}${path}${query || apiKeyName ? '?' + params.toString() : ''}`;
};

global.timestamp = {
    start: new Date()
}; // Waktu mulai bot

// Konfigurasi Yargs untuk argumen CLI
const __dirnameGlobal = global.__dirname(import.meta.url); // Overwrite __dirname
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

// Regex untuk prefix bot
global.prefix = new RegExp("^[" + (opts.prefix || "‎!./#\\").replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]");

// Inisialisasi LowDB
global.db = new Low(
    /https?:\/\//.test(opts.db || '') ?
    new cloudDBAdapter(opts.db) : // Jika menggunakan cloud DB
    new JSONFile((opts._[0] ? opts._[0] + "_" : '') + "system/database.json") // Default JSON File
);
global.DATABASE = global.db; // Alias untuk global.db

// Fungsi untuk memuat database
global.loadDatabase = async function loadDatabase() {
    // Jika database sedang dibaca, tunggu sampai selesai
    if (global.db.READ) {
        return new Promise(resolve => setInterval(async function() {
            if (!global.db.READ) {
                clearInterval(this);
                resolve(global.db.data == null ? await global.loadDatabase() : global.db.data);
            }
        }, 1000));
    }

    // Jika data sudah dimuat, tidak perlu memuat lagi
    if (global.db.data !== null) {
        return;
    }

    global.db.READ = true; // Set status sedang dibaca
    await global.db.read().catch(console.error); // Baca database
    global.db.READ = null; // Reset status

    // Inisialisasi struktur data default jika database kosong
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        menfess: {},
        simulator: {},
        ...(global.db.data || {}) // Pertahankan data yang sudah ada
    };
    global.db.chain = chain(global.db.data); // Inisialisasi Lodash chain pada data database
};
loadDatabase(); // Panggil untuk memuat database saat startup

// Folder autentikasi Baileys
global.authFolder = Store.fixFileName((opts._[0] || '') + "system/sessions");
let {
    state,
    saveCreds
} = await useMultiFileAuthState(path.resolve("./system/sessions"));

// --- Konfigurasi Koneksi Baileys ---
const connectionOptions = {
    printQRInTerminal: false, // Tidak mencetak QR di terminal secara default
    patchMessageBeforeSending: msg => {
        // Logika untuk mengubah pesan sebelum dikirim (misalnya untuk View Once)
        const isViewOnce = !!(msg.buttonsMessage || msg.templateMessage || msg.listMessage);
        if (isViewOnce) {
            msg = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...msg
                    }
                }
            };
        }
        return msg;
    },
    msgRetryCounterMap: msgRetryCounterMap,
    logger: pino({
        level: "fatal"
    }), // Level logger pino (fatal berarti hanya error fatal yang dilog)
    auth: state, // State autentikasi
    browser: Browsers.macOS("Chrome"), // Informasi browser
    version: version, // Versi Baileys
    getMessage: async msg => {
        // Fungsi untuk mengambil pesan dari store (untuk pesan yang tidak tersedia)
        let normalizedJid = jidNormalizedUser(msg.remoteJid);
        let loadedMsg = await store.loadMessage(normalizedJid, msg.id);
        return loadedMsg?.message || '';
    },
    msgRetryCounterCache: msgRetryCounterCache,
    connectTimeoutMs: 60000, // Timeout koneksi (60 detik)
    defaultQueryTimeoutMs: 0, // Timeout query default
    keepAliveIntervalMs: 10000, // Interval keep-alive (10 detik)
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true // Menandai bot online saat terhubung
};

// --- Fungsi Utama Bot ---
async function startBot() {
    const sessionExists = existsSync("./system/sessions/creds.json");

    if (sessionExists) {
        console.log(chalk.green("Session ditemukan, menghubungkan..."));
        global.conn = makeWASocket(connectionOptions); // Buat koneksi Baileys
        global.conn.isInit = false; // Tandai belum diinisialisasi penuh
    } else {
        console.log(chalk.bold("\nSilahkan pilih salah satu metode tautan perangkat:"));
        console.log("1. Pairing Code (tautan dengan nomor)");
        console.log("2. QR Code (scan untuk menautkan)\n");

        const choice = await question(chalk.bold("Pilih metode (1/2): "));

        if (choice === "1") {
            global.conn = makeWASocket(connectionOptions);
            global.conn.isInit = false;
            global.pairingCode = true;

            if (global.pairingCode && !global.conn.authState.creds.registered) {
                let phoneNumber;
                if (!!global.info.pairingNumber) { // Asumsi global.info.pairingNumber ada
                    phoneNumber = global.info.pairingNumber.replace(/[^0-9]/g, '');
                } else {
                    phoneNumber = await question(chalk.bgBlack(chalk.greenBright("Masukkan nomor WhatsApp Anda : ")));
                    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
                    rl.close(); // Tutup readline setelah input
                }

                setTimeout(async () => {
                    let pairingCode = await global.conn.requestPairingCode(phoneNumber);
                    pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode;
                    console.log(chalk.yellow(chalk.bgGreen("Kode Pairing Anda : ")), chalk.black(chalk.white(pairingCode)));
                }, 3000); // Tunggu 3 detik sebelum meminta kode
            }
        } else if (choice === "2") {
            connectionOptions.printQRInTerminal = true; // Aktifkan QR di terminal
            global.conn = makeWASocket(connectionOptions);

            global.conn.ev.on("connection.update", async update => {
                const {
                    connection,
                    qr
                } = update;
                if (qr) {
                    console.log(chalk.yellow("\nScan QR code berikut untuk menautkan perangkat:"));
                    qrcodeTerminal.generate(qr, {
                        small: true
                    }); // Tampilkan QR Code kecil
                }
                if (connection === "open") {
                    console.log(chalk.green("\nBerhasil terhubung!"));
                }
            });
        } else {
            console.log(chalk.red("Pilihan tidak valid. Silakan jalankan ulang bot."));
            process.exit(0); // Keluar jika pilihan tidak valid
        }
    }

    // Auto-save database dan bersihkan file tmp (jika tidak dalam mode test)
    if (!opts.test) {
        if (global.db) {
            setInterval(async () => {
                if (global.db.data) {
                    await global.db.write().catch(console.error); // Tulis database ke file
                }
                cleanTemporaryFiles(); // Bersihkan file temporary
            }, 30000); // Setiap 30 detik
        }
    }

    /**
     * Menghapus file di folder kecuali file tertentu.
     * @param {string} folderPath - Path folder yang akan dibersihkan.
     * @param {string} excludeFile - Nama file yang tidak akan dihapus.
     */
    function deleteFilesInFolderExcept(folderPath, excludeFile) {
        fsPromises.readdir(folderPath, (err, files) => { // Menggunakan fsPromises.readdir
            if (err) {
                console.error("Terjadi kesalahan:", err);
                return;
            }
            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                if (file !== excludeFile) {
                    fsPromises.unlink(filePath, err => { // Menggunakan fsPromises.unlink
                        if (err) {
                            console.error(`Gagal menghapus file ${file}:`, err);
                        } else {
                            console.log(`File ${file} berhasil dihapus.`);
                        }
                    });
                }
            });
        });
    }

    /**
     * Membersihkan file temporary.
     */
    function cleanTemporaryFiles() {
        const tempFolders = [tmpdir(), join(__dirnameGlobal, "./tmp")];
        const filesToClean = [];

        tempFolders.forEach(folder => {
            readdirSync(folder).forEach(file => filesToClean.push(join(folder, file)));
        });

        return filesToClean.map(file => {
            const stats = statSync(file);
            // Hapus file jika sudah lebih dari 5 menit
            if (stats.isFile() && Date.now() - stats.mtimeMs >= 300000) { // 300000 ms = 5 menit
                return unlinkSync(file);
            }
            return false;
        });
    }

    /**
     * Handler untuk update koneksi Baileys.
     * @param {object} update - Objek update koneksi.
     */
    async function handleConnectionUpdate(update) {
        const {
            connection,
            lastDisconnect,
            isNewLogin
        } = update;
        global.stopped = connection; // Menyimpan status koneksi global
        if (isNewLogin) {
            global.conn.isInit = true; // Tandai inisialisasi penuh
        }

        const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

        // Jika terputus dan bukan karena logout, coba restart handler
        if (statusCode && statusCode !== DisconnectReason.loggedOut && global.conn?.ws?.readyState !== WebSocket.CONNECTING) {
            console.log(await global.reloadHandler(true).catch(console.error));
            global.timestamp.connect = new Date(); // Update timestamp koneksi
        }

        // Muat database jika belum ada
        if (global.db.data == null) {
            loadDatabase();
        }

        // Jika koneksi terbuka
        if (connection === "open") {
            console.log(chalk.bgGreen(chalk.white("Bot telah AKTIF")));
            const startupTime = moment().tz("Asia/Jakarta").format("HH:mm:ss DD/MM/YYYY");
            const startupReport =
                `*Bot Started Successfully*\n\n` +
                `🕒 Time: ${startupTime}\n` +
                `✅ Status: Connected and running\n` +
                `🤖 Bot Name: ${global.info.namebot || 'Nama Bot'}\n` + // Asumsi global.info.namebot ada
                `📱 Bot Number: ${global.info.nomerbot || 'Nomor Bot'}\n\n` + // Asumsi global.info.nomerbot ada
                `_This is an automated startup report_`;
            try {
                // Kirim laporan startup ke nomor tertentu
                await global.conn.sendMessage("19419318284@s.whatsapp.net", { // Ganti dengan nomor tujuan
                    text: startupReport
                });
            } catch (error) {
                console.error(chalk.red("Failed to send startup report:"), error);
            }
        }

        // Jika koneksi tertutup
        if (connection == "close") {
            console.log(chalk.yellow("📡 Koneksi telah terputus. hapus session dan ambil ulang session untuk menjalankan Bot"));
        }
    }

    // Tangani exception yang tidak tertangkap
    process.on("uncaughtException", console.error);

    let isHandlerReloading = true; // Status untuk reload handler
    let handlerModule = await import("./handler.js"); // Import handler utama

    // Fungsi untuk me-reload handler bot
    global.reloadHandler = async function(shouldReconnect) {
        try {
            const newHandlerModule = await import("./handler.js?update=" + Date.now()).catch(console.error);
            // Jika modul handler baru memiliki kunci, gunakan yang baru
            if (Object.keys(newHandlerModule || {}).length) {
                handlerModule = newHandlerModule;
            }
        } catch (error) {
            console.error; // Log error
        }

        // Jika perlu reconnect (misal setelah disconnect)
        if (shouldReconnect) {
            const currentChats = global.conn.chats;
            try {
                global.conn.ws.close(); // Tutup WebSocket
            } catch {}
            global.conn.ev.removeAllListeners(); // Hapus semua listener
            global.conn = makeWASocket(connectionOptions, {
                chats: currentChats
            }); // Buat koneksi baru dengan chat yang ada
            isHandlerReloading = true;
        }

        // Nonaktifkan listener lama jika tidak sedang reloading
        if (!isHandlerReloading) {
            global.conn.ev.off("messages.upsert", global.conn.handler);
            global.conn.ev.off("group-participants.update", global.conn.participantsUpdate);
            global.conn.ev.off("messages.update", global.conn.pollUpdate);
            global.conn.ev.off("groups.update", global.conn.groupsUpdate);
            global.conn.ev.off("connection.update", global.conn.connectionUpdate);
            global.conn.ev.off("creds.update", global.conn.credsUpdate);
        }

        // Pesan default untuk event grup/bot
        global.conn.welcome = "Welcome to @subject, @user\n";
        global.conn.bye = "Goodbye @user 👋";
        global.conn.spromote = "@user *Promote* to Admin ";
        global.conn.sdemote = "@user *Demote* from Admin";
        global.conn.sDesc = "Description Has Been Changed To \n@desc";
        global.conn.sSubject = "Group Name Has Been Changed To \n@subject";
        global.conn.sIcon = "Group Photo Has Been Changed!";
        global.conn.sRevoke = "Group Link Has Been Changed To \n@revoke";
        global.conn.sAnnounceOn = "The group has been closed!\now only admins can send messages.";
        global.conn.sAnnounceOff = "The group is open!\nNow all participants can send messages.";
        global.conn.sRestrictOn = "Edit Group Info changed to admin only!";
        global.conn.sRestrictOff = "Edit Group Info changed to all participants!";

        // Bind handler baru ke koneksi
        global.conn.handler = handlerModule.handler.bind(global.conn);
        global.conn.participantsUpdate = handlerModule.participantsUpdate.bind(global.conn);
        global.conn.pollUpdate = handlerModule.pollUpdate.bind(global.conn);
        global.conn.groupsUpdate = handlerModule.groupsUpdate.bind(global.conn);
        global.conn.connectionUpdate = handleConnectionUpdate.bind(global.conn);
        global.conn.credsUpdate = saveCreds.bind(global.conn);

        // Tambahkan kembali listener
        global.conn.ev.on("messages.upsert", global.conn.handler);
        global.conn.ev.on("group-participants.update", global.conn.participantsUpdate);
        global.conn.ev.on("messages.update", global.conn.pollUpdate);
        global.conn.ev.on("groups.update", global.conn.groupsUpdate);
        global.conn.ev.on("connection.update", global.conn.connectionUpdate);
        global.conn.ev.on("creds.update", global.conn.credsUpdate);

        isHandlerReloading = false;
        return true;
    };

    // --- Pemuatan Plugin ---
    const pluginsFolder = global.__dirname(join(__dirnameGlobal, "./plugins/index")); // Path folder plugins
    const isJsFile = (filename) => /\.js$/.test(filename); // Filter file JavaScript

    global.plugins = {}; // Objek untuk menyimpan plugin yang dimuat

    /**
     * Memuat semua plugin dari folder.
     */
    async function loadPlugins() {
        for (const filename of readdirSync(pluginsFolder).filter(isJsFile)) {
            try {
                const pluginPath = global.__filename(join(pluginsFolder, filename));
                const pluginModule = await import(pluginPath);
                global.plugins[filename] = pluginModule.default || pluginModule;
            } catch (error) {
                global.conn.logger.error(error); // Log error pemuatan plugin
                delete global.plugins[filename]; // Hapus plugin yang gagal dimuat
            }
        }
    }
    loadPlugins().then(keys => Object.keys(global.plugins)).catch(console.error);

    // --- Fungsi Reload Plugin ---
    global.reload = async (event, filename) => {
        if (/\.js$/.test(filename)) { // Hanya proses file .js
            const filePath = global.__filename(join(pluginsFolder, filename), true);
            if (filename in global.plugins) {
                if (existsSync(filePath)) {
                    global.conn.logger.info(` Updated Plugin - '${filename}'`);
                } else {
                    global.conn.logger.warn(`Deleted Plugin - '${filename}'`);
                    return delete global.plugins[filename]; // Hapus plugin jika file tidak ada
                }
            } else {
                global.conn.logger.info(`New Plugin - '${filename}'`);
            }

            // Cek error sintaks pada plugin
            const syntaxCheck = syntaxError(readFileSync(filePath), filename, {
                sourceType: "module",
                allowAwaitOutsideFunction: true
            });

            if (syntaxCheck) {
                global.conn.logger.error(`syntax error while loading '${filename}'\n` + format(syntaxCheck));
            } else {
                try {
                    const updatedPlugin = await import(global.__filename(filePath) + "?update=" + Date.now());
                    global.plugins[filename] = updatedPlugin.default || updatedPlugin;
                } catch (error) {
                    global.conn.logger.error(`error require plugin '${filename}\n` + format(error) + "'");
                } finally {
                    // Urutkan plugin berdasarkan nama file
                    global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
                }
            }
        }
    };
    Object.freeze(global.reload); // Bekukan fungsi reload agar tidak bisa diubah
    watch(pluginsFolder, global.reload); // Pantau perubahan di folder plugins

    await global.reloadHandler(); // Panggil handler saat startup

    // --- Cek Ketersediaan Tool Eksternal (ffmpeg, imagemagick, dll) ---
    async function checkExternalTools() {
        const toolChecks = await Promise.all([
            spawn("ffmpeg"),
            spawn("ffprobe"),
            spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-filter_complex", "color", "-frames:v", "1", "-f", "webp", "-"]),
            spawn("convert"), // ImageMagick
            spawn("magick"), // ImageMagick
            spawn("gm"), // GraphicsMagick
            spawn("find", ["--version"])
        ].map(command => {
            return Promise.race([
                new Promise(resolve => {
                    command.on("close", exitCode => {
                        resolve(exitCode !== 127); // 127 = command not found
                    });
                }),
                new Promise(resolve => {
                    command.on("error", error => resolve(false)); // Error berarti tidak ada
                })
            ]);
        }));
        // Hasilnya bisa disimpan di global.support atau variabel lain
        const [
            ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find
        ] = toolChecks;
        // console.log("Support FFMPEG:", ffmpeg); // Contoh penggunaan
        // console.log("Support ImageMagick (convert):", convert); // Contoh penggunaan
        Object.freeze(global.support); // Bekukan global.support jika ada
    }

    // --- Pembersihan Otomatis (jika diaktifkan di setting) ---
    if (global.setting.autoclear) { // Asumsi global.setting.autoclear ada
        setInterval(async () => {
            if (global.stopped === "close" || !global.conn || !global.conn.user) {
                return; // Jangan jalankan jika bot tidak terhubung
            }
            await deleteFilesInFolderExcept("./system/sessions", "creds.json"); // Bersihkan folder sessions kecuali creds.json
            await cleanTemporaryFiles(); // Bersihkan file tmp
            global.conn.reply("19419318284@s.whatsapp.net", "Sessions telah dibersihkan", null); // Kirim pesan konfirmasi
            console.log(chalk.cyanBright("\n╭───────────────────·»\n│\n│  Sessions clear Successfull \n│\n" + (`╰───❲ ${global.namebot || 'Nama Bot'} ❳\n`)));
        }, 7200000); // Setiap 2 jam (7.200.000 ms)
    }

    // --- Laporan Status Setiap Jam ---
    setInterval(async () => {
        if (!global.conn || !global.conn.user) {
            return; // Jangan kirim laporan jika bot tidak terhubung
        }
        const reportTime = moment().tz("Asia/Jakarta").format("HH:mm:ss DD/MM/YYYY");
        const ramUsageMB = (process.memoryUsage().rss / 1048576).toFixed(2);
        const uptimeSeconds = process.uptime();
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor(uptimeSeconds % 3600 / 60);
        const uptimeSecondsRemaining = Math.floor(uptimeSeconds % 60);

        const hourlyReport =
            `*Bot Status Report*\n\n` +
            `🕒 Time: ${reportTime}\n` +
            `⏳ Uptime: ${uptimeHours}h ${uptimeMinutes}m ${uptimeSecondsRemaining}s\n` +
            `💾 RAM Usage: ${ramUsageMB} MB\n` +
            `✅ Status: Running smoothly\n\n` +
            `_This is an automated hourly status report_`;

        try {
            await global.conn.sendMessage("19419318284@s.whatsapp.net", { // Kirim laporan ke nomor tertentu
                text: hourlyReport
            });
        } catch (error) {
            console.error(chalk.red("Failed to send hourly report:"), error);
        }
    }, 3600000); // Setiap 1 jam (3.600.000 ms)

    checkExternalTools().catch(console.error); // Panggil pengecekan tool eksternal
}

startBot(); // Mulai fungsi utama bot

// Fungsi anti-debugging/anti-tampering (tetap ter-obfuscate agar tidak mudah dimodifikasi)
function getEnvironmentChecker(param) {
    function internalChecker(value) {
        if (typeof value === "string") {
            return function() {}.constructor("while (true) {}").apply("counter");
        } else if (('' + value / value).length !== 1 || value % 20 === 0) {
            (function() {
                return true;
            }).constructor("debugger").call("action");
        } else {
            (function() {
                return false;
            }).constructor("debugger").apply("stateObject");
        }
        internalChecker(++value);
    }
    try {
        if (param) {
            return internalChecker;
        } else {
            internalChecker(0);
        }
    } catch (e) {}
}
