/**
 * commands/moderation/liberar.js — !liberar [ID]
 * Alias manual para whitelist (para uso da staff fora do canal automático).
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../utils/configManager');
const { sendLog } = require('../../utils/logger');

module.exports = {
    name: 'liberar',
    async execute(message, args, client) {
        const cfg = getConfig();
        const ok = (cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff))
            || message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!ok) return message.reply('❌ Sem permissão.');

        const id = args[0];
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!liberar [ID]`');

        try {
            const [res] = await client.db.execute('UPDATE vrp_users SET whitelist = 1 WHERE id = ?', [id]);
            if (res.affectedRows === 0) return message.reply(`❌ ID \`${id}\` não encontrado.`);

            // Log da liberação manual
            await sendLog(client, {
                type: 'WL',
                title: '✅ Whitelist Manual',
                fields: [
                    { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                    { name: '👮 Liberado por', value: message.author.tag, inline: true }
                ]
            });

            const embed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('✅ Passaporte Liberado')
                .addFields(
                    { name: 'ID', value: `\`${id}\``, inline: true },
                    { name: 'Por', value: `${message.author}`, inline: true }
                )
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[LIBERAR]', err.message);
            return message.reply('❌ Erro no BD.');
        }
    }
};
