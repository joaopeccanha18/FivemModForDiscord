/**
 * commands/moderation/dban.js — !dban [@user] [motivo]
 * Bane um usuário do servidor Discord.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'dban',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply('❌ Você precisa de **Banir Membros**.');
        const alvo = message.mentions.members.first();
        const motivo = args.slice(1).join(' ') || 'Sem motivo informado.';
        if (!alvo) return message.reply('📝 Uso: `!dban [@user] [motivo]`');
        if (!alvo.bannable) return message.reply('❌ Não posso banir este usuário (cargo superior).');
        try {
            await alvo.ban({ reason: `${message.author.tag}: ${motivo}` });
            return message.reply(`🔨 **${alvo.user.tag}** foi banido do servidor. Motivo: ${motivo}`);
        } catch (err) {
            message.reply('❌ Não foi possível banir o usuário.');
        }
    }
};
