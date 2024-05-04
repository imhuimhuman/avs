const {Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('discord.js')



module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            console.log(`Logged in as ${client.user.tag}`);
        console.log(client.guilds.cache.get('1209883660837330944'))
        const mg = client.guilds.cache.get('1234569536913543268')
        const channel = mg.channels.cache.get('1236380292046917733')
        const msgs = await channel.messages.fetch();
        if (msgs.has('1236381462820028567')) return console.log('Already sent message')


        const embed = new EmbedBuilder()
        .setTitle('Check Invites')
        .setDescription('Click the button below to check invites')
        .setThumbnail(mg.iconURL())
        .setColor('#206694');

        const b = new ButtonBuilder()
        .setStyle('1')
        .setLabel('Check Invites')
        .setCustomId('check_invites')
        .setEmoji('📝');
        const row = new ActionRowBuilder().addComponents(b);


        await channel.send({embeds: [embed], components: [row]});


        }
        catch (err) {
            console.log(err)
        }

 

    }

}