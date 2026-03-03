/**
 * commands/moderation/lock.js — !lock
 * commands/moderation/unlock.js — !unlock
 * Tranca/Destranca o canal para o cargo @everyone.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'lock',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
            return message.reply('❌ Você precisa de **Gerenciar Canais**.');
        try {
            await message.channel.permissionOverwrites.edit(message.guild.id, {
                SendMessages: false
            });
            message.reply('🔒 Canal **trancado**. Apenas Staff pode enviar mensagens.');
        } catch (err) {
            message.reply('❌ Não foi possível trancar o canal. Verifique as permissões do bot.');
        }
    }
};
