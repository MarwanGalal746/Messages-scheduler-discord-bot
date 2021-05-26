const momentTimezone = require('moment-timezone')
const {MessageCollector} = require('discord.js')
const schMessages = require('../models/schMessages.js')

module.exports = {
    expectedArgs: '<channel tag> <YYYY/MM/DD> <HH:mm> <"AM" or "PM"> <Timezone> <Repetition>',
    minArgs:6,    
    maxArgs:6,
    init: (client) => { 
        const checkForPosts = async () => {
            const query= {
                date: {
                    $lte: Date.now()
                }
            }
            let tomDate= new Date();
            let todDate = new Date();
            const results = await schMessages.find(query)
            for(const post of results){
                tomDate = new Date(post.date)
                todDate = new Date(post.date)
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
            tomDate.setDate(tomDate.getDate()+1)
            const updCond = {
                    date: {
                        $lte: todDate
                    },
                    repetition:'daily'
            }
            const upd = {
                $set : {date: tomDate}
            }
            const option = {
                multi:true
            }
            const del= {
                date: {
                    $lte: Date.now()
                }, repetition: 'no'
            }
            await schMessages.deleteMany(del)
            await schMessages.update(updCond,upd,option)
            setTimeout(checkForPosts, 10000);
        } 
        checkForPosts()
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
            message.reply(`Please provide either "AM" or "PM", I suggest you write !help to learn how to use the bot.`)
            return
        }

        const validTZs = momentTimezone.tz.names()
        if(!validTZs.includes(timeZone)){
            message.reply("Please provide known timezone, I suggest you write !help to learn how to use the bot..")
            return
        }

        const targetDate = momentTimezone.tz(
            `${date} ${time} ${clockType}`,
            "YYYY/MM/DD HH:mm A",
            timeZone
        )
        if(targetDate<Date.now()){
            message.reply("This date was in the past, I suggest you write !help to learn how to use the bot..")
            return
        }
        if(rep!=='no' && rep!=='daily'){    
            message.reply('Please enter a valid value, I suggest you write !help to learn how to use the bot.')
            return
        }

        const filter = (m) => {
            return m.author.id === message.author.id
        }

        message.reply("send the message you would like to schedule (You hav 60 seconds to send the message).")
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
            console.log(collectedMessage.content,guild.id.length,targetChannel.id, typeof(targetChannel.id))
            await new schMessages({
                date:targetDate.valueOf(),
                content: collectedMessage.content,  
                guildId: guild.id,
                channelId: targetChannel.id,
                authorId: message.author.id,
                repetition: rep
            }).save()
        })
    }
}