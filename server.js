const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('./config/connection');
const ansi = require('./helpers/consoleColors')
const welcomeLogo = require('./lib/WelcomeLogo');
const employeeDB = require("./lib/EmployeeDB");
const { updateDepartment } = require("./lib/EmployeeDB");
const mainMenuList = [
    {
        type: "list",
        name: "type",
        message: "Select an option",
        choices: [
            `${ansi.green}View All Departments`,
            `${ansi.green}View All Roles`,
            `${ansi.green}View All Employees`,
            `${ansi.green}View All Managers`,
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
            `${ansi.red}Delete an Employee`,
            new inquirer.Separator(),
            `${ansi.cyan}Get Utilized Budget by Department`,
            `${ansi.cyan}Get Utilized Budget by Role`,
            new inquirer.Separator(),
            `${ansi.magenta}EXIT`
        ],
        loop: false
    }
]


function init() {
    console.log(welcomeLogo)
    main();
}

async function main() {
    var [rows, fields] = [[], []];
    var employee,manager,department,role,query
    var val = await inquirer.prompt(mainMenuList);
    switch (val.type) {
        case `${ansi.green}View All Departments`:
            displayTable(employeeDB.allDepartments())
            break;

        case `${ansi.green}View All Roles`:
            displayTable(employeeDB.allRoles())
            break;

        case `${ansi.green}View All Employees`:
            query = await employeeDB.employeeOrder();
            displayTable(query);
            break;

        case `${ansi.green}View All Managers`:
            query = await employeeDB.allManagers();
            displayTable(query)
            break;

        case `${ansi.green}View Employees by Manager`:
            query = await employeeDB.employeeByManager();
            displayTable(query);
            break;

        case `${ansi.green}View Employees by Department`:
            query = await employeeDB.employeeByDepartment();
            displayTable(query);
            break;

        case `${ansi.green}View Employees by Role`:
            query = await employeeDB.employeeByRole();
            displayTable(query);
            break;

        case `${ansi.blue}Add a Deparment`:
            await employeeDB.addDepartment();
            main();
            break;

        case `${ansi.blue}Add a Role`:
            await employeeDB.addRole();
            main();
            break;

        case `${ansi.blue}Add an Employee`:
            await employeeDB.addEmployee();
            main();
            break;

        case `${ansi.yellow}Update a Department`:
            await employeeDB.updateDepartment();
            main();
            break;

        case `${ansi.yellow}Update a Role`:
            await employeeDB.updateRole();
            main();
            break;

        case `${ansi.yellow}Update an Employee`:
            await employeeDB.updateEmployee();
            main();
            break;

        case `${ansi.red}Delete a Department`:
            await employeeDB.deleteDepartment();
            main();
            break;

        case `${ansi.red}Delete a Role`:
            await employeeDB.deleteRole();
            main();
            break;

        case `${ansi.red}Delete an Employee`:
            await employeeDB.deleteEmployee();
            main();
            break;

        case `${ansi.cyan}Get Utilized Budget by Department`:
            displayTable(employeeDB.budgetDepartment())
            break;

        case `${ansi.cyan}Get Utilized Budget by Role`:
            displayTable(employeeDB.budgetRole())
            break;

        case `${ansi.magenta}EXIT`:
            
            exitMenu();
            break;
    }

};




async function displayTable(query) {
    //get the data using the supplied query
    const [rows, fields] = await db.query(query);

    //if no records are returned, display appropriate message, otherwise display table
    if (rows.length == 0) {
        console.log(`\n**There are no records to display**\n`)
    } else {
        console.info(`\n`);
        console.table(rows);
    }
    //Gives the user a chance to view table before returning to the main menu
    await inquirer.prompt(
        [
            {
                type: "input",
                name: "type",
                message: "Press ENTER to return to main menu..."
            }
        ]
    );
    main();
}



function exitMenu() {
    console.log("\nGoodbye!");
    process.exit(0);
}


init();