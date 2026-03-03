/**
 * commands/ban.js — !ban [ID] [motivo]
 * Registra um banimento no BD. Requer cargo de Staff ou Admin.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

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

        try {
            await client.db.execute(
                `INSERT INTO vrp_bans (user_id, reason, banned_by, banned_at)
                 VALUES (?, ?, ?, NOW())
                 ON DUPLICATE KEY UPDATE reason = VALUES(reason), banned_at = NOW()`,
                [id, motivo, message.author.tag]
            );
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔨 Jogador Banido')
                .addFields(
                    { name: 'Passaporte', value: `\`${id}\``, inline: true },
                    { name: 'Banido por', value: `${message.author}`, inline: true },
                    { name: 'Motivo', value: motivo }
                ).setTimestamp();
            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[BAN]', err.message);
            return message.reply('❌ Erro no BD. Certifique-se de que a tabela `vrp_bans` existe.');
        }
    }
};
