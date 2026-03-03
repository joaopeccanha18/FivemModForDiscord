/**
 * commands/config/statusbot.js — !config-statusbot [modo] [tipo] [texto]
 * Modos: auto (players FiveM) | manual (texto livre)
 * Tipos: PLAYING | WATCHING | LISTENING | COMPETING
 */
const { PermissionsBitField, ActivityType } = require('discord.js');
const { saveConfig } = require('../../utils/configManager');

module.exports = {
    name: 'config-statusbot',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const modo = args[0]?.toLowerCase();
        if (!modo) return message.reply('📝 Uso: `!config-statusbot auto` ou `!config-statusbot manual [PLAYING/WATCHING] [texto]`');

        if (modo === 'auto') {
            saveConfig({ status_mode: 'auto' });
            return message.reply('✅ Status voltou ao modo automático (players do FiveM).');
        }

        if (modo === 'manual') {
            const tipoArg = args[1]?.toUpperCase();
            const texto = args.slice(2).join(' ');
            const tipos = ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'];
            if (!tipos.includes(tipoArg) || !texto)
                return message.reply(`📝 Uso: \`!config-statusbot manual [${tipos.join('/')}] [texto]\``);

            saveConfig({ status_mode: 'manual', status_tipo: tipoArg, status_texto: texto });
            // Aplica imediatamente
            client.user.setPresence({
                activities: [{ name: texto, type: ActivityType[tipoArg] }],
                status: 'online'
            });
            return message.reply(`✅ Status definido para **${tipoArg}** \`${texto}\`.`);
        }

        return message.reply('❌ Modo inválido. Use `auto` ou `manual`.');
    }
};
