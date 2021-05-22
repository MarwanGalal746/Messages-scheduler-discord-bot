const momentTimezone = require('moment-timezone')
const {MessageCollector} = require('discord.js')
const schMessages = require('../models/schMessages.js')

module.exports = {
    expectedArgs: '<channel tag> <YYYY/MM/DD> <HH:mm> <"AM" or "PM"> <Timezone>',
    minArgs:5,    
    maxArgs:5,
    init: (client) => { 
        const checkForPosts = async () => {
            const query= {
                date: {
                    $lte: Date.now()
                }
            }
            console.log('hello')
            const results = await schMessages.find(query)
            for(const post of results){
                const {guildId, channelId, content} = post
                console.log(guildId, channelId, content)
                const guild = await client.guilds.fetch(guildId)
                if(!guild){
                    continue
                }
                const channel = guild.channels.cache.get(channelId)
                if(!channel){
                    continue
                }
                channel.send(content)
            }

            await schMessages.deleteMany(query)
            setTimeout(checkForPosts, 10000);
        } 
        checkForPosts()
    },
    callback: async ({message, args}) => {
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
            const x=collectedMessage.content
            const y=guild.id
            const z=targetChannel.id
            await new schMessages({
                date:targetDate.valueOf(),
                content: x,  
                guildID: y,
                channelID: z
            }).save()
        })
    }
}