/**
 * commands/discord/ping.js — !ping
 * Exibe a latência da API do Discord e do bot.
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    async execute(message, args, client) {
        const enviado = await message.reply('🏓 Calculando...');
        const latency = enviado.createdTimestamp - message.createdTimestamp;
        const apiPing = Math.round(client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor(latency < 200 ? '#00FF7F' : latency < 500 ? '#FFFF00' : '#FF4444')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latência do Bot', value: `\`${latency}ms\``, inline: true },
                { name: 'Latência da API', value: `\`${apiPing}ms\``, inline: true }
            )
            .setTimestamp();

        await enviado.edit({ content: '', embeds: [embed] });
    }
};
