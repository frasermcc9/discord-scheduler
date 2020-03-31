const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const auth = require('./auth.json');

const client = new CommandoClient({
    commandPrefix: auth.prefix,
    owner: '202917897176219648'
});



client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['core', 'Core Commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('error', console.error);
client.login(auth.token);

client.once('ready', () => {
    console.log(`Successfully connected to discord. Username: ${client.user.tag}. ID: ${client.user.id}`);
    client.user.setActivity('Zooming');
});

client.on('error', console.error);
client.login(auth.token);

