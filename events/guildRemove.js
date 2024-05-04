
const {Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('discord.js')
const fs = require('fs');
const serverJoined = './events/serverJoined.json'


module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(guild) {
        // Create an embed to log the guild deletion event
        const embed = new EmbedBuilder()
            .setTitle('Left a server!')
            .setDescription(`I have left <:discord_logo:1234429899113103402>  **${guild.name}**!\n\n**Owner:** <@${guild.ownerId}>\n**Members:** ${guild.memberCount}\n**ID:** ${guild.id}\n\n`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('#206694')
            .setFooter({ text: `discord.gg/vindustry` });
        
        // Send the embed to the logs channel
        const logsGuild = guild.client.guilds.cache.get('1230511598251278416');
        const logsChannel = logsGuild.channels.cache.get('1234235840972980344');
        logsChannel.send({ embeds: [embed] });
        
        // Load the server list from the JSON file
        let serverList = [];
        try {
            const data = fs.readFileSync(serverJoined, 'utf8');
            serverList = JSON.parse(data);
        } catch (err) {
            console.error('Error reading JSON file:', err);
            return;
        }

        // Remove the guild object from the server list based on the guild name
        const guildIndex = serverList.findIndex((server) => server.name === guild.name);
        if (guildIndex !== -1) {
            // Remove the guild object if found
            serverList.splice(guildIndex, 1);
            
            // Write the updated server list back to the JSON file
            try {
                fs.writeFileSync(serverJoined, JSON.stringify(serverList, null, 2), 'utf8');
            } catch (err) {
                console.error('Error writing JSON file:', err);
            }
        } else {
            console.log(`Guild with name "${guild.name}" not found in server list.`);
        }
    }
};