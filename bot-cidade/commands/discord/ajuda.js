/**
 * commands/discord/ajuda.js — !ajuda
 * Exibe todos os comandos organizados por categoria.
 */
const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../utils/configManager');

module.exports = {
    name: 'ajuda',
    async execute(message) {
        const cfg = getConfig();
        const p = cfg.prefix || '!';

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📋 Lista de Comandos')
            .addFields(
                {
                    name: '⚙️ Configuração (Admin)',
                    value: [
                        `\`${p}config ver\` — Ver todas as configurações`,
                        `\`${p}config setip [IP:PORTA]\` — Definir IP do FiveM`,
                        `\`${p}config setstaff [@cargo]\` — Cargo de Staff`,
                        `\`${p}config setticketrole [@cargo]\` — Cargo de Atendimento`,
                        `\`${p}config whitelist [#canal]\` — Canal de Auto-WL`,
                        `\`${p}config status [#canal]\` — Canal de status fixo`,
                        `\`${p}config logs [#canal]\` — Logs de moderação`,
                        `\`${p}config logswl [#canal]\` — Logs de Whitelist`,
                        `\`${p}config logsticket [#canal]\` — Logs de Tickets`,
                        `\`${p}config logsbau [#canal]\` — Logs de Baús`,
                        `\`${p}config logscombate [#canal]\` — Logs de Combate`,
                        `\`${p}config ticket [#canal]\` — Canal de Tickets`,
                        `\`${p}config categoria [ID]\` — Categoria de Tickets`,
                    ].join('\n')
                },
                {
                    name: '🛠️ Moderação FiveM (Staff)',
                    value: [
                        `\`${p}liberar [ID]\` — Aprovar whitelist manualmente`,
                        `\`${p}ban [ID] [motivo]\` — Banir no BD + RCON`,
                        `\`${p}unban [ID]\` — Remover banimento`,
                        `\`${p}kick [ID] [motivo]\` — Kick no BD + RCON`,
                        `\`${p}warn [ID] [motivo]\` — Advertência no BD`,
                    ].join('\n')
                },
                {
                    name: '🔧 Moderação Discord (Staff)',
                    value: [
                        `\`${p}clear [N]\` — Apagar N mensagens`,
                        `\`${p}lock\` / \`${p}unlock\` — Trancar/destrancar canal`,
                        `\`${p}slowmode [seg]\` — Modo lento`,
                        `\`${p}timeout [@user] [min]\` — Silenciar`,
                        `\`${p}untimeout [@user]\` — Remover silêncio`,
                        `\`${p}dban [@user] [motivo]\` — Banir do Discord`,
                        `\`${p}dkick [@user] [motivo]\` — Expulsar do Discord`,
                        `\`${p}setnick [@user] [apelido]\` — Mudar apelido`,
                    ].join('\n')
                },
                {
                    name: '📣 Ferramentas de Staff',
                    value: [
                        `\`${p}anunciar [#canal] [msg]\` — Fazer anúncio`,
                        `\`${p}embed [título] | [desc]\` — Criar embed`,
                        `\`${p}say [msg]\` — Falar como o bot`,
                        `\`${p}addemoji [nome] [url]\` — Adicionar emoji`,
                        `\`${p}setup\` — Criar painel de tickets`,
                    ].join('\n')
                },
                {
                    name: '📊 Informações',
                    value: [
                        `\`${p}ip\` — IP e jogadores do servidor FiveM`,
                        `\`${p}serverinfo\` — Informações do servidor`,
                        `\`${p}userinfo [@user]\` — Info de um usuário`,
                    ].join('\n')
                }
            )
            .setFooter({ text: `${message.guild.name} • Bot Cidade`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
