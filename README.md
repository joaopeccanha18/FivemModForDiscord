# 🏙️ WhitelistBot — Sistema de Integração FiveM + Discord

> **Desenvolvido por João Peçanha**
> Um sistema de integração completo e modular entre um servidor FiveM de roleplay e o Discord — sem precisar editar código para configurar.

---

## ✨ Funcionalidades

### 🤖 Auto-Whitelist
- Monitora um canal dedicado do Discord para IDs de jogadores
- Aprova automaticamente o ID na tabela `vrp_users` do banco de dados
- Deleta a mensagem do usuário instantaneamente
- Envia uma confirmação visual que se auto-apaga após 5 segundos

### ⚙️ Configuração Dinâmica (Sem Editar Código)
- Todas as configurações ficam no `config.json` e são gerenciadas via comandos `!config` no Discord
- Alterações entram em vigor **imediatamente** — sem reiniciar o bot
- Configurações: IP do servidor FiveM, prefixo, IDs de canais, autorole, modo de status e muito mais

### 🎭 Eventos Automáticos
- **Autorole** — Atribui automaticamente um cargo a novos membros
- **Mensagem de boas-vindas** — Envia uma embed rica quando alguém entra (personalizável com `{user}`, `{servidor}`, `{membros}`)
- **Mensagem de saída** — Envia uma embed quando alguém sai
- **Status Automático** — Atualiza o status "Jogando" do bot a cada 60s com a contagem de players ao vivo

### 🎫 Sistema de Tickets
- `!setup` cria um painel de suporte profissional com botões interativos
- Membros clicam em **📩 Abrir Ticket** para receber um canal privado
- Staff ou o próprio membro fecha com **🔒 Fechar Ticket** (contagem regressiva de 5s)
- Verificação de tickets duplicados

### 🛠️ Moderação FiveM (Staff)
- `!liberar [ID]` — Aprovação manual de whitelist
- `!ban [ID] [motivo]` — Registra banimento no banco de dados
- `!kick [ID] [motivo]` — Registra kick no banco de dados
- `!warn [ID] [motivo]` — Registra advertência com contador acumulado
- `!dvall` — Envia requisição HTTP ao servidor FiveM para deletar todos os veículos vazios

### 🔧 Moderação Discord (Staff)
- `!clear [N]` — Apaga até 100 mensagens em massa
- `!lock` / `!unlock` — Tranca/destranca o canal para @everyone
- `!slowmode [seg]` — Define o modo lento (0 desativa)
- `!timeout [@user] [min]` — Silencia temporariamente um membro
- `!untimeout [@user]` — Remove o silenciamento
- `!dban [@user] [motivo]` — Bane um membro do Discord
- `!dkick [@user] [motivo]` — Expulsa um membro do Discord
- `!setnick [@user] [apelido]` — Altera o apelido de um membro

### 📣 Ferramentas de Staff
- `!anunciar [#canal] [mensagem]` — Envia uma embed de anúncio com @everyone
- `!embed [título] | [descrição]` — Cria uma embed personalizada
- `!say [mensagem]` — Fala pelo bot
- `!addemoji [nome] [url]` — Adiciona emoji ao servidor a partir de uma URL

### 📊 Utilitários e Informações (Público)
- `!ajuda` — Lista completa de comandos por categoria
- `!ip` — Mostra o IP do servidor FiveM e a contagem de players ao vivo
- `!ping` — Latência do bot e da API
- `!serverinfo` — Estatísticas completas do servidor (membros, cargos, canais, boosts...)
- `!servericon` — Exibe o ícone do servidor
- `!serverbanner` — Exibe o banner do servidor (Nível de Boost 2+)
- `!userinfo [@user]` — Info de um membro (cargos, data de entrada, idade da conta...)
- `!sugerir [texto]` — Envia uma sugestão com reações de votação 👍/👎

### 📨 Logs do FiveM → Discord (resource `discord-logs`)
Logs avançados enviados via webhook diretamente para canais do Discord:
- ✅ Jogador conectou (nome, menção do Discord, licença)
- ❌ Jogador desconectou (nome, motivo)
- 💀 **Logs de combate avançados** — nome da arma, distância em metros, detecção de headshot
- 💊 Log de Heal por admin
- 🛡️ Log de God Mode por admin (ligado/desligado)
- 🗃️ Log de interação com baú/porta-malas

---

## 🗂️ Estrutura do Projeto

```
WhitelistBot/
├── bot-cidade/              ← Bot Discord em Node.js
│   ├── index.js             ← Entrada principal (carregamento recursivo)
│   ├── config.json          ← Configurações dinâmicas (gerenciadas via !config)
│   ├── .env.example         ← Template de credenciais estáticas
│   ├── utils/
│   │   └── configManager.js ← Leitura/escrita segura do config.json
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
├── discord-logs/            ← Resource Lua para FiveM (v3)
│   ├── fxmanifest.lua
│   ├── config.lua           ← URLs dos Webhooks
│   └── server.lua           ← Listeners de eventos + endpoint HTTP /dvall
├── ext-logs/                ← Resource Lua alternativo (v2)
│   ├── fxmanifest.lua
│   ├── config.lua
│   └── server.lua
├── lista de comandos.md     ← Referência completa de comandos
└── TUTORIAL.md              ← Guia de configuração passo a passo
```

---

## 🚀 Início Rápido

### 1. Configurar o Bot
```bash
cd bot-cidade
cp .env.example .env     # Preencha TOKEN e credenciais do BD
node index.js
```

### 2. Configurar pelo Discord
```
!config setip 45.123.45.6:30120
!config setstaff @Staff
!config whitelist #whitelist
!config entrada #boas-vindas
!config-autorole @Cidadão
!config ver
```

### 3. Resource FiveM
```bash
# Copie a pasta discord-logs/ para o diretório resources do seu FiveM
# Preencha os links dos webhooks em discord-logs/config.lua
# Adicione ao server.cfg:
ensure baseevents
ensure discord-logs
```

---

## 🧰 Tecnologias Utilizadas

| Componente | Tecnologia |
|---|---|
| Bot Discord | Node.js + Discord.js v14 |
| Banco de Dados | MySQL 2 (connection pool) |
| Configuração | `fs` + JSON (dinâmico, sem reiniciar) |
| Requisições HTTP | Axios |
| Resource FiveM | Lua (Cerulean) |
| Logs via Webhook | `PerformHttpRequest` nativo |

---

## 📄 Licença

MIT — Livre para usar e modificar.