/*
        ••JANGAN HAPUS INI••
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 

• Menerima pembuatan script bot
• Menerima perbaikan script atau fitur bot
• Menerima pembuatan fitur bot
• Menerima semua kebutuhan bot
• Menerima Jadi Bot

ℹ️ Information

• Pembayaran bisa dicicil
• Bisa bayar di awal atau akhir
• Pembayaran melalu QRIS Only
• Testimoni Banyak

Aturan:
1. Dilarang memperjualbelikan script ini.
2. Hak cipta milik Vynaa Valerie.

“Dan janganlah kamu makan harta di antara kamu dengan jalan yang batil, dan janganlah kamu membunuh dirimu sendiri. Sesungguhnya Allah adalah Maha Penyayang kepadamu.” (QS. Al-Baqarah: 188)
*/
import { resolve, dirname as _dirname } from 'path'
import _fs, { existsSync, readFileSync } from 'fs'
const { promises: fs } = _fs

class Database {
    /**
     * Create new Database
     * @param {String} filepath Path to specified json database
     * @param  {...any} args JSON.stringify arguments
     */
    constructor(filepath, ...args) {
        this.file = resolve(filepath)
        this.logger = console
        
        this._load()

        this._jsonargs = args
        this._state = false
        this._queue = []
        this._interval = setInterval(async () => {
          if (!this._state && this._queue && this._queue[0]) {
            this._state = true
            await this[this._queue.shift()]().catch(this.logger.error)
            this._state = false
          }
        }, 1000)
        
    }

    get data() {
        return this._data
    }

    set data(value) {
        this._data = value
        this.save()
    }

    /**
     * Queue Load
     */
    load() {
        this._queue.push('_load')
    }

    /**
     * Queue Save
     */
    save() {
        this._queue.push('_save')
    }

    _load() {
        try {
          return this._data = existsSync(this.file) ? JSON.parse(readFileSync(this.file)) : {}
        } catch (e) {
          this.logger.error(e)
          return this._data = {}
        }
    }

    async _save() {
        let dirname = _dirname(this.file)
        if (!existsSync(dirname)) await fs.mkdir(dirname, { recursive: true })
        await fs.writeFile(this.file, JSON.stringify(this._data, ...this._jsonargs))
        return this.file
    }
}

export default Database

