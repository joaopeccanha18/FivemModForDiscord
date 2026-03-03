/**
 * commands/warn.js — !warn [ID] [motivo]
 * Registra advertência e exibe o total acumulado.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: 'warn',
    async execute(message, args, client) {
        const cfg = getConfig();
        const isStaff = cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!isStaff && !isAdmin) return message.reply('❌ Sem permissão.');

        const id = args[0];
        const motivo = args.slice(1).join(' ') || 'Sem motivo informado.';
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!warn [ID] [motivo]`');

        try {
            await client.db.execute(
                `INSERT INTO vrp_warns (user_id, reason, warned_by, warned_at) VALUES (?, ?, ?, NOW())`,
                [id, motivo, message.author.tag]
            );
            const [[{ total }]] = await client.db.execute(
                'SELECT COUNT(*) AS total FROM vrp_warns WHERE user_id = ?', [id]
            );
            const embed = new EmbedBuilder()
                .setColor('#FFFF00')
                .setTitle('⚠️ Advertência Registrada')
                .addFields(
                    { name: 'Passaporte', value: `\`${id}\``, inline: true },
                    { name: 'Advertido por', value: `${message.author}`, inline: true },
                    { name: 'Total de Warns', value: `**${total}**`, inline: true },
                    { name: 'Motivo', value: motivo }
                ).setTimestamp();
            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[WARN]', err.message);
            return message.reply('❌ Erro no BD. Certifique-se de que a tabela `vrp_warns` existe.');
        }
    }
};
