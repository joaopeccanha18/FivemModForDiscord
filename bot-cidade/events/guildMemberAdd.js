/**
 * events/guildMemberAdd.js
 * - Aplica o cargo de autorole ao novo membro.
 * - Envia mensagem de boas-vindas no canal de entrada configurado.
 */
const { Events, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        const cfg = getConfig();

        // ── AUTOROLE ──────────────────────────────────────────────────
        if (cfg.autorole) {
            const role = member.guild.roles.cache.get(cfg.autorole);
            if (role) {
                await member.roles.add(role).catch(err =>
                    console.error('[AUTOROLE] Falha ao adicionar cargo:', err.message)
                );
            }
        }

        // ── MENSAGEM DE BOAS-VINDAS ───────────────────────────────────
        if (cfg.canais?.entrada) {
            const canal = member.guild.channels.cache.get(cfg.canais.entrada);
            if (canal) {
                const texto = (cfg.mensagem_entrada || 'Bem-vindo(a), {user}!')
                    .replace('{user}', `${member}`)
                    .replace('{servidor}', member.guild.name)
                    .replace('{membros}', member.guild.memberCount);

                const embed = new EmbedBuilder()
                    .setColor('#00FF7F')
                    .setTitle('👋 Novo Membro!')
                    .setDescription(texto)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: `Membro #${member.guild.memberCount}` })
                    .setTimestamp();

                await canal.send({ embeds: [embed] }).catch(err =>
                    console.error('[ENTRADA] Falha ao enviar boas-vindas:', err.message)
                );
            }
        }
    }
};
