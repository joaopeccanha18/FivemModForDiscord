/**
 * commands/moderation/unlock.js — !unlock
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unlock',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
            return message.reply('❌ Você precisa de **Gerenciar Canais**.');
        try {
            await message.channel.permissionOverwrites.edit(message.guild.id, {
                SendMessages: null // null = reset to default (herda do servidor)
            });
            message.reply('🔓 Canal **destrancado**.');
        } catch (err) {
            message.reply('❌ Não foi possível destrancar o canal.');
        }
    }
};
