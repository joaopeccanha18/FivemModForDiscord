#!/bin/bash
# ============================================================
# setup.sh — Instalação automática do FivemModForDiscord
# Pré-requisito: .env já configurado em bot-cidade/.env
# Uso: bash setup.sh
# ============================================================

set -e  # Para na primeira falha

BOLD="\e[1m"
GREEN="\e[32m"
YELLOW="\e[33m"
RESET="\e[0m"

echo -e "${BOLD}${GREEN}"
echo "============================================"
echo "  FivemModForDiscord — Setup Automático"
echo "============================================"
echo -e "${RESET}"

# Detecta o diretório do script (independente de onde for executado)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$SCRIPT_DIR/bot-cidade"

# ── 1. Node.js ───────────────────────────────────────────────
echo -e "${YELLOW}[1/5] Instalando Node.js v20...${RESET}"
if ! command -v node &> /dev/null; then
    apt-get update -qq
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
    echo "      Node.js $(node -v) instalado."
else
    echo "      Node.js já instalado: $(node -v)"
fi

# ── 2. Verificar .env ────────────────────────────────────────
echo -e "${YELLOW}[2/5] Verificando .env...${RESET}"
if [ ! -f "$BOT_DIR/.env" ]; then
    echo ""
    echo "  ❌ Arquivo .env não encontrado em bot-cidade/.env"
    echo "  Configure-o antes de rodar este script."
    echo "  Exemplo:"
    echo "    TOKEN=seu_token"
    echo "    DB_HOST=ip_do_banco"
    echo "    DB_USER=usuario"
    echo "    DB_PASS=senha"
    echo "    DB_NAME=nome_do_banco"
    exit 1
fi
echo "      .env encontrado ✅"

# ── 3. Dependências npm ──────────────────────────────────────
echo -e "${YELLOW}[3/5] Instalando dependências (npm install)...${RESET}"
cd "$BOT_DIR"
npm install --silent
echo "      Dependências instaladas ✅"

# ── 4. PM2 ──────────────────────────────────────────────────
echo -e "${YELLOW}[4/5] Instalando PM2...${RESET}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 --silent
    echo "      PM2 instalado ✅"
else
    echo "      PM2 já instalado: $(pm2 -v)"
fi

# Para processo antigo se existir
pm2 delete fivemmoddiscord 2>/dev/null || true

# Inicia o bot
pm2 start index.js --name "fivemmoddiscord"
pm2 save

# ── 5. Auto-start no boot ────────────────────────────────────
echo -e "${YELLOW}[5/5] Configurando auto-start no boot...${RESET}"
STARTUP_CMD=$(pm2 startup | grep "sudo env" | tail -1)
if [ -n "$STARTUP_CMD" ]; then
    eval "$STARTUP_CMD"
    pm2 save
    echo "      Auto-start configurado ✅"
else
    echo "      ⚠️ Execute manualmente: pm2 startup"
fi

# ── Resumo ───────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}============================================"
echo "  ✅ Setup concluído!"
echo "============================================${RESET}"
echo ""
echo "  Comandos úteis:"
echo "    pm2 logs fivemmoddiscord     → Ver logs"
echo "    pm2 restart fivemmoddiscord  → Reiniciar"
echo "    pm2 list                     → Status"
echo ""
