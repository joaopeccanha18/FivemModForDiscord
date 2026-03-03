-- ============================================================
-- config.lua — Configurações do Resource ext-logs
-- Preencha apenas este arquivo com seus links de Webhook
-- ============================================================

Config = {}

-- Links dos Webhooks (crie-os no Discord > Configurações do Servidor > Integrações > Webhooks)
Config.Webhooks = {
    Mortes     = "COLOQUE_SEU_WEBHOOK_DE_MORTES_AQUI",
    Baus       = "COLOQUE_SEU_WEBHOOK_DE_BAUS_AQUI",
    AdminHeal  = "COLOQUE_SEU_WEBHOOK_DE_ADMINS_AQUI",
    AdminGod   = "COLOQUE_SEU_WEBHOOK_DE_ADMINS_AQUI",
    JoinLeave  = "COLOQUE_SEU_WEBHOOK_DE_ENTRADA_SAIDA_AQUI"
}

-- Nome que aparece nas mensagens do Discord
Config.BotName = "Logs da Cidade 🏙️"

-- Cores das Embeds em decimal (use conversor Hex -> Decimal: ex. #FF0000 = 16711680)
Config.Cores = {
    Morte     = 16711680,  -- Vermelho
    Bau       = 16776960,  -- Amarelo
    Admin     = 255,       -- Azul
    JoinGreen = 65280,     -- Verde
    LeaveRed  = 16711680,  -- Vermelho
}
