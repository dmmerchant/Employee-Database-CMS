const db = require('../config/connection')

class Role {
    constructor(id,title,salary,department_id) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
        this.name = title;
    }
    getID(){
        return this.id
    }
    getTitle(){
        return this.title
    }
    getSalary(){
        return this.salary
    }
    async getEmployees(){
        
    }
    async getDepartmentName(){
        
    }
    async getUtilizedBudget(){

    }
}

module.exports = Role