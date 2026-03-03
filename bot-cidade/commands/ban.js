/**
 * commands/ban.js — !ban [ID] [motivo]
 * Registra banimento no BD, expulsa via RCON e loga no canal de logs.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');
const { sendLog } = require('../utils/logger');

async function rconSend(command) {
    const { Rcon } = require('rcon-client');
    const rcon = await Rcon.connect({
        host: process.env.DB_HOST,
        port: parseInt(process.env.RCON_PORT || 30120),
        password: process.env.RCON_PASSWORD
    });
    const r = await rcon.send(command);
    rcon.end();
    return r;
}

module.exports = {
    name: 'ban',
    async execute(message, args, client) {
        const cfg = getConfig();
        const isStaff = cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!isStaff && !isAdmin) return message.reply('❌ Sem permissão.');

        const id = args[0];
        const motivo = args.slice(1).join(' ') || 'Sem motivo informado.';
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!ban [ID] [motivo]`');

        // 1. Registra no banco de dados
        try {
            await client.db.execute(
                `INSERT INTO vrp_bans (user_id, reason, banned_by, banned_at)
                 VALUES (?, ?, ?, NOW())
                 ON DUPLICATE KEY UPDATE reason = VALUES(reason), banned_by = VALUES(banned_by), banned_at = NOW()`,
                [id, motivo, message.author.tag]
            );
        } catch (dbErr) {
            console.error('[BAN DB]', dbErr.message);
            return message.reply('❌ Falha ao registrar no banco de dados. Verifique se a tabela `vrp_bans` existe.');
        }

        // 2. Expulsa via RCON
        let rconStatus = '';
        try {
            await rconSend(`ban ${id} ${motivo}`);
            rconStatus = '📡 **FiveM:** Banimento aplicado com sucesso pelo console.';
            console.log(`[RCON BAN] ID ${id} banido | Motivo: ${motivo}`);
        } catch (rconErr) {
            console.error('[RCON BAN] Falha:', rconErr.message);
            rconStatus = '⚠️ **FiveM:** Banido no MySQL, mas não foi possível aplicar via console (jogador offline ou RCON falhou).';
        }

        // 3. Envia log no canal de logs
        await sendLog(client, {
            type: 'BAN',
            title: '🔨 Jogador Banido',
            fields: [
                { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                { name: '👮 Banido por', value: message.author.tag, inline: true },
                { name: '📡 RCON', value: rconStatus, inline: false },
                { name: '📝 Motivo', value: motivo, inline: false }
            ]
        });

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🔨 Jogador Banido')
            .setDescription(rconStatus)
            .addFields(
                { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                { name: '👮 Banido por', value: `${message.author}`, inline: true },
                { name: '📝 Motivo', value: motivo }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
