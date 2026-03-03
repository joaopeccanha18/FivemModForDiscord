/**
 * commands/discord/userinfo.js — !userinfo [@user]
 * Exibe informações detalhadas de um membro do servidor.
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    async execute(message, args) {
        const alvo = message.mentions.members.first() || message.member;
        const user = alvo.user;
        const cargos = alvo.roles.cache
            .filter(r => r.id !== message.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`)
            .slice(0, 10)
            .join(', ') || 'Nenhum';

        const embed = new EmbedBuilder()
            .setColor(alvo.displayHexColor || '#5865F2')
            .setTitle(`👤 ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '🤖 Bot?', value: user.bot ? 'Sim' : 'Não', inline: true },
                { name: '📅 Conta criada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '📥 Entrou no server', value: `<t:${Math.floor(alvo.joinedTimestamp / 1000)}:D>`, inline: true },
                { name: '🎭 Cargo mais alto', value: `${alvo.roles.highest}`, inline: true },
                { name: '🏅 Cargos', value: cargos, inline: false }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
