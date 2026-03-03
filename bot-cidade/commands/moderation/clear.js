/**
 * commands/moderation/clear.js — !clear [quantidade]
 * Apaga N mensagens do canal (máximo 100, apenas mensagens com menos de 14 dias).
 */
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
            return message.reply('❌ Você precisa da permissão **Gerenciar Mensagens**.');

        const qtd = parseInt(args[0]);
        if (isNaN(qtd) || qtd < 1 || qtd > 100)
            return message.reply('📝 Uso: `!clear [1-100]`');

        try {
            await message.delete();
            const deletadas = await message.channel.bulkDelete(qtd, true); // true = ignora >14 dias
            const aviso = await message.channel.send(`🗑️ **${deletadas.size}** mensagens apagadas.`);
            setTimeout(() => aviso.delete().catch(() => { }), 4_000);
        } catch (err) {
            console.error('[CLEAR]', err.message);
            message.channel.send('❌ Erro ao apagar mensagens. Verifique as permissões do bot.');
        }
    }
};
