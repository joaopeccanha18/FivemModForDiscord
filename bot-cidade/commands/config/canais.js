/**
 * commands/config/canais.js — !config [canal] [#canal]
 * Comando unificado para configurar todos os canais do bot.
 * Também gerencia: setip, setstaff.
 *
 * Subcomandos:
 *   !config setip [IP:PORTA]
 *   !config setstaff [@cargo]
 *   !config whitelist [#canal]
 *   !config entrada [#canal]
 *   !config saida [#canal]
 *   !config sugerir [#canal]
 *   !config estatistica [#canal]
 *   !config combate [#canal]
 *   !config admin [#canal]
 *   !config bau [#canal]
 *   !config ver
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig, saveConfig } = require('../../utils/configManager');

const CANAL_MAP = {
    whitelist: 'whitelist',
    entrada: 'entrada',
    saida: 'saida',
    sugerir: 'sugestoes',
    estatistica: 'estatisticas',
    combate: 'logs_combate',
    admin: 'logs_admin',
    bau: 'logs_bau',
    ticket: 'tickets'
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
                    { name: '🔤 Prefixo', value: `\`${cfg.prefix || '!'}\``, inline: true },
                    { name: '🤖 Modo Status', value: `\`${cfg.status_mode || 'auto'}\``, inline: true },
                    { name: '👮 Cargo Staff', value: cfg.cargo_staff ? `<@&${cfg.cargo_staff}>` : '`não definido`', inline: true },
                    { name: '🎭 Autorole', value: cfg.autorole ? `<@&${cfg.autorole}>` : '`não definido`', inline: true },
                    { name: '🔑 Canal WL', value: ch.whitelist ? `<#${ch.whitelist}>` : '`não definido`', inline: true },
                    { name: '👋 Canal Entrada', value: ch.entrada ? `<#${ch.entrada}>` : '`não definido`', inline: true },
                    { name: '👋 Canal Saída', value: ch.saida ? `<#${ch.saida}>` : '`não definido`', inline: true },
                    { name: '💡 Canal Sugestões', value: ch.sugestoes ? `<#${ch.sugestoes}>` : '`não definido`', inline: true },
                    { name: '📊 Canal Estatísticas', value: ch.estatisticas ? `<#${ch.estatisticas}>` : '`não definido`', inline: true },
                    { name: '⚔️ Canal Combate', value: ch.logs_combate ? `<#${ch.logs_combate}>` : '`não definido`', inline: true },
                    { name: '🛡️ Canal Admin', value: ch.logs_admin ? `<#${ch.logs_admin}>` : '`não definido`', inline: true },
                    { name: '🗃️ Canal Baús', value: ch.logs_bau ? `<#${ch.logs_bau}>` : '`não definido`', inline: true }
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
            return message.reply(`✅ Cargo de Staff definido: <@&${id}>.`);
        }

        // ── !config [tipo_canal] [#canal] ────────────────────────────
        if (CANAL_MAP[sub]) {
            const canalId = args[1]?.replace(/[<#>]/g, '');
            if (!canalId || isNaN(canalId)) return message.reply(`📝 Uso: \`!config ${sub} [#canal]\``);
            saveConfig({ canais: { [CANAL_MAP[sub]]: canalId } });
            return message.reply(`✅ Canal de **${sub}** definido para <#${canalId}>. Ativo imediatamente!`);
        }

        return message.reply('❓ Subcomando inválido. Use `!config ver` para ver todas as opções.');
    }
};
