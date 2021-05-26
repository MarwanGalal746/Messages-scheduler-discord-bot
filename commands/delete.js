const momentTimezone = require('moment-timezone')
const {MessageCollector} = require('discord.js')
const schMessages = require('../models/schMessages.js')

module.exports = {
    expectedArgs: '<channel tag> <YYYY/MM/DD> <HH:mm> <"AM" or "PM"> <Timezone> <Repetition>',
    minArgs:6,    
    maxArgs:6,
    init: () => { 
        
    },
    callback: async ({message, args}) => {
        const {mentions, guild, channel} = message
        const targetChannel = mentions.channels.first()
        if(!targetChannel){
            message.reply('Please tag a channel to send your message in.')
            return
        }
        args.shift()
        const [date, time, clockType, timeZone, rep] = args
        if(clockType!=='AM'  &&  clockType!=='PM') {
            message.reply(`Please provide either "AM" or "PM" .`)
            return
        }

        const validTZs = momentTimezone.tz.names()
        if(!validTZs.includes(timeZone)){
            message.reply("Please provide known timezone.")
            return
        }

        const targetDate = momentTimezone.tz(
            `${date} ${time} ${clockType}`,
            "YYYY/MM/DD HH:mm A",
            timeZone
        )
        // if(targetDate>Date.now()){
        //     message.reply("This date isn't in the past, please enter past date.")
        //     return
        // }
        //message.reply(rep)
        if(rep!=='no' && rep!=='daily'){    
            message.reply('Please enter a valid rep')
            return
        }

        const filter = (m) => {
            return m.author.id === message.author.id
        }

        message.reply("send the message that you want to delete.")
        const collector = new MessageCollector(channel, filter,  {
            max: 1,
            time: 60000
        })

        collector.on('end', async (collected) => {
            const collectedMessage = collected.first()

            if(!collectedMessage){
                message.reply('You didn\'t reply in time')
                return
            }
            //message.reply("Your message has been deleted")
            console.log(collectedMessage.content,guild.id.length,targetChannel.id, typeof(targetChannel.id))
            // await new schMessages({
            //     date:targetDate.valueOf(),
            //     content: collectedMessage.content,  
            //     guildId: guild.id,
            //     channelId: targetChannel.id,
            //     repetition: rep
            // }).save()
            const query={
                date:targetDate.valueOf(),
                content: collectedMessage.content,  
                guildId: guild.id,
                channelId: targetChannel.id,
                authorId:message.author.id,
                repetition: rep
            }
            const found = await schMessages.exists(query)
            if(! found){
                message.reply("You have not schedule this message.")
            } else {
                await schMessages.findOneAndDelete(query)
                message.reply("Your message has been deleted")
            }
        })
    }
}
    