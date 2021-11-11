const mysql = require('mysql');
const util = require('util');

const config = {
  host: '127.0.0.1', // Replace with your host name
  user: 'seconds', // Replace with your database username
  password: 'seconds_password', // Replace with your database password
  database: 'seconds', // // Replace with your database Name
};

const Mysql = class {
  static async query(queryString) {
    const conn = mysql.createConnection(config);
    const query = util.promisify(conn.query).bind(conn);
    try {
      return await query(queryString);
    } finally {
      conn.end();
    }
  }
};

module.exports = Mysql;
