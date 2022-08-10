const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: 'Pzcb!Froderick1977',
      database: 'employee_db'
    }
  );
  module.exports = db.promise()