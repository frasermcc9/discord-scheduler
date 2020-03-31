const { Command } = require('discord.js-commando');
const schedule = require('node-schedule')
const Discord = require('discord.js')

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


        let reactionArray = ['✅', '❌']
        const filter = (reaction, user) => {
            return reactionArray.includes(reaction.emoji.name) && user.id == msg.author.id;
        };

        let confirmMessage = new Discord.MessageEmbed()
            .setTitle("New Scheduled Direct Message")
            .setDescription(`Sending at: ${date}`)
            .addField(bold('Content'), `${dmContent}`)
            .addField(bold('Recipient'), `${role}`)
            .setColor('#37db00')
        msg.say(confirmMessage).then(msg => msg.react('✅')).then(async m => {
            await m.message.react('❌')

            const collector = new Discord.ReactionCollector(m.message, filter, { time: 1000 * 45 })
            collector.on('collect', () => {
                collector.stop()
            })
            collector.on('end', collected => {
                msg.say('Confirmed Message')
                let reactData = collected.first()
                if (typeof (reactData) == 'undefined' || reactData.emoji.name == '❌')
                    return msg.say(`You cancelled the message`)
                else if (reactData.emoji.name == '✅') {
                    let j = schedule.scheduleJob(date, function () {
                        let membersWithRole = msg.guild.roles.cache.find(r => r == role).members.map(m => m.user);
                        membersWithRole.forEach(el => {
                            el.send(dmContent).catch(() => { console.log(`Tried to send a dm to ${el.username}, but couldn't. Likely due to privacy settings or the user was a bot.`) })
                        })
                    });

                }
            })
        })
    }
}

const bold = (txt) => '**' + txt + '**'
