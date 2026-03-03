/**
 * commands/discord/ajuda.js — !ajuda
 * Exibe todos os comandos organizados por categoria em um menu de embeds.
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
            .setDescription(`Prefixo atual: \`${p}\``)
            .addFields(
                {
                    name: '⚙️ Configuração do Bot (Admin)',
                    value: [
                        `\`${p}config ver\` — Ver todas as configurações`,
                        `\`${p}config setip\` — Definir IP do FiveM`,
                        `\`${p}config setstaff\` — Definir cargo de Staff`,
                        `\`${p}config [whitelist/entrada/saida/...]\` — Definir canais`,
                        `\`${p}config-prefixo\` — Mudar prefixo`,
                        `\`${p}config-statusbot\` — Configurar status do bot`,
                        `\`${p}config-nomebot\` — Mudar nome do bot`,
                        `\`${p}config-avatarbot\` — Mudar avatar do bot`,
                        `\`${p}config-autorole\` — Definir cargo ao entrar`,
                    ].join('\n')
                },
                {
                    name: '🛠️ Moderação FiveM (Staff)',
                    value: [
                        `\`${p}liberar [ID]\` — Aprovar whitelist manualmente`,
                        `\`${p}ban [ID] [motivo]\` — Banir no BD da cidade`,
                        `\`${p}kick [ID] [motivo]\` — Kick no BD da cidade`,
                        `\`${p}warn [ID] [motivo]\` — Advertência no BD`,
                        `\`${p}dvall\` — Limpar veículos vazios in-game`,
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
                    name: '📊 Informações & Utilitários',
                    value: [
                        `\`${p}ip\` — Ver IP e players do servidor FiveM`,
                        `\`${p}ping\` — Latência do bot`,
                        `\`${p}serverinfo\` — Informações do servidor`,
                        `\`${p}servericon\` — Ícone do servidor`,
                        `\`${p}serverbanner\` — Banner do servidor`,
                        `\`${p}userinfo [@user]\` — Info de um usuário`,
                        `\`${p}sugerir [texto]\` — Enviar sugestão`,
                    ].join('\n')
                }
            )
            .setFooter({ text: `${message.guild.name} • Bot Cidade`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
