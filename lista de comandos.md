# 📋 Lista de Comandos — Bot Cidade (v4)

---

## 🤖 Automações (sem comando — funcionam sozinhas)

| Função | Como funciona |
|---|---|
| **Auto-Whitelist** | No canal configurado, o jogador envia só o número do ID → bot aprova no BD, deleta e exibe confirmação de 5s |
| **Status Automático** | A cada 60s atualiza o "Jogando" com players do FiveM (modo `auto`) |
| **Autorole** | Cargo aplicado automaticamente a novos membros |
| **Boas-vindas** | Embed enviada no canal de entrada quando alguém entra |
| **Saída** | Embed enviada no canal de saída quando alguém sai |

---

## ⚙️ Configuração do Bot (somente Administradores)

| Comando | Descrição |
|---|---|
| `!config ver` | Exibe toda a configuração atual |
| `!config setip [IP:PORTA]` | Define o IP do servidor FiveM |
| `!config setstaff [@cargo]` | Define o cargo de Staff Geral |
| `!config setticketrole [@cargo]` | Define o cargo de Atendimento para Tickets |
| `!config whitelist [#canal]` | Define o canal de Auto-Whitelist |
| `!config entrada [#canal]` | Define o canal de boas-vindas |
| `!config saida [#canal]` | Define o canal de saída |
| `!config sugerir [#canal]` | Define o canal de sugestões |
| `!config estatistica [#canal]` | Define o canal de estatísticas |
| `!config combate [#canal]` | Define o canal de logs de combate |
| `!config admin [#canal]` | Define o canal de logs de admin |
| `!config bau [#canal]` | Define o canal de logs de baús |
| `!config ticket [#canal]` | Define o canal de logs de tickets |
| `!config categoria [ID]` | Define a categoria onde os tickets serão criados |
| `!config status [#canal]` | Define o canal com embed de status fixo da cidade |
| `!config prefixo [símbolo]` | Muda o prefixo do bot (ex: `.`, `?`) |
| `!config statusbot auto` | Status mostra players do FiveM |
| `!config statusbot manual [TIPO] [texto]` | Status manual (PLAYING/WATCHING/LISTENING/COMPETING) |
| `!config nomebot [nome]` | Muda apelido do bot no servidor |
| `!config avatarbot [url]` | Muda o avatar global do bot |
| `!config autorole [@cargo]` | Cargo dado automaticamente a novos membros |

---

## 🛠️ Moderação FiveM (Staff ou Admin)

| Comando | Descrição |
|---|---|
| `!liberar [ID]` | Whitelist manual de um passaporte |
| `!ban [ID] [motivo]` | Registra banimento no banco de dados |
| `!kick [ID] [motivo]` | Registra kick no banco de dados |
| `!warn [ID] [motivo]` | Registra advertência (conta o total) |
| `!dvall` | Limpa todos os veículos vazios no FiveM |

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
| `!ping` | Mostra latência do bot e da API |
| `!serverinfo` | Informações completas do servidor |
| `!servericon` | Exibe o ícone do servidor |
| `!serverbanner` | Exibe o banner do servidor (Boost 2+) |
| `!userinfo [@user]` | Informações de um membro |
| `!sugerir [texto]` | Envia sugestão com votação 👍/👎 |

---

## 📨 Logs Recebidos do FiveM

> Chegam automaticamente via Webhook configurado no `discord-logs/config.lua`.

| Log | Descrição |
|---|---|
| ✅ Jogador Conectou | Nome, Discord, licença |
| ❌ Jogador Desconectou | Nome, motivo, identificadores |
| 💀 Registro de Morte | Morto, matador, arma, distância, headshot |
| 💊 Admin: Heal | Admin que curou e jogador alvo |
| 🛡️ Admin: God Mode | Admin que ativou/desativou |
| 🗃️ Baú / Porta-malas | Jogador e detalhes da interação |
