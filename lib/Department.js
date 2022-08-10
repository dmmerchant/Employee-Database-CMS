const db = require('../config/connection')

class Department {
    constructor(id,name) {
        this.id = id;
        this.name = name;
    }
    getID(){
        return this.id
    }
    getName(){
        return this.name
    }
    async getRoles(){
        
    }
    async getEmployees(){
        
    }
    async getUtilizedBudget(){

    }
}

module.exports = Department