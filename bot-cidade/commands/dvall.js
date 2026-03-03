/**
 * commands/dvall.js — !dvall
 * Envia uma requisição HTTP para o endpoint /dvall do FiveM (ext-logs),
 * que deleta todos os veículos vazios do servidor.
 * O IP é lido dinamicamente do config.json.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: 'dvall',
    async execute(message, args, client) {
        const cfg = getConfig();
        const isStaff = cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!isStaff && !isAdmin) return message.reply('❌ Sem permissão.');

        if (!cfg.fivem_ip) {
            return message.reply('⚠️ IP do FiveM não configurado. Use `!config setip [IP]` primeiro.');
        }

        const msg = await message.reply('🚗 Enviando ordem de limpeza de veículos ao servidor...');

        try {
            const { data } = await axios.post(`http://${cfg.fivem_ip}/dvall`, {}, { timeout: 5000 });
            const embed = new EmbedBuilder()
                .setColor('#00FFFF')
                .setTitle('🚗 Limpeza de Veículos Executada')
                .addFields(
                    { name: 'Veículos deletados', value: `**${data.deletados ?? '?'}**`, inline: true },
                    { name: 'Executado por', value: `${message.author}`, inline: true }
                ).setTimestamp();
            await msg.edit({ content: '', embeds: [embed] });
        } catch (err) {
            console.error('[DVALL]', err.message);
            await msg.edit('❌ Não foi possível contactar o servidor FiveM. Verifique o IP e se o resource `discord-logs` está ativo.');
        }
    }
};
