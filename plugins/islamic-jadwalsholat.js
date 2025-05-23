import axios from 'axios'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Use example ${usedPrefix}${command} semarang`
  try {
    const res = await jadwalsholatBulanan(text)
    let reply = `Jadwal Sholat ${text} untuk 1 Bulan:\n\n`
    res.forEach(day => {
      reply += `Tanggal: ${day.date}\n`
      reply += `Fajar: ${day.fajar}\n`
      reply += `Matahari Terbit: ${day.matahari_terbit}\n`
      reply += `Dhuhur: ${day.dhuhur}\n`
      reply += `Ashar: ${day.ashar}\n`
      reply += `Matahari Terbenam: ${day.matahari_terbenam}\n`
      reply += `Magrib: ${day.maghrib}\n`
      reply += `Isya: ${day.isya}\n`
      reply += `Imsak: ${day.imsak}\n`
      reply += `Tengah Malam: ${day.tengah_malam}\n\n`
    })
    m.reply(reply)
  } catch (e) {
    throw 'Terjadi kesalahan saat mengambil data jadwal sholat.'
  }
}
handler.help = ['salat <daerah>']
handler.tags = ['islami']
handler.command = /^(jadwal)?s(a|o|ha|ho)lat$/i

export default handler

async function jadwalsholatBulanan(kota) {
  try {
    const { data } = await axios.get(`https://api.aladhan.com/v1/calendarByCity?city=${kota}&country=Indonesia&method=8&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`)

    const result = data.data.map(day => ({
      date: day.date.readable,
      fajar: day.timings.Fajr,
      matahari_terbit: day.timings.Sunrise,
      dhuhur: day.timings.Dhuhr,
      ashar: day.timings.Asr,
      matahari_terbenam: day.timings.Sunset,
      maghrib: day.timings.Maghrib,
      isya: day.timings.Isha,
      imsak: day.timings.Imsak,
      tengah_malam: day.timings.Midnight
    }))
    return result
  } catch (e) {
    return 'Terjadi kesalahan saat mengambil data jadwal sholat.'
  }
}
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/