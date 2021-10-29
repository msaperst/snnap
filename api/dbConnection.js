const mysql = require('mysql');

const conn = mysql.createConnection({
  host: '127.0.0.1', // Replace with your host name
  user: 'seconds', // Replace with your database username
  password: 'seconds_password', // Replace with your database password
  database: 'seconds', // // Replace with your database Name
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;
