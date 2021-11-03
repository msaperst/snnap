const db = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mysql = require('../../services/Mysql');

const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret-jwt-token';

const User = class {
  constructor(username, password) {
    this.instancePromise = (async () => {
      const user = await Mysql.query(
        `SELECT * FROM users WHERE username = ${db.escape(username)};`
      );
      if (!user.length) {
        throw new Error('Username or password is incorrect!');
      }
      let bcryptResult;
      try {
        bcryptResult = await bcrypt.compare(password, user[0].password);
      } catch (error) {
        throw new Error('Username or password is incorrect!');
      }
      this.id = user[0].id;
      if (bcryptResult) {
        this.token = jwt.sign({ id: this.id }, JWT_SECRET, {
          expiresIn: '1h',
        });
        await Mysql.query(
          `UPDATE users SET last_login = now() WHERE id = '${this.id}'`
        );
        this.name = user[0].name;
        this.username = user[0].username;
        this.email = user[0].email;
      } else {
        throw new Error('Username or password is incorrect!');
      }
    })();
  }

  async getToken() {
    await this.instancePromise;
    return this.token;
  }

  async getName() {
    await this.instancePromise;
    return this.name;
  }

  async getUsername() {
    await this.instancePromise;
    return this.username;
  }

  async getEmail() {
    await this.instancePromise;
    return this.email;
  }
};

module.exports = User;
