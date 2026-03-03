# 🖥️ Tutorial Completo — Deploy do Bot na VPS com PM2

> Do zero ao bot rodando 24/7 com reinício automático.

---

## 📋 Pré-requisitos

- VPS com Ubuntu/Debian (recomendado)
- Acesso root via SSH
- O projeto `WhitelistBot` disponível na VPS (via Git ou upload manual)

---

## ⚙️ PARTE 1 — Instalar Node.js

```bash
# Atualiza os pacotes do sistema
apt update && apt upgrade -y

# Instala o curl (se não tiver)
apt install curl -y

# Instala o Node.js v20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Confirma a instalação
node -v   # deve mostrar v20.x.x
npm -v    # deve mostrar 10.x.x
```

---

## 📁 PARTE 2 — Colocar o Projeto na VPS

### Opção A — Via Git (recomendado)
```bash
cd /root
git clone https://github.com/SEU_USUARIO/WhitelistBot.git
cd WhitelistBot/bot-cidade
```

### Opção B — Upload Manual (SFTP/FileZilla)
- Faça upload da pasta `bot-cidade` para `/root/WhitelistBot/bot-cidade`

---

## 🔑 PARTE 3 — Configurar o `.env`

```bash
cd /root/WhitelistBot/bot-cidade
cp .env.example .env
nano .env
```

Preencha os dados:
```env
TOKEN=seu_token_do_bot
DB_HOST=IP_DO_BANCO
DB_USER=usuario_do_banco
DB_PASS=senha_do_banco
DB_NAME=nome_do_banco
RCON_PORT=30120
RCON_PASSWORD=senha_rcon
```

Salve com `Ctrl+O`, `Enter`, depois `Ctrl+X`.

---

## 📦 PARTE 4 — Instalar as Dependências

```bash
cd /root/WhitelistBot/bot-cidade
npm install
```

### Testar se inicia corretamente
```bash
node index.js
```

Se aparecer `[BOT] ✅ Online como NomeDoBot#0000`, está funcionando.  
Pressione `Ctrl+C` para parar — agora vamos colocar no PM2.

---

## 🚀 PARTE 5 — Instalar e Configurar o PM2

### Instalar o PM2 globalmente
```bash
npm install -g pm2
```

### Iniciar o bot com PM2
```bash
cd /root/WhitelistBot/bot-cidade
pm2 start index.js --name "whitelistbot"
```

### Salvar o processo
```bash
pm2 save
```

### Configurar para iniciar automaticamente no boot
```bash
pm2 startup
```

> ⚠️ **IMPORTANTE:** O comando acima vai gerar uma linha começando com `sudo env PATH=...`  
> **Copie essa linha exatamente** e execute no terminal.

**Exemplo do que aparece (a sua será diferente):**
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

Depois execute novamente:
```bash
pm2 save
```

---

## ✅ Verificar se está tudo certo

```bash
pm2 list
```

Deve aparecer algo assim:
```
┌─────┬──────────────┬─────────┬──────┬───────────┬──────────┐
│ id  │ name         │ status  │ cpu  │ mem       │ uptime   │
├─────┼──────────────┼─────────┼──────┼───────────┼──────────┤
│  0  │ whitelistbot │ online  │ 0%   │ 80mb      │ 2m       │
└─────┴──────────────┴─────────┴──────┴───────────┴──────────┘
```

---

## 🔧 Comandos do Dia a Dia

| Comando | O que faz |
|---|---|
| `pm2 list` | Lista os processos |
| `pm2 logs whitelistbot` | Ver os logs em tempo real |
| `pm2 logs whitelistbot --lines 200` | Ver os últimos 200 logs |
| `pm2 restart whitelistbot` | Reiniciar o bot |
| `pm2 stop whitelistbot` | Parar o bot |
| `pm2 delete whitelistbot` | Remover do PM2 |
| `pm2 monit` | Painel visual com CPU/RAM |

---

## 🔄 Atualizar o Bot

Quando fizer alterações no código:
```bash
cd /root/WhitelistBot/bot-cidade
# (se usando Git)
git pull

pm2 restart whitelistbot
```

---

## ❓ Problemas Comuns

| Problema | Solução |
|---|---|
| Bot não inicia | Rode `pm2 logs whitelistbot` e veja o erro |
| Bot não volta após reboot | Rode `pm2 startup` + `pm2 save` novamente |
| `Cannot find module` | Rode `npm install` dentro de `bot-cidade/` |
| Token inválido | Verifique o `.env` — token não pode ter espaços |
| Erro de banco de dados | Confirme host, usuário, senha e nome do banco no `.env` |
