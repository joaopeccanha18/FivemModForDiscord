const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow = null;
let botProcess = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 660,
        minWidth: 700,
        minHeight: 500,
        title: 'FiveM Bot Launcher',
        icon: path.join(__dirname, 'icon.png'),
        frame: false,
        backgroundColor: '#0d0f17',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    stopBot();
    app.quit();
});

// ── IPC: controlo da janela ──────────────────────────────────
ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:close', () => { stopBot(); mainWindow?.close(); });

// ── IPC: iniciar bot ────────────────────────────────────────
ipcMain.on('bot:start', () => {
    if (botProcess) return;

    const botDir = path.join(__dirname, '..', 'bot-cidade');

    botProcess = spawn('node', ['index.js'], {
        cwd: botDir,
        env: process.env,
        shell: true,
    });

    sendStatus('online');

    botProcess.stdout.on('data', (data) => {
        sendLog({ type: 'info', text: data.toString() });
    });

    botProcess.stderr.on('data', (data) => {
        sendLog({ type: 'error', text: data.toString() });
    });

    botProcess.on('close', (code) => {
        sendLog({ type: 'warn', text: `Processo terminou com código ${code}` });
        sendStatus('offline');
        botProcess = null;
    });

    botProcess.on('error', (err) => {
        sendLog({ type: 'error', text: `Erro ao iniciar: ${err.message}` });
        sendStatus('offline');
        botProcess = null;
    });
});

// ── IPC: parar bot ──────────────────────────────────────────
ipcMain.on('bot:stop', stopBot);

function stopBot() {
    if (!botProcess) return;
    botProcess.kill();
    botProcess = null;
    sendStatus('offline');
}

function sendLog(data) {
    mainWindow?.webContents.send('bot:log', data);
}

function sendStatus(status) {
    mainWindow?.webContents.send('bot:status', status);
}
