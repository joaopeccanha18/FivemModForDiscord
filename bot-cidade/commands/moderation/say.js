/**
 * commands/moderation/say.js — !say [mensagem]
 * Envia uma mensagem como o bot, deleta o comando original.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'say',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return message.reply('❌ Você precisa de **Gerenciar Mensagens**.');
        const texto = args.join(' ');
        if (!texto) return message.reply('📝 Uso: `!say [mensagem]`');
        await message.delete().catch(() => { });
        await message.channel.send(texto);
    }
};
