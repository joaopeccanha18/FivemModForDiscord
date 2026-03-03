/**
 * commands/config/canais.js — !config
 * Comando unificado para configurar TUDO do bot.
 * 
 * Subcomandos:
 *   !config setip [IP:PORTA]
 *   !config setstaff [@cargo]
 *   !config [whitelist/entrada/saida/sugerir/estatistica/combate/admin/bau/ticket] [#canal]
 *   !config categoria [ID_Categoria]
 *   !config prefixo [símbolo]
 *   !config statusbot [auto / manual TIPO texto]
 *   !config nomebot [nome]
 *   !config avatarbot [url]
 *   !config autorole [@cargo]
 *   !config ver
 */
const { PermissionsBitField, EmbedBuilder, ActivityType } = require('discord.js');
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
    ticket: 'tickets',
    categoria: 'ticket_categoria',
    status: 'status'
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
                    { name: '🗃️ Canal Baús', value: ch.logs_bau ? `<#${ch.logs_bau}>` : '`não definido`', inline: true },
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

        // ── !config prefixo ──────────────────────────────────────────
        if (sub === 'prefixo') {
            const novo = args[1];
            if (!novo || novo.length > 3) return message.reply('📝 Uso: `!config prefixo [símbolo]`  — Ex: `!config prefixo .`');
            saveConfig({ prefix: novo });
            return message.reply(`✅ Prefixo alterado para \`${novo}\`. Use \`${novo}ajuda\` a partir de agora!`);
        }

        // ── !config statusbot ────────────────────────────────────────
        if (sub === 'statusbot') {
            const modo = args[1]?.toLowerCase();
            if (!modo) return message.reply('📝 Uso: `!config statusbot auto` ou `!config statusbot manual [PLAYING/WATCHING] [texto]`');

            if (modo === 'auto') {
                saveConfig({ status_mode: 'auto' });
                return message.reply('✅ Status voltou ao modo automático (players do FiveM).');
            }

            if (modo === 'manual') {
                const tipoArg = args[2]?.toUpperCase();
                const texto = args.slice(3).join(' ');
                const tipos = ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'];
                if (!tipos.includes(tipoArg) || !texto)
                    return message.reply(`📝 Uso: \`!config statusbot manual [${tipos.join('/')}] [texto]\``);

                saveConfig({ status_mode: 'manual', status_tipo: tipoArg, status_texto: texto });
                client.user.setPresence({
                    activities: [{ name: texto, type: ActivityType[tipoArg] }],
                    status: 'online'
                });
                return message.reply(`✅ Status definido para **${tipoArg}** \`${texto}\`.`);
            }
            return message.reply('❌ Modo inválido. Use `auto` ou `manual`.');
        }

        // ── !config nomebot ──────────────────────────────────────────
        if (sub === 'nomebot') {
            const nome = args.slice(1).join(' ');
            if (!nome) return message.reply('📝 Uso: `!config nomebot [nome]`');
            try {
                await message.guild.members.me.setNickname(nome);
                return message.reply(`✅ Nome do bot alterado para **${nome}** neste servidor.`);
            } catch {
                return message.reply('❌ Não foi possível alterar o nome. Verifique as permissões do bot.');
            }
        }

        // ── !config avatarbot ────────────────────────────────────────
        if (sub === 'avatarbot') {
            const url = args[1];
            if (!url || !url.startsWith('http')) return message.reply('📝 Uso: `!config avatarbot [URL da imagem]`');
            try {
                await client.user.setAvatar(url);
                return message.reply('✅ Avatar do bot atualizado com sucesso!');
            } catch {
                return message.reply('❌ Falha ao atualizar o avatar (limite de 2 alterações por hora ou URL inválida).');
            }
        }

        // ── !config autorole ─────────────────────────────────────────
        if (sub === 'autorole') {
            const cargoId = args[1]?.replace(/[<@&>]/g, '');
            if (!cargoId || isNaN(cargoId)) return message.reply('📝 Uso: `!config autorole [@cargo]`');
            const role = message.guild.roles.cache.get(cargoId);
            if (!role) return message.reply('❌ Cargo não encontrado neste servidor.');
            saveConfig({ autorole: cargoId });
            return message.reply(`✅ Autorole definido para <@&${cargoId}>. Novos membros receberão este cargo ao entrar.`);
        }

        // ── !config [tipo_canal] [#canal] ────────────────────────────
        if (CANAL_MAP[sub]) {
            const canalId = args[1]?.replace(/[<#>]/g, '');
            if (!canalId || isNaN(canalId)) return message.reply(`📝 Uso: \`!config ${sub} [#canal]\``);
            saveConfig({ canais: { [CANAL_MAP[sub]]: canalId } });
            return message.reply(`✅ Canal/Categoria de **${sub}** definido para <#${canalId}> / \`${canalId}\`. Ativo imediatamente!`);
        }

        return message.reply('❓ Subcomando inválido. Use `!config ver` para ver todas as opções.');
    }
};
