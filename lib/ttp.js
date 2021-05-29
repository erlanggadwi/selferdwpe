const fetch = require('node-fetch')

const getStickerMaker = (link) => new Promise((resolve, reject) => {
    fetch('https://api.areltiyan.xyz/sticker_maker?text='+encodeURIComponent(link), {
        method: 'GET',
    })
    .then(async res => {
        const text = await res.json()

        resolve(text)
        
     })
    .catch(err => reject(err))
});
exports.getStickerMaker = getStickerMaker
