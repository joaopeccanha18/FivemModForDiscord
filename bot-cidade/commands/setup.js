/**
 * commands/setup.js — !setup
 * Cria o painel de Central de Atendimento com botão para abrir Ticket.
 * Somente Administradores podem usar.
 */
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'setup',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Apenas Administradores podem usar `!setup`.');
        }

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle('📬 Central de Atendimento')
            .setDescription(
                '**Precisa de ajuda da nossa equipe?**\n\n' +
                '> 📩 Clique no botão abaixo para abrir um ticket privado.\n' +
                '> 👮 Um membro da staff irá te atender em breve.\n\n' +
                '⚠️ Abra tickets apenas para assuntos sérios relacionados à cidade.'
            )
            .setTimestamp()
            .setFooter({ text: 'Sistema de Suporte', iconURL: client.user.displayAvatarURL() });

        const btn = new ButtonBuilder()
            .setCustomId('open_ticket')
            .setLabel('Abrir Ticket')
            .setEmoji('📩')
            .setStyle(ButtonStyle.Primary);

        await message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(btn)] });
        await message.delete().catch(() => { });
    }
};
