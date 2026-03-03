# 📋 Lista de Comandos — Bot Cidade (v4)

---

## 🤖 Automações (sem comando — funcionam sozinhas)

| Função | Como funciona |
|---|---|
| **Auto-Whitelist** | Jogador envia só o ID → bot aprova no BD, muda o apelido para `Nome \| ID`, adiciona cargo de WL, deleta a msg original e exibe confirmação de 5s |
| **Status Automático** | A cada 60s atualiza o "Jogando" com players do FiveM |

---

## ⚙️ Configuração do Bot (somente Administradores)

| Comando | Descrição |
|---|---|
| `!config ver` | Exibe toda a configuração atual |
| `!config setip [IP:PORTA]` | Define o IP do servidor FiveM |
| `!config setstaff [@cargo]` | Define o cargo de Staff Geral |
| `!config setticketrole [@cargo]` | Define o cargo de Atendimento para Tickets |
| `!config whitelist [#canal]` | Define o canal de Auto-Whitelist |
| `!config ticket [#canal]` | Define o canal de tickets |
| `!config categoria [ID]` | Define a categoria onde os tickets serão criados |
| `!config status [#canal]` | Define o canal com embed de status fixo da cidade |
| `!config logs [#canal]` | Canal de logs de moderação geral |
| `!config logswl [#canal]` | Canal de logs de Whitelist aprovada |
| `!config logsticket [#canal]` | Canal de logs de Tickets abertos/fechados |
| `!config logscombate [#canal]` | Canal de logs de Combate (mortes do FiveM) |

---

## 🛠️ Moderação FiveM (Staff ou Admin)

| Comando | Descrição |
|---|---|
| `!liberar [ID]` | Whitelist manual de um passaporte |
| `!wlsetup` | Reenvia a embed de instrução no canal de whitelist |

---

## 🔧 Moderação Discord (Staff ou Admin)

| Comando | Permissão Necessária | Descrição |
|---|---|---|
| `!clear [1-100]` | Gerenciar Mensagens | Apaga N mensagens do canal |
| `!lock` | Gerenciar Canais | Tranca o canal para @everyone |
| `!unlock` | Gerenciar Canais | Destranca o canal |
| `!slowmode [0-21600]` | Gerenciar Canais | Define modo lento (seg) |
| `!timeout [@user] [min] [motivo]` | Silenciar Membros | Silencia temporariamente |
| `!untimeout [@user]` | Silenciar Membros | Remove silenciamento |
| `!dban [@user] [motivo]` | Banir Membros | Bane do servidor Discord |
| `!dkick [@user] [motivo]` | Expulsar Membros | Expulsa do servidor Discord |
| `!setnick [@user] [apelido]` | Gerenciar Apelidos | Muda apelido (vazio = remove) |

---

## 📣 Ferramentas de Staff

| Comando | Descrição |
|---|---|
| `!anunciar [#canal] [mensagem]` | Envia anúncio com @everyone no canal |
| `!embed [título] \| [descrição]` | Cria uma embed personalizada |
| `!say [mensagem]` | Fala pelo bot (deleta o comando) |
| `!addemoji [nome] [url]` | Adiciona emoji ao servidor |
| `!setup` | Cria o painel de tickets com botão |
| Botão **📩 Abrir Ticket** | Cria canal privado de ticket |
| Botão **🔒 Fechar Ticket** | Fecha o canal após 5 segundos |

---

## 📊 Utilitários e Informações (Público)

| Comando | Descrição |
|---|---|
| `!ajuda` | Lista todos os comandos por categoria |
| `!ip` | Mostra o IP e players online do servidor |
| `!serverinfo` | Informações completas do servidor |
| `!userinfo [@user]` | Informações de um membro |

---

## 📨 Logs Recebidos do FiveM

> Chegam automaticamente via Webhook configurado no `discord-logs/config.lua`.

| Log | Descrição |
|---|---|
| ✅ Jogador Conectou | Nome, Discord, licença |
| ❌ Jogador Desconectou | Nome, motivo, identificadores |
| 💀 Morte em Combate | Morto, matador, arma, distância, headshot |
| 💀 Morte Registrada | Morto, causa (queda/NPC/ambiente), motivo |
