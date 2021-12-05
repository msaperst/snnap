const mysql = require('mysql');
const util = require('util');

const config = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'seconds',
  password: process.env.MYSQL_PASSWORD || 'seconds_password',
  database: process.env.MYSQL_DATABASE || 'seconds',
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
