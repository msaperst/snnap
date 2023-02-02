const mysql = require('mysql2');
const util = require('util');

const config = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: process.env.MYSQL_PORT || '3306',
  user: process.env.MYSQL_USER || 'snnap',
  password: process.env.MYSQL_PASSWORD || 'snnap_password',
  database: process.env.MYSQL_DATABASE || 'snnap',
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
