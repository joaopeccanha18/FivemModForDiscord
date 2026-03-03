-- ============================================================
-- config.lua — Configurações do Resource discord-logs
-- Configure aqui os Webhooks e o nome do bot de logs.
-- ============================================================

Config = {}

-- Cole os links dos Webhooks criados no seu servidor Discord
Config.Webhooks = {
    Combate   = "https://discord.com/api/webhooks/1478413110350975017/2p0SOoJvRhOaIJlvDDV4siHaWql0D4u7KZhPyVCpr_TCHdff-1T1qRL7XgZLvHBWLrPO",
    AdminHeal = "COLOQUE_SEU_WEBHOOK_DE_ADMIN_AQUI",
    AdminGod  = "COLOQUE_SEU_WEBHOOK_DE_ADMIN_AQUI",
    Baus      = "COLOQUE_SEU_WEBHOOK_DE_BAUS_AQUI",
    JoinLeave = "COLOQUE_SEU_WEBHOOK_DE_ENTRADA_SAIDA_AQUI"
}

-- Nome visível nos logs do Discord
Config.BotName = "Logs da Cidade 🏙️"

-- Cores das Embeds em valor decimal (conversor: colorpicker → ex: #FF0000 = 16711680)
Config.Cores = {
    Morte      = 16711680,  -- Vermelho
    Headshot   = 16711680,  -- Vermelho (mortes com headshot ficam em vermelho forte)
    Bau        = 16776960,  -- Amarelo
    Admin      = 255,       -- Azul
    JoinGreen  = 65280,     -- Verde
    LeaveRed   = 16711680,  -- Vermelho
}
