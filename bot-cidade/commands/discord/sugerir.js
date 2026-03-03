/**
 * commands/discord/sugerir.js — !sugerir [texto]
 * Envia uma sugestão para o canal configurado com reactions de votação.
 */
const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../utils/configManager');

module.exports = {
    name: 'sugerir',
    async execute(message, args) {
        const cfg = getConfig();
        const canalId = cfg.canais?.sugestoes;
        if (!canalId) return message.reply('⚙️ Canal de sugestões não configurado. Use `!config sugerir [#canal]`.');

        const texto = args.join(' ');
        if (!texto) return message.reply('📝 Uso: `!sugerir [sua sugestão]`');

        const canal = message.guild.channels.cache.get(canalId);
        if (!canal) return message.reply('❌ Canal de sugestões não encontrado. Configure novamente.');

        try {
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('💡 Nova Sugestão')
                .setDescription(texto)
                .setFooter({ text: `Enviado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            const msg = await canal.send({ embeds: [embed] });
            await msg.react('👍');
            await msg.react('👎');

            await message.reply(`✅ Sua sugestão foi enviada para ${canal}!`);
            await message.delete().catch(() => { });
        } catch (err) {
            console.error('[SUGERIR]', err.message);
            message.reply('❌ Falha ao enviar a sugestão.');
        }
    }
};
