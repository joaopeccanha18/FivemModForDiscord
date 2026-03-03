/**
 * commands/discord/serverinfo.js — !serverinfo
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    async execute(message) {
        const g = message.guild;
        await g.fetch();
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`📊 ${g.name}`)
            .setThumbnail(g.iconURL({ dynamic: true }))
            .addFields(
                { name: '🆔 ID', value: g.id, inline: true },
                { name: '👑 Dono', value: `<@${g.ownerId}>`, inline: true },
                { name: '👥 Membros', value: `${g.memberCount}`, inline: true },
                { name: '📅 Criado em', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '📢 Canais', value: `${g.channels.cache.size}`, inline: true },
                { name: '🎭 Cargos', value: `${g.roles.cache.size}`, inline: true },
                { name: '😀 Emojis', value: `${g.emojis.cache.size}`, inline: true },
                { name: '🔰 Boost Level', value: `${g.premiumTier}`, inline: true },
                { name: '💎 Boosts', value: `${g.premiumSubscriptionCount || 0}`, inline: true }
            )
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }
};
