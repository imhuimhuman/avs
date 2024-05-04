const { Client, GatewayIntentBits, Collection, ContextMenuCommandBuilder} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token} = require('./config.json');


 

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildVoiceStates,

	],
});
const invsPath = './models/invites.json';
const invitedUsersPath = './models/invitedUsers.json';

function loadInviteData() {
    if (fs.existsSync(invsPath)) {
        const jsonData = fs.readFileSync(invsPath, 'utf8');
        return JSON.parse(jsonData);
    }
    return {};
}

function loadInvitedUsers() {
    if (fs.existsSync(invitedUsersPath)) {
        const jsonData = fs.readFileSync(invitedUsersPath, 'utf8');
        return JSON.parse(jsonData);
    }
    return {};
}

function saveInviteData(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(invsPath, jsonData, 'utf8');
}

function saveInvitedUsers(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(invitedUsersPath, jsonData, 'utf8');
}


client.cooldowns = new Collection();


    const getAllFiles = (dir) => {
    const files = fs.readdirSync(dir);
    let allFiles = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // If the file is a directory, recursively call getAllFiles
            const nestedFiles = getAllFiles(filePath);
            allFiles = allFiles.concat(nestedFiles);
        } else {
            // If the file is a JavaScript file, add it to the array
            if (file.endsWith('.js')) {
                allFiles.push(filePath);
            }
        }
    });

    return allFiles;
};

const eventsPath = path.join(__dirname, 'events');
const eventFiles = getAllFiles(eventsPath);

for (const file of eventFiles) {
    const event = require(file);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);

