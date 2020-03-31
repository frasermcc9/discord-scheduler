const { Command } = require('discord.js-commando');
const schedule = require('node-schedule')
const { MessageEmbed } = require('discord.js')

module.exports = class ScheduleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'schedule',
            memberName: 'schedule',
            group: 'core',
            description: 'Set a scheduled direct message to people with a certain role',
            guildOnly: true,
            args: [{
                key: 'scheduledDate',
                prompt: 'Please enter exactly like this, using numbers: Year,Month,Day,Hour,Minute,Second',
                type: 'string',
            }, {
                key: 'role',
                prompt: 'This is the role that will be sent the direct message',
                type: 'role',
            }, {
                key: 'dmContent',
                prompt: 'What should be included in the direct message',
                type: 'string',
            }]
        });
    }

    run(msg, { scheduledDate, role, dmContent }) {

        let d = scheduledDate.split(',')
        d = d.map(Number)
        let date = new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5])

        let confirmMessage = new MessageEmbed()
            .setTitle("New Scheduled Direct Message")
            .setDescription(`Sending at: ${date}`)
            .addField(bold('Content'), `${dmContent}`)
            .addField(bold('Recipient'), `${role}`)
            .setColor('#37db00')
        msg.say(confirmMessage)

        let j = schedule.scheduleJob(date, function () {
            let membersWithRole = msg.guild.roles.find(r => r == role).members.map(m => m.user);
            membersWithRole.forEach(el => {
                el.send(dmContent).catch(() => { console.log(`Tried to send a dm to ${el.username}, but couldn't. Likely due to privacy settings or the user was a bot.`) })
            })
        });
    }
}

const bold = (txt) => {
    return '**' + txt + '**'
}