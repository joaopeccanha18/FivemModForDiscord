-- ============================================================
-- config.lua — Configurações do Resource discord-logs
-- Configure aqui os Webhooks e o nome do bot de logs.
-- ============================================================

Config = {}

-- Cole os links dos Webhooks criados no seu servidor Discord
Config.Webhooks = {
    AdminHeal = "https://discord.com/api/webhooks/1478416427735060674/7NhZzatqpTfBI7J2SQfZmKrCup78-dXZx5nR9a71hsP_ixo888UqQECT5XgyQs9S-Q_x",
    AdminGod  = "https://discord.com/api/webhooks/1478416427735060674/7NhZzatqpTfBI7J2SQfZmKrCup78-dXZx5nR9a71hsP_ixo888UqQECT5XgyQs9S-Q_x",
    JoinLeave = "https://discord.com/api/webhooks/1478416720627634338/i39xYVXUdE82flt-ynvzrU0qxM29oSTaiohJ658yzmjp5buNVuYTI7B0FUi5YG-ViNVR"
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
