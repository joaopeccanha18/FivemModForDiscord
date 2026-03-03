-- ============================================================
-- server.lua — Lógica principal do resource discord-logs v3
-- Captura eventos do FiveM e envia Embeds ricas para o Discord
-- ============================================================

-- Função de proteção: não envia se o webkit ainda não foi configurado
local function webhookValido(url)
    return url and url ~= "" and not url:find("COLOQUE")
end

-- Função genérica para enviar uma Embed para um Webhook do Discord
local function enviarWebhook(webhook, titulo, descricao, cor)
    if not webhookValido(webhook) then
        print("[discord-logs] ⚠️ Webhook não configurado para: " .. titulo)
        return
    end

    local payload = json.encode({
        username = Config.BotName,
        embeds = {{
            color       = cor,
            title       = titulo,
            description = descricao,
            footer      = { text = "discord-logs • " .. os.date("%d/%m/%Y %H:%M:%S") }
        }}
    })

    PerformHttpRequest(webhook,
        function(code, _, _)
            if code ~= 204 then
                print(("[discord-logs] ❌ Falha no webhook '%s' — código HTTP: %s"):format(titulo, tostring(code)))
            end
        end,
        'POST', payload, { ['Content-Type'] = 'application/json' }
    )
end

-- Obtém Discord mention e License de um jogador
local function getIds(source)
    local ids = { discord = "N/A", license = "N/A", ip = "N/A" }
    for _, v in ipairs(GetPlayerIdentifiers(source)) do
        if v:find("discord:")  then ids.discord = "<@"  .. v:gsub("discord:", "")  .. ">" end
        if v:find("license:")  then ids.license = "`"   .. v:gsub("license:", "")   .. "`" end
        if v:find("ip:")       then ids.ip       = "`"  .. v:gsub("ip:", "")        .. "`" end
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

    enviarWebhook(Config.Webhooks.JoinLeave,
        "✅ Jogador Conectou à Cidade",
        ("**Jogador:** %s\n**Discord:** %s\n**Licença:** %s"):format(nome, ids.discord, ids.license),
        Config.Cores.JoinGreen
    )
end)

-- ============================================================
-- EVENTO: Jogador Desconectou
-- ============================================================
AddEventHandler('playerDropped', function(motivo)
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    enviarWebhook(Config.Webhooks.JoinLeave,
        "❌ Jogador Desconectou",
        ("**Jogador:** %s\n**Motivo:** %s\n**Discord:** %s\n**Licença:** %s"):format(nome, motivo, ids.discord, ids.license),
        Config.Cores.LeaveRed
    )
end)

-- ============================================================
-- EVENTO: Log de Combate Detalhado (via baseevents)
-- Inclui arma, distância e se foi headshot.
-- Requer: ensure baseevents no server.cfg
-- ============================================================
AddEventHandler('baseevents:onPlayerKilled', function(killerData, deathData)
    local morto    = GetPlayerName(source) or "Desconhecido"
    local killer   = "Mundo/Queda/Ambiente"
    local arma     = tostring(deathData.weaponName or "Desconhecida")
    local distancia = deathData.killerDistance and math.floor(deathData.killerDistance) or 0
    local headshot = deathData.headShot and "**SIM** 🎯" or "Não"
    local cor      = deathData.headShot and Config.Cores.Headshot or Config.Cores.Morte

    if killerData and killerData.killerType == 1 then
        killer = GetPlayerName(killerData.killerNetId) or ("Jogador #" .. tostring(killerData.killerNetId))
    end

    local desc = ("**Morto:** %s\n**Matador:** %s\n**Arma:** `%s`\n**Distância:** `%d metros`\n**Headshot:** %s"):format(
        morto, killer, arma, distancia, headshot
    )

    enviarWebhook(Config.Webhooks.Combate, "💀 Registro de Morte", desc, cor)
end)

-- ============================================================
-- EVENTO CUSTOMIZADO: Log de Admin Heal
-- Dispare do seu script de admin:
--   TriggerServerEvent('discord-logs:adminHeal', nomeAdmin, sourceAlvo)
-- ============================================================
RegisterNetEvent('discord-logs:adminHeal', function(nomeAdmin, alvoId)
    local src   = source
    local ids   = getIds(src)
    local alvo  = GetPlayerName(alvoId) or ("ID " .. tostring(alvoId))

    enviarWebhook(Config.Webhooks.AdminHeal,
        "💊 Admin: Heal Utilizado",
        ("**Admin:** %s (%s)\n**Curou:** %s"):format(nomeAdmin, ids.discord, alvo),
        Config.Cores.Admin
    )
end)

-- ============================================================
-- EVENTO CUSTOMIZADO: Log de Admin God Mode
-- Dispare: TriggerServerEvent('discord-logs:adminGod', nomeAdmin, true/false)
-- ============================================================
RegisterNetEvent('discord-logs:adminGod', function(nomeAdmin, ativo)
    local src   = source
    local ids   = getIds(src)
    local status = ativo and "✅ **Ativou** o God Mode" or "❌ **Desativou** o God Mode"

    enviarWebhook(Config.Webhooks.AdminGod,
        "🛡️ Admin: God Mode",
        ("**Admin:** %s (%s)\n**Ação:** %s"):format(nomeAdmin, ids.discord, status),
        Config.Cores.Admin
    )
end)

-- ============================================================
-- EVENTO CUSTOMIZADO: Log de Baú / Porta-malas
-- Dispare do seu script de baús:
--   TriggerServerEvent('discord-logs:bau', "Abriu porta-malas do veículo X com item Y")
-- ============================================================
RegisterNetEvent('discord-logs:bau', function(detalhes)
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    enviarWebhook(Config.Webhooks.Baus,
        "🗃️ Atividade em Baú/Porta-malas",
        ("**Jogador:** %s\n**Discord:** %s\n**Detalhe:** %s"):format(nome, ids.discord, tostring(detalhes)),
        Config.Cores.Bau
    )
end)

-- ============================================================
-- ENDPOINT HTTP: POST /dvall
-- Chamado pelo Bot Discord via comando !dvall
-- Deleta todos os veículos sem motorista do mapa
-- ============================================================
SetHttpHandler(function(req, res)
    if req.path == '/dvall' and req.method == 'POST' then
        local deletados = 0

        for _, veh in ipairs(GetAllVehicles()) do
            -- Deleta apenas veículos sem driver (seat -1 = assento do motorista)
            if GetPedInVehicleSeat(veh, -1) == 0 then
                DeleteEntity(veh)
                deletados = deletados + 1
            end
        end

        print(("[discord-logs] 🚗 /dvall: %d veículos vazios deletados."):format(deletados))
        res.writeHead(200, { ['Content-Type'] = 'application/json' })
        res.send(json.encode({ success = true, deletados = deletados }))

    else
        res.writeHead(404)
        res.send('Not Found')
    end
end)
