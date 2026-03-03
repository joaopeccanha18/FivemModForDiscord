# 🚀 Tutorial: Bot Cidade — Configuração Completa (v4)

> ✨ **Tudo é configurado via `!config` no Discord. Sem mexer em código ou reiniciar o bot.**

---

## ⚠️ Pré-requisitos

- Node.js 16.11+
- MySQL com o banco de dados do vRP
- Bot com as 3 **Privileged Gateway Intents** ativas no [Developer Portal](https://discord.com/developers/applications):
  - Presence Intent, Server Members Intent, Message Content Intent

---

## 🤖 PARTE 1 — Bot (`bot-cidade`)

### 1. Criar o `.env`
Copie `.env.example` → `.env` e preencha:
```
TOKEN=seu_token_aqui
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=sua_senha
DB_NAME=vrp
```

### 2. Criar tabelas extras no BD (uma única vez)
```sql
CREATE TABLE IF NOT EXISTS vrp_bans  (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, reason VARCHAR(500), banned_by VARCHAR(100), banned_at DATETIME DEFAULT NOW());
CREATE TABLE IF NOT EXISTS vrp_kicks (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, reason VARCHAR(500), kicked_by VARCHAR(100), kicked_at DATETIME DEFAULT NOW());
CREATE TABLE IF NOT EXISTS vrp_warns (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, reason VARCHAR(500), warned_by VARCHAR(100), warned_at DATETIME DEFAULT NOW());
```

### 3. Iniciar
```bash
cd bot-cidade
node index.js
```

---

## ⚙️ PARTE 2 — Configurar o Bot pelo Discord

Após ligar o bot, use os comandos abaixo no Discord:

### Configuração essencial
```
!config setip 45.123.45.6:30120   → IP do FiveM
!config setstaff @Staff            → Cargo que pode usar !ban, !kick, etc.
!config setticketrole @Suporte     → Cargo que pode ver os tickets abertos
!config autorole @Cidadão          → Cargo dado a novos membros
!config ver                        → Confirma tudo
```

### Configurar canais
```
!config whitelist #whitelist       → Canal de Auto-Whitelist
!config entrada #boas-vindas       → Mensagens de entrada
!config saida #saidas              → Mensagens de saída
!config sugerir #sugestoes         → Canal de sugestões
!config combate #logs-combate      → Logs de mortes detalhadas
!config admin #logs-admin          → Logs de admin (heal/god)
!config bau #logs-baus             → Logs de baús
!config categoria 1234567890       → Categoria onde os tickets são abertos
```

### Configurar status
```
!config statusbot auto                           → Players FiveM (padrão)
!config statusbot manual PLAYING Roleplay City   → Texto fixo
```

---

## 🎮 PARTE 3 — Resource FiveM (`discord-logs`)

### 1. Copiar para o servidor
```
resources/[local]/discord-logs/
```

### 2. Preencher `config.lua`
```lua
Config.Webhooks = {
    Combate   = "https://discord.com/api/webhooks/...",
    AdminHeal = "https://discord.com/api/webhooks/...",
    Baus      = "https://discord.com/api/webhooks/...",
    JoinLeave = "https://discord.com/api/webhooks/..."
}
```

### 3. `server.cfg`
```
ensure baseevents
ensure discord-logs
```

### 4. Integrar com scripts de admin/baús
```lua
TriggerServerEvent('discord-logs:adminHeal', "NomeAdmin", sourceAlvo)
TriggerServerEvent('discord-logs:adminGod', "NomeAdmin", true)
TriggerServerEvent('discord-logs:bau', "Detalhe do que aconteceu")
```

---

## ❓ FAQ

| Problema | Solução |
|---|---|
| Bot não lê mensagens | Ative as 3 Privileged Intents no Developer Portal |
| Prefixo mudou e não funciona | Use o novo prefixo, ou edite `config.json` e reinicie |
| `!dvall` não funciona | Verifique o IP com `!config ver` e se `discord-logs` está ativo |
| `!ban` falha | Execute os SQLs da Parte 1 no seu banco de dados |
