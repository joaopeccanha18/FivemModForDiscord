/**
 * commands/moderation/liberar.js — !liberar [ID] [@membro]
 * Alias manual para whitelist (para uso da staff fora do canal automático).
 * Também atribui o cargo de WL e define o apelido "Nome | ID" do membro mencionado.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig } = require('../../utils/configManager');
const { sendLog } = require('../../utils/logger');

const WL_ROLE_ID = '1463937235907903717';

module.exports = {
    name: 'liberar',
    async execute(message, args, client) {
        const cfg = getConfig();
        const ok = (cfg.cargo_staff && message.member.roles.cache.has(cfg.cargo_staff))
            || message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!ok) return message.reply('❌ Sem permissão.');

        const id = args[0];
        if (!id || isNaN(id)) return message.reply('📝 Uso: `!liberar [ID] [@membro]`');

        // Membro mencionado (opcional) — se não houver menção, apenas atualiza o BD
        const alvo = message.mentions.members.first() || null;

        try {
            // 1. Busca nome do personagem no BD
            const [rows] = await client.db.execute(`
                SELECT u.id, i.nome, i.sobrenome
                FROM vrp_users u
                LEFT JOIN vrp_user_identities i ON i.user_id = u.id
                WHERE u.id = ?
                LIMIT 1
            `, [id]);

            if (rows.length === 0) return message.reply(`❌ ID \`${id}\` não encontrado.`);

            // 2. Atualiza a whitelist no BD
            await client.db.execute('UPDATE vrp_users SET whitelist = 1 WHERE id = ?', [id]);

            let apelido = null;

            if (alvo) {
                // 3. Adiciona cargo de WL
                try {
                    await alvo.roles.add(WL_ROLE_ID);
                    console.log(`[LIBERAR] ✅ Cargo WL adicionado para ${alvo.user.tag}`);
                } catch (roleErr) {
                    console.warn(`[LIBERAR] ⚠️  Não foi possível adicionar cargo WL: ${roleErr.message}`);
                }

                // 4. Define apelido "Nome Sobrenome | ID"
                let nickName = alvo.user.username;
                if (rows[0].nome) {
                    nickName = `${rows[0].nome} ${rows[0].sobrenome || ''}`.trim();
                } else {
                    console.warn(`[LIBERAR] ID ${id} sem personagem em vrp_user_identities — usando nome do Discord.`);
                }
                apelido = `${nickName} | ${id}`.substring(0, 32);

                try {
                    await alvo.setNickname(apelido, `Whitelist manual por ${message.author.tag}`);
                    console.log(`[LIBERAR] ✅ Apelido definido: "${apelido}" para ${alvo.user.tag}`);
                } catch (nickErr) {
                    console.warn(`[LIBERAR] ⚠️  Não foi possível definir apelido: ${nickErr.message}`);
                }
            }

            // 5. Log da liberação manual
            await sendLog(client, {
                type: 'WL',
                title: '✅ Whitelist Manual',
                fields: [
                    { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                    { name: '👮 Liberado por', value: message.author.tag, inline: true },
                    ...(alvo ? [{ name: '👤 Discord', value: alvo.user.tag, inline: true }] : []),
                    ...(apelido ? [{ name: '🏷️ Apelido', value: apelido, inline: false }] : [])
                ]
            });

            // 6. Embed de confirmação
            const embed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('✅ Passaporte Liberado')
                .addFields(
                    { name: '🔑 ID', value: `\`${id}\``, inline: true },
                    { name: '👮 Por', value: `${message.author}`, inline: true },
                    ...(alvo ? [{ name: '👤 Membro', value: `${alvo}`, inline: true }] : []),
                    ...(apelido ? [{ name: '🏷️ Apelido', value: apelido, inline: false }] : [])
                )
                .setTimestamp();
            return message.reply({ embeds: [embed] });

        } catch (err) {
            console.error('[LIBERAR]', err.message);
            return message.reply('❌ Erro no BD.');
        }
    }
};
