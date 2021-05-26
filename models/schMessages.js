const mongoose = require('mongoose')

const reqStr = {
    type: String,
    required: true
}

const schMessages = new mongoose.Schema({
    date: {
        type:Date,
        required: true
    },
    content: reqStr,
    guildId: reqStr,
    channelId: reqStr,
    authorId: reqStr,
    repetition: reqStr
})

const name = 'scheduled-messages'

module.exports = mongoose.model[name] ||mongoose.model(name, schMessages, name)