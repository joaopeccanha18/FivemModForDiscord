/**
 * events/guildMemberRemove.js
 * - Envia mensagem de saída no canal configurado.
 */
const { Events, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member, client) {
        const cfg = getConfig();
        if (!cfg.canais?.saida) return;

        const canal = member.guild.channels.cache.get(cfg.canais.saida);
        if (!canal) return;

        const texto = (cfg.mensagem_saida || '{user} saiu do servidor. 👋')
            .replace('{user}', member.user.tag)
            .replace('{servidor}', member.guild.name);

        const embed = new EmbedBuilder()
            .setColor('#FF4444')
            .setTitle('📤 Membro Saiu')
            .setDescription(texto)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await canal.send({ embeds: [embed] }).catch(() => { });
    }
};
