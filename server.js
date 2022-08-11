const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('./config/connection');
const ansi = require('./helpers/consoleColors')
const welcomeLogo = require('./lib/WelcomeLogo');
const employeeDB = require("./lib/EmployeeDB");
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


const responsePause = [
    {
        type: "input",
        name: "type",
        message: "Press ENTER to return to main menu..."
    }
]

function init() {
    console.log(welcomeLogo)
    main();
}

async function main() {
    var [rows, fields] = [[], []];
    var employee,manager,department,role
    var val = await inquirer.prompt(mainMenuList);
    switch (val.type) {
        case `${ansi.green}View All Departments`:
            displayTable(employeeDB.allDepartments())
            break;

        case `${ansi.green}View All Roles`:
            displayTable(employeeDB.allRoles())
            break;

        case `${ansi.green}View All Employees`:
            allEmployees();
            break;

        case `${ansi.green}View All Managers`:
            [rows, fields] = await db.query(employeeDB.searchManagers())
            manager = rows.map(x => `'${x.name}'`);
            allEmployees(`concat(a.first_name," ", a.last_name) in (${manager.join(",")})`);
            break;

        case `${ansi.green}View Employees by Manager`:
            manager = await employeeDB.selectManager();
            allEmployees(`c.name = '${manager}'`)
            break;

        case `${ansi.green}View Employees by Department`:
            department = await employeeDB.selectDepartment();
            allEmployees(`Department = '${department}'`)
            break;

        case `${ansi.green}View Employees by Role`:
            role = await employeeDB.selectRole();
            allEmployees(`Title = '${role}'`)
            break;

        case `${ansi.blue}Add a Deparment`:
            var val = await inquirer.prompt(
                [{
                    type: "input",
                    name: "name",
                    message: "What is the name of the department?",
                }]
            );
            await employeeDB.inputRecord("department", "name", `'${val.name}'`);
            main();
            break;

        case `${ansi.blue}Add a Role`:
            var val = await inquirer.prompt(
                [
                    {
                        type: "input",
                        name: "title",
                        message: "What is the name of the Role?",
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "What is the salary for this role?"
                    }
                ]
            );
            department = await employeeDB.selectDepartment("What department does this role belong to?");
            [rows, fields] = await db.query(employeeDB.searchDepartments(`name = '${department}'`));
            await employeeDB.inputRecord("role", "title,salary,department_id", `'${val.title}',${val.salary},${rows[0].id}`);
            main();
            break;

        case `${ansi.blue}Add an Employee`:
            await employeeDB.addEmployee();
            main();
            break;

        case `${ansi.yellow}Update a Department`:

            break;

        case `${ansi.yellow}Update a Role`:

            break;

        case `${ansi.yellow}Update an Employee`:
            
            break;

        case `${ansi.red}Delete a Department`:
            department = await employeeDB.selectDepartment("What department would you like to delete?");
            [rows, fields] = await db.query(employeeDB.searchDepartments(`name = '${department}'`));
            await employeeDB.deleteRecord("department",rows[0].id);
            main();
            break;

        case `${ansi.red}Delete a Role`:
            role = await employeeDB.selectRole("What role would you like to delete?");
            [rows, fields] = await db.query(employeeDB.searchRoles(`title = '${role}'`));
            await employeeDB.deleteRecord("role",rows[0].id);
            main();
            break;

        case `${ansi.red}Delete an Employee`:
            employee = await employeeDB.selectEmployee("What employee would you like to delete?");
            [rows, fields] = await db.query(employeeDB.searchEmpFullName(`${employee}`));
            await employeeDB.deleteRecord("employee",rows[0].id);
            main();
            break;

        case `${ansi.cyan}Get Utilized Budget by Department`:
            displayTable(employeeDB.budgetDepartment())
            break;

        case `${ansi.cyan}Get Utilized Budget by Role`:
            displayTable(employeeDB.budgetRole())
            break;
            break;

        case `${ansi.magenta}EXIT`:

            break;
    }

};

async function allEmployees(whereClause = '') {
    var val = await inquirer.prompt(
        [{
            type: "list",
            name: "type",
            message: "How would you like employees to be displayed?",
            choices: [
                'First Name | Last Name',
                'Last Name | First Name'
            ]
        }]
    );
    if (val.type == 'First Name | Last Name') {
        displayTable(employeeDB.employeeByFirst(whereClause))
    } else {
        displayTable(employeeDB.employeeByLast(whereClause))
    }
}


async function displayTable(query) {
    const [rows, fields] = await db.query(query);
    if (rows.length == 0) {
        console.log(`\n**There are no records to display**\n`)
    } else {
        console.info(` \n \n`);
        console.table(rows);
    }
    await inquirer.prompt(responsePause);
    main();
}



function exitMenu() {

}


init();