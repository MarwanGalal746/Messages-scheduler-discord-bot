const discord = require('discord.js')
const wokcommands = require('wokcommands')
require('dotenv').config()

const client = new discord.Client()

client.on('ready', () => {
    new wokcommands(client, {
        commandsDir:'commands',
        showWarns: false
    }).setMongoPath(process.env.MONGO_URI)
})
client.login(process.env.TOKEN)















// const mongo = require('./mongose.js')

// const connectToMongoDB = async () => {
//     await mongo().then(mongoose => {
//         try {
//             console.log('Connected to mongodb!')
//         } finally {
//             mongoose.connection.close()
//         }
//     })
    
// }

// connectToMongoDB()