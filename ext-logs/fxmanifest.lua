fx_version 'cerulean'
game 'gta5'

author 'João Peçanha'
description 'Sistema de Logs do FiveM para Discord (mortes, baús, admin, limpeza de veículos)'
version '2.0.0'

-- O FiveM carrega config.lua antes para as variáveis estarem disponíveis
server_scripts {
    'config.lua',
    'server.lua'
}
