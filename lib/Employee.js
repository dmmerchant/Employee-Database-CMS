const db = require('../config/connection')

class Employee {
    constructor(id,first_name,last_name,role_id,manager_id) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
        this.name = first_name + ' ' + last_name
    }
    getID(){
        return this.id
    }
    getFullNameFL(){
        return this.first_name + ' ' + this.last_name
    }
    getFullNameLF(){
        return this.last_name + ', ' + this.first_name 
    }
    async getRole(){
        return "Employee"
    }
    async getSalary(){

    }
    async getManagerName(){

    }
    async getManagerInfo(){

    }
    async getSubordinates(){

    }
}

module.exports = Employee