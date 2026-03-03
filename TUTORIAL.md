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

### 2. Iniciar
```bash
cd bot-cidade
node index.js
# ou com nodemon para desenvolvimento:
npm run dev
```



---

## ⚙️ PARTE 2 — Configurar o Bot pelo Discord

Após ligar o bot, use os comandos abaixo no Discord:

### Configuração essencial
```
!config setip 45.123.45.6:30120   → IP do FiveM
!config setstaff @Staff            → Cargo de Staff
!config setticketrole @Suporte     → Cargo de Atendimento (Tickets)
!config whitelist #whitelist       → Canal de whitelist
!wlsetup                           → Envia a embed de instrução no canal
!config ver                        → Confirma tudo
```

### Configurar canais
```
!config whitelist #whitelist       → Canal de Auto-Whitelist (entrada de IDs)
!config status #status-cidade      → Embed de status da cidade (atualiza a cada 60s)
!config ticket #tickets            → Canal de tickets
!config categoria 1234567890       → Categoria onde os tickets são abertos

# ───── Canais de Logs por Funcionalidade ─────
!config logswl #logs-wl            → Logs de Whitelist aprovada
!config logsticket #logs-tickets   → Logs de Tickets abertos/fechados
!config logscombate #logs-combate  → Logs de Combate do FiveM
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
    JoinLeave = "https://discord.com/api/webhooks/..."
}
```

### 3. `server.cfg`
```
ensure baseevents
ensure discord-logs
```



## ❓ FAQ

| Problema | Solução |
|---|---|
| Bot não lê mensagens | Ative as 3 Privileged Intents no Developer Portal |
| Auto-WL não funciona | Verifique se o canal está configurado com `!config whitelist #canal` |
| Logs não aparecem | Confirme o canal com `!config ver` e verifique permissões do bot |
