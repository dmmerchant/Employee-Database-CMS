const inquirer = require("inquirer");
const db = require('../config/connection');
const ansi = require('../helpers/consoleColors')

function warningMessage(message){
    return `${ansi.yellow + ansi.bright + message + ansi.reset}`
}

function errorMessage(message){
    return `${ansi.red + ansi.bright + message + ansi.reset}`
}

function successMessage(message){
    return `${ansi.green + ansi.bright + message + ansi.reset}`
}

class EmployeeDB {
    constructor() {
    }

    //#region Queries
    //#region Basic Queries
    //These are generic queries that are utilized to display tables

    //returns query for all deparments
    allDepartments(whereClause = '') {
        var query = `SELECT id as ID, name AS Department FROM department`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        return query
    }

    //returns query for all roles and displays the department name
    allRoles(whereClause = '') {
        var query = `SELECT  role.id as ID, title AS Title,salary AS Salary,department.name AS Department 
                    FROM role LEFT JOIN department on role.department_id = department.id`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        return query
    }

    //returns a query for all employees ordered by first name. Joins the roles and department table to show title and department.
    //Joins back on the employee table to get the full name of the person's manager
    employeeByFirst(whereClause = '',alpha = true) {
        var query = `SELECT a.id as ID, a.first_name AS 'First Name', a.last_name AS 'Last Name', Title, Salary, Department, c.name AS Manager
                    FROM employee AS a
                    JOIN (${this.allRoles()}) AS b on a.role_id = b.id
                    LEFT JOIN (${this.searchEmpFullName()}) AS c on a.manager_id = c.id`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        if (!alpha){
            query += ` ORDER BY a.id`
        }else{
            query += ` ORDER BY a.first_name`
        }
        
        return query
    }

    //returns a query for all employees ordered by last name. Joins the roles and department table to show title and department.
    //Joins back on the employee table to get the full name of the person's manager
    employeeByLast(whereClause = '',alpha = true) {
        var query = `SELECT a.id as ID, a.last_name AS 'Last Name', a.first_name AS 'First Name', Title, Salary, Department, c.name AS Manager
                    FROM employee AS a
                    JOIN (${this.allRoles()}) AS b on a.role_id = b.id
                    LEFT JOIN (${this.searchEmpFullName()}) AS c on a.manager_id = c.id`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        };
        if (!alpha){
            query += ` ORDER BY a.id`
        }else{
            query += ` ORDER BY a.last_name`
        }
        return query
    }

    budgetDepartment() {
        var query = `SELECT Department, count(*) AS '# of Employees', sum(Salary) AS 'Utilized Budget'
                    FROM (${this.employeeByFirst()}) AS Employees
                    GROUP BY Department`
        return query
    }

    budgetRole() {
        var query = `SELECT Title as Role, count(*) AS '# of Employees', sum(Salary) AS 'Utilized Budget'
                    FROM (${this.employeeByFirst()}) AS Employees
                    GROUP BY Title`
        return query
    }
    //#endregion

    //#region Helper Queries
    //These queries are utilized either in inquirer prompts or to look up a record id for modifications

    searchDepartments(whereClause = '') {
        var query = `SELECT id, name FROM department`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        return query
    }

    //Specifically searches the roles. Title is changed to name to work with inquirer
    searchRoles(whereClause = '') {
        var query = `SELECT id, title AS name from role`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        return query
    }

    //Utilizes the employee query to find all employees that are managers. Manager is changed to name to work with inquirer
    searchManagers() {
        var query = `SELECT DISTINCT Manager AS name FROM (${this.employeeByFirst()}) AS a where Manager is not NULL;`
        return query
    }

    //Utilizes the employee query to find all employees that are managers. Manager is changed to name to work with inquirer
    searchEmpFullName(nameClause = '') {
        var query = `SELECT id, concat(first_name, " ", last_name) AS name
                    FROM employee`
        if (nameClause != '') {
            query += ` WHERE concat(first_name, " ", last_name) ${nameClause}`
        }
        return query
    }
    //#endregion
    //#endregion


    //#region Functions
    //#region Generic Functions
    //These are reusable generic input, update, and delete functions
    async inputRecord(table, fields, values) {
        var query = `INSERT INTO ${table} (${fields})
                    VALUES (${values})`
        await db.query(query);
        console.log(successMessage(`\n The new ${table} has been added to the database successully.\n`))
        return
    }

    async updateRecord(table,fields,values,id){
        var setStatement = []
        for (var i = 0; i < fields.length; i++) { 
            setStatement.push(`${fields[i]} = ${values[i]}`);
        }
        var query = `UPDATE ${table} SET ${setStatement} WHERE id = ${id}`
        await db.query(query);
        console.log(successMessage(`\n The record has been updated successully.\n`))
    }


    async deleteRecord(table, id) {
        var query = `DELETE from ${table} where id = ${id}`
        await db.query(query);
        console.log(successMessage(`\n The record has been deleted from ${table}.\n`))
        return
    }


    async generalInput(message) {
        var val = await inquirer.prompt(
            [{
                type: "input",
                name: "name",
                message: message
            }]
        );
        console.log(val.name);
        return val.name;
    }

    async generalList(message,values){
        var val = await inquirer.prompt(
            [{
                type: "list",
                name: "name",
                message: message,
                choices: values,
                loop: false
            }]
        );
        console.log(val.name);
        return val.name;
    }

    async displayError(error) {
        var val = await inquirer.prompt(
            [
            {
                type: "confirm",
                name: "confirm",
                message: "Would you like to view the error details?",
                default: false
                
            }]
        );
        if (val.confirm) {
            console.log(error);
            await this.generalInput("Press ENTER to return to main menu...");
        }
        return
    
    }

    //#endregion



    //#region View Functions
    //These are functions build appropriate queries based on selection.
    
    //Allows the user to choose if Employees should be ordered by first name or last name. Returns the proper query
    async employeeOrder(whereClause = '') {
        var val = await inquirer.prompt(
            [{
                type: "list",
                name: "type",
                message: "How would you like employees to be displayed?",
                choices: [
                    'First Name | Last Name',
                    'Last Name | First Name'
                ],
                loop: false
                
            },
            {
                type: "confirm",
                name: "order",
                message: "Would you like the employees ordered alphabetically?"
                
            }]
        );
        if (val.type == 'First Name | Last Name') {
            return this.employeeByFirst(whereClause,val.order);
        } else {
            return this.employeeByLast(whereClause,val.order);
        }
    }

    async allManagers(){
        var [rows, fields] = await db.query(this.searchManagers())
        var manager = rows.map(x => `'${x.name}'`);
        return await this.employeeOrder(`concat(a.first_name," ", a.last_name) in (${manager.join(",")})`);
    }

    async employeeByManager(){
        var manager = await this.selectManager();
        return await this.employeeOrder(`c.name = '${manager}'`);
    }

    async employeeByDepartment(){
        var department = await this.selectDepartment();
        return await this.employeeOrder(`Department = '${department}'`);
    }

    async employeeByRole(){
        var role = await this.selectRole();
        return await this.employeeOrder(`Title = '${role}'`);
    }

    //#endregion

    //#region Selection Functions
    //These are functions that allow the user to select a specific record.
    
    async selectDepartment(message = 'Select a department...') {
        var [rows, fields] = await db.query(this.searchDepartments());
        return await this.generalList(message,rows)
    }

    async selectRole(message = 'Select a role...') {
        var [rows, fields] = await db.query(this.searchRoles());
        return await this.generalList(message,rows)
    }

    async selectManager(message = 'Select a manager...') {
        var [rows, fields] = await db.query(this.searchManagers());
        return await this.generalList(message,rows)
    }

    async selectEmployee(message = 'Select an employee...', allowNull = false,nameClause) {
        var [rows, fields] = await db.query(this.searchEmpFullName(nameClause));
        if (allowNull) {
            rows = ["NONE", new inquirer.Separator(), ...rows]
        }
        var val = await inquirer.prompt(
            [{
                type: "list",
                name: "name",
                message: message,
                choices: rows,
                loop: false
            }]
        );
        return val.name
    }
    //#endregion

    //#region INSERT Functions

    async addDepartment(){
        var name = await this.generalInput('What is the name of the department?');
        try{
            await this.inputRecord("department", "name", `'${name}'`);
        } catch(error){
            console.log(errorMessage("An error occured while trying to insert the record."));
            await this.displayError(error);
        }
        
        return;
    }

    
    async addRole(){
        var title = await this.generalInput('What is the name of the Role?');
        var salary = await this.generalInput('What is the salary for this role?');
        var department = await this.selectDepartment("What department does this role belong to?");
        var [rows, fields] = await db.query(this.searchDepartments(`name = '${department}'`));

        try{
            await this.inputRecord("role", "title,salary,department_id", `'${title}',${salary},${rows[0].id}`);
        } catch(error){
            console.log(errorMessage("An error occured while trying to insert the record."));
            await this.displayError(error);
        }
        
        return;
    }


    async addEmployee() {
        var firstName = await this.generalInput(`What is the employee's first name?`);
        var lastName = await this.generalInput(`What is the employee's last name?`);
        var role = await this.selectRole("What role does this employee have?");
        var [rows, fields] = await db.query(this.searchRoles(`title = '${role}'`));
        role = rows[0].id

        var manager = await this.selectEmployee("Who does the employee report to?", true);
        if (manager != "NONE") {
            var [rows, fields] = await db.query(this.searchEmpFullName(`= '${manager}'`));
            manager = rows[0].id
        } else {
            manager = 'NULL'
        }
        try{
            await this.inputRecord("employee", "first_name,last_name,role_id,manager_id", `'${firstName}','${lastName}',${role},${manager}`);
        } catch(error){
            console.log(errorMessage("An error occured while trying to insert the record."));
            await this.displayError(error);
        }
        
        return;
    }
    //#endregion

    //#region UPDATE functions
    async updateDepartment(){
        var department = await this.selectDepartment("What department would you like to update?");
        var [rows, fields] = await db.query(this.searchDepartments(`name = '${department}'`));
        department = rows[0].id
        var name = await this.generalInput('What is the name of the department?');
        try{
            await this.updateRecord("department",[`name`],[`'${name}'`],department);
        } catch(error){
            console.log(errorMessage(`An error occured while trying to update the record.`));
            await this.displayError(error);
        }
        
        return;
    }

    async updateRole(){
        var fieldNames = [];
        var values = [];
        var role = await this.selectRole("What role would you like to update?");
        var [rows, fields] = await db.query(this.searchRoles(`title = '${role}'`));
        role = rows[0].id
        var val = await inquirer.prompt(
            [{
                type: "checkbox",
                name: "updates",
                message: "What fields would you like to update?",
                choices: ['Title','Salary','Department']
            }]
        );
        console.log(val.updates)
        if(val.updates.includes('Title')){
            fieldNames.push("title")
            var title = await this.generalInput('What is the new title of the role?')
            values.push(`'${title}'`);
        }
        if(val.updates.includes('Salary')){
            fieldNames.push("salary")
            values.push(await this.generalInput('What is the new salary of the role?'));
        }
        if(val.updates.includes('Department')){
            fieldNames.push("department_id")
            var department = await this.selectDepartment();
            [rows, fields] = await db.query(this.searchDepartments(`name = '${department}'`));
            values.push(rows[0].id)
        }
        if (fieldNames.length != 0){
            try{
                await this.updateRecord("role",fieldNames,values,role)
            } catch(error){
                console.log(errorMessage("An error occured while trying to update the record."));
                await this.displayError(error);
            }
        } else {
            console.log(warningMessage("No fields were selected for updating. The request to update has been cancelled."))
        }
        

        return;

    }

    async updateEmployee(){
        var fieldNames = [];
        var values = [];
        var employee = await this.selectEmployee("What employee would you like to update?");
        var [rows, fields] = await db.query(this.searchEmpFullName(`= '${employee}'`));
        var employeeID = rows[0].id
        var val = await inquirer.prompt(
            [{
                type: "checkbox",
                name: "updates",
                message: "What fields would you like to update?",
                choices: ['First Name','Last Name','Role','Manager']
            }]
        );
        console.log(val.updates)
        if(val.updates.includes('First Name')){
            fieldNames.push("first_name")
            var firstName = await this.generalInput('What is the new first name of the employee?')
            values.push(`'${firstName}'`);
        }
        if(val.updates.includes('Last Name')){
            fieldNames.push("last_name")
            var lastName = await this.generalInput('What is the new last name of the employee?');
            values.push(`'${lastName}'`)
        }
        if(val.updates.includes('Role')){
            fieldNames.push("role_id")
            var role = await this.selectRole("What role would you like to update?");
            var [rows, fields] = await db.query(this.searchRoles(`title = '${role}'`));
            values.push(rows[0].id)
        }
        if(val.updates.includes('Manager')){
            fieldNames.push("manager_id")
            var manager = await this.selectEmployee("Who is does the employee report to?",true,`<> '${employee}'`);
            if (manager != "NONE") {
                var [rows, fields] = await db.query(this.searchEmpFullName(`= '${manager}'`));
                values.push(rows[0].id)
            } else {
                values.push('NULL')
            }
        }
        if (fieldNames.length != 0){
            try{
                await this.updateRecord("employee",fieldNames,values,employeeID)
            } catch(error){
                console.log(errorMessage("An error occured while trying to update the record."));
                await this.displayError(error);
            }
        } else {
            console.log(warningMessage("No fields were selected for updating. The request to update has been cancelled."))
        }
        

        return;
    }

    //#endregion

    //#region DELETE functions
    async deleteDepartment(){
        var department = await this.selectDepartment("What department would you like to delete?");
        var [rows, fields] = await db.query(this.searchDepartments(`name = '${department}'`));
        try{
            await this.deleteRecord("department",rows[0].id);
        } catch(error){
            console.log(errorMessage("An error occured while trying to delete the record."));
            await this.displayError(error);
        }
        
        return;
    }

    async deleteRole(){
        var role = await this.selectRole("What role would you like to delete?");
        var [rows, fields] = await db.query(this.searchRoles(`title = '${role}'`));
        try{
            await this.deleteRecord("role",rows[0].id);
        } catch(error){
            console.log(errorMessage("An error occured while trying to delete the record."));
            await this.displayError(error);
        }
        
        return;
    }

    async deleteEmployee(){
        var employee = await this.selectEmployee("What employee would you like to delete?");
        var [rows, fields] = await db.query(this.searchEmpFullName(`= '${employee}'`));
        try{
            await this.deleteRecord("employee",rows[0].id);
        } catch(error){
            console.log(errorMessage("An error occured while trying to delete the record."));
            await this.displayError(error);
        }
        
        return;
    }

    //#endregion

    //#endregion
}

module.exports = new EmployeeDB()