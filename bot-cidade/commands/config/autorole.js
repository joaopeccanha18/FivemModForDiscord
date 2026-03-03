/**
 * commands/config/autorole.js — !config-autorole [@cargo]
 * Define o cargo que será dado automaticamente a novos membros.
 */
const { PermissionsBitField } = require('discord.js');
const { saveConfig } = require('../../utils/configManager');

module.exports = {
    name: 'config-autorole',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const cargoId = args[0]?.replace(/[<@&>]/g, '');
        if (!cargoId || isNaN(cargoId)) return message.reply('📝 Uso: `!config-autorole [@cargo]`');

        const role = message.guild.roles.cache.get(cargoId);
        if (!role) return message.reply('❌ Cargo não encontrado neste servidor.');

        saveConfig({ autorole: cargoId });
        return message.reply(`✅ Autorole definido para <@&${cargoId}>. Novos membros receberão este cargo ao entrar.`);
    }
};
