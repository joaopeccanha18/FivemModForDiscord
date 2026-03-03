/**
 * commands/moderation/timeout.js — !timeout [@user] [minutos] [motivo]
 * Silencia temporariamente um membro no Discord.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'timeout',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return message.reply('❌ Você precisa de **Silenciar Membros**.');

        const alvo = message.mentions.members.first();
        const min = parseInt(args[1]);
        const motivo = args.slice(2).join(' ') || 'Sem motivo.';

        if (!alvo) return message.reply('📝 Uso: `!timeout [@user] [minutos] [motivo]`');
        if (isNaN(min) || min < 1) return message.reply('❌ Informe um tempo válido em minutos (mínimo 1).');
        if (alvo.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Não é possível silenciar um Administrador.');

        try {
            await alvo.timeout(min * 60 * 1000, motivo);
            return message.reply(`⏱️ **${alvo.user.tag}** silenciado por **${min} min**. Motivo: ${motivo}`);
        } catch (err) {
            console.error('[TIMEOUT]', err.message);
            message.reply('❌ Não foi possível silenciar o usuário.');
        }
    }
};
