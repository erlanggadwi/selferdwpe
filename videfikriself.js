/* eslint-disable no-case-declarations */
const { decryptMedia, erdwpe } = require('@open-wa/wa-automate')
const { color, msgFilter, processTime, isUrl} = require('./function')
const { uploadImages, sleep } = require('./function/fetcher.js')
const { register } = require('./data/')
const { msg3 } = require('./msg')
const { downloader, stalker, fun, spammer, meme, education } = require('./lib')
const { getStickerMaker } = require('./lib/ttp')
const path = require('path')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')
const config = require('./config.json')
const fs = require('fs-extra')
const bent = require('bent')
const fetch = require('node-fetch')
const canvas = require('canvacord')
const Jimp = require('jimp')
const imgbb = require("imgbb-uploader")
const emojiUnicode = require('emoji-unicode')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')



let setting = JSON.parse(fs.readFileSync('./database/setting.json'))

let {
    limitCount,
    memberLimit,
    groupLimit,
    banChats,
    barbarkey,
    melodickey,
    vhtearkey,
    restartState: isRestart,
    mtc: mtcState
    } = setting

let state = {
    status: () => {
        if(banChats){
            return 'aktif'
        }else if(mtcState){
            return 'Nonaktif'
        }else if(!mtcState){
            return 'Aktif'
        }else{
            return 'Aktif'
        }
    }
}

// eslint-disable-next-line no-undef
         /*=_=_=_=_=_=_=_=_=_=_=_=_=_ MESSAGE HANDLER =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=*/
module.exports = handler = async (erdwpe = new erdwpe(), message) => {
    try {
        const {
            type,
            id,
            from,
            t,
            to,
            sender,
            isGroupMsg,
            chat,
            chatId,
            caption,
            isMedia,
            mimetype,
            quotedMsg,
            quotedMsgObj,
            author,
            mentionedJidList
            } = message
        const self = sender && sender.isMe ? to : from
        let { body } = message
        const { owner, prefix, lolhuman } = config
        const { name, formattedTitle } = chat
        let { pushname, formattedName, verifiedName } = sender
        pushname = pushname || formattedName || verifiedName
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image') && caption) || type === 'video' && caption) && caption.startsWith(prefix) ? caption : ''
        const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const ar = args.map((v) => v.toLowerCase())
        const query = args.join(' ')
        const url = args.length !== 0 ? args[0] : ''
        const now = moment(t * 1000).format('DD/MM/YYYY HH:mm:ss')
        const uaOverride = config.uaOverride
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        /*=_=_=_=_=_=_=_=_=_=_=_=_=_ END OF MESSAGE HANDLER =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=*/

        /*=_=_=_=_=_=_=_=_=_=_=_=_=_ DATABASES =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=*/
        const _antilink = JSON.parse(fs.readFileSync('./database/antilink.json'))
        const _antivirtext = JSON.parse(fs.readFileSync('./database/antivirtext.json'))
        const _antinsfw = JSON.parse(fs.readFileSync('./database/antinsfw.json'))
        /*=_=_=_=_=_=_=_=_=_=_=_=_=_ END OF DATABASES =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=*/

        /*=_=_=_=_=_=_=_=_=_=_=_=_=_ VALIDATOR =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=*/
        const botNumber = await erdwpe.getHostNumber() + '@c.us'
        const groupAdmins = isGroupMsg ? await erdwpe.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const _registered = JSON.parse(fs.readFileSync('./database/registered.json'))
        const isCmd = body.startsWith(prefix)
        const isOwner = sender.id === owner
        const isRegistered = register.checkRegisteredUser(sender.id, _registered)
        const time = moment(t * 1000).format('DD/MM/YY HH:mm:ss')
        const imgb = '0ed37ce95a75301ffeacf29eaff172da'
        const isImage = type === 'image'
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
        const isQuotedText = quotedMsg && quotedMsg.type === 'text'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedVoice = quotedMsg && quotedMsg.type === 'ptt'
        const isAudio = type === 'audio'
        const isVoice = type === 'ptt'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isDetectorOn = isGroupMsg ? _antilink.includes(chat.id) : false
        const isAntiVirtextOn = isGroupMsg ? _antivirtext.includes(chat.id) : false
        const isAntiNsfwOn = isGroupMsg ? _antinsfw.includes(chat.id) : false
        /*=_=_=_=_=_=_=_=_=_=_=_=_=_ END OF VALIDATOR =_=_=_=_=_=_=_=_=_=_=_=_=_=_=_=*/

        //ANTI-GROUP LINK DETECTOR
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isDetectorOn && !isOwner) {
            if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                console.log(color('[KICK]', 'red'), color('Anti Group-Link detector.', 'aqua'))
                await erdwpe.reply(self, msg3.linkDetected(), id)
                await erdwpe.removeParticipant(groupId, sender.id)
            }
        }

         function banChat () {
            if(banChats == true) {
            return false
        }else{
            return true
            }
        }

  // detector
   if (isGroupMsg && isMedia && isAntiNsfwOn && isImage && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            const getUrl = await uploadImages(mediaData, true)
            const preproccessocr1 = await axios.get(`http://api.lolhuman.xyz/api/nsfwcheck?apikey=${lolhuman}&img=${getUrl}`)
            const nsfw = preproccessocr1.data.result
            const nsfw3 = nsfw.replace('%', '')
            if (nsfw3 >= 40.0){
                if (isGroupAdmins){
                    await erdwpe.reply(self, 'Admin Baka Untung Kau Admin Jadi Tidak Saya Kick Ingat Yah Min Ngak Boleh Gitu💕 HARAM DESU', id)
                } else {
                    console.log('NSFW DETECT')
                    await erdwpe.sendTextWithMentions(self, `Terdeteksi @${sender.id} telah mengirim FOTO HARAM dengan presentase ${nsfw}\nMaka dari itu Akan otomatis dikeluarkan dari group!`)
            await erdwpe.removeParticipant(groupId, sender.id)

        }
    }
}

        // ANTI-VIRTEXT
        if (isGroupMsg && isGroupAdmins && isBotGroupAdmins && isAntiVirtextOn && !isOwner) {
        if (chats.length > 5000) {
            await erdwpe.sendTextWithMentions(self, `Terdeteksi @${sender.id} telah mengirim Virtext\nAkan dikeluarkan dari group!`)
            await erdwpe.removeParticipant(groupId, sender.id)
        }
    }
                   if (body === `${prefix}public`) {
                    if (!isOwner) return erdwpe.reply(self, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner ZAM!', id)
                    if(setting.banChats === false) return
                    setting.banChats = false
                    banChats = false
                    fs.writeFileSync('./database/setting.json', JSON.stringify(setting, null, 2))
                    erdwpe.reply(self, ' _*MODE PUBLIC!*_ ', id)
                }
        // Anti-spam
        //if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        //if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Log
        if (isCmd && !isGroupMsg) {console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))}
        if (isCmd && isGroupMsg) {console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))}

        // [BETA] Avoid Spam Message
    
    /*let lnomerb = JSON.parse(fs.readFileSync('./database/nomer.json'))
   let ltatas = JSON.parse(fs.readFileSync('./database/pesanatas.json'))
    let ltbawah = JSON.parse(fs.readFileSync('./database/pbawah.json'))
    if(message.body == `${ltatas}`){
        erdwpe.reply(lnomerb, `${ltbawah}`, id)
        erdwpe.reply(self, `Berhasil Mengirim Fake Reply`, id)
        console.log("Berhasil Mengirim Fake Reply")
    }*/
        if (banChat())  {
        switch (command) {

               case 'self':
          if (setting.banChats === true) return
          if (!isOwner) return erdwpe.reply(self, 'Perintah ini hanya bisa di gunakan oleh Owner erdwpe', id)
          setting.banChats = true
          banChats = true
          fs.writeFileSync('./database/setting.json', JSON.stringify(setting, null, 2))
          erdwpe.reply(self, '  _*MODE SELF!*_ ', id)
          break

            case 'register': //By: Slavyam
                if (isRegistered) return await erdwpe.reply(self, msg3.notRegistered(pushname), id)
                const namaUser = query.substring(0, query.indexOf('|') - 1)
                const umurUser = query.substring(query.lastIndexOf('|') + 2)
                const serialUser = register.createSerial(10)
                register.addRegisteredUser(sender.id, namaUser, umurUser, time, serialUser, _registered)
                await erdwpe.reply(self, `*「 REGISTRATION 」*\n\nRegistrasi berhasil!\n\n=======================\n➸ *Nama*: ${namaUser}\n➸ *Umur*: ${umurUser}\n➸ *Waktu pendaftaran*: ${now}\n➸ *Serial*: ${serialUser}\n=======================`, id)
            break
            case 'antiporn'://PREMIUM
                await erdwpe.reply(self, 'Premium feature!\nContact: wa.me/6285692655520', id)
            break
              case 'ping':
            await erdwpe.sendText(self, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
                case 'freply':
            argosm = body.trim().split('|')
            if (argosm.length >= 4) {
                const tnomer = argosm[1]
                const tbatas = argosm[2]
                const tbbawah = argosm[3]
            const nomerb = [`${tnomer}@c.us`]
            const patasb = [`${tbatas}`]
            const bwahb = [`${tbbawah}`]
            fs.writeFileSync('./database/nomer.json', JSON.stringify(nomerb));
            fs.writeFileSync('./database/pesanatas.json', JSON.stringify(patasb));
            fs.writeFileSync('./database/pbawah.json', JSON.stringify(bwahb));
            erdwpe.reply(self, `Berhasil Menambahkan Text`, id)
            }
            break


            /* RANDOM WORDS */
            case 'fakta':
                //if (!isRegistered) return await erdwpe.reply(self, msg3.notRegistered(pushname), id)
                const datafakta = await axios.get(`https://videfikri.com/api/fakta/`)
                const fakta = datafakta.data.result
                await erdwpe.reply(self, `${fakta.fakta}`, id)
            break
            case 'quotes':
                //if (!isRegistered) return await erdwpe.reply(self, msg3.notRegistered(pushname), id)
                const dataquotes = await axios.get(`https://videfikri.com/api/randomquotes/`)
                const quotes = dataquotes.data.result
                await erdwpe.reply(self, `➸ *Author*: ${quotes.author}\n➸ *Quotes*: ${quotes.quotes}`, id)
            break
                 case 'bucin':
                //if (!isRegistered) return await erdwpe.reply(self, msg3.notRegistered(pushname), id)
                const databucin = await axios.get(`http://api.lolhuman.xyz/api/random/bucin?apikey=${lolhuman}`)
                await erdwpe.reply(self, databucin.data.result, id)
            break
                case 'cerpen': // By Kris
            //await erdwpe.reply(self, ind.wait(), id)
            axios.get('https://masgi.herokuapp.com/api/cerpen')
                .then(async (res) => await erdwpe.reply(self, res.data.data, id))
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
        break
            case 'cersex':
                const cersex3 = await fetch('http://docs-jojo.herokuapp.com/api/cersex')
                const cersex2 = await cersex3.json()
                   const { judul, cersex } = await cersex2.result
                    const mmkkgsk =`➸ *Judul* : ${judul}\n\n➸ *Cerita* : ${cersex}`
                     erdwpe.reply(self, mmkkgsk, id)
                   break
                      case 'ceritahoror':
                const lrando2 = await axios.get(`http://api.lolhuman.xyz/api/ceritahoror?apikey=${lolhuman}`)
                const random2 = lrando2.data.result
                const random3 = `➸ *judul*: ${random2.title}\n➸ *cerita*: ${random2.desc}`
                await erdwpe.sendFileFromUrl(self, `${random2.thumbnail}`, 'narto.jpg', random3, id)
                   break
                   case 'puisi': // By Kris
                   //await erdwpe.reply(self, ind.wait(), id)
                   axios.get('https://masgi.herokuapp.com/api/puisi2')
                       .then(async (res) => await erdwpe.reply(self, res.data.data, id))
                       .catch(async (err) => {
                           console.error(err)
                           await erdwpe.reply(self, 'Error!', id)
                       })
               break
                      case 'nhder':
            if (args.length == 0) return erdwpe.reply(self, `untuk menggunakannya ketik #nhder kodenuklirmu`, id)
         const nhderr = body.slice(7)
         erdwpe.reply(self,'Wait.. Sedang di proses',id)
         const nhder = await axios.get(`http://api.lolhuman.xyz/api/nhentaipdf/${nhderr}?apikey=${lolhuman}`)
         erdwpe.sendFileFromUrl(self, nhder.data.result, id)
            break 
                 case 'loli':
            erdwpe.sendFileFromUrl(self, 'http://api.lolhuman.xyz/api/random/loli?apikey=erdwpe2003', 'nih loli nya tuan', 'nih loli nya tuan', id)
            break
            case 'wallanime' :
            const walnime = ['https://wallpaperaccess.com/full/395986.jpg','https://wallpaperaccess.com/full/21628.jpg','https://wallpaperaccess.com/full/21622.jpg','https://wallpaperaccess.com/full/21612.jpg','https://wallpaperaccess.com/full/21611.png','https://wallpaperaccess.com/full/21597.jpg','https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://wallpaperaccess.com/full/21591.jpg','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            erdwpe.sendFileFromUrl(self, walnimek, 'Nimek.jpg', 'nih mhank', message.id)
            break
            case 'wallhp':
            erdwpe.sendFileFromUrl(self, 'https://source.unsplash.com/1080x1920/?nature','wp.jpeg', 'nih mhank', message.id)
            break
            case 'walldesktop':
            erdwpe.sendFileFromUrl(self, 'https://source.unsplash.com/1920x1080/?nature','wp.jpeg', 'nih mhank', message.id)
            break
            case 'searchwp':
               if (!query) return await erdwpe.reply(self, `Untuk mencari wallpaper gunakan command\n\n ${prefix}searchwp megumin`, id)
                const wp = body.slice(10)
                const lrando = await axios.get(`http://api.lolhuman.xyz/api/wallpaper?apikey=${lolhuman}&query=${wp}`)
                erdwpe.sendFileFromUrl(self, lrando.data.result, '', 'nih mhank', id)
                .catch(async (err) => {
                console.error(err)
                await erdwpe.reply(self, 'Error!', id)
                })
        break
                break
            /* STICKER MAKER */
            case 'takestick':
                //if (!isRegistered) return await erdwpe.reply(self, msg3.notRegistered(pushname), id)
                    if (quotedMsg && quotedMsg.type == 'sticker') {
                        if (!query.includes('|')) return await erdwpe.reply(self, `Untuk mengubah watermark sticker, reply sticker dengan caption ${prefix}takestick package_name | author_name\n\nContoh: ${prefix}takestick PUNYA GUA | videfikri`, id)
                        await erdwpe.reply(self, msg3.wait(), id)
                        const packnames = query.substring(0, query.indexOf('|') - 1)
                        const authors = query.substring(query.lastIndexOf('|') + 2)
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await erdwpe.sendImageAsSticker(self, imageBase64, { author: `${authors}`, pack: `${packnames}` })
                        .catch(async (err) => {
                            console.error(err)
                            await erdwpe.reply(self, 'Error!', id)
                        })
                    } else {
                        await erdwpe.reply(self, `Reply sticker yang ingin dicolong dengan caption ${prefix}takestick package_name | author_name\n\nContoh: ${prefix}takestick punya gua | videfikri`, id)
                    }
        break
        case 'tomp3': // by: Piyobot
                if ((isMedia && isVideo || isQuotedVideo)) {
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    const encryptMedia = isQuotedVideo ? quotedMsg : message
                    const _mimetype = isQuotedVideo ? quotedMsg.mimetype : mimetype
                    console.log(color('[WAPI]', 'green'), 'Downloading and decrypting media...')
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const temp = './temp'
                    const name = new Date() * 1
                    const fileInputPath = path.join(temp, 'video', `${name}.${_mimetype.replace(/.+\//, '')}`)
                    const fileOutputPath = path.join(temp, 'audio', `${name}.mp3`)
                    fs.writeFile(fileInputPath, mediaData, (err) => {
                        if (err) return console.error(err)
                        ffmpeg(fileInputPath)
                            .format('mp3')
                            .on('start', (commandLine) => console.log(color('[FFmpeg]', 'green'), commandLine))
                            .on('progress', (progress) => console.log(color('[FFmpeg]', 'green'), progress))
                            .on('end', async () => {
                                console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                await erdwpe.sendFile(self, fileOutputPath, 'audio.mp3', '', id)
                                console.log(color('[WAPI]', 'green'), 'Success sending mp3!')
                                setTimeout(() => {
                                    fs.unlinkSync(fileInputPath)
                                    fs.unlinkSync(fileOutputPath)
                                }, 30000)
                            })
                            .save(fileOutputPath)
                    })
                } else {
                    await erdwpe.reply(self, 'format salah', id)
                }
            break
                case "latintoaksara":
                const hc = require('hanacaraka');
                const javanese = hc.encode(body.slice(10))
                erdwpe.reply(self, javanese, id)
break
case "aksaratolatin":
    const hc2 = require('hanacaraka');
    const latin = hc2.decode(body.slice(15))
    erdwpe.reply(self, latin, id)
break
                       case 'bass':
                if (isMedia && isAudio || isQuotedAudio || isVoice || isQuotedVoice) {
                    if (args.length !== 1) return await erdwpe.reply(self, 'reply file audio dengan command #bass 40', id)
                    await erdwpe.reply(self, '_tunggu sebentar_', id)
                    const encryptMedia = isQuotedAudio || isQuotedVoice ? quotedMsg : message
                    console.log(color('[WAPI]', 'green'), 'Downloading and decrypting media...')
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const temp = './temp'
                    const name = new Date() * 1
                    const fileInputPath = path.join(temp, `${name}.mp3`)
                    const fileOutputPath = path.join(temp, 'audio', `${name}.mp3`)
                    fs.writeFile(fileInputPath, mediaData, (err) => {
                        if (err) return console.error(err)
                        ffmpeg(fileInputPath)
                            .audioFilter(`equalizer=f=40:width_type=h:width=50:g=${args[0]}`)
                            .format('mp3')
                            .on('start', (commandLine) => console.log(color('[FFmpeg]', 'green'), commandLine))
                            .on('progress', (progress) => console.log(color('[FFmpeg]', 'green'), progress))
                            .on('end', async () => {
                                console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                await erdwpe.sendPtt(self, fileOutputPath, id)
                                console.log(color('[WAPI]', 'green'), 'Success sending audio!')
                                setTimeout(() => {
                                    fs.unlinkSync(fileInputPath)
                                    fs.unlinkSync(fileOutputPath)
                                }, 30000)
                            })
                            .save(fileOutputPath)
                    })
                } else {
                    await erdwpe.reply(self, 'format salah', id)
                }
            break
            case 'upscale':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const datasca = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotosca = await uploadImages(datasca, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(from, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(from, `https://api.lolhuman.xyz/api/upscale?apikey=${lolhuman}&img=${fotosca}`, 'dah jadi', 'nih ngab', id)
                    console.log('Success sending upscale image!')
                } else {
                    await erdwpe.reply(from, '*mana gambarnya ngab*', id)
                }
            break
             case 'memesticker':
                if (!query.includes('|')) return await erdwpe.reply(self, `*mana gambar nya ngab*\n\nUntuk membuat stickermeme ${prefix}memesticker meng | gokil`, id)
    if ((isMedia || isQuotedImage) && args.length >= 0) {
        const top = query.split('|')[0]
        const bottom = query.split('|')[1]
        const encryptMedia = isQuotedImage ? quotedMsg : message
        const mediaData = await decryptMedia(encryptMedia, uaOverride)
        const getUrl = await uploadImages(mediaData, true)
        const ImageBase64 = await meme.custom(getUrl, top, bottom)
            erdwpe.sendImageAsSticker(self, ImageBase64, { keepScale: true, author: 'xrlangga', pack: '©ERDWPE BOT' })
                .then(() => {
                     erdwpe.reply(self, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
                .catch((err) => console.error(err))
    } else {
        await erdwpe.reply(self, '*mana gambar nya ngab*', id)
    }
    break
      case 'snobg':
            case 'stickernobg':
    if ((isMedia && isImage || isQuotedImage) && args.length >= 0) {
        //await erdwpe.reply(self, msg3.wait(), id)
        const encryptMedia = isQuotedImage ? quotedMsg : message
        const mediaData = await decryptMedia(encryptMedia, uaOverride)
        const getUrl = await uploadImages(mediaData, true)
        const ImageBase64 = await meme.custom2(getUrl)
            erdwpe.sendImageAsSticker(self, ImageBase64, { keepScale: true, author: 'xrlangga', pack: '©ERDWPE BOT' })
                .then(() => {
                     erdwpe.reply(self, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
                .catch((err) => console.error(err))
    } else {
        await erdwpe.reply(self, '*mana gambar nya ngab*', id)
    }
    break

            case 'sgifwm':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                    if (!query.includes('|')) return await erdwpe.reply(self, `Untuk membuat stickergif watermark\ngunakan ${prefix}sgifwm author | packname`, id)
                    if (isMedia && type === 'video' || mimetype === 'image/gif') {
                    const namaPacksgif = query.substring(0, query.indexOf('|') - 1)
                    const authorPacksgif = query.substring(query.lastIndexOf('|') + 2)
                    //await erdwpe.reply(self, msg3.wait(), id)
                    try {
                        const mediaData = await decryptMedia(message, uaOverride)
                        const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await erdwpe.sendMp4AsSticker(self, videoBase64, { fps: 10, startTime: `00:00:00.0`, endTime : `00:00:06.0`, loop: 0, crop: false }, { author: `${authorPacksgif}`, pack: `${namaPacksgif}` })
                            .then(async () => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                
                            })
                    } catch (err) {
                        console.error(err)
                        await erdwpe.reply(self, `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`, id)
                    }
                } else if (isQuotedGif || isQuotedVideo) {
                    const namaPacksgif = query.substring(0, query.indexOf('|') - 1)
                    const authorPacksgif = query.substring(query.lastIndexOf('|') + 2)
                    //await erdwpe.reply(self, msg3.wait(), id)
                    try {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const videoBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await erdwpe.sendMp4AsSticker(self, videoBase64, { fps: 10, startTime: `00:00:00.0`, endTime : `00:00:06.0`, loop: 0, crop: false }, { author: `${authorPacksgif}`, pack: `${namaPacksgif}` })
                            .then(async () => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                
                            })
                    } catch (err) {
                        console.error(err)
                        await erdwpe.reply(self, `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`, id)
                    }
                } else {
                    await erdwpe.reply(self, `Untuk membuat stickergif dengan watermark\ngunakan ${prefix}sgifwm author | packname`, id)
                }
            break
            case 'stickernocrop':
            case 'stnc':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (isMedia && isImage || isQuotedImage) {
                    try {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await erdwpe.sendImageAsSticker(self, imageBase64, { keepScale: true, author: 'xrlangga', pack: '©ERDWPE BOT' }) 
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                } catch (err) {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                }
            } else {
                await erdwpe.reply(self, `Untuk membuat sticker no crop\nsilahkan *upload* atau reply foto dengan caption ${prefix}stnc`, id)
            }
            break
              case 'toimg': {
            if(quotedMsg && quotedMsg.type == 'sticker'){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await erdwpe.sendFile(self, imageBase64, 'imagesticker.jpg', '_succes_', id)
            } else if (!quotedMsg) return erdwpe.reply(self, 'tidak ada sticker yang di balas!', id)}
            break
            case 'tovid': 
            if(isQuotedSticker){
            await erdwpe.reply(self, 'tunggu sebentar', id)
            try{
                const encryptMedia = isQuotedSticker ? quotedMsg : message
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                fs.writeFile('./temp/anu.webp', mediaData)
                const getUrl2 = await imgbb(imgb, './temp/anu.webp')
                const link2 = getUrl2.display_url
                const vid2 = await axios.get(`https://api.lolhuman.xyz/api/convert/webptomp4?apikey=${lolhuman}&img=${link2}`)
                await erdwpe.sendFileFromUrl(self, vid2.data.result, 'ini.mp4', '©ERDWPE BOT', 'nih ngab', id)
            } catch (err) {
                console.log(err)
                await erdwpe.reply (self, 'ERROR', id)
            }
        } else {
            await erdwpe.reply(self, 'format salah', id)
        }
            break

                case 'stickergreyscale':
                case 'sgreyscale':                
                if (isMedia && isImage || isQuotedImage) {
                    try {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    fs.writeFile('./temp/anu.jpeg', mediaData)
                    Jimp.read('./temp/anu.jpeg').then(image => {
                    image.greyscale()
                    image.scale(0.5)
                    .write('./temp/anuresult.jpeg')
                     erdwpe.sendImageAsSticker(self, './temp/anuresult.jpeg', { keepScale: true, author: 'xrlangga', pack: '©ERDWPE BOT' })
                     })                
                       } catch (err) {
                await erdwpe.reply (self, 'ERROR', id)
            }
                } else {
            await erdwpe.reply(self, 'format salah', id)
        }
                break
                      case 'stickerrotate':
                      case 'srotate':
                    if (isMedia && isImage || isQuotedImage) {
                    try {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    fs.writeFile('./temp/anu.jpeg', mediaData)
                    Jimp.read('./temp/anu.jpeg').then(image => {
                    image.rotate(180)
                    image.scale(0.5)
                    .write('./temp/anuresult.jpeg')
                     erdwpe.sendImageAsSticker(self, './temp/anuresult.jpeg', { keepScale: true, author: 'xrlangga', pack: '©ERDWPE BOT' })
                     })                
                       } catch (err) {
                await erdwpe.reply (self, 'ERROR', id)
            }
                } else {
            await erdwpe.reply(self, 'format salah', id)
        }
                break
                 
                 
            case 'sticker':
            case 'stiker':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (isMedia && isImage || isQuotedImage) {
                    try {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await erdwpe.sendImageAsSticker(self, imageBase64, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                } catch (err) {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                }
            } else {
                await erdwpe.reply(self, `Untuk membuat sticker\nsilahkan *upload* atau reply foto dengan caption ${prefix}sticker`, id)
            }
            break
                    case 'stickerround':
            case 'sr':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (isMedia && isImage || isQuotedImage) {
                    try {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await erdwpe.sendImageAsSticker(self, imageBase64, { circle: true,  author: 'xrlangga', pack: '©ERDWPE BOT' })
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                } catch (err) {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                }
            } else {
                await erdwpe.reply(self, `Untuk membuat sticker\nsilahkan *upload* atau reply foto dengan caption ${prefix}stickerround`, id)
            }
            break
            case 'attp':
                if (!query) return await erdwpe.reply(self, 'untuk menggunakan command ini ketik #attp xrlangga', id)
                const textattp = body.slice(6)
                erdwpe.sendStickerfromUrl(self, `http://api.lolhuman.xyz/api/attp?apikey=${lolhuman}&text=${textattp}`, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                console.log('OTW NGAB')
            break

               case 'ttp':
                try
                {
                    const string = body.toLowerCase().includes('#ttp') ? body.slice(5) : body.slice(5)
                    if(args)
                    {
                        if(quotedMsgObj == null)
                        {
                            const gasMake = await getStickerMaker(string)
                            if(gasMake.status == true)
                            {
                                try{
                                    await erdwpe.sendImageAsSticker(self, gasMake.base64, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                                }catch(err) {
                                    await erdwpe.reply(self, 'Gagal membuat.', id)
                                } 
                            }else{
                                await erdwpe.reply(self, gasMake.reason, id)
                            }
                        }else if(quotedMsgObj != null){
                            const gasMake = await getStickerMaker(quotedMsgObj.body)
                            if(gasMake.status == true)
                            {
                                try{
                                    await erdwpe.sendImageAsSticker(self, gasMake.base64, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                                }catch(err) {
                                    await erdwpe.reply(self, 'Gagal membuat.', id)
                                } 
                            }else{
                                await erdwpe.reply(self, gasMake.reason, id)
                            }
                        }
                       
                    }else{
                        await erdwpe.reply(self, 'Tidak boleh kosong.', id)
                    }
                }catch(error)
                {
                    console.log(error)
                }
            break
              case 'triggered':
                if (isMedia && isImage || isQuotedImage) {
                    await erdwpe.reply(self, 'tunggu sebentar..', id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    console.log(color('[WAPI]', 'green'), 'Downloading and decrypting media...')
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const temp = './temp'
                    const name = new Date() * 1
                    const fileInputPath = path.join(temp, `${name}.gif`)
                    const fileOutputPath = path.join(temp, 'video', `${name}.mp4`)
                    canvas.Canvas.trigger(mediaData)
                        .then((buffer) => {
                            canvas.write(buffer, fileInputPath)
                            ffmpeg(fileInputPath)
                                .outputOptions([
                                    '-movflags faststart',
                                    '-pix_fmt yuv420p',
                                    '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
                                ])
                                .inputFormat('gif')
                                .on('start', (commandLine) => console.log(color('[FFmpeg]', 'green'), commandLine))
                                .on('progress', (progress) => console.log(color('[FFmpeg]', 'green'), progress))
                                .on('end', async () => {
                                    console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                    await erdwpe.sendMp4AsSticker(self, fileOutputPath, { fps: 30, startTime: '00:00:00.0', endTime : '00:00:05.0', loop: 0, crop: false }, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                                    console.log(color('[WAPI]', 'green'), 'Success sending GIF!')
                                    setTimeout(() => {
                                        fs.unlinkSync(fileInputPath)
                                        fs.unlinkSync(fileOutputPath)
                                    }, 30000)
                                })
                                .save(fileOutputPath)
                        })
                } else {
                    await erdwpe.reply(self, 'reply gambarnya dengan command #triggered', id)
                }
            break
                    case 'wasted':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const dataPotoWt = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotoWtNya2 = await uploadImages(dataPotoWt, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(self, `https://some-random-api.ml/canvas/wasted?avatar=${fotoWtNya2}`, 'dah jadi', 'nih ngab', id)
                    console.log('Success sending Wasted image!')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
            case 'gun':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const datagun = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotogun = await uploadImages(datagun, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(self, `https://videfikri.com/api/textmaker/crossgun/?urlgbr=${fotogun}`, 'dah jadi', 'nih ngab', id)
                    console.log('Success sending Wasted image!')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
                 case 'gtav':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const datagtav = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotogtav = await uploadImages(datagtav, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(self, `https://videfikri.com/api/textmaker/gtavposter/?urlgbr=${fotogtav}`, 'dah jadi', 'nih ngab', id)
                    console.log('Success sending Wasted image!')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
            case 'patrickmeme' :
             if (!query.includes('|')) return await erdwpe.reply(self, `*contoh:* ${prefix}patrickmeme bucinaku sayang dia | dia sayang orang lain`, id)
                erdwpe.reply(self, 'tunggu sebentar', id)
                const meme1 = meme.split('|')[0]
                const meme2 = meme.split('|')[1]
                erdwpe.sendFileFromUrl(self, `https://api.memegen.link/images/ds/${meme1}/${meme2}.png`)
            break
             case 'vote' :
             if (!query.includes('|')) return await erdwpe.reply(self, `*contoh:* ${prefix}vote bucin | login`, id)
                erdwpe.reply(self, 'tunggu sebentar', id)
                const vote1 = query.split('|')[0]
                const vote2 = query.split('|')[1]
                erdwpe.sendFileFromUrl(self, `https://api.memegen.link/images/ds/${vote1}/${vote2}.png`)
            break
              case 'mending' :
             if (!query.includes('|')) return await erdwpe.reply(self, `*contoh:* ${prefix}mending main | sholat`, id)
                erdwpe.reply(self, 'tunggu sebentar', id)
                const mending1 = mending.split('|')[0]
                const mending2 = mending.split('|')[1]
                erdwpe.sendFileFromUrl(self, `https://api.memegen.link/images/drake/${mending1}/${mending2}.png`)
            break
              case 'pencil':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const datapencil = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotopencil = await uploadImages(datapencil, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(self, `https://videfikri.com/api/textmaker/pencildrawing/?urlgbr=${fotopencil}`, 'dah jadi', 'nih ngab', id)
                    console.log('Success sending Wasted image!')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
            case 'quotemaker':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const maker = body.slice(12)
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const dataquote = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotoquote = await uploadImages(dataquote, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(self, `http://api.lolhuman.xyz/api/quotemaker3?apikey=${lolhuman}&text=${maker}&img=${fotoquote}`, '', 'nih ngab', id)
                    console.log('Success sending quote maker!')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
              case 'pencil2':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const datapencil2 = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotopencil2 = await uploadImages(datapencil2, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    await erdwpe.sendFileFromUrl(self, `https://videfikri.com/api/textmaker/pencil/?urlgbr=${fotopencil2}`, 'dah jadi', 'nih ngab', id)
                    console.log('Success sending Wasted image!')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
              case 'ocr':
                if (isMedia && type === 'image' || isQuotedImage) {
                    const encryptMediaWt = isQuotedImage ? quotedMsg : message
                    const dataocr2 = await decryptMedia(encryptMediaWt, uaOverride)
                    const fotoocr2 = await uploadImages(dataocr2, `fotoProfilWt.${sender.id}`)
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    const preproccessocr = await axios.get(`http://api.lolhuman.xyz/api/ocr?apikey=${lolhuman}&img=${fotoocr2}`)
                   await erdwpe.reply(self, preproccessocr.data.result, id)
                    console.log('Success')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
             case 'phcomment':
                if (!query.includes('|')) return await erdwpe.reply(self, 'contoh #phcomment ERDWPE BOT | COMMENT ', id)
                const usernamePh = query.substring(0, query.indexOf('|') - 1)
                const commentPh = query.substring(query.lastIndexOf('|') + 2)
                const ppPhRaw = await erdwpe.getProfilePicFromServer(sender.id)
                if (ppPhRaw === undefined) {
                    var ppPh = errorImg
                } else {
                    ppPh = ppPhRaw
                }
                const dataPpPh = await bent('buffer')(ppPh)
                const linkPpPh = await uploadImages(dataPpPh, `${sender.id}_ph`)
                await erdwpe.reply(self, 'tunggu sebentar...', id)
                const preproccessPh = await axios.get(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${linkPpPh}&text=${commentPh}&username=${usernamePh}`)
                await erdwpe.sendFileFromUrl(self, preproccessPh.data.message, 'ph.jpg', '', id)
                console.log('Success creating image!')
            break
            case 'trash':
                if (!isGroupMsg) return await erdwpe.reply(self, 'fitur ini hanya bisa digunakan di grup', id)
                if (!query.includes('@')) return await erdwpe.reply(self, 'contoh #trash @tagmember', id)
                try {
                    await erdwpe.reply(self, 'tunggu sebentar', id)
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        const ypics = await erdwpe.getProfilePicFromServer(mentionedJidList[i])
                        if (ypics === undefined) {
                            var ypfps = errorImg
                        } else {
                            ypfps = ypics
                        }
                    }
                    canvas.Canvas.trash(ypfps)
                        .then(async (buffer) => {
                            canvas.write(buffer, `./temp/${sender.id}_trash.png`)
                            await erdwpe.sendFile(self, `./temp/${sender.id}_trash.png`, `${sender.id}_trash.png`, '', id)
                            fs.unlinkSync(`./temp/${sender.id}_trash.png`)
                        })
                } catch (err) {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                }
            break
            case 'hitler':
                if (!isGroupMsg) return await erdwpe.reply(self, 'fitur ini hanya bisa digunakan di grup', id)
                if (!query.includes('@')) return await erdwpe.reply(self, 'contoh #hitler @tagmember', id)
                try {
                    await erdwpe.reply(self, 'tunggu sebentar..', id)
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        const ypics = await erdwpe.getProfilePicFromServer(mentionedJidList[i])
                        if (ypics === undefined) {
                            var ypf = errorImg
                        } else {
                            ypf = ypics
                        }
                    }
                    canvas.Canvas.hitler(ypf)
                        .then(async (buffer) => {
                            canvas.write(buffer, `./temp/${sender.id}_hitler.png`)
                            await erdwpe.sendFile(self, `./temp/${sender.id}_hitler.png`, `${sender.id}_hitler.png`, '', id)
                            fs.unlinkSync(`./temp/${sender.id}_hitler.png`)
                        })
                } catch (err) {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                }
            break
            case 'stickergif':
            case 'sgif':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (isMedia && type === 'video' || mimetype === 'image/gif') {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    try {
                        const mediaData = await decryptMedia(message, uaOverride)
                        const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await erdwpe.sendMp4AsSticker(self, videoBase64, { fps: 10, startTime: `00:00:00.0`, endTime : `00:00:06.0`, loop: 0, crop: false }, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                            .then(async () => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                
                            })
                    } catch (err) {
                        console.error(err)
                        await erdwpe.reply(self, `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`, id)
                    }
                } else if (isQuotedGif || isQuotedVideo) {
                    //await erdwpe.reply(self, msg3.wait(), id)
                    try {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const videoBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await erdwpe.sendMp4AsSticker(self, videoBase64, { fps: 10, startTime: `00:00:00.0`, endTime : `00:00:06.0`, loop: 0, crop: false }, { author: 'xrlangga', pack: '©ERDWPE BOT' })
                            .then(async () => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                                
                            })
                    } catch (err) {
                        console.error(err)
                        await erdwpe.reply(self, `Ukuran video terlalu besar\nMaksimal size adalah 1MB!`, id)
                    }
                } else {
                    await erdwpe.reply(self, `Untuk mengconvert GIF/Video menjadi stikergif silahkan upload video/gif dengan caption ${prefix}stikergif`, id)
                }
            break
             case 'getpic':
                if (mentionedJidList.length !== 0) {
                    const userPic = await erdwpe.getProfilePicFromServer(mentionedJidList[0])
                    if (userPic === undefined) {
                        var pek = errorImg
                    } else {
                        pek = userPic
                    }
                    await erdwpe.sendFileFromUrl(self, pek, 'pic.jpg', '', id)
                } else if (args.length !== 0) {
                    const userPic = await erdwpe.getProfilePicFromServer(args[0] + '@c.us')
                    if (userPic === undefined) {
                        var peks = errorImg
                    } else {
                        peks = userPic
                    }
                    await erdwpe.sendFileFromUrl(self, peks, 'pic.jpg', '', id)
                } else {
                    await erdwpe.reply(self, 'format salah', id)
                }
            break
            /* END OF STICKER MAKER */

            /* DOWNLOADER */
                case 'igdl': // by: VideFrelan
            case 'instadl':
                if (!isUrl(url) && !url.includes('instagram.com')) return await erdwpe.reply(self, 'cara menggunakannya #igdl url image/video nya', id)
                await erdwpe.reply(self, 'tunggu sebentar', id)
                  const urlig = body.slice(6)
            const ig = await axios.get(`http://api.lolhuman.xyz/api/instagram2?apikey=${lolhuman}&url=${url}`)
            const ig1 = ig.data.result
            const rig = `➸ *username*: ${ig1.account.username}\n➸ *nama*: ${ig1.account.full_name}`
                await erdwpe.sendFileFromUrl(self, `${ig1.media}`, '', rig, id)
            break   

   case 'tiktoknowm2':
            case 'ttnowm2':
            if (!isUrl(url) && !url.includes('tiktok.com')) return await erdwpe.reply(self, 'cara menggunakannya #tiktoknowm linktiktoknya', id)
            await erdwpe.reply(self, 'tunggu sebentar', id)
            const tiktok2 = await axios.get(`http://api.lolhuman.xyz/api/tiktok?apikey=${lolhuman}&url=${url}`)
            const tikto1 = tiktok2.data.result
            const rtiktok = `➸ *username*: ${tikto1.author.username}\n➸ *judul*: ${tikto1.title}\n➸ *description*: ${tikto1.description}`
            await erdwpe.sendFileFromUrl(self, `${tikto1.link}`, '', rtiktok, id)
            console.log('Sukses Mengirim')
            break   
                   case 'tiktoknowm':
            case 'ttnowm':
            if (!isUrl(url) && !url.includes('tiktok.com')) return await erdwpe.reply(self, 'cara menggunakannya #tiktoknowm linktiktoknya', id)
            await erdwpe.reply(self, 'tunggu sebentar', id)
            const tiktok = await axios.get(`https://api.lolhuman.xyz/api/tiktok3?apikey=${lolhuman}&url=${url}`)
            await erdwpe.sendFileFromUrl(self, tiktok.data.result, '', 'nih ngab', id)
            console.log('Sukses Mengirim')
            break   
               case 'ytmp3':
                if (!isUrl(url) && !url.includes('youtu.be')) return await erdwpe.reply(self, 'format salah', id)
                await erdwpe.reply(self, '_tunggu sebentar_', id)
            const ytmp31 = await axios.get(`https://api.lolhuman.xyz/api/ytaudio?apikey=${lolhuman}&url=${url}`)
            const ytmp312 = ytmp31.data.result.link[3]
            //const ytmp3123 = `➸ *Judul*: ${ytmp312.title}\n➸ *Size*: ${ytmp312.size}`
                await erdwpe.sendFileFromUrl(self, `${ytmp312.link}`, '', id)
            break     
            case 'ytmp4':
                if (!isUrl(url) && !url.includes('youtu.be')) return await erdwpe.reply(self, 'format salah', id)
                await erdwpe.reply(self, '_tunggu sebentar_', id)
            const ytmp41 = await axios.get(`https://api.lolhuman.xyz/api/ytvideo?apikey=${lolhuman}&url=${url}`)
            const ytmp412 = ytmp41.data.result.link
            //const ytmp4123 = `➸ *Judul*: ${ytmp412.title}\n➸ *Size*: ${ytmp412.link.size}`
                await erdwpe.sendFileFromUrl(self, `${ytmp412.link}`, 'anu.mp4', '©ERDWPE BOT', '©ERDWPE BOT', id)
            break
             case 'play':
             if (args.length == 0) return erdwpe.reply(from, `Untuk mencari lagu from youtube\n\nPenggunaan: #play judul lagu`, id)
                await erdwpe.reply(self, '_tunggu sebentar_', id)
            const play3 = body.slice(6)
            const play4 = await axios.get(`http://api.lolhuman.xyz/api/ytplay2?apikey=${lolhuman}&query=${play3}`)
            const play5 = play4.data.result
            const play6 = `➸ *Judul*: ${play5.title}`
                await erdwpe.sendFileFromUrl(self, `${play5.audio}`, '', play6, id)
            break 
            case 'pptiktok':
               const pptt = body.slice(10)
               erdwpe.sendFileFromUrl(self, `https://api.lolhuman.xyz/api/pptiktok/${pptt}?apikey=${lolhuman}`, 'pp.jpeg' , '©ERDWPE BOT', '©ERDWPE BOT', id)
              break

         case 'ytmp32':
                if (!isUrl(url) && !url.includes('youtu.be')) return await erdwpe.reply(self, 'format salah', id)
                await erdwpe.reply(self, '_tunggu sebentar_', id)
                const music_yt = await axios.get(`http://lolhuman.herokuapp.com/api/ytaudio?apikey=${lolhuman}&url=${url}`)
                try {
                const { title, uploader, duration, view, like, description, link } = music_yt.data.result
                const cpt = `   *LAGU DI TEMUKAN* ✨\n
💠 Title✨: ${title}
💠 Upload✨: ${uploader}
💠 Duration✨: ${duration}
💠 Views✨: ${view}
💠 Like✨ : ${like}
   
   *LAGU SEDANG DI KIRIM*`
                await erdwpe.reply(self, `${cpt}`, id)
                const pree = await fetch(link[0].link);
                const buffer = await pree.buffer();
                await fs.writeFile('./temp/audio/audio.mp3', buffer)
                await erdwpe.sendFile(self, './temp/audio/audio.mp3', 'lagu.mp3', '', id)
                fs.unlinkSync(`./temp/audio/audio.mp3`)
                } catch {
                erdwpe.sendFileFromUrl(self, 'https://img.pngio.com/error-icons-png-vector-free-icons-and-png-backgrounds-error-png-500_500.png', 'lol.jpg', 'Lagu Gagal Di dapat Kan', id)
                }
            break
            case 'ytmp42':
                if (!isUrl(url) && !url.includes('youtu.be')) return await erdwpe.reply(self, 'format salah', id)
                await erdwpe.reply(self, '_tunggu sebentar_', id)
                const music_yt2 = await axios.get(`http://api.lolhuman.xyz/api/ytvideo?apikey=${lolhuman}&url=${url}`)
                try {
                const { title, uploader, duration, view, like, dislike, link } = music_yt2.data.result
                const cpt2 = `   *VIDEO DI TEMUKAN* ✨\n
💠 Title✨: ${title}
💠 Upload✨: ${uploader}
💠 Duration✨: ${duration}
💠 Views✨: ${view}
💠 Like✨ : ${like}
💠 Dislike✨ : ${dislike}
   
   *VIDEO SEDANG DI KIRIM*`
                await erdwpe.reply(self, `${cpt2}`, id)
                const pree2 = await fetch(link[0].link);
                const buffer = await pree2.buffer();
                await fs.writeFile('./temp/video/video.mp4', buffer)
                await erdwpe.sendFile(self, './temp/video/video.mp4', 'video.mp4', '', id)       
                fs.unlinkSync(`./temp/video/video.mp4`)
                } catch {
                erdwpe.sendFileFromUrl(self, 'https://img.pngio.com/error-icons-png-vector-free-icons-and-png-backgrounds-error-png-500_500.png', 'lol.jpg', 'Lagu Gagal Di dapat Kan', id)
                }
            break
            case 'nightcore':
                    await erdwpe.reply(self, '_tunggu sebentar_', id)
                    const encryptMedia = isQuotedAudio || isQuotedVoice ? quotedMsg : message
                    console.log(color('[WAPI]', 'green'), 'Downloading and decrypting media...')
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const temp = './temp'
                    const name = new Date() * 1
                    const fileInputPath = path.join(temp, `${name}.mp3`)
                    const fileOutputPath = path.join(temp, 'audio', `${name}.mp3`)
                    fs.writeFile(fileInputPath, mediaData, (err) => {
                        if (err) return console.error(err)
                        ffmpeg(fileInputPath)
                            .audioFilter('asetrate=44100*1.25')
                            .format('mp3')
                            .on('start', (commandLine) => console.log(color('[FFmpeg]', 'green'), commandLine))
                            .on('progress', (progress) => console.log(color('[FFmpeg]', 'green'), progress))
                            .on('end', async () => {
                                console.log(color('[FFmpeg]', 'green'), 'Processing finished!')
                                await erdwpe.sendPtt(self, fileOutputPath, id)
                                console.log(color('[WAPI]', 'green'), 'Success sending audio!')
                                setTimeout(() => {
                                    fs.unlinkSync(fileInputPath)
                                    fs.unlinkSync(fileOutputPath)
                                }, 30000)
                            })
                            .save(fileOutputPath)
                    })
                
            break
            case 'igstory':
                const story = body.slice(9)
                await erdwpe.reply(self, '_tunggu sebentar_', id)
                const igst = await axios.get(`https://api.lolhuman.xyz/api/igstory/${story}?apikey=${lolhuman}`)
                for (let i = 0; i < igst.data.result.length; i++) {
                await erdwpe.sendFileFromUrl(self, igst.data.result[i], '', '©ERDWPE BOT', id)
                console.log('Sukses Mengirim')
                }
                break 
                /* END OF DOWNLOADER */

                /* STALKER */
                case 'igstalk':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Format salah!\nuntuk meng-stalk akun Instagram seseorang, gunakan ${prefix}stalkig username\n\nContoh: ${prefix}stalkig xrlangga`, id)
                stalker.instagram(query)
                .then(async ({result}) => {
                    const { photo_profile, username, fullname, posts, followers, following, bio } = await result
                    await erdwpe.sendFileFromUrl(self, photo_profile, 'ProfileIgStalker.jpg', `➸ *Username*: ${username}\n *Full Name*: ${fullname}\n➸ *Biography*: ${bio}\n➸ *Followers*: ${followers}\n➸ *Following*: ${following}\n➸ *Post*: ${posts}`, id)
                }) 
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'twtprof':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Format salah!\nuntuk meng-stalk akun Twitter seseorang\ngunakan ${prefix}twtprof username`, id)
                await erdwpe.reply(self, msg3.wait(), id)
                stalker.twitter(query)
                .then(async ({result}) => {
                    const { full_name, username, followers, following, tweets, profile, verified, listed_count, favourites, joined_on, profile_banner } = await result
                    await erdwpe.sendFileFromUrl(self, profile, 'ProfileTwitter.jpg', `➸ *Username*: ${username}\n *Full Name*: ${full_name}\n➸ *Followers*: ${followers}\n➸ *Following*: ${following}\n➸ *Tweet*: ${tweets}\n➸ *Is_Verified*: ${verified}\n➸ *Favourites*: ${favourites}\n➸ *Listed Count*: ${listed_count}\n➸ *Joined On*: ${joined_on}\n➸ *Profile Banner*: ${profile_banner}`, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'github':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Format salah!\nuntuk meng-stalk akun Github\ngunakan ${prefix}github username`, id)
                await erdwpe.reply(self, msg3.wait(), id)
                stalker.github(query)
                .then(async ({result}) => {
                    const { username, id, profile_pic, fullname, company, blog, location, email, hireable, biografi, public_repository, public_gists, followers, following, joined_on, last_updated, profile_url} = await result
                    await erdwpe.sendFileFromUrl(self, profile_pic, 'ProfileGithub.jpg', `➸ *Username*: ${username}\n➸ *Full Name*: ${fullname}\n➸ *ID*: ${id}\n➸ *Company*: ${company}\n➸ *Blog*: ${blog}\n➸ *Location*: ${location}\n➸ *Email*: ${email}\n➸ *Hireable*: ${hireable}\n➸ *Biography*: ${biografi}\n➸ *Public Repository*: ${public_repository}\n➸ *Public Gists*: ${public_gists}\n➸ *Followers*: ${followers}\n➸ *Following*: ${following}\n➸ *Joined On*: ${joined_on}\n➸ *Last Updated*: ${last_updated}\n➸ *Profile URL*: ${profile_url}`, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
               case 'jadwalsholat':
                if (args.length == 0) return erdwpe.reply(self, `Untuk mencari jadwal sholat\n\nPenggunaan: #jadwalsholat surabaya`, id)
                const sholat = body.slice(14)
                const sholat1 = await axios.get(`http://api.lolhuman.xyz/api/sholat/${sholat}?apikey=${lolhuman}`)
                const sholat2 = sholat1.data.result
                const sholat3 = `➸ *wilayah*: ${sholat2.wilayah}\n➸ *tanggal*: ${sholat2.tanggal}\n➸ *sahur*: ${sholat2.sahur}\n➸ *imsak*: ${sholat2.imsak}\n➸ *subuh*: ${sholat2.subuh}\n➸ *dhuha*: ${sholat2.dhuha}\n➸ *dzuhur*: ${sholat2.dzuhur}\n➸ *ashar*: ${sholat2.ashar}\n➸ *maghrib*: ${sholat2.maghrib}\n➸ *isya*: ${sholat2.isya}`
                await erdwpe.sendFileFromUrl(self, `https://assets.kompasiana.com/items/album/2018/04/25/2018-04-25-masjid-5ae06670cbe52329bd520502.jpg`, 'narto.jpg', sholat3, id)
                   break
                   case 'tiktokstalk':
                    if (args.length == 0) return erdwpe.reply(self, `Untuk mencari jadwal sholat\n\nPenggunaan: #jadwalsholat surabaya`, id)
                    const ttstalk = body.slice(13)
                    const ttstalk1 = await axios.get(`https://api.lolhuman.xyz/api/stalktiktok/${ttstalk}?apikey=${lolhuman}`)
                    const ttstalk2 = ttstalk1.data.result
                    const ttstalk3 = `➸ *Username*: ${ttstalk2.username}\n➸ *Nickname*: ${ttstalk2.nickname}\n➸ *Bio*: ${ttstalk2.bio}\n➸ *Followers*: ${ttstalk2.followers}\n➸ *Followings*: ${ttstalk2.followings}\n➸ *Likes*: ${ttstalk2.likes}\n➸ *Video*: ${ttstalk2.video}`
                    await erdwpe.sendFileFromUrl(self, `${ttstalk2.user_picture}`, 'narto.jpg', ttstalk3, id)
                       break
            /* END OF STALKER */

            /* FUN MENU */
            case 'simi':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Gunakan ${prefix}simi teks`, id)
                fun.simsimi(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, result.jawaban, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'balikhuruf':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk membalik huruf\ngunakan ${prefix}balikhuruf teks`, id)
                fun.balikhuruf(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, result.kata, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
               case 'alay':
                if (isQuotedText){
                    const alay1 = body.slice(6)
                    const alay2 = axios.get(self, `http://api.lolhuman.xyz/api/alay?apikey=${lolhuman}&text=${alay1}`, id)
                    await erdwpe.reply(self, alay2.data.result, id)
                    console.log('Success')
                } else {
                    await erdwpe.reply(self, '*mana gambarnya ngab*', id)
                }
            break
            case 'hitunghuruf':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk menghitung jumlah huruf\ngunakan ${prefix}hitunghuruf teks`, id)
                fun.hitunghuruf(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, result.jumlah, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'hilih':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk membuat hilih teks\ngunakan ${prefix}hilih teks\n\nContoh: ${prefix}hilih halah bacot`, id)
                fun.hilihteks(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, result.kata, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            /* END OF FUN MENU */
            
            /* SPAMMER */
            case 'email':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query.includes('|')) return await erdwpe.reply(self, `Untuk mengirim email kepada seseorang\ngunakan ${prefix}email target | subjek | pesan`, id)
                const target = query.substring(0, query.indexOf('|') - 1)
                const subjek = query.substring(query.indexOf('|') + 2, query.lastIndexOf('|') - 1)
                const pesan = query.substring(query.lastIndexOf('|') + 2)
                spammer.email(target, subjek, pesan)
                .then(async ({result}) => {
                    await erdwpe.reply(self, result.log_lengkap, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'call':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk mengirim panggilan kepada seseorang\ngunakan ${prefix}call nomor_telpon`, id)
                spammer.call(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, result.logs, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            /* END OF SPAMMER */

            /* EDUCATION */
            case 'covidindo':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                await erdwpe.reply(self, msg.wait(), id)
                .then(async ({result}) => {
                    await erdwpe.reply(self, `➸ *Negara*: ${result.country}\n➸ *Positif*: ${result.positif}\n➸ *Negatif*: ${result.negatif}\n➸ *Meninggal*: ${result.meinggal}\n➸ *Sembuh*: ${result.sembuh}\n➸ *Dalam Perawatan*: ${result.dalam_perawatan}`, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'kbbi':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk mencari kata KBBI\ngunakan ${prefix}kbbi query\n\nContoh: ${prefix}kbbi manusia`, id)
                await erdwpe.reply(self, msg3.wait(), id)
                education.kbbi(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, `➸ *Judul*: ${result.judul}\n➸ *PageID*: ${result.pageid}\n➸ *Isi Konten*: ${result.isi_konten}`, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'wiki':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk mencari Wikipedia\ngunakan ${prefix}wiki query\n\nContoh: ${prefix}wiki indonesia`, id)
                await erdwpe.reply(self, msg3.wait(), id)
                education.wikipedia(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, `➸ *Judul*: ${result.judul}\n➸ *PageID*: ${result.pageid}\n➸ *Isi Konten*: ${result.isi_konten}`, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            case 'wikien':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Untuk mencari Wikipedia bahasa inggris\ngunakan ${prefix}wikien query\n\nContoh: ${prefix}wikien indonesia`, id)
                await erdwpe.reply(self, msg.wait(), id)
                education.wikipediaen(query)
                .then(async ({result}) => {
                    await erdwpe.reply(self, `➸ *Title*: ${result.judul}\n➸ *PageID*: ${result.pageid}\n➸ *Content*: ${result.desc}`, id)
                })
                .catch(async (err) => {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                })
            break
            /* END OF EDUCATION */

            /* MODERATIOR CMDS */
             case 'kick':
            if (!isGroupMsg) return erdwpe.reply(self, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return erdwpe.reply(self, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return erdwpe.reply(self, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length === 0) return erdwpe.reply(self, 'Maaf, format pesan salah.\nSilahkan tag satu atau lebih orang yang akan dikeluarkan', id)
            if (mentionedJidList[0] === botNumber) return await erdwpe.reply(self, 'Maaf, format pesan salah.\nTidak dapat mengeluarkan akun bot sendiri', id)
            await erdwpe.sendTextWithMentions(self, `Request diterima, mengeluarkan:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await erdwpe.sendText(self, 'Gagal, kamu tidak bisa mengeluarkan admin grup.')
                await erdwpe.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promote':
            if (!isGroupMsg) return erdwpe.reply(self, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return erdwpe.reply(self, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return erdwpe.reply(self, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length !== 1) return erdwpe.reply(self, 'Maaf, hanya bisa mempromote 1 user', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await erdwpe.reply(self, 'Maaf, user tersebut sudah menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await erdwpe.reply(self, 'Maaf, format pesan salah.\nTidak dapat mempromote akun bot sendiri', id)
            await erdwpe.promoteParticipant(groupId, mentionedJidList[0])
            await erdwpe.sendTextWithMentions(self, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break
        case 'demote':
            if (!isGroupMsg) return erdwpe.reply(self, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return erdwpe.reply(self, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return erdwpe.reply(self, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length !== 1) return erdwpe.reply(self, 'Maaf, hanya bisa mendemote 1 user', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await erdwpe.reply(self, 'Maaf, user tersebut belum menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await erdwpe.reply(self, 'Maaf, format pesan salah.\nTidak dapat mendemote akun bot sendiri', id)
            await erdwpe.demoteParticipant(groupId, mentionedJidList[0])
            await erdwpe.sendTextWithMentions(self, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
             case 'edotensei':
            if (!isGroupMsg) return erdwpe.reply(self, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isOwner) return erdwpe.reply(self, 'Perintah ini hanya bisa di gunakan oleh Owner BOT', id)
            //if (!isBotGroupAdmins) return erdwpe.reply(self, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return erdwpe.reply(self, 'Fitur untuk menghapus member lalu menambahkan member kembali,kirim perintah #edotensei @tagmember', id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (owner.includes(mentionedJidList[i])) return erdwpe.reply(self, 'eror dia adalah ownerku', id)
                await erdwpe.removeParticipant(groupId, mentionedJidList[i])
                await sleep(3000)
                await erdwpe.addParticipant(self,`${mentionedJidList}`)
            } 
            break
                   case 'unblock':
            if (!isOwner) return erdwpe.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner Elaina!', id)
                let unblock = body.slice(9)
                await erdwpe.contactUnblock(from, `${unblock}@c.us`).then((a)=>{
                    console.log(a)
                    erdwpe.reply(from, `Success unblok!`, id)
                })
            break
            case 'mutegrup':
            if (!isGroupMsg) return erdwpe.reply(self, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return erdwpe.reply(self, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return erdwpe.reply(self, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (args.length !== 1) return erdwpe.reply(self, `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`, id)
            if (args[0] == 'on') {
                erdwpe.setGroupToAdminsOnly(groupId, true).then(() => erdwpe.sendText(self, 'Berhasil mengubah agar hanya admin yang dapat chat!'))
            } else if (args[0] == 'off') {
                erdwpe.setGroupToAdminsOnly(groupId, false).then(() => erdwpe.sendText(self, 'Berhasil mengubah agar semua anggota dapat chat!'))
            } else {
                erdwpe.reply(self, `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`, id)
            }
            break
            case 'bc':
if (!isOwner) return erdwpe.reply(self, 'heh, siapa ini bukan owner Bot main suruh', id)
if (args.length == 0) return erdwpe.reply(self, 'Untuk broadcast ke semua chat ketik:\n${prefix}bc [isi chat]')
let msg = body.slice(4)
const chatz = await erdwpe.getAllChatIds()
if(quotedMsg && quotedMsg.type == 'image')
    { const mediaData = await decryptMedia(quotedMsg) 
        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
for (let idk of chatz) {
var cvk = await erdwpe.getChatById(idk)
if (!cvk.isReadOnly) 
    erdwpe.sendImage(idk, imageBase64, 'gambar.jpeg',  `           *「 𝔼ℝ𝔻𝕎ℙ𝔼 𝔹𝕆𝕋 」*\n\n${msg}`) 
if (cvk.isReadOnly) 
erdwpe.sendImage(idk, imageBase64, 'gambar.jpeg',  `           *「 𝔼ℝ𝔻𝕎ℙ𝔼 𝔹𝕆𝕋 」*\n\n${msg}`)
} erdwpe.reply(self, 'Broadcast Success!', id)
}else{
for(let idk of chatz){ var cvk = await erdwpe.getChatById(idk) 
    if(!cvk.isReadOnly) 
        erdwpe.sendText(idk, `           *「 𝔼ℝ𝔻𝕎ℙ𝔼 𝔹𝕆𝕋 」*\n\n${msg}`)
}
erdwpe.reply('Broadcast Success!') } 
break
            case 'antilink':
                if (!isGroupMsg) return await erdwpe.reply(self, msg3.groupOnly(), id)
                if (!isGroupAdmins) return await erdwpe.reply(self, msg3.adminOnly(), id)
                if (!isBotGroupAdmins) return await erdwpe.reply(self, msg3.botNotAdmin(), id)
                if (ar[0] === 'on') {
                    if (isDetectorOn) return await erdwpe.reply(self, `Gagal, Anti group-link sudah pernah di nyalakan sebelumnya`, id)
                    _antilink.push(groupId)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(_antilink))
                    await erdwpe.reply(self, `*...:* *ANTI GROUP LINK*\n\nPerhatian untuk member grup\nGroup ini telah dipasang anti-link, jika anda mengirim link group lain, maka akan otomatis terkick!`, id)
                } else if (ar[0] === 'off') {
                    _antilink.splice(groupId, 1)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(_antilink))
                    await erdwpe.reply(self, `Berhasil menonaktifkan anti-link`, id)
                } else {
                    await erdwpe.reply(self, `Untuk melindungi grup ini dari link grup lain\nketik ${prefix}antilink on --enable\n${prefix}antilink off --disable`, id)
                }
            break
            case 'antivirtext':
                if (!isGroupMsg) return await erdwpe.reply(self, msg3.groupOnly(), id)
                if (!isGroupAdmins) return await erdwpe.reply(self, msg3.adminOnly(), id)
                if (!isBotGroupAdmins) return await erdwpe.reply(self, msg3.botNotAdmin(), id)
                if (ar[0] === 'on') {
                    if (isAntiVirtextOn) return await erdwpe.reply(self, `Gagal, Anti Virtext sudah pernah dinyalakan sebelumnya`, id)
                    _antivirtext.push(groupId)
                    fs.writeFileSync('./database/antivirtext.json', JSON.stringify(_antivirtext))
                    await erdwpe.reply(self, `*...:* *ANTI VIRTEXT*\n\nPerhatian untuk member grup\nGroup ini telah dipasang anti virtext, jika anda mengirim virtext, maka akan otomatis terkick!`, id)
                } else if (ar[0] === 'off') {
                    _antivirtext.splice(groupId, 1)
                    fs.writeFileSync('./database/antivirtext.json', JSON.stringify(_antivirtext))
                    await erdwpe.reply(self, `Berhasil menonaktifkan anti-virtext`, id)
                } else {
                    await erdwpe.reply(self, `Untuk melindungi grup ini dari virtext\nketik ${prefix}antivirtext on --enable\n${prefix}antivirtext off --disable`, id)
                }
            break
              case 'antinsfw':
                if (!isGroupMsg) return await erdwpe.reply(self, msg3.groupOnly(), id)
                if (!isGroupAdmins) return await erdwpe.reply(self, msg3.adminOnly(), id)
                if (!isBotGroupAdmins) return await erdwpe.reply(self, msg3.botNotAdmin(), id)
                if (ar[0] === 'on') {
                    if (isAntiNsfwOn) return await erdwpe.reply(self, `Gagal, Anti NSFW sudah pernah dinyalakan sebelumnya`, id)
                    _antinsfw.push(groupId)
                    fs.writeFileSync('./database/antinsfw.json', JSON.stringify(_antinsfw))
                    await erdwpe.reply(self, `*...:* *ANTI NSFW*\n\nPerhatian untuk member Group ini telah dipasang anti NSFW, jika anda mengirim NSFW, maka akan otomatis terkick!`, id)
                } else if (ar[0] === 'off') {
                    _antinsfw.splice(groupId, 1)
                    fs.writeFileSync('./database/antinsfw.json', JSON.stringify(_antinsfw))
                    await erdwpe.reply(self, `Berhasil menonaktifkan anti-NSFW`, id)
                } else {
                    await erdwpe.reply(self, `Untuk melindungi grup ini dari NSFW\nketik ${prefix}antinsfw on --enable\n${prefix}antinsfw off --disable`, id)
                }
            break
            /* END OF MODERATION CMDS */

            /* OTHERS */
            case 'emot':
                //if (!isRegistered) return await erdwpe.reply(self, msg.notRegistered(pushname), id)
                if (!query) return await erdwpe.reply(self, `Format salah!\nuntuk convert emoji to sticker\ngunakan ${prefix}emot emoji_nya`, id)
                try {
                await erdwpe.reply(self, msg3.wait(), id)
                const emoji = emojiUnicode(query)
                await erdwpe.sendImageAsSticker(self, await erdwpe.download(`https://videfikri.com/api/emojitopng/?emojicode=${emoji}`), { author: 'xrlangga', pack: '©ERDWPE BOT' })
                } catch (err) {
                    console.error(err)
                    await erdwpe.reply(self, 'Error!', id)
                }
            break
            /* END OF OTHERS */

            case 'menuadmin':
                if (isGroupMsg && isGroupAdmins) {
                await erdwpe.reply(self, msg3.menuAdmin(), id)
                }
            break
            case 'menu':
            case 'help':
            //git commit -m "initial commit" --allow-empty
                await erdwpe.sendLinkWithAutoPreview(self, msg3.menu(pushname))
                .then(() => ((isGroupMsg) && (isGroupAdmins)) ? erdwpe.sendText(self, `Menu Admin Grup: *${prefix}menuadmin*`) : null)
            break

            default:
                if (isCmd) {
                    await erdwpe.reply(self, `perintah tidak di temukan coba cek di *${prefix}menu*`, id)
                }
            break
        }
    } 
}catch (err) {
        console.error(err)
    }
}
