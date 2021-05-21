const momentTimezone = require('moment-timezone')
const {MessageCollector} = require('discord.js')
const schMessages = require('../models/schMessages.js')

module.exports = {
    expectedArgs: '<channel tag> <YYYY/MM/DD> <HH:mm> <"AM" or "PM"> <Timezone>',
    minArgs:5,
    maxArgs:5,
    init: () => {},
    callback: ({message, args}) => {
        const {mentions, guild, channel} = message
        const targetChannel = mentions.channels.first()
        if(!targetChannel){
            console.log('Please tag a channel to send your message in.')
            return
        }
        args.shift()
        const [date, time, clockType, timeZone] = args
        if(clockType!=='AM'  &&  clockType!=='PM') {
            console.log(`Please provide either "AM" or "PM" .`)
            return
        }

        const validTZs = momentTimezone.tz.names()
        if(!validTZs.includes(timeZone)){
            console.log("Please provide known timezone.")
            return
        }

        const targetDate = momentTimezone.tz(
            `${date} ${time} ${clockType}`,
            "YYYY/MM/DD HH:mm A",
            timeZone
        )

        const filter = (m) => {
            return m.author.id === message.author.id
        }

        message.reply("send the message you would like to schedule")
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
            message.reply("Your message has been scheduled")

            await new schMessages({
                date:targetDate.valueOf(),
                content: collectedMessage.content,
                guildID: guild.id,
                channelID: targetChannel.id
            }).save()
        })
    }
}