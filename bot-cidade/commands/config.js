/**
 * commands/config.js — !config
 * Permite que Administradores configurem o bot sem tocar em código ou reiniciar.
 *
 * Subcomandos:
 *   !config setip [IP:PORTA]
 *   !config setcanal wl [ID]
 *   !config setcanal combate [ID]
 *   !config setcanal admin [ID]
 *   !config setcanal bau [ID]
 *   !config setstaff [ID_CARGO]
 *   !config ver
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig, saveConfig } = require('../utils/configManager');

// Mapa de apelidos de canal para a chave exata no config.json
const CANAL_MAP = {
    wl: 'whitelist',
    combate: 'logs_combate',
    admin: 'logs_admin',
    bau: 'logs_bau'
};

module.exports = {
    name: 'config',
    async execute(message, args, client) {
        // Somente Administradores podem usar !config
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Apenas **Administradores** podem usar `!config`.');
        }

        const sub = args[0]?.toLowerCase();

        // ── !config ver ──────────────────────────────────────────────
        if (sub === 'ver' || !sub) {
            const cfg = getConfig();
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('⚙️ Configuração Atual do Bot')
                .addFields(
                    { name: '🌐 IP do FiveM', value: cfg.fivem_ip || '`não definido`', inline: false },
                    { name: '🔑 Canal de Whitelist', value: cfg.canais?.whitelist ? `<#${cfg.canais.whitelist}>` : '`não definido`', inline: true },
                    { name: '⚔️ Canal de Combate', value: cfg.canais?.logs_combate ? `<#${cfg.canais.logs_combate}>` : '`não definido`', inline: true },
                    { name: '🛡️ Canal de Admin', value: cfg.canais?.logs_admin ? `<#${cfg.canais.logs_admin}>` : '`não definido`', inline: true },
                    { name: '🎁 Canal de Baús', value: cfg.canais?.logs_bau ? `<#${cfg.canais.logs_bau}>` : '`não definido`', inline: true },
                    { name: '👮 Cargo de Staff', value: cfg.cargo_staff ? `<@&${cfg.cargo_staff}>` : '`não definido`', inline: true }
                )
                .setFooter({ text: 'Use !config [subcomando] para alterar' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // ── !config setip [IP:PORTA] ─────────────────────────────────
        if (sub === 'setip') {
            const ip = args[1];
            if (!ip) return message.reply('📝 Uso: `!config setip [IP:PORTA]`  — Ex: `!config setip 45.123.45.6:30120`');

            const ok = saveConfig({ fivem_ip: ip });
            return message.reply(ok
                ? `✅ IP do FiveM definido para \`${ip}\`. O status do bot atualizará no próximo ciclo (60s).`
                : '❌ Falha ao salvar config.json. Verifique o console.'
            );
        }

        // ── !config setcanal [tipo] [ID] ─────────────────────────────
        if (sub === 'setcanal') {
            const tipo = args[1]?.toLowerCase();
            const canalId = args[2]?.replace(/[<#>]/g, ''); // aceita tanto ID puro quanto mention #canal

            if (!tipo || !CANAL_MAP[tipo]) {
                return message.reply(
                    '📝 Uso: `!config setcanal [tipo] [ID]`\n' +
                    'Tipos disponíveis: `wl`, `combate`, `admin`, `bau`'
                );
            }
            if (!canalId || isNaN(canalId)) {
                return message.reply('📝 Informe um ID de canal válido. Ex: `!config setcanal wl 1234567890`');
            }

            const chave = CANAL_MAP[tipo];
            const ok = saveConfig({ canais: { [chave]: canalId } });

            return message.reply(ok
                ? `✅ Canal de **${tipo}** definido para <#${canalId}>. Ativo imediatamente!`
                : '❌ Falha ao salvar config.json. Verifique o console.'
            );
        }

        // ── !config setstaff [ID_CARGO] ──────────────────────────────
        if (sub === 'setstaff') {
            const cargoId = args[1]?.replace(/[<@&>]/g, ''); // aceita mention @&cargo ou ID puro
            if (!cargoId || isNaN(cargoId)) {
                return message.reply('📝 Uso: `!config setstaff [ID_CARGO]`  — Ex: `!config setstaff 987654321`');
            }

            const ok = saveConfig({ cargo_staff: cargoId });
            return message.reply(ok
                ? `✅ Cargo de Staff definido para <@&${cargoId}>. Ativo imediatamente!`
                : '❌ Falha ao salvar config.json. Verifique o console.'
            );
        }

        // Subcomando desconhecido
        return message.reply(
            '❓ Subcomando inválido. Opções: `ver`, `setip`, `setcanal`, `setstaff`\n' +
            'Ex: `!config setip 127.0.0.1:30120`'
        );
    }
};
