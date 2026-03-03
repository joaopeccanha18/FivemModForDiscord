/**
 * commands/config/wlsetup.js — !wlsetup
 * Força o reenvio da embed de instrução no canal de whitelist.
 */
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getConfig, saveConfig } = require('../../utils/configManager');

module.exports = {
    name: 'wlsetup',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('❌ Apenas Administradores.');

        const cfg = getConfig();
        const canalId = cfg.canais?.whitelist;
        if (!canalId) return message.reply('❌ Canal de whitelist não configurado. Use `!config whitelist #canal` primeiro.');

        const canal = client.channels.cache.get(canalId);
        if (!canal) return message.reply('❌ Canal de whitelist não encontrado. Verifique as permissões do bot.');

        const embed = new EmbedBuilder()
            .setTitle('🔑  Whitelist — Passaporte')
            .setColor('#5865F2')
            .setDescription(
                '## Como liberar seu passaporte\n\n' +
                '> **1.** Abra o jogo e anote o número do seu **Passaporte** .\n' +
                '> **2.** Cole **apenas o número** aqui neste canal.\n' +
                '> **3.** Siga as regras do RolePlay, e boa viagem para a Fixture RolePlay.\n\n' +
                '```\nExemplo: 1234\n```'
            )
            .setFooter({ text: '⚡ Aprovação automática' })
            .setTimestamp();

        try {
            // Tenta editar a mensagem existente
            const msgId = cfg.canais?.wl_message_id;
            if (msgId) {
                try {
                    const msgExistente = await canal.messages.fetch(msgId);
                    await msgExistente.delete().catch(() => { });
                } catch { /* mensagem já foi deletada */ }
            }

            // Apaga todas as msgs do bot no canal e reenvia
            const msgs = await canal.messages.fetch({ limit: 20 });
            const botMsgs = msgs.filter(m => m.author.id === client.user.id);
            for (const m of botMsgs.values()) await m.delete().catch(() => { });

            const novaMsg = await canal.send({ embeds: [embed] });
            saveConfig({ canais: { wl_message_id: novaMsg.id } });

            return message.reply(`✅ Embed de whitelist reenviada em <#${canalId}>!`);
        } catch (err) {
            console.error('[WLSETUP]', err.message);
            return message.reply('❌ Erro ao reenviar a embed. Verifique as permissões do bot no canal.');
        }
    }
};
