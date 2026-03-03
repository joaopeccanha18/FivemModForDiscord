# 🏙️ FivemModForDiscord — v7

> **Desenvolvido por João Peçanha**
> Sistema de integração completo entre um servidor FiveM de roleplay e o Discord — configurável 100% via comandos, sem editar código.

---

## ✨ Funcionalidades

### 🤖 Auto-Whitelist
- Monitora um canal dedicado do Discord para IDs de jogadores
- Aprova automaticamente o ID na tabela `vrp_users` do banco de dados
- Altera o apelido do membro para o formato `NomePersonagem | ID`
- Adiciona o cargo de cidadão automaticamente
- Deleta a mensagem do usuário e exibe confirmação visual de 5s

### ⚙️ Configuração Dinâmica
- Todas as configurações via comandos `!config` no Discord
- Alterações em vigor **imediatamente** — sem reiniciar o bot
- Configurações: IP do FiveM, canais, cargos, modo de status e mais

### 🎫 Sistema de Tickets
- `!setup` cria painel de suporte com botão interativo
- Membros clicam em **📩 Abrir Ticket** para canal privado
- Staff ou membro fecha com **🔒 Fechar Ticket** (contagem de 5s)
- Prevenção de tickets duplicados

### 🔧 Moderação Discord (Staff)
- `!clear` `!lock` `!unlock` `!slowmode`
- `!timeout` `!untimeout` `!dban` `!dkick` `!setnick`

### 📣 Ferramentas de Staff
- `!anunciar` `!embed` `!say` `!addemoji`
- `!liberar [ID]` — Whitelist manual
- `!wlsetup` — Reenviar embed de instrução no canal de WL

### 📊 Status ao Vivo
- Status do bot atualizado a cada 60s com players do FiveM
- Embed de status fixo num canal configurado

### 📨 Logs FiveM → Discord (resource `discord-logs`)
Enviados automaticamente via webhook sem passar pelo bot:
- ✅ Jogador conectou / ❌ Desconectou
- 💀 Mortes em combate — arma, distância, headshot
- 💀 Mortes por queda / NPC / ambiente

---

## 🗂️ Estrutura do Projeto

```
FivemModForDiscord/
├── bot-cidade/              ← Bot Discord (Node.js)
│   ├── index.js
│   ├── config.json          ← Configurações dinâmicas (!config)
│   ├── .env                 ← Credenciais (TOKEN, DB)
│   ├── utils/
│   │   ├── configManager.js
│   │   └── logger.js
│   ├── events/
│   │   ├── ready.js
│   │   ├── messageCreate.js
│   │   └── interactionCreate.js
│   └── commands/
│       ├── config/          ← !config, !wlsetup
│       ├── moderation/      ← !clear, !lock, !dban, !timeout...
│       └── discord/         ← !ajuda, !ip, !serverinfo...
├── discord-logs/            ← Resource Lua para FiveM
│   ├── fxmanifest.lua
│   ├── config.lua           ← URLs dos Webhooks
│   └── server.lua           ← Eventos + endpoint HTTP /kick
├── lista de comandos.md
├── TUTORIAL.md
├── PM2_TUTORIAL.md
└── README.md
```

---

## 🚀 Início Rápido

### 1. Configurar `.env`
```env
TOKEN=seu_token_do_bot
DB_HOST=ip_do_banco
DB_USER=usuario
DB_PASS=senha
DB_NAME=nome_do_banco
```

### 2. Iniciar o bot
```bash
cd bot-cidade
npm install
node index.js
```

### 3. Configurar pelo Discord
```
!config setip 45.123.45.6:30120
!config setstaff @Staff
!config whitelist #whitelist
!wlsetup
!config ver
```

### 4. Resource FiveM
```bash
# Copie discord-logs/ para resources/ no servidor FiveM
# Preencha os webhooks em discord-logs/config.lua
# Adicione ao server.cfg:
ensure baseevents
ensure discord-logs
```

### 5. Produção (VPS)
Consulte o **[PM2_TUTORIAL.md](./PM2_TUTORIAL.md)** para manter o bot 24/7 com reinício automático.

---

## 🧰 Tecnologias

| Componente | Tecnologia |
|---|---|
| Bot Discord | Node.js + Discord.js v14 |
| Banco de Dados | MySQL 2 |
| HTTP | Axios |
| Resource FiveM | Lua |
| Logs | Discord Webhooks |

---

## 📄 Licença

MIT — Livre para usar e modificar.