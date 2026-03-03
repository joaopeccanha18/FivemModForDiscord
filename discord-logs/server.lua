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
-- Usado pelos endpoints /kick e /ban para encontrar o jogador ativo
-- ============================================================
local passportMap = {} -- { [vrp_id_string] = netId }

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

-- Registra passport ID → netId quando o personagem spawna (evento vRP padrão)
AddEventHandler('vrp:playerSpawned', function(user_id, src, first_spawn)
    if user_id and src then
        passportMap[tostring(user_id)] = src
        print(("[discord-logs] 🗂️  Passaporte %s → netId %s registrado"):format(tostring(user_id), tostring(src)))
    end
end)

-- Webhook de saída + limpa mapa
AddEventHandler('playerDropped', function(motivo)
    local src  = source
    local nome = GetPlayerName(src) or "Desconhecido"
    local ids  = getIds(src)

    -- Remove do passportMap
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
-- EVENTO CUSTOMIZADO: Log de Admin Heal
-- TriggerServerEvent('discord-logs:adminHeal', nomeAdmin, sourceAlvo)
-- ============================================================
RegisterNetEvent('discord-logs:adminHeal', function(nomeAdmin, alvoId)
    local src  = source
    local ids  = getIds(src)
    local alvo = GetPlayerName(alvoId) or ("ID " .. tostring(alvoId))
    enviarWebhook(Config.Webhooks.AdminHeal,
        "💊 Admin: Heal Utilizado",
        ("**Admin:** %s (%s)\n**Curou:** %s"):format(nomeAdmin, ids.discord, alvo),
        Config.Cores.Admin
    )
end)

-- ============================================================
-- EVENTO CUSTOMIZADO: Log de Admin God Mode
-- TriggerServerEvent('discord-logs:adminGod', nomeAdmin, true/false)
-- ============================================================
RegisterNetEvent('discord-logs:adminGod', function(nomeAdmin, ativo)
    local src    = source
    local ids    = getIds(src)
    local status = ativo and "✅ **Ativou** o God Mode" or "❌ **Desativou** o God Mode"
    enviarWebhook(Config.Webhooks.AdminGod,
        "🛡️ Admin: God Mode",
        ("**Admin:** %s (%s)\n**Ação:** %s"):format(nomeAdmin, ids.discord, status),
        Config.Cores.Admin
    )
end)

-- ============================================================
-- EVENTO CUSTOMIZADO: Log de Baú / Porta-malas
-- TriggerServerEvent('discord-logs:bau', "detalhe")
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
-- ENDPOINTS HTTP — chamados pelo Bot Discord
--   POST /kick  { passport, reason }  → DropPlayer em tempo real
--   POST /ban   { passport, reason }  → DropPlayer se online
--   POST /dvall                        → Deletar veículos vazios
-- ============================================================
SetHttpHandler(function(req, res)

    -- ── /kick ──────────────────────────────────────────────────────
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

    -- ── /ban ───────────────────────────────────────────────────────
    elseif req.path == '/ban' and req.method == 'POST' then
        local body     = json.decode(req.body or '{}') or {}
        local passport = tostring(body.passport or '')
        local reason   = tostring(body.reason or 'Banido.')

        local netId = passportMap[passport]
        local online = netId ~= nil
        if online then
            DropPlayer(netId, '[BAN] ' .. reason)
            print(('[discord-logs] 🔨 /ban: Passaporte %s (netId %s) expulso.'):format(passport, tostring(netId)))
        else
            print(('[discord-logs] 🔨 /ban: Passaporte %s offline — ban só no BD.'):format(passport))
        end

        res.writeHead(200, { ['Content-Type'] = 'application/json' })
        res.send(json.encode({ success = true, online = online, passport = passport }))

    -- ── /dvall ─────────────────────────────────────────────────────
    elseif req.path == '/dvall' and req.method == 'POST' then
        local deletados = 0
        for _, veh in ipairs(GetAllVehicles()) do
            if GetPedInVehicleSeat(veh, -1) == 0 then
                DeleteEntity(veh)
                deletados = deletados + 1
            end
        end
        print(('[discord-logs] 🚗 /dvall: %d veículos deletados.'):format(deletados))
        res.writeHead(200, { ['Content-Type'] = 'application/json' })
        res.send(json.encode({ success = true, deletados = deletados }))

    else
        res.writeHead(404)
        res.send('Not Found')
    end
end)
