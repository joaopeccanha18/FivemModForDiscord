/**
 * commands/discord/servericon.js — !servericon
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'servericon',
    async execute(message) {
        const url = message.guild.iconURL({ dynamic: true, size: 1024 });
        if (!url) return message.reply('❌ Este servidor não possui um ícone definido.');
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`🖼️ Ícone de ${message.guild.name}`)
            .setImage(url);
        return message.reply({ embeds: [embed] });
    }
};
