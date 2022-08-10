const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('./config/connection');
const ansi = require('./helpers/consoleColors')
const Employee = require('./lib/Employee')
const Department = require('./lib/Department')
const Role = require('./lib/Role')
const MainMenu = require('./lib/MainMenu')


var beginRun = new MainMenu();
beginRun.init();