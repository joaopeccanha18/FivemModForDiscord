/**
 * commands/kick.js — !kick [ID] [motivo]
 * Registra um kick no BD. Requer cargo de Staff ou Admin.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');

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

        try {
            await client.db.execute(
                `INSERT INTO vrp_kicks (user_id, reason, kicked_by, kicked_at) VALUES (?, ?, ?, NOW())`,
                [id, motivo, message.author.tag]
            );
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('👟 Jogador Kickado')
                .addFields(
                    { name: 'Passaporte', value: `\`${id}\``, inline: true },
                    { name: 'Kickado por', value: `${message.author}`, inline: true },
                    { name: 'Motivo', value: motivo }
                ).setTimestamp();
            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[KICK]', err.message);
            return message.reply('❌ Erro no BD. Certifique-se de que a tabela `vrp_kicks` existe.');
        }
    }
};
