/**
 * commands/moderation/addemoji.js — !addemoji [nome] [url]
 * Adiciona um emoji ao servidor a partir de uma URL de imagem.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'addemoji',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions))
            return message.reply('❌ Você precisa de **Gerenciar Expressões**.');
        const nome = args[0];
        const url = args[1];
        if (!nome || !url || !url.startsWith('http'))
            return message.reply('📝 Uso: `!addemoji [nome] [url-da-imagem]`');
        try {
            const emoji = await message.guild.emojis.create({ attachment: url, name: nome });
            return message.reply(`✅ Emoji <:${emoji.name}:${emoji.id}> adicionado com sucesso!`);
        } catch (err) {
            console.error('[ADDEMOJI]', err.message);
            message.reply('❌ Falha ao adicionar emoji. Verifique se a URL é válida (PNG/GIF) e o limite de emojis do servidor.');
        }
    }
};
