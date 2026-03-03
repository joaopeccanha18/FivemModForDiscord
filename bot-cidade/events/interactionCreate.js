/**
 * events/interactionCreate.js
 * Gerencia cliques em Botões (open_ticket / close_ticket).
 */
const {
    Events, PermissionsBitField, ChannelType,
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const { customId, guild, user, member, channel } = interaction;

        // ─── ABRIR TICKET ───────────────────────────────────────────
        if (customId === 'open_ticket') {
            const existing = guild.channels.cache.find(
                c => c.topic === user.id && c.name.startsWith('ticket-')
            );
            if (existing) {
                return interaction.reply({
                    content: `📬 Você já tem um ticket aberto em ${existing}!`,
                    ephemeral: true
                });
            }

            try {
                const { getConfig } = require('../utils/configManager');
                const cfg = getConfig();
                const categoriaId = cfg.canais?.ticket_categoria;

                const ticketRoleId = cfg.cargo_ticket || null;

                // Remove caracteres especiais do username para evitar erro do Discord
                const safeName = user.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';

                const overwrites = [
                    { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }, // everyone não vê
                    {
                        id: user.id, allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    }
                ];

                // Se huma tag de atendente foi configurada, dá permissão a ela
                if (ticketRoleId) {
                    overwrites.push({
                        id: ticketRoleId,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    });
                }

                const channelData = {
                    name: `ticket-${safeName}`,
                    type: ChannelType.GuildText,
                    topic: user.id,
                    permissionOverwrites: overwrites
                };

                if (categoriaId) {
                    channelData.parent = categoriaId;
                }

                const ticketCh = await guild.channels.create(channelData);

                await interaction.reply({ content: `✅ Ticket criado em ${ticketCh}!`, ephemeral: true });

                const embed = new EmbedBuilder()
                    .setColor('#00BFFF')
                    .setTitle('🎫 Ticket de Suporte')
                    .setDescription(
                        `Olá ${user}! Descreva seu problema detalhadamente.\n` +
                        `A staff irá te atender em breve.\n\n` +
                        `Clique em **Fechar Ticket** quando o atendimento terminar.`
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Sistema de Tickets', iconURL: client.user.displayAvatarURL() });

                const closeBtn = new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Fechar Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger);

                await ticketCh.send({
                    content: `${user}`,
                    embeds: [embed],
                    components: [new ActionRowBuilder().addComponents(closeBtn)]
                });

            } catch (err) {
                console.error('[TICKET] Erro ao criar:', err.message);
                interaction.reply({ content: '❌ Não foi possível criar o ticket. Verifique permissões do bot.', ephemeral: true });
            }

        }

        // ─── FECHAR TICKET ───────────────────────────────────────────
        if (customId === 'close_ticket') {
            const isOwner = channel.topic === user.id;
            const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);

            if (!isOwner && !isAdmin) {
                return interaction.reply({ content: '❌ Você não pode fechar este ticket.', ephemeral: true });
            }

            await interaction.reply('🔒 Ticket será fechado em **5 segundos**...');
            setTimeout(() => channel.delete().catch(console.error), 5_000);
        }
    }
};
