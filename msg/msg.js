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
  ❏ Donasi:  _*https://saweria.co/erdwpebot*_  
  ❏ Prefix: 「  ${prefix} 」
  ❏ Nama: *${pushname}*
  
◪ 𝗠𝗘𝗡𝗨
- ${prefix}sticker
- ${prefix}stickergif
- ${prefix}sgifwm
- ${prefix}stickernocrop
- ${prefix}takestick
- ${prefix}memesticker
- ${prefix}ttp
- ${prefix}attp
- ${prefix}toimg
- ${prefix}emot
- ${prefix}play
- ${prefix}tiktoknowm
- ${prefix}tomp3
- ${prefix}bass
- ${prefix}quotemaker
- ${prefix}igdl [link ig]
- ${prefix}igstory [@username]
- ${prefix}nhder
- ${prefix}twtprof
- ${prefix}findsticker
- ${prefix}github
- ${prefix}email
- ${prefix}call
- ${prefix}fakta
- ${prefix}quotes
- ${prefix}cersex
- ${prefix}puisi
- ${prefix}cerpen
- ${prefix}loli
- ${prefix}wallhp
- ${prefix}ceritahoror
- ${prefix}walldekstop
- ${prefix}wallanime
- ${prefix}searchwp
- ${prefix}bucin
- ${prefix}jadwalsholat
- ${prefix}triggered
- ${prefix}trash
- ${prefix}hitler
- ${prefix}gtav
- ${prefix}pencil
- ${prefix}pencil2
- ${prefix}phcomment
- ${prefix}vote
- ${prefix}wasted
- ${prefix}gun
- ${prefix}igstalk [@username]

     
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