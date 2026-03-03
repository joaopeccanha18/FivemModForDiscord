/**
 * commands/unban.js — !unban [ID]
 * Remove o banimento do jogador e loga no canal de logs.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../utils/configManager');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: 'unban',
    async execute(message, args, client) {
        const cfg = getConfig();
        const isStaff = cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!isStaff && !isAdmin) return message.reply('❌ Sem permissão.');

        const id = args[0];
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!unban [ID]`');

        try {
            const [res] = await client.db.execute(
                'DELETE FROM vrp_bans WHERE user_id = ?',
                [id]
            );

            if (res.affectedRows === 0) {
                return message.reply(`⚠️ Nenhum banimento encontrado para o passaporte \`${id}\`.`);
            }

            // Log da ação
            await sendLog(client, {
                type: 'UNBAN',
                title: '✅ Banimento Removido',
                fields: [
                    { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                    { name: '👮 Desbanido por', value: message.author.tag, inline: true }
                ]
            });

            console.log(`[UNBAN] ID ${id} desbanido por ${message.author.tag}`);

            const embed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('✅ Banimento Removido')
                .setDescription('O jogador foi desbanido e poderá entrar no servidor novamente.')
                .addFields(
                    { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                    { name: '👮 Desbanido por', value: `${message.author}`, inline: true }
                )
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[UNBAN]', err.message);
            return message.reply('❌ Erro ao acessar o banco de dados. Verifique se a tabela `vrp_bans` existe.');
        }
    }
};
