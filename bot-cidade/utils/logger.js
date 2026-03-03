/**
 * utils/logger.js
 * Sistema de logs por funcionalidade — cada tipo vai para um canal específico.
 *
 * Mapeamento de tipos para chaves do config.json:
 *   WL      → canais.logs_wl      (logs de whitelist aprovada)
 *   TICKET  → canais.logs_tickets (logs de tickets abertos/fechados)
 *   BAU     → canais.logs_bau     (logs de baús — também usado pelo resource FiveM)
 *   COMBATE → canais.logs_combate (logs de combate — também usado pelo resource FiveM)
 *   BAN     → canais.logs         (ações de moderação gerais)
 *   KICK    → canais.logs
 *   UNBAN   → canais.logs
 *   WARN    → canais.logs
 *   CONFIG  → canais.logs
 *   DISCORD → canais.logs
 *
 * Uso: const { sendLog } = require('../utils/logger');
 *      await sendLog(client, { type, title, fields, footer });
 */
const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('./configManager');

const CORES = {
    WL: '#00FF7F', // Verde
    TICKET: '#9B59B6', // Roxo
    BAU: '#E67E22', // Laranja escuro
    COMBATE: '#E74C3C', // Vermelho sangue
    BAN: '#FF0000', // Vermelho
    KICK: '#FFA500', // Laranja
    UNBAN: '#00BFFF', // Azul claro
    WARN: '#FFD700', // Amarelo
    CONFIG: '#5865F2', // Azul Discord
    DISCORD: '#EB459E', // Rosa
};

// Qual chave do config.json cada tipo usa como destino
const CANAL_KEY = {
    WL: 'logs_wl',
    TICKET: 'logs_tickets',
    BAU: 'logs_bau',
    COMBATE: 'logs_combate',
    BAN: 'logs',
    KICK: 'logs',
    UNBAN: 'logs',
    WARN: 'logs',
    CONFIG: 'logs',
    DISCORD: 'logs',
};

/**
 * @param {import('discord.js').Client} client
 * @param {object} opts
 * @param {string} opts.type    - WL | TICKET | BAU | COMBATE | BAN | KICK | UNBAN | WARN | CONFIG | DISCORD
 * @param {string} opts.title   - Título do embed
 * @param {Array}  opts.fields  - Array de { name, value, inline? }
 * @param {string?} opts.footer - Rodapé opcional
 */
async function sendLog(client, { type = 'CONFIG', title, fields = [], footer }) {
    try {
        const cfg = getConfig();
        const key = CANAL_KEY[type] ?? 'logs';
        const canalId = cfg.canais?.[key];
        if (!canalId) return; // Canal não configurado — ignora silenciosamente

        const canal = client.channels.cache.get(canalId);
        if (!canal) return;

        const embed = new EmbedBuilder()
            .setColor(CORES[type] ?? '#99AAB5')
            .setTitle(title)
            .addFields(fields)
            .setTimestamp();

        if (footer) embed.setFooter({ text: footer });

        await canal.send({ embeds: [embed] });
    } catch (err) {
        console.error('[LOGGER] Falha ao enviar log:', err.message);
    }
}

module.exports = { sendLog };
