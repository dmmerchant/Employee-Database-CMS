const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('../config/connection');
const welcomeLogo = require('./WelcomeLogo')
const ansi = require('../helpers/consoleColors')
const Employee = require('./Employee')
const Department = require('./Department')
const Role = require('./Role')
const mainMenuList = [
    {
        type: "list",
        name: "type",
        message: "Select an option",
        choices: [
            `${ansi.green}View All Departments`,
            `${ansi.green}View All Roles`,
            `${ansi.green}View All Employees`,
            `${ansi.green}View Employees by Manager`,
            `${ansi.green}View Employees by Department`,
            `${ansi.green}View Employees by Role`,
            new inquirer.Separator(),
            `${ansi.blue}Add a Deparment`,
            `${ansi.blue}Add a Role`,
            `${ansi.blue}Add an Employee`,
            new inquirer.Separator(),
            `${ansi.yellow}Update a Department`,
            `${ansi.yellow}Update a Role`,
            `${ansi.yellow}Update an Employee`,
            new inquirer.Separator(),
            `${ansi.red}Delete a Department`,
            `${ansi.red}Delete a Role`,
            `${ansi.red}Delete a Manager`,
            new inquirer.Separator(),
            `${ansi.cyan}Get Utilized Budget by Department`,
            `${ansi.cyan}Get Utilized Budget by Role`,
            new inquirer.Separator(),
            `${ansi.magenta}EXIT`
        ],
        loop: false
    }
]

const responsePause = [
    {
        type: "input",
        name: "type",
        message: "Press ENTER to return to main menu..."
    }
]

class MainMenu {
    constructor() {
        this.allDepartments = [];
        this.allEmployees = [];
    }
    init() {
        console.log(welcomeLogo)
        this.main();
    }
    async displayTable(data,empty){
        if(data.length == 0){
            data.push(empty)
        }
        console.info(` \n \n`);
        console.table(data);
        console.info(`\n`);
        await inquirer.prompt(responsePause);
        this.main();
    }
    async main() {
        let [rows, fields] = [[],[]];
        var val = await inquirer.prompt(mainMenuList);
        switch (val.type) {
            case `${ansi.green}View All Departments`:
                [rows,fields] = await db.query('SELECT * FROM department');
                this.displayTable(rows,{'id':'','name':''})
                break;

            case `${ansi.green}View All Roles`:
                [rows,fields] = await db.query('SELECT role.id,title,salary,department.name FROM role LEFT JOIN department on role.department_id = department.id');
                console.info(` \n \n`);
                console.log(rows);
                console.info(`\n`);
                await inquirer.prompt(responsePause)
                this.init();
                break;

            case 'View All Employees':
                this.employeePrompt();
                break;

            case 'View Employees by Manager':

                break;

            case 'View Employees by Department':

                break;

            case 'View Employees by Role':

                break;

            case 'View Employees by Manager':

                break;

            case 'Add a Deparment':

                break;

            case 'Add a Role':

                break;

            case 'Add an Employee':

                break;

            case 'Update a Department':

                break;

            case 'Update a Role':

                break;

            case 'Update an Employee':

                break;

            case 'Delete a Department':

                break;

            case 'Delete a Role':

                break;

            case 'Delete a Manager':

                break;

            case 'Get Utilized Budget by Department':

                break;

            case 'Get Utilized Budget by Role':

                break;

            case 'EXIT':

                break;
        }

    };

    async responsePause() {
        inquirer
            .prompt()
            .then(
                this.init
            );
    }

    employeePrompt() {
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "type",
                    message: "Select an option",
                    choices: [
                        'View Last Name First',
                        'View First Name Last'
                    ]
                }
            ])
            .then(val => {
                switch (val.type) {
                    case 'View Last Name First':
                        db.query('SELECT last_name,first_name,title,salary,department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id ORDER BY last_name ASC', function (err, results) {
                            console.table(results);
                        })
                        break;

                    case 'View First Name Last':
                        db.query('SELECT role.id,title,salary,department.name FROM role LEFT JOIN deparment on role.department_id = department.id', function (err, results) {
                            console.table(results);
                        })
                            .then(this.init);
                        break;
                }
            });
    }

    exitMenu() {

    }
}

module.exports = MainMenu