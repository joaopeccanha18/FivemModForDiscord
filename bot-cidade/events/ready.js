/**
 * events/ready.js
 * Inicia o loop de status e suporta dois modos: 'auto' (players FiveM) e 'manual'.
 * Também mantém uma embed fixa no canal de status configurado, atualizada a cada 60s.
 */
const { Events, ActivityType, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getConfig, saveConfig } = require('../utils/configManager');

const TIPOS = {
    PLAYING: ActivityType.Playing,
    WATCHING: ActivityType.Watching,
    LISTENING: ActivityType.Listening,
    COMPETING: ActivityType.Competing
};

/**
 * Cria ou edita a embed fixa de status no canal configurado.
 */
async function updateStatusEmbed(client, playerCount, online) {
    const cfg = getConfig();
    const canalId = cfg.canais?.status;
    if (!canalId) return; // canal não configurado, ignora

    const canal = client.channels.cache.get(canalId);
    if (!canal) return;

    const embed = new EmbedBuilder()
        .setTitle('🏙️ Status do Servidor')
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
            // Tenta editar a mensagem existente
            try {
                const msg = await canal.messages.fetch(msgId);
                await msg.edit({ embeds: [embed] });
                return;
            } catch {
                // Mensagem não encontrada — cria uma nova abaixo
            }
        }

        // Apaga mensagens antigas do bot no canal para manter limpo
        const msgs = await canal.messages.fetch({ limit: 10 });
        const botMsgs = msgs.filter(m => m.author.id === client.user.id);
        for (const m of botMsgs.values()) await m.delete().catch(() => { });

        // Envia nova embed e salva o ID no config
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
            const modo = cfg.status_mode || 'auto';

            // MODO MANUAL: usa o texto e tipo configurados via !config statusbot
            if (modo === 'manual' && cfg.status_texto) {
                const tipo = TIPOS[cfg.status_tipo] ?? ActivityType.Playing;
                client.user.setPresence({ activities: [{ name: cfg.status_texto, type: tipo }], status: 'online' });
                await updateStatusEmbed(client, 0, true);
                return;
            }

            // MODO AUTO: consulta players.json do FiveM
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
