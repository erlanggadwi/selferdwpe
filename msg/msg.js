const fs = require('fs-extra')
const { prefix } = JSON.parse(fs.readFileSync('config.json'))

exports.notRegistered = (pushname) => {
    return `Hai ${pushname}\nKamubelum terdaftar di database\nketik ${prefix}register untuk melakukan pendaftaran`
}

exports.wait = () => {
    return 'Mohon tunggu sebentar...'
}

exports.linkDetected = () => {
    return `*...:* *ANTI GROUP LINK*\n\nAnda terdeteksi mengirimkan link group lain\nAnda akan dikick otomatis!`
}

exports.groupOnly = () => {
    return `Perintah ini hanya bisa digunakan didalam grup!`
}

exports.botNotAdmin = () => {
    return `Jadikan bot sebagai admin terlebih dahulu!`
}

exports.adminOnly = () => {
    return `Perintah ini hanya bisa digunakan oleh admin grup!`
}

exports.menu = (pushname) => {
    return `

◪ 𝗜𝗡𝗙𝗢
  ❏ Donasi:  https://saweria.co/erdwpebot
  ❏ Prefix: 「  ${prefix} 」
  ❏ Nama: *${pushname}*
  
◪ 𝗠𝗘𝗡𝗨
- _${prefix}stickergif_
- _${prefix}sgifwm_
- _${prefix}stickerround_
- _${prefix}stickernocrop_
- _${prefix}takestick_
- _${prefix}memesticker_
- _${prefix}ttp_
- _${prefix}attp_
- _${prefix}toimg_
- _${prefix}tovid_
- _${prefix}emot_
- _${prefix}play_
- _${prefix}ocr_
- _${prefix}tiktoknowm_
- _${prefix}tomp3_
- _${prefix}bass_
- _${prefix}quotemaker_
- _${prefix}igdl_ [link ig]
- _${prefix}igstory_ [username]
- _${prefix}nhder_
- _${prefix}twtprof_
- _${prefix}findsticker_
- _${prefix}github_
- _${prefix}email_
- _${prefix}call_
- _${prefix}fakta_
- _${prefix}quotes_
- _${prefix}cersex_
- _${prefix}puisi_
- _${prefix}cerpen_
- _${prefix}loli_
- _${prefix}wallhp_
- _${prefix}ceritahoror_
- _${prefix}walldekstop_
- _${prefix}wallanime_
- _${prefix}searchwp_
- _${prefix}bucin_
- _${prefix}jadwalsholat_
- _${prefix}triggered_
- _${prefix}trash_
- _${prefix}hitler_
- _${prefix}gtav_
- _${prefix}pencil_
- _${prefix}pencil2_
- _${prefix}phcomment_
- _${prefix}vote_
- _${prefix}wasted_
- _${prefix}gun_
- _${prefix}igstalk_ [username]
     
_made with ❤ from SBY_
`
}
exports.menuAdmin = () => {
    return `
*...:* *ADMIN MENU* *:...   
-❁ *${prefix}antilink*
-❁ *${prefix}kick*
-❁ *${prefix}promote*
-❁ *${prefix}demote*
-❁ *${prefix}mutegrup* [on/off]
-❁ *${prefix}edotensei*
-❁ *${prefix}antivirtext*
`
}