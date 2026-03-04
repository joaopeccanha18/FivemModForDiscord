/**
 * events/messageCreate.js
 * - Auto-WL no canal configurado (JOIN entre vrp_users e vrp_user_identities).
 * - Comandos com prefixo dinâmico lido do config.json.
 */
const { Events } = require('discord.js');
const { getConfig } = require('../utils/configManager');
const { sendLog } = require('../utils/logger');

const WL_ROLE_ID = '1463937235907903717';

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
                // 1. Deleta a mensagem original imediatamente
                await message.delete().catch(() => { });

                // 2. Faz fetch do membro para garantir dados actualizados
                let membro;
                try {
                    membro = await message.guild.members.fetch(message.author.id);
                } catch {
                    membro = message.member;
                }

                try {
                    // 3. Verifica se o ID existe e busca o nome em única query (JOIN)
                    const [rows] = await client.db.execute(`
                        SELECT u.id, i.nome, i.sobrenome
                        FROM vrp_users u
                        LEFT JOIN vrp_user_identities i ON i.user_id = u.id
                        WHERE u.id = ?
                        LIMIT 1
                    `, [id]);

                    if (rows.length === 0) {
                        const msg = await message.channel.send(`❌ Passaporte \`${id}\` não encontrado no banco de dados.`);
                        setTimeout(() => msg.delete().catch(() => { }), 5_000);
                        return;
                    }

                    // 4. Atualiza a whitelist
                    await client.db.execute('UPDATE vrp_users SET whitelist = 1 WHERE id = ?', [id]);

                    // 5. Adiciona o cargo de WL
                    try {
                        await membro.roles.add(WL_ROLE_ID);
                        console.log(`[AUTO-WL] ✅ Cargo de WL adicionado para ${message.author.tag}`);
                    } catch (roleErr) {
                        console.warn(`[AUTO-WL] ⚠️  Não foi possível adicionar cargo WL: ${roleErr.message}`);
                    }

                    // 6. Monta o apelido — usa nome do personagem se tiver, ou nome do Discord
                    let nickName = message.author.username;
                    if (rows[0].nome) {
                        nickName = `${rows[0].nome} ${rows[0].sobrenome || ''}`.trim();
                    } else {
                        console.warn(`[AUTO-WL] ID ${id} ainda sem personagem em vrp_user_identities — usando nome do Discord.`);
                    }

                    // 7. Aplica apelido no Discord: "Nome | ID" (máx 32 chars)
                    const novoApelido = `${nickName} | ${id}`.substring(0, 32);
                    try {
                        await membro.setNickname(novoApelido, 'Auto-WL');
                        console.log(`[AUTO-WL] ✅ ID ${id} | Apelido: "${novoApelido}" | Discord: ${message.author.tag}`);
                    } catch (nickErr) {
                        console.error(`[AUTO-WL] ❌ Falha ao definir apelido: ${nickErr.message}`);
                        // Mostra o erro no canal temporariamente para diagnóstico
                        const errMsg = await message.channel.send(
                            `⚠️ Whitelist aprovada, mas não foi possível alterar o apelido: \`${nickErr.message}\``
                        );
                        setTimeout(() => errMsg.delete().catch(() => { }), 8_000);
                    }

                    // 8. Confirmação temporária (auto-apaga em 5s)
                    const msg = await message.channel.send(
                        `✅ **Whitelist Aprovada!** Passaporte \`${id}\` liberado.\nBem-vindo(a) à cidade, ${message.author}! 🏙️`
                    );
                    setTimeout(() => msg.delete().catch(() => { }), 5_000);

                    // 9. Log no canal de logs de WL
                    await sendLog(client, {
                        type: 'WL',
                        title: '✅ Whitelist Aprovada (Auto)',
                        fields: [
                            { name: '🔑 Passaporte', value: `\`${id}\``, inline: true },
                            { name: '👤 Discord', value: message.author.tag, inline: true },
                            { name: '🏷️ Apelido', value: novoApelido, inline: false }
                        ]
                    });

                } catch (err) {
                    console.error('[AUTO-WL] Erro:', err.message);
                    const msg = await message.channel.send(
                        `⚠️ Erro ao processar WL do ID \`${id}\`. Verifique o console do bot.`
                    );
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
