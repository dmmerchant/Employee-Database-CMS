const ansi = require('../helpers/consoleColors')

const welcomeLogo = `
${ansi.BGblue}

    ██████  ███▄   ▄███  ██████▄   ██         ██████    ██      ██  ██████  ██████                ██████  ███▄   ▄███   ██████  
    ██      ██ █▄ ▄█ ██  ██    ██  ██        ██    ██    ██    ██   ██      ██                   ██       ██ █▄ ▄█ ██  ██    ██ 
    ██      ██  █▄█  ██  ██    ██  ██       ██      ██    ██  ██    ██      ██                  ██        ██  █▄█  ██  ▀██▄     
    █████   ██   █   ██  ██████▀   ██       ██      ██     ████     █████   █████              ██         ██   █   ██    ▀██▄   
    ██      ██       ██  ██        ██       ██      ██      ██      ██      ██                  ██        ██       ██      ▀██▄ 
    ██      ██       ██  ██        ██        ██    ██       ██      ██      ██                   ██       ██       ██  ██    ██ 
    ██████  ██       ██  ██        ████████   ██████        ██      ██████  ██████                ██████  ██       ██   ██████  

${ansi.BGgreen}${ansi.black}${ansi.bright}
  
            Welcome to the Employee Database CMS. The system that helps you manage your employee data with ease!!!  
  ${ansi.reset}
  `

module.exports = welcomeLogo