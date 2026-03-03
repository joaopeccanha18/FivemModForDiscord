/**
 * commands/moderation/setnick.js — !setnick [@user] [apelido]
 * Altera o apelido de um membro no servidor.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setnick',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames))
            return message.reply('❌ Você precisa de **Gerenciar Apelidos**.');
        const alvo = message.mentions.members.first();
        const nick = args.slice(1).join(' ') || null; // null = remove o apelido
        if (!alvo) return message.reply('📝 Uso: `!setnick [@user] [apelido]` (sem apelido = remove)');
        try {
            await alvo.setNickname(nick, `Solicitado por ${message.author.tag}`);
            return message.reply(nick ? `✅ Apelido de **${alvo.user.tag}** alterado para **${nick}**.` : `✅ Apelido de **${alvo.user.tag}** removido.`);
        } catch (err) {
            message.reply('❌ Não foi possível alterar o apelido.');
        }
    }
};
