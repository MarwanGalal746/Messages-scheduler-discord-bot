const schMessages = require('../models/schMessages.js')

module.exports = {
    requiredPermissions: ['ADMINISTRATOR'],
    expectedArgs: '',
    minArgs:0,    
    maxArgs:0,
    callback: async ({message, args}) => {
        const {mentions, guild, channel} = message
        const query={
            guildId: guild.id,
            authorId: message.author.id
        }
        console.log(message.author.username)
        const all = await schMessages.find({
            guildId: guild.id
                }   )
        if(all.length <=0){
            message.reply('You didn\'t schedule messages in this server.')
        }
        else{
            let res='\n'
            res+='All the messages which scheduled in this server: \n\n'
            let i=0
            
            for(const msg of all){
                res+=`${++i}- Content of the message: `
                res+=msg.content
                res+=`\nDate when the message will be scheduled: `
                res+=msg.date
                res+='\n'
                if(msg.repetition ==='no')
                    res+=`Repetition: ${msg.repetition} repetition`
                else
                    res+=`Repetition: ${msg.repetition} repetition`
                res+=`\nMessage's author username: ${msg.username}`
                res+='\n\n'
            }
            message.reply(res)
        }
    }
}
    