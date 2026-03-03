/**
 * commands/config/avatarbot.js — !config-avatarbot [url]
 * Altera o avatar global do bot (limitado pelo Discord: ~2x/hora).
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'config-avatarbot',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const url = args[0];
        if (!url || !url.startsWith('http')) return message.reply('📝 Uso: `!config-avatarbot [URL da imagem]`');

        try {
            await client.user.setAvatar(url);
            return message.reply('✅ Avatar do bot atualizado com sucesso!');
        } catch (err) {
            console.error('[AVATARBOT]', err.message);
            return message.reply('❌ Falha ao atualizar o avatar. Certifique-se de que a URL é uma imagem válida e que não ultrapassou o limite do Discord (2 alterações/hora).');
        }
    }
};
