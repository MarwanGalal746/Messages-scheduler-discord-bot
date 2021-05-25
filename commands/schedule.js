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
            //console.log('hello')
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
            let del= {
                date: {
                    $lte: Date.now()
                },
                repetition: 'no'
            }
            await schMessages.deleteMany(del)
            del= {
                date: {
                    $lte: Date.now()
                },
                repetition: {
                    $eq: 'daily'
                }
            }
           await schMessages.collection.updateMany({
            date: {
                $lte: Date.now()
            },
            repetition: {
                $eq: 'daily'
            }
        },{$set : {"date":Date.now() +1}}, { upsert: true } )
            //await schMessages.where({repetition: 'daily'}).update({date: Date.now()+1})
            setTimeout(checkForPosts, 10000);
        } 
        checkForPosts()
    },
    callback: async ({message, args}) => {
        console.log()
        const {mentions, guild, channel} = message
        const targetChannel = mentions.channels.first()
        if(!targetChannel){
            console.log('Please tag a channel to send your message in, to learn how to use the bot type !help.')
            return
        }
        args.shift()
        const [date, time, clockType, timeZone, rep] = args
        if(clockType!=='AM'  &&  clockType!=='PM') {
            console.log(`Please provide either "AM" or "PM", to learn how to use the bot type !help.`)
            return
        }

        const validTZs = momentTimezone.tz.names()
        if(!validTZs.includes(timeZone)){
            console.log("Please provide known timezone, to learn how to use the bot type !help.")
            return
        }



        const targetDate = momentTimezone.tz(
            `${date} ${time} ${clockType}`,
            "YYYY/MM/DD HH:mm A",
            timeZone
        )
        if(rep !== 'no' && rep !== 'daily' && rep !== 'weekly'){
            console.log("Please provide a valid repetition, to learn how to use the bot type !help. ")
            return
        }

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
            console.log(collectedMessage.content,guild.id,targetChannel.id, typeof(targetChannel.id))
            if(rep==='no'){
                await new schMessages({
                    date:targetDate.valueOf(),
                    content: collectedMessage.content,  
                    guildId: guild.id,
                    channelId: targetChannel.id,
                    repetition: "no"
                }).save()
            } else if(rep==='daily'){
                await new schMessages({
                    date:targetDate.valueOf(),
                    content: collectedMessage.content,  
                    guildId: guild.id,
                    channelId: targetChannel.id,
                    repetition: "daily"
                }).save()
            } 
        })
    }
}