const schMessages = require('../models/schMessages.js')

module.exports = {
    requiredPermissions: ['ADMINISTRATOR'],
    expectedArgs: '',
    minArgs:0,    
    maxArgs:0,
    callback: async ({message, args}) => {
        const {mentions, guild, channel} = message
        const query={
            guildId: guild.id
        }
        await schMessages.deleteMany(query)
        message.reply('The  scheduled messages of the server were deleted successfully.')
    }
}
    