const discord = require('discord.js')
const wokcommands = require('wokcommands')
require('dotenv').config()
// const server = require('./server.js')

const client = new discord.Client()

client.on('ready', () => {
    new wokcommands(client, {
        commandsDir:'commands',
        showWarns: false
    }).setMongoPath(process.env.MONGO_URI)
})
client.login(process.env.TOKEN)

// server()
