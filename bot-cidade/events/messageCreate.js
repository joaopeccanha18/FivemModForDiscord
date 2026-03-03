/**
 * events/messageCreate.js
 * - Auto-WL no canal configurado.
 * - Comandos com prefixo dinâmico lido do config.json.
 */
const { Events } = require('discord.js');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const cfg = getConfig();
        const prefix = cfg.prefix || '!';

        // ── AUTO-WHITELIST ───────────────────────────────────────────
        if (cfg.canais?.whitelist && message.channel.id === cfg.canais.whitelist) {
            const conteudo = message.content.trim();
            if (/^\d+$/.test(conteudo)) {
                const id = conteudo;
                await message.delete().catch(() => { });
                try {
                    const [res] = await client.db.execute('UPDATE vrp_users SET whitelist = 1 WHERE id = ?', [id]);
                    const texto = res.affectedRows > 0
                        ? `✅ **Whitelist Aprovada!** Passaporte \`${id}\` liberado. Bem-vindo(a), ${message.author}!`
                        : `❌ Passaporte \`${id}\` não encontrado no banco de dados.`;
                    const msg = await message.channel.send(texto);
                    setTimeout(() => msg.delete().catch(() => { }), 5_000);
                } catch (err) {
                    console.error('[AUTO-WL]', err.message);
                    const msg = await message.channel.send(`⚠️ Erro interno ao processar WL do ID \`${id}\`.`);
                    setTimeout(() => msg.delete().catch(() => { }), 5_000);
                }
            }
            return;
        }

        // ── COMANDOS COM PREFIXO DINÂMICO ────────────────────────────
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (err) {
            console.error(`[CMD] Erro em ${prefix}${commandName}:`, err);
            message.reply('❌ Ocorreu um erro interno.').catch(() => { });
        }
    }
};
