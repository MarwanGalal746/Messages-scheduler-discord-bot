const mongoose = require('mongoose')

const reqStr = {
    type: String,
    required: true
}

const schMessages = new mongoose.Schema({
    date: {
        type:Date,
        //
    },
    content: {
        type: String,
        //
    },
    guildId: {
        type: String,
        //
    },
    channelId: {
        type: String,
        //
    }
})

const name = 'scheduled-messages'

module.exports = mongoose.model[name] ||mongoose.model(name, schMessages, name)