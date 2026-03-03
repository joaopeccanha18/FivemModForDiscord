# 🏙️ WhitelistBot — FiveM + Discord Integration System

> **Developed by João Peçanha**
> A complete, modular integration system between a FiveM roleplay server and Discord — with zero code editing required for configuration.

---

## ✨ Features

### 🤖 Auto-Whitelist
- Monitors a dedicated Discord channel for player IDs
- Automatically approves the ID in the `vrp_users` database table
- Deletes the user's message instantly
- Sends a self-deleting confirmation after 5 seconds

### ⚙️ Dynamic Configuration (No Code Editing)
- All settings are stored in `config.json` and managed via `!config` commands in Discord
- Changes take effect **instantly** — no bot restart required
- Settings: FiveM server IP, prefix, channel IDs, autorole, status mode, and more

### 🎭 Auto Events
- **Autorole** — Automatically assigns a role to new members
- **Welcome message** — Sends a rich embed when someone joins (customizable with `{user}`, `{servidor}`, `{membros}`)
- **Leave message** — Sends an embed when someone leaves
- **Auto Status** — Updates the bot's "Playing" status every 60s with the live player count

### 🎫 Ticket System
- `!setup` creates a professional support panel with interactive buttons
- Members click **📩 Open Ticket** to get a private channel
- Staff or the member can close with **🔒 Close Ticket** (5s countdown)
- Checks for open tickets to prevent duplicates

### 🛠️ FiveM Moderation (Staff)
- `!liberar [ID]` — Manual whitelist approval
- `!ban [ID] [reason]` — Records a ban in the database
- `!kick [ID] [reason]` — Records a kick in the database
- `!warn [ID] [reason]` — Records a warning with cumulative counter
- `!dvall` — Sends an HTTP request to the FiveM server to delete all empty vehicles

### 🔧 Discord Moderation (Staff)
- `!clear [N]` — Bulk delete up to 100 messages
- `!lock` / `!unlock` — Lock/unlock a channel for @everyone
- `!slowmode [sec]` — Set slow mode (0 disables)
- `!timeout [@user] [min]` — Temporarily mute a member
- `!untimeout [@user]` — Remove a timeout
- `!dban [@user] [reason]` — Ban a member from Discord
- `!dkick [@user] [reason]` — Kick a member from Discord
- `!setnick [@user] [nickname]` — Change a member's nickname

### 📣 Staff Tools
- `!anunciar [#channel] [message]` — Send a @everyone announcement embed
- `!embed [title] | [description]` — Create a custom embed
- `!say [message]` — Speak as the bot
- `!addemoji [name] [url]` — Add an emoji to the server from a URL

### 📊 Utilities & Info (Public)
- `!ajuda` — Full command list organized by category
- `!ip` — Shows the FiveM server IP and live player count
- `!ping` — Bot and API latency
- `!serverinfo` — Full server stats (member count, roles, channels, boosts...)
- `!servericon` — Displays the server icon
- `!serverbanner` — Displays the server banner (Boost Level 2+)
- `!userinfo [@user]` — Member info (roles, join date, account age...)
- `!sugerir [text]` — Send a suggestion with 👍/👎 voting reactions

### 📨 FiveM → Discord Logs (`discord-logs` resource)
Advanced webhook-based logging sent directly to Discord channels:
- ✅ Player connected (name, Discord mention, license)
- ❌ Player disconnected (name, reason)
- 💀 **Advanced kill logs** — weapon name, distance in meters, headshot detection
- 💊 Admin Heal log
- 🛡️ Admin God Mode log (on/off)
- 🗃️ Chest / trunk interaction log

---

## 🗂️ Project Structure

```
WhitelistBot/
├── bot-cidade/              ← Node.js Discord Bot
│   ├── index.js             ← Entry point (recursive command loader)
│   ├── config.json          ← Dynamic settings (managed via !config)
│   ├── .env.example         ← Static credentials template
│   ├── utils/
│   │   └── configManager.js ← Safe read/write for config.json
│   ├── events/
│   │   ├── ready.js
│   │   ├── messageCreate.js
│   │   ├── interactionCreate.js
│   │   ├── guildMemberAdd.js
│   │   └── guildMemberRemove.js
│   └── commands/
│       ├── config/          ← !config, !config-prefixo, !config-statusbot...
│       ├── moderation/      ← !ban, !kick, !warn, !clear, !dban, !timeout...
│       └── discord/         ← !ajuda, !ip, !ping, !serverinfo, !sugerir...
├── discord-logs/            ← FiveM Lua Resource (v3)
│   ├── fxmanifest.lua
│   ├── config.lua           ← Webhook URLs
│   └── server.lua           ← Event listeners + /dvall HTTP endpoint
├── ext-logs/                ← Alternative FiveM Lua Resource (v2)
│   ├── fxmanifest.lua
│   ├── config.lua
│   └── server.lua
├── lista de comandos.md     ← Full command reference (PT-BR)
└── TUTORIAL.md              ← Setup guide (PT-BR)
```

---

## 🚀 Quick Start

### 1. Bot Setup
```bash
cd bot-cidade
cp .env.example .env     # Fill in TOKEN and DB credentials
node index.js
```

### 2. In-Discord Configuration
```
!config setip 45.123.45.6:30120
!config setstaff @Staff
!config whitelist #whitelist
!config entrada #welcome
!config-autorole @Citizen
!config ver
```

### 3. FiveM Resource
```bash
# Copy discord-logs/ to your FiveM resources folder
# Fill in webhook URLs in discord-logs/config.lua
# Add to server.cfg:
ensure baseevents
ensure discord-logs
```

---

## 🧰 Tech Stack

| Component | Technology |
|---|---|
| Discord Bot | Node.js + Discord.js v14 |
| Database | MySQL 2 (connection pool) |
| Config | `fs` + JSON (dynamic, no restart) |
| HTTP Client | Axios |
| FiveM Resource | Lua (Cerulean) |
| Webhook Logs | Native `PerformHttpRequest` |

---

## 📄 License

MIT — Free to use and modify.