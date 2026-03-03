/**
 * commands/moderation/embed.js — !embed [título] | [descrição]
 * Cria uma embed personalizada no canal atual.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'embed',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return message.reply('❌ Você precisa de **Gerenciar Mensagens**.');

        const conteudo = args.join(' ');
        const partes = conteudo.split('|');
        const titulo = partes[0]?.trim();
        const descricao = partes[1]?.trim();

        if (!titulo) return message.reply('📝 Uso: `!embed [título] | [descrição]`');

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(titulo)
            .setTimestamp();

        if (descricao) embed.setDescription(descricao);

        try {
            await message.channel.send({ embeds: [embed] });
            await message.delete().catch(() => { });
        } catch {
            message.reply('❌ Falha ao criar a embed.');
        }
    }
};
