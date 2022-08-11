const inquirer = require("inquirer");
const db = require('../config/connection');

class EmployeeDB {
    constructor() {
    }
    allDepartments() {
        return `SELECT id as ID, name AS Name FROM department`
    }
    allRoles() {
        var query = `SELECT  role.id as ID, title AS Title,salary AS Salary,department.name AS Department 
                    FROM role LEFT JOIN department on role.department_id = department.id`

        return query
    }
    innerJoinRoles() {
        var query = `SELECT role.id, title AS Title,salary AS Salary,department.name AS Department 
                    FROM role LEFT JOIN department on role.department_id = department.id`

        return query
    }

    searchDepartments(whereClause = ''){
        var query = `SELECT * FROM department`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        return query
    }

    searchRoles(whereClause = ''){
        var query = `SELECT id, title AS name from role`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        return query
    }

    searchManagers(){
        var query = `SELECT DISTINCT Manager AS name FROM (${this.employeeByFirst()}) AS a where Manager is not NULL;`
        return query
    }

    searchEmpFullName(name = '') {
        var query = `SELECT id, concat(first_name, " ", last_name) AS name
                    FROM employee`
        if (name != '') {
            query += ` WHERE concat(first_name, " ", last_name) = '${name}' `
        }
        return query
    }
    employeeByFirst(whereClause = '') {
        var query = `SELECT a.id as ID, a.first_name AS 'First Name', a.last_name AS 'Last Name', Title, Salary, Department, c.name AS Manager
                    FROM employee AS a
                    JOIN (${this.innerJoinRoles()}) AS b on a.role_id = b.id
                    LEFT JOIN (${this.searchEmpFullName()}) AS c on a.manager_id = c.id`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        }
        query += ` ORDER BY a.first_name` 
        return query
    }
    employeeByLast(whereClause = '') {
        var query = `SELECT a.id as ID, a.last_name AS 'Last Name', a.first_name AS 'First Name', Title, Salary, Department, c.name AS Manager
                    FROM employee AS a
                    JOIN (${this.innerJoinRoles()}) AS b on a.role_id = b.id
                    LEFT JOIN (${this.searchEmpFullName()}) AS c on a.manager_id = c.id`
        if (whereClause != '') {
            query += ` WHERE ${whereClause} `
        };
        query += ` ORDER BY a.last_name`
        return query
    }
    budgetDepartment(){
        var query = `SELECT Department, count(*) AS '# of Employees', sum(Salary) AS 'Utilized Budget'
                    FROM (${this.employeeByFirst()}) AS Employees
                    GROUP BY Department`
        return query
    }
    budgetRole(){
        var query = `SELECT Title as Role, count(*) AS '# of Employees', sum(Salary) AS 'Utilized Budget'
                    FROM (${this.employeeByFirst()}) AS Employees
                    GROUP BY Title`
        return query
    }
    async selectDepartment() {
        var [rows, fields] = await db.query(this.searchDepartments());
        var val = await inquirer.prompt(
            [{
                type: "list",
                name: "name",
                message: "Select a Department?",
                choices: rows
            }]
        );
        return val.name
    }
    
    async selectRole(message = 'Select a role...') {
        var [rows, fields] = await db.query(this.searchRoles());
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
    
    async selectManager(message = 'Select a manager...') {
        var [rows, fields] = await db.query(this.searchManagers());
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
    
    async selectEmployee(message = 'Select an employee...',allowNull = false) {
        var [rows, fields] = await db.query(this.searchEmpFullName());
        if (allowNull) {
            rows = ["NONE",new inquirer.Separator(),...rows]
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
    async inputRecord(table,fields,values){
        var query = `INSERT INTO ${table} (${fields})
        VALUES (${values})`
        await db.query(query);
        console.log(`\n The new ${table} has been added to the database successully.\n`)
        return
    }
    async deleteRecord(table,id){
        var query = `DELETE from ${table} where ID = ${id}`
        await db.query(query);
        console.log(`\n The record has been deleted from ${table}.\n`)
        return
    }
}

module.exports = new EmployeeDB()