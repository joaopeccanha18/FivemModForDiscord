require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// ============================================================
// CLIENTE DISCORD
// ============================================================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

client.commands = new Collection();

// ============================================================
// POOL DE BD MySQL — com fallback gracioso
// ============================================================
(async () => {
    try {
        client.db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        const conn = await client.db.getConnection();
        conn.release();
        console.log('[DB] ✅ Pool MySQL conectada com sucesso.');
    } catch (err) {
        console.error('[DB] ❌ Falha ao conectar ao MySQL:', err.message);
        console.warn('[DB] ⚠️  Comandos de BD vão falhar até a conexão ser restabelecida.');
    }
})();

// ============================================================
// CARREGAMENTO RECURSIVO DE COMANDOS (suporta subpastas)
// /commands/config, /commands/moderation, /commands/discord
// ============================================================
function loadCommandsFromDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            loadCommandsFromDir(path.join(dir, entry.name));
        } else if (entry.name.endsWith('.js')) {
            const cmd = require(path.join(dir, entry.name));
            if (cmd.name && cmd.execute) {
                client.commands.set(cmd.name, cmd);
                console.log(`[CMD] Carregado: ${cmd.name}`);
            }
        }
    }
}

loadCommandsFromDir(path.join(__dirname, 'commands'));

// ============================================================
// CARREGAMENTO DE EVENTOS
// ============================================================
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
        const evt = require(path.join(eventsPath, file));
        evt.once
            ? client.once(evt.name, (...args) => evt.execute(...args, client))
            : client.on(evt.name, (...args) => evt.execute(...args, client));
        console.log(`[EVT] Registrado: ${evt.name}`);
    }
}

client.login(process.env.TOKEN);
