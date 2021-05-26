
const schMessages = require('../models/schMessages.js')

module.exports = {
    requiredPermissions: ['ADMINISTRATOR'],
    expectedArgs: '',
    minArgs:0,    
    maxArgs:0,
    callback: async ({message, args}) => {
        const {mentions, guild, channel} = message
        let msg=`
This bot is used to schedule messages once or daily in the server, and to use it you can read the following:\n\nFor scheduling messages in general, you can use the command (schedule) with following structure\n!schedule <channel tag> <YYYY/MM/DD> <HH:mm> <"AM" or "PM"> <Timezone> <Repetition>
\nThis is an example for scheduling a message once\n!schedule #general 2021/5/26 4:45 PM Africa/Cairo no\n\nThis is an example for scheduling a message daily\n!schedule #general 2021/5/26 4:45 PM Africa/Cairo daily\n\n- To delete a specific message that you have scheduled, you can use the command (delete) with following structure\n!delete <channel tag> <YYYY/MM/DD> <HH:mm> <“AM” or “PM”> <Timezone> <Repetition>\n\n- To delete all the messages that you have scheduled on the server, you can use the command (delete-all-my-msgs) command with the following structure\n!delete-all-my-msgs\n\n- To delete the messages that have been scheduled on the server by anyone, you can use the command (delete-all-server-msgs) with the following structure (this command can only be used by the server owner)\n!delete-all-server-msgs\n
To view all the messages that you have scheduled on the server, you can use the command (get-all-my-msgs) command with the following structure\n!get-all-my-msgs\n\n- To view the messages that have been scheduled on the server by anyone, you can use the command (get-all-server-msgs) with the following structure (this command can only be used by the server owner)\n!get-all-server-msgs\n\n`
        message.reply(msg)

    }
}
    