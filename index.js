const { create, erdwpe } = require('@open-wa/wa-automate')
const { color, options } = require('./function')
const fs = require('fs-extra')
const config = require('./config.json')
const ownerNumber = config.owner

// AUTO UPDATE BY NURUTOMO
// THX FOR NURUTOMO
// Cache handler and check for file change
require('./videfikri.js')
nocache('./videfikri.js', module => console.log(`${module} Updated!`))

const start = async (erdwpe = new erdwpe()) => {
    console.log(color('[erdwpe BOT]', 'magenta'), color('erdwpe BOT is now online!', 'aqua'))
    
    erdwpe.onStateChanged((state) => {
        console.log(color('-> [STATE]'), state)
        if (state === 'CONFLICT') erdwpe.forceRefocus()
        if (state === 'UNPAIRED') erdwpe.forceRefocus()
    })

    erdwpe.onAddedToGroup(async (chat) => {
        await erdwpe.sendText(chat.groupMetadata.id, 'Maaf, bot ini tidak tersedia untuk grup!')
        await erdwpe.leaveGroup(chat.groupMetada.id)
    })

    erdwpe.onMessage((message) => {
        require('./videfikri.js')(erdwpe, message)
    })

    erdwpe.onIncomingCall(async (call) => {
        await erdwpe.sendText(call.peerJid, `Kamu telah menelpon BOT\nMaaf kamu akan diblockir!\nChat owner: wa.me/${ownerNumber} agar dibuka blok-nya!`)
        await erdwpe.contactBlock(call.peerJid)
            .then(() => console.log(`Seseorang menelpon BOT, dan telah diblokir. ID: ${call.peerJid}`))
    })
}
/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => {}) {
    console.log('Module', `${module}`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async() => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}
create(options(start))
    .then((erdwpe) => start(erdwpe))
    .catch((err) => console.error(err))