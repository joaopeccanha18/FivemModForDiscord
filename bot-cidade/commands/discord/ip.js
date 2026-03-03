/**
 * commands/discord/ip.js — !ip
 * Mostra o IP do servidor FiveM e a quantidade de jogadores online.
 */
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getConfig } = require('../../utils/configManager');

module.exports = {
    name: 'ip',
    async execute(message) {
        const cfg = getConfig();
        if (!cfg.fivem_ip) return message.reply('⚠️ IP do servidor não configurado. Use `!config setip [IP]`.');

        try {
            const { data } = await axios.get(`http://${cfg.fivem_ip}/players.json`, { timeout: 5000 });
            const embed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('🎮 Servidor FiveM')
                .addFields(
                    { name: '🌐 IP de Conexão', value: `\`${cfg.fivem_ip}\``, inline: true },
                    { name: '👥 Online', value: `**${data.length}**`, inline: true }
                )
                .setFooter({ text: 'Clique em "Conectar" no cliente FiveM e cole o IP.' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } catch {
            return message.reply(`❌ Não foi possível contactar o servidor. Tente entrar direto: \`${cfg.fivem_ip}\``);
        }
    }
};
