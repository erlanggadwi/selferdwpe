const { fetchJson } = require('../function/fetcher.js')
const config = require('../config.json')

const ytPlay = (query) => new Promise((resolve, reject) => {
    console.log(`Searching for song in YouTube...`)
    fetchJson(`https://videfikri.com/api/ytplay?query=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const insta = (url) => new Promise((resolve, reject) => {
    console.log(`Get Instagram media from ${url}`)
    fetchJson(`https://api.vhtear.com/instadl?link=${url}&apikey=${config.vhtear}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const ttnowm = (url2) => new Promise((resolve, reject) => {
    console.log(`Get tiktok media from ${url}`)
    fetchJson(`http://docs-jojo.herokuapp.com/api/tiktok_nowm?url=${url2}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const its = (query) => new Promise((resolve, reject) => {
    console.log('Searching for IG Story...')
    fetchJson(`https://api.vhtear.com/igstory?query=${query}&apikey=${config.vhtear}`)
        .then((result) => resolve(result))
        .catch((err) =>  reject(err))
})

const sticker = (query) => new Promise((resolve, reject) => {
    console.log('Searching for sticker...')
    fetchJson(`https://api.vhtear.com/wasticker?query=${query}&apikey=${config.vhtear}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})


const igtv = (url) => new Promise((resolve, reject) => {
    console.log(`Searching Instagram TV for: ${url}...`)
    fetchJson(`https://videfikri.com/api/igtv/?url=${url}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const ytmp3 = (query) => new Promise((resolve, reject) => {
    console.log(`Converting YT to MP3 from ${query}...`)
    fetchJson(`https://videfikri.com/api/ytmp3/?url=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const ytmp4 = (query) => new Promise((resolve, reject) => {
    console.log(`Converting YT to MP4 from ${query}...`)
    fetchJson(`https://videfikri.com/api/ytmp4/?url=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

module.exports = {
    ytPlay,
    insta,
    sticker,
    its,
    igtv,
    ytmp3,
    ytmp4
}