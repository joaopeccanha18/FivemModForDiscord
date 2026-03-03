/**
 * events/ready.js
 * Inicia o loop de status automático FiveM e mantém a embed fixa de status.
 */
const { Events, ActivityType, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getConfig, saveConfig } = require('../utils/configManager');

async function updateStatusEmbed(client, playerCount, online) {
    const cfg = getConfig();
    const canalId = cfg.canais?.status;
    if (!canalId) return;

    const canal = client.channels.cache.get(canalId);
    if (!canal) return;

    const embed = new EmbedBuilder()
        .setTitle('🏙️ Status da Cidade')
        .setColor(online ? '#00FF7F' : '#FF4444')
        .addFields(
            { name: '🟢 Status', value: online ? 'Online' : '🔴 Offline', inline: true },
            { name: '👥 Jogadores', value: online ? `${playerCount} conectados` : '—', inline: true },
            { name: '🌐 IP', value: cfg.fivem_ip || '`não configurado`', inline: true }
        )
        .setFooter({ text: 'Atualizado automaticamente a cada 60s' })
        .setTimestamp();

    try {
        const msgId = cfg.canais?.status_message_id;
        if (msgId) {
            try {
                const msg = await canal.messages.fetch(msgId);
                await msg.edit({ embeds: [embed] });
                return;
            } catch { /* mensagem não encontrada — cria nova */ }
        }

        const msgs = await canal.messages.fetch({ limit: 10 });
        const botMsgs = msgs.filter(m => m.author.id === client.user.id);
        for (const m of botMsgs.values()) await m.delete().catch(() => { });

        const novaMsg = await canal.send({ embeds: [embed] });
        saveConfig({ canais: { status_message_id: novaMsg.id } });
    } catch (err) {
        console.error('[STATUS EMBED] Erro:', err.message);
    }
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[BOT] ✅ Online como ${client.user.tag}`);

        const updateStatus = async () => {
            const cfg = getConfig();

            if (!cfg.fivem_ip) {
                client.user.setPresence({
                    activities: [{ name: 'Use !config setip para configurar', type: ActivityType.Watching }],
                    status: 'idle'
                });
                return;
            }

            try {
                const { data } = await axios.get(`http://${cfg.fivem_ip}/players.json`, { timeout: 4000 });
                const count = data.length;
                client.user.setPresence({
                    activities: [{ name: `${count} jogadores na cidade 🏙️`, type: ActivityType.Playing }],
                    status: 'online'
                });
                await updateStatusEmbed(client, count, true);
            } catch {
                client.user.setPresence({
                    activities: [{ name: 'Servidor Offline 🔴', type: ActivityType.Watching }],
                    status: 'dnd'
                });
                await updateStatusEmbed(client, 0, false);
            }
        };

        updateStatus();
        setInterval(updateStatus, 60_000);
    }
};
