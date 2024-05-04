const fs = require('fs');
const path = require('path');
const { EmbedBuilder, Events } = require('discord.js');

// Define the path to the JSON file
const serverJoined = path.resolve(__dirname, 'serverJoined.json');

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild) {
        // Create an embed to log the guild creation event
        const embed = new EmbedBuilder()
            .setTitle('Joined a new server!')
            .setDescription(`I have joined <:discord_logo:1234429899113103402> **${guild.name}**!\n\n**Owner:** <@${guild.ownerId}>\n**Members:** ${guild.memberCount}\n**ID:** ${guild.id}\n`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('#206694')
            .setFooter({ text: `discord.gg/vindustry` });

        // Send the embed to the logs channel
        const logsGuild = guild.client.guilds.cache.get('1230511598251278416');
        const logsChannel = logsGuild.channels.cache.get('1234235840972980344');
        logsChannel.send({ embeds: [embed] });

        // Read the existing server list from the JSON file, or create an empty list if the file doesn't exist
        let serverList = [];
        try {
            if (fs.existsSync(serverJoined)) {
                const data = fs.readFileSync(serverJoined, 'utf8');
                serverList = JSON.parse(data);
            }
        } catch (err) {
            console.error('Error reading JSON file:', err);
        }

        // Create a set to keep track of unique server IDs
        const serverIds = new Set(serverList.map(server => server.id));

        // Iterate through all the guilds the bot is in and add them to the list if not already present
        guild.client.guilds.cache.forEach(currentGuild => {
            if (!serverIds.has(currentGuild.id)) {
                const newServer = {
                    name: currentGuild.name,
                    id: currentGuild.id,
                    owner: currentGuild.ownerId,
                    members: currentGuild.memberCount,
                };

                // Add the new server to the list and the set of unique IDs
                serverList.push(newServer);
                serverIds.add(currentGuild.id);
            }
        });

        // Write the updated server list back to the JSON file
        try {
            fs.writeFileSync(serverJoined, JSON.stringify(serverList, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing JSON file:', err);
        }
    }
};
