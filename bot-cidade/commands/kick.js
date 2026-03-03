/**
 * commands/kick.js — !kick [ID] [motivo]
 * Registra kick no BD, desconecta via RCON e loga no canal de logs.
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
    name: 'kick',
    async execute(message, args, client) {
        const cfg = getConfig();
        const isStaff = cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!isStaff && !isAdmin) return message.reply('❌ Sem permissão.');

        const id = args[0];
        const motivo = args.slice(1).join(' ') || 'Sem motivo informado.';
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!kick [ID] [motivo]`');

        // 1. Registra no banco de dados
        try {
            await client.db.execute(
                'INSERT INTO vrp_kicks (user_id, reason, kicked_by, kicked_at) VALUES (?, ?, ?, NOW())',
                [id, motivo, message.author.tag]
            );
        } catch (dbErr) {
            console.error('[KICK DB]', dbErr.message);
            return message.reply('❌ Falha ao registrar no banco de dados. Verifique se a tabela `vrp_kicks` existe.');
        }

        // 2. Desconecta via RCON
        let rconStatus = '';
        try {
            await rconSend(`clientkick ${id} ${motivo}`);
            rconStatus = '📡 **FiveM:** Jogador desconectado com sucesso pelo console.';
            console.log(`[RCON KICK] ID ${id} desconectado | Motivo: ${motivo}`);
        } catch (rconErr) {
            console.error('[RCON KICK] Falha:', rconErr.message);
            rconStatus = '⚠️ **FiveM:** Registrado no BD, mas não foi possível desconectar via console (jogador offline ou RCON falhou).';
        }

        // 3. Envia log no canal de logs
        await sendLog(client, {
            type: 'KICK',
            title: '👟 Jogador Kickado',
            fields: [
                { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                { name: '👮 Kickado por', value: message.author.tag, inline: true },
                { name: '📡 RCON', value: rconStatus, inline: false },
                { name: '📝 Motivo', value: motivo, inline: false }
            ]
        });

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('👟 Jogador Kickado')
            .setDescription(rconStatus)
            .addFields(
                { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                { name: '👮 Kickado por', value: `${message.author}`, inline: true },
                { name: '📝 Motivo', value: motivo }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
