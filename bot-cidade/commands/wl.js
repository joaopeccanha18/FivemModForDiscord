/**
 * commands/wl.js — !wl [ID]
 * Whitelist manual de um passaporte. Requer cargo de Staff ou Admin.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

module.exports = {
    name: 'wl',
    async execute(message, args, client) {
        const cfg = getConfig();
        const isStaff = cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!isStaff && !isAdmin) return message.reply('❌ Sem permissão.');

        const id = args[0];
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!wl [ID]`');

        try {
            const [res] = await client.db.execute('UPDATE vrp_users SET whitelisted = 1 WHERE id = ?', [id]);
            if (res.affectedRows === 0) return message.reply(`❌ ID \`${id}\` não encontrado no banco.`);

            const embed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('✅ Whitelist Manual Aprovada')
                .addFields(
                    { name: 'Passaporte', value: `\`${id}\``, inline: true },
                    { name: 'Aprovado por', value: `${message.author}`, inline: true }
                )
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[WL]', err.message);
            return message.reply('❌ Erro no banco de dados. Veja o console.');
        }
    }
};
