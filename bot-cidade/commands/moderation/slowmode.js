/**
 * commands/moderation/slowmode.js — !slowmode [segundos]
 * Define o modo lento do canal (0 para desativar).
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'slowmode',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
            return message.reply('❌ Você precisa de **Gerenciar Canais**.');
        const seg = parseInt(args[0]);
        if (isNaN(seg) || seg < 0 || seg > 21600)
            return message.reply('📝 Uso: `!slowmode [0-21600]` (segundos). Use `0` para desativar.');
        try {
            await message.channel.setRateLimitPerUser(seg);
            return message.reply(seg === 0 ? '✅ Modo lento **desativado**.' : `✅ Modo lento definido para **${seg}s**.`);
        } catch (err) {
            message.reply('❌ Falha ao definir o modo lento.');
        }
    }
};
