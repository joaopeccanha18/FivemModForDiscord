-- ============================================================
-- server.lua — Lógica principal do resource ext-logs
-- Captura eventos do FiveM e envia Embeds para o Discord
-- ============================================================

-- Função auxiliar para enviar um Embed para um Webhook do Discord
local function enviarWebhook(webhook, titulo, descricao, cor)
    -- Proteção: não envia se o webhook não foi configurado
    if not webhook or webhook == "" or webhook:find("COLOQUE") then
        print("[ext-logs] ⚠️ Webhook não configurado para: " .. titulo)
        return
    end

    local embed = {
        {
            ["color"]       = cor,
            ["title"]       = titulo,
            ["description"] = descricao,
            ["footer"]      = { ["text"] = "ext-logs • " .. os.date("%d/%m/%Y %H:%M:%S") }
        }
    }

    PerformHttpRequest(webhook,
        function(errCode, text, headers)
            if errCode ~= 204 then
                print("[ext-logs] ❌ Erro ao enviar webhook (" .. titulo .. "): " .. tostring(errCode))
            end
        end,
        'POST',
        json.encode({ username = Config.BotName, embeds = embed }),
        { ['Content-Type'] = 'application/json' }
    )
end

-- Função auxiliar para obter os identificadores principais de um jogador
local function getIds(source)
    local ids = { discord = "N/A", license = "N/A" }
    for _, v in ipairs(GetPlayerIdentifiers(source)) do
        if v:find("discord:") then ids.discord = "<@" .. v:gsub("discord:", "") .. ">" end
        if v:find("license:") then ids.license = "`" .. v:gsub("license:", "") .. "`" end
    end
    return ids
end

-- ============================================================
-- EVENTO: Jogador Conectando
-- ============================================================
AddEventHandler('playerJoining', function()
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    local desc = string.format("**Jogador:** %s\n**Discord:** %s\n**Licença:** %s", nome, ids.discord, ids.license)
    enviarWebhook(Config.Webhooks.JoinLeave, "✅ Jogador Entrou na Cidade", desc, Config.Cores.JoinGreen)
end)

-- ============================================================
-- EVENTO: Jogador Desconectando
-- ============================================================
AddEventHandler('playerDropped', function(motivo)
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    local desc = string.format("**Jogador:** %s\n**Motivo:** %s\n**Discord:** %s\n**Licença:** %s", nome, motivo, ids.discord, ids.license)
    enviarWebhook(Config.Webhooks.JoinLeave, "❌ Jogador Saiu da Cidade", desc, Config.Cores.LeaveRed)
end)

-- ============================================================
-- EVENTO: Log de Morte (via baseevents)
-- Disparado pelo resource 'baseevents' que já vem com o FiveM
-- ============================================================
AddEventHandler('baseevents:onPlayerKilled', function(killerData, deathData)
    local src      = source
    local morto    = GetPlayerName(src) or "Desconhecido"
    local killer   = "Mundo/Ambiente"

    if killerData and killerData.killerType == 1 then
        killer = GetPlayerName(killerData.killerNetId) or "Desconhecido (Player)"
    end

    local desc = string.format("**Morto:** %s\n**Matador:** %s\n**Arma:** `%s`", morto, killer, tostring(deathData.weaponName))
    enviarWebhook(Config.Webhooks.Mortes, "💀 Registro de Morte", desc, Config.Cores.Morte)
end)

-- ============================================================
-- EVENTO PERSONALIZADO: Log de Admin Heal
-- Dispare este evento no seu código de admin: TriggerServerEvent('ext-logs:adminHeal', adminNome, targetId)
-- ============================================================
RegisterNetEvent('ext-logs:adminHeal', function(adminNome, targetId)
    local src    = source
    local target = GetPlayerName(targetId) or "Desconhecido"
    local ids    = getIds(src)

    local desc = string.format("**Admin:** %s (%s)\n**Curou:** %s (Passaporte: %s)", adminNome, ids.discord, target, tostring(targetId))
    enviarWebhook(Config.Webhooks.AdminHeal, "💊 Admin: Heal Usado", desc, Config.Cores.Admin)
end)

-- ============================================================
-- EVENTO PERSONALIZADO: Log de Admin God Mode
-- Dispare: TriggerServerEvent('ext-logs:adminGod', adminNome, bool_ativo)
-- ============================================================
RegisterNetEvent('ext-logs:adminGod', function(adminNome, ativo)
    local src  = source
    local ids  = getIds(src)
    local stat = ativo and "✅ Ativou" or "❌ Desativou"

    local desc = string.format("**Admin:** %s (%s)\n**Ação:** %s o God Mode", adminNome, ids.discord, stat)
    enviarWebhook(Config.Webhooks.AdminGod, "🛡️ Admin: God Mode", desc, Config.Cores.Admin)
end)

-- ============================================================
-- EVENTO PERSONALIZADO: Log de Baú Aberto
-- Dispare do seu script de baús: TriggerServerEvent('ext-logs:bau', itemInfo)
-- ============================================================
RegisterNetEvent('ext-logs:bau', function(itemInfo)
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    local desc = string.format("**Jogador:** %s\n**Discord:** %s\n**Ação:** %s", nome, ids.discord, tostring(itemInfo))
    enviarWebhook(Config.Webhooks.Baus, "🎁 Baú: Atividade Registrada", desc, Config.Cores.Bau)
end)

-- ============================================================
-- ENDPOINT HTTP: /dvall — Deleta veículos vazios
-- Chamado pelo bot Discord via !dvall → axios.post(fivem_ip/dvall)
-- ============================================================
SetHttpHandler(function(req, res)
    if req.path == '/dvall' and req.method == 'POST' then
        local deletados = 0

        -- Itera por todos os veículos do mapa e deleta os que não têm driver
        for _, vehicle in ipairs(GetAllVehicles()) do
            local driver = GetPedInVehicleSeat(vehicle, -1)
            if driver == 0 then
                DeleteEntity(vehicle)
                deletados = deletados + 1
            end
        end

        print(string.format("[ext-logs] 🚗 !dvall executado: %d veículos vazios deletados.", deletados))

        res.writeHead(200, { ['Content-Type'] = 'application/json' })
        res.send(json.encode({ success = true, deletados = deletados }))
    else
        res.writeHead(404)
        res.send('Not Found')
    end
end)
