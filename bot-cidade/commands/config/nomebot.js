/**
 * commands/config/nomebot.js — !config-nomebot [nome]
 * Altera o nome de exibição do bot no servidor.
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'config-nomebot',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const nome = args.join(' ');
        if (!nome) return message.reply('📝 Uso: `!config-nomebot [nome]`');

        try {
            // Altera o apelido do bot no servidor (não o username global)
            await message.guild.members.me.setNickname(nome);
            return message.reply(`✅ Nome do bot alterado para **${nome}** neste servidor.`);
        } catch (err) {
            console.error('[NOMEBOT]', err.message);
            return message.reply('❌ Não foi possível alterar o nome. Verifique as permissões do bot.');
        }
    }
};
