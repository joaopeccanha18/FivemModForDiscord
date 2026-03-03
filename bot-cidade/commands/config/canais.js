/**
 * commands/config/canais.js — !config
 * Comando unificado para configurar o bot.
 *
 * Subcomandos:
 *   !config ver
 *   !config setip [IP:PORTA]
 *   !config setstaff [@cargo]
 *   !config setticketrole [@cargo]
 *   !config [whitelist/estatistica/combate/admin/bau/ticket/status/logs/logswl/logsticket/logsbau/logscombate] [#canal]
 *   !config categoria [ID_Categoria]
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig, saveConfig } = require('../../utils/configManager');

const CANAL_MAP = {
    whitelist: 'whitelist',
    estatistica: 'estatisticas',
    combate: 'logs_combate',
    admin: 'logs_admin',
    bau: 'logs_bau',
    ticket: 'tickets',
    categoria: 'ticket_categoria',
    status: 'status',
    logs: 'logs',
    logswl: 'logs_wl',
    logsticket: 'logs_tickets',
    logsbau: 'logs_bau',
    logscombate: 'logs_combate'
};

module.exports = {
    name: 'config',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const sub = args[0]?.toLowerCase();

        // ── !config ver ──────────────────────────────────────────────
        if (!sub || sub === 'ver') {
            const cfg = getConfig();
            const ch = cfg.canais || {};
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('⚙️ Configuração Atual do Bot')
                .addFields(
                    { name: '🌐 IP FiveM', value: cfg.fivem_ip || '`não definido`', inline: true },
                    { name: '👮 Cargo Staff', value: cfg.cargo_staff ? `<@&${cfg.cargo_staff}>` : '`não definido`', inline: true },
                    { name: '🎫 Cargo Ticket', value: cfg.cargo_ticket ? `<@&${cfg.cargo_ticket}>` : '`não definido`', inline: true },
                    { name: '🔑 Canal WL', value: ch.whitelist ? `<#${ch.whitelist}>` : '`não definido`', inline: true },
                    { name: '📊 Canal Estatísticas', value: ch.estatisticas ? `<#${ch.estatisticas}>` : '`não definido`', inline: true },
                    { name: '📺 Canal Status', value: ch.status ? `<#${ch.status}>` : '`não definido`', inline: true },
                    { name: '⚔️ Logs Combate', value: ch.logs_combate ? `<#${ch.logs_combate}>` : '`não definido`', inline: true },
                    { name: '🛡️ Logs Admin', value: ch.logs_admin ? `<#${ch.logs_admin}>` : '`não definido`', inline: true },
                    { name: '🗃️ Logs Baús', value: ch.logs_bau ? `<#${ch.logs_bau}>` : '`não definido`', inline: true },
                    { name: '✅ Logs WL', value: ch.logs_wl ? `<#${ch.logs_wl}>` : '`não definido`', inline: true },
                    { name: '🎫 Logs Tickets', value: ch.logs_tickets ? `<#${ch.logs_tickets}>` : '`não definido`', inline: true },
                    { name: '🛡️ Logs Moderação', value: ch.logs ? `<#${ch.logs}>` : '`não definido`', inline: true },
                    { name: '🎫 Canal Tickets', value: ch.tickets ? `<#${ch.tickets}>` : '`não definido`', inline: true },
                    { name: '📁 Categoria Tickets', value: ch.ticket_categoria ? `\`${ch.ticket_categoria}\`` : '`não definido`', inline: true }
                )
                .setFooter({ text: 'Use !config [sub] para alterar' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // ── !config setip ────────────────────────────────────────────
        if (sub === 'setip') {
            const ip = args[1];
            if (!ip) return message.reply('📝 Uso: `!config setip [IP:PORTA]`');
            saveConfig({ fivem_ip: ip });
            return message.reply(`✅ IP definido para \`${ip}\`.`);
        }

        // ── !config setstaff ─────────────────────────────────────────
        if (sub === 'setstaff') {
            const id = args[1]?.replace(/[<@&>]/g, '');
            if (!id || isNaN(id)) return message.reply('📝 Uso: `!config setstaff [@cargo]`');
            saveConfig({ cargo_staff: id });
            return message.reply(`✅ Cargo de **Staff Geral** definido: <@&${id}>.`);
        }

        // ── !config setticketrole ────────────────────────────────────
        if (sub === 'setticketrole') {
            const id = args[1]?.replace(/[<@&>]/g, '');
            if (!id || isNaN(id)) return message.reply('📝 Uso: `!config setticketrole [@cargo]`');
            saveConfig({ cargo_ticket: id });
            return message.reply(`✅ Cargo de **Atendimento (Tickets)** definido: <@&${id}>.`);
        }

        // ── !config [tipo_canal] [#canal ou ID] ──────────────────────
        if (CANAL_MAP[sub]) {
            const canalId = args[1]?.replace(/[<#>]/g, '');
            if (!canalId || isNaN(canalId)) return message.reply(`📝 Uso: \`!config ${sub} [#canal]\``);
            saveConfig({ canais: { [CANAL_MAP[sub]]: canalId } });
            return message.reply(`✅ **${sub}** configurado para <#${canalId}>. Ativo imediatamente!`);
        }

        return message.reply('❓ Subcomando inválido. Use `!config ver` para ver todas as opções.');
    }
};
