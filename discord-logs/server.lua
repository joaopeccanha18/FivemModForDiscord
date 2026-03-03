-- ============================================================
-- server.lua — Lógica principal do resource discord-logs v3
-- Captura eventos do FiveM e envia Embeds ricas para o Discord
-- ============================================================

-- Função de proteção: não envia se o webhook ainda não foi configurado
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
local function getIds(src)
    local ids = { discord = "N/A", license = "N/A", ip = "N/A" }
    for _, v in ipairs(GetPlayerIdentifiers(src)) do
        if v:find("discord:")  then ids.discord = "<@"  .. v:gsub("discord:", "")  .. ">" end
        if v:find("license:")  then ids.license = "`"   .. v:gsub("license:", "")   .. "`" end
        if v:find("ip:")       then ids.ip       = "`"  .. v:gsub("ip:", "")        .. "`" end
    end
    return ids
end

-- ============================================================
-- MAPA: passport (vrp_id) → netId do servidor
-- Usado pelo endpoint /kick para encontrar o jogador ativo
-- ============================================================
local passportMap = {}

-- Webhook de entrada
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

-- Registra passport ID → netId quando o personagem spawna
AddEventHandler('vrp:playerSpawned', function(user_id, src, first_spawn)
    if user_id and src then
        passportMap[tostring(user_id)] = src
    end
end)

-- Webhook de saída + limpa mapa
AddEventHandler('playerDropped', function(motivo)
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    for pid, netId in pairs(passportMap) do
        if netId == src then passportMap[pid] = nil; break end
    end

    enviarWebhook(Config.Webhooks.JoinLeave,
        "❌ Jogador Desconectou",
        ("**Jogador:** %s\n**Motivo:** %s\n**Discord:** %s\n**Licença:** %s"):format(nome, motivo, ids.discord, ids.license),
        Config.Cores.LeaveRed
    )
end)

-- ============================================================
-- COMBATE: mortes PvP detalhadas (requer baseevents no server.cfg)
-- ============================================================
local morteRegistrada = {}

AddEventHandler('baseevents:onPlayerKilled', function(killerData, deathData)
    local src      = source
    local morto    = GetPlayerName(src) or "Desconhecido"
    local killer   = "Mundo / Ambiente"
    local arma     = tostring(deathData.weaponName or "Desconhecida")
    local distancia = deathData.killerDistance and math.floor(deathData.killerDistance) or 0
    local headshot = deathData.headShot and "**SIM** 🎯" or "Não"
    local cor      = deathData.headShot and Config.Cores.Headshot or Config.Cores.Morte

    if killerData and killerData.killerType == 1 then
        killer = GetPlayerName(killerData.killerNetId) or ("Jogador #" .. tostring(killerData.killerNetId))
    end

    morteRegistrada[src] = os.time()

    local desc = ("**Morto:** %s\n**Matador:** %s\n**Arma:** `%s`\n**Distância:** `%d metros`\n**Headshot:** %s"):format(
        morto, killer, arma, distancia, headshot
    )
    enviarWebhook(Config.Webhooks.Combate, "💀 Morte em Combate", desc, cor)
end)

-- Fallback: qualquer morte não coberta acima (queda, afogamento, NPC, explosão…)
AddEventHandler('baseevents:onPlayerDied', function(killerData, deathData)
    local src  = source
    if morteRegistrada[src] and (os.time() - morteRegistrada[src]) < 3 then return end

    local morto = GetPlayerName(src) or "Desconhecido"
    local arma  = tostring(deathData.weaponName or "Desconhecida")
    local causa = "Mundo / Ambiente"

    if killerData and killerData.killerType == 1 then
        causa = "Jogador: " .. (GetPlayerName(killerData.killerNetId) or "#" .. tostring(killerData.killerNetId))
    elseif killerData and killerData.killerType == 2 then
        causa = "NPC / Veículo"
    end

    morteRegistrada[src] = os.time()

    local desc = ("**Morto:** %s\n**Causa:** %s\n**Arma/Motivo:** `%s`"):format(morto, causa, arma)
    enviarWebhook(Config.Webhooks.Combate, "💀 Morte Registrada", desc, Config.Cores.Morte)
end)

-- ============================================================
-- ENDPOINT HTTP: POST /kick
-- Chamado pelo Bot Discord via comando !kick
-- Expulsa o jogador pelo passport ID (vrp_id)
-- ============================================================
SetHttpHandler(function(req, res)

    if req.path == '/kick' and req.method == 'POST' then
        local body     = json.decode(req.body or '{}') or {}
        local passport = tostring(body.passport or '')
        local reason   = tostring(body.reason or 'Sem motivo.')

        local netId = passportMap[passport]
        if not netId then
            res.writeHead(404, { ['Content-Type'] = 'application/json' })
            res.send(json.encode({ success = false, error = 'Jogador nao encontrado online.' }))
            return
        end

        DropPlayer(netId, '[Staff] ' .. reason)
        print(('[discord-logs] 👟 /kick: Passaporte %s (netId %s) — %s'):format(passport, tostring(netId), reason))
        res.writeHead(200, { ['Content-Type'] = 'application/json' })
        res.send(json.encode({ success = true, passport = passport }))

    else
        res.writeHead(404)
        res.send('Not Found')
    end
end)
