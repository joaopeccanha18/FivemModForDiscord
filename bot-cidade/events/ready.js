/**
 * events/ready.js
 * Inicia o loop de status e suporta dois modos: 'auto' (players FiveM) e 'manual'.
 */
const { Events, ActivityType } = require('discord.js');
const axios = require('axios');
const { getConfig } = require('../utils/configManager');

const TIPOS = {
    PLAYING: ActivityType.Playing,
    WATCHING: ActivityType.Watching,
    LISTENING: ActivityType.Listening,
    COMPETING: ActivityType.Competing
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[BOT] ✅ Online como ${client.user.tag}`);

        const updateStatus = async () => {
            const cfg = getConfig();
            const modo = cfg.status_mode || 'auto';

            // MODO MANUAL: usa o texto e tipo configurados via !config-statusbot
            if (modo === 'manual' && cfg.status_texto) {
                const tipo = TIPOS[cfg.status_tipo] ?? ActivityType.Playing;
                client.user.setPresence({ activities: [{ name: cfg.status_texto, type: tipo }], status: 'online' });
                return;
            }

            // MODO AUTO: consulta players.json do FiveM
            if (!cfg.fivem_ip) {
                client.user.setPresence({
                    activities: [{ name: 'Use !config-statusbot para configurar', type: ActivityType.Watching }],
                    status: 'idle'
                });
                return;
            }

            try {
                const { data } = await axios.get(`http://${cfg.fivem_ip}/players.json`, { timeout: 4000 });
                client.user.setPresence({
                    activities: [{ name: `${data.length} jogadores na cidade 🏙️`, type: ActivityType.Playing }],
                    status: 'online'
                });
            } catch {
                client.user.setPresence({
                    activities: [{ name: 'Servidor Offline 🔴', type: ActivityType.Watching }],
                    status: 'dnd'
                });
            }
        };

        updateStatus();
        setInterval(updateStatus, 60_000);
    }
};
