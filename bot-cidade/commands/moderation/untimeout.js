/**
 * commands/moderation/untimeout.js — !untimeout [@user]
 * Remove o silenciamento de um membro.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'untimeout',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply('❌ Você precisa de **Silenciar Membros**.');
        const alvo = message.mentions.members.first();
        if (!alvo) return message.reply('📝 Uso: `!untimeout [@user]`');
        try {
            await alvo.timeout(null);
            return message.reply(`✅ Silenciamento de **${alvo.user.tag}** removido.`);
        } catch (err) {
            message.reply('❌ Não foi possível remover o silenciamento.');
        }
    }
};
