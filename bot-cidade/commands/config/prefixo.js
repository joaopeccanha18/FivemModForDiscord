/**
 * commands/config/prefixo.js — !config-prefixo [símbolo]
 * Altera o prefixo do bot dinamicamente.
 */
const { PermissionsBitField } = require('discord.js');
const { saveConfig } = require('../../utils/configManager');

module.exports = {
    name: 'config-prefixo',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const novo = args[0];
        if (!novo || novo.length > 3) return message.reply('📝 Uso: `!config-prefixo [símbolo]`  — Ex: `!config-prefixo .`');

        saveConfig({ prefix: novo });
        return message.reply(`✅ Prefixo alterado para \`${novo}\`. Use \`${novo}ajuda\` a partir de agora!`);
    }
};
