/**
 * commands/moderation/dkick.js — !dkick [@user] [motivo]
 * Expulsa um usuário do servidor Discord.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'dkick',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply('❌ Você precisa de **Expulsar Membros**.');
        const alvo = message.mentions.members.first();
        const motivo = args.slice(1).join(' ') || 'Sem motivo informado.';
        if (!alvo) return message.reply('📝 Uso: `!dkick [@user] [motivo]`');
        if (!alvo.kickable) return message.reply('❌ Não posso expulsar este usuário.');
        try {
            await alvo.kick(`${message.author.tag}: ${motivo}`);
            return message.reply(`👟 **${alvo.user.tag}** foi expulso do servidor. Motivo: ${motivo}`);
        } catch (err) {
            message.reply('❌ Não foi possível expulsar o usuário.');
        }
    }
};
