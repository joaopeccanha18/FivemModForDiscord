/**
 * commands/moderation/anunciar.js — !anunciar [#canal] [mensagem]
 * Envia um anúncio formatado em um canal específico.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'anunciar',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const canal = message.mentions.channels.first();
        const texto = args.slice(1).join(' ');
        if (!canal || !texto) return message.reply('📝 Uso: `!anunciar [#canal] [mensagem]`');

        const embed = new EmbedBuilder()
            .setColor('#FF6600')
            .setTitle('📢 Anúncio')
            .setDescription(texto)
            .setFooter({ text: `Enviado por ${message.author.tag}` })
            .setTimestamp();

        try {
            await canal.send({ content: '@everyone', embeds: [embed] });
            message.reply(`✅ Anúncio enviado em ${canal}.`);
        } catch {
            message.reply('❌ Não foi possível enviar no canal. Verifique as permissões do bot.');
        }
    }
};
