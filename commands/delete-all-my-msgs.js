const schMessages = require('../models/schMessages.js')

module.exports = {
    expectedArgs: '',
    minArgs:0,    
    maxArgs:0,
    callback: async ({message, args}) => {
        const {mentions, guild, channel} = message
        const query={
            guildId: guild.id,
            authorId: message.author.id
        }
        await schMessages.deleteMany(query)
    }
}
    