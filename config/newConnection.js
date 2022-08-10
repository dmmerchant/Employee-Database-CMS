// get the client
const Tester = async function Tester(query){
    const mysql = require('mysql2/promise');

    // get the promise implementation, we will use bluebird
    const bluebird = require('bluebird');
    
    // create the connection, specify bluebird as Promise
    const connection = await mysql.createConnection(
        {
          host: 'localhost',
          // MySQL username,
          user: 'root',
          // TODO: Add MySQL password
          password: 'Pzcb!Froderick1977',
          database: 'employee_db',
          Promise: bluebird
        }
    );
    
    // query database
    const [rows, fields] = await connection.execute(query);
    console.log(rows)
    return rows
}

module.exports = Tester
