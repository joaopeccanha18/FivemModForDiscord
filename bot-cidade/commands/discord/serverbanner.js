/**
 * commands/discord/serverbanner.js — !serverbanner
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverbanner',
    async execute(message) {
        const g = await message.guild.fetch();
        const url = g.bannerURL({ size: 1024 });
        if (!url) return message.reply('❌ Este servidor não possui um banner. (Requer Nível de Boost 2+)');
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`🏳️ Banner de ${g.name}`)
            .setImage(url);
        return message.reply({ embeds: [embed] });
    }
};
