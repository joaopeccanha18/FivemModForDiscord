/**
 * configManager.js
 * Utilitário central para leitura e escrita do config.json de forma segura.
 * Usado por todos os comandos !config e pelos eventos do bot.
 */
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

/**
 * Lê e retorna o objeto atual do config.json.
 * @returns {object}
 */
function getConfig() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (error) {
        console.error('[CONFIG] ❌ Falha ao ler config.json:', error.message);
        return {};
    }
}

/**
 * Salva um objeto atualizado no config.json usando merge com o atual.
 * @param {object} novosDados - Dados parciais ou completos para mesclar e salvar.
 * @returns {boolean} true se salvo com sucesso, false em caso de erro.
 */
function saveConfig(novosDados) {
    try {
        const atual = getConfig();
        const atualizado = deepMerge(atual, novosDados);
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(atualizado, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('[CONFIG] ❌ Falha ao salvar config.json:', error.message);
        return false;
    }
}

/**
 * Faz merge profundo de dois objetos (necessário para estrutura aninhada `canais`).
 */
function deepMerge(base, override) {
    const result = { ...base };
    for (const key of Object.keys(override)) {
        if (typeof override[key] === 'object' && override[key] !== null && !Array.isArray(override[key])) {
            result[key] = deepMerge(base[key] || {}, override[key]);
        } else {
            result[key] = override[key];
        }
    }
    return result;
}

module.exports = { getConfig, saveConfig };
