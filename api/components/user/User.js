const db = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mysql = require('../../services/Mysql');

const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret-jwt-token';

const User = class {
  static login(username, password) {
    const newUser = new User();
    newUser.instancePromise = (async () => {
      const user = await Mysql.query(
        `SELECT *
         FROM users
         WHERE username = ${db.escape(username)};`
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
      newUser.id = user[0].id;
      if (bcryptResult) {
        newUser.token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
          expiresIn: '1h',
        });
        await Mysql.query(
          `UPDATE users
           SET last_login = now()
           WHERE id = '${newUser.id}'`
        );
        newUser.name = user[0].name;
        newUser.username = user[0].username;
        newUser.email = user[0].email;
      } else {
        throw new Error('Username or password is incorrect!');
      }
    })();
    return newUser;
  }

  static register(username, password, name, email) {
    const newUser = new User();
    newUser.instancePromise = (async () => {
      let exists = await Mysql.query(
        `SELECT *
         FROM users
         WHERE LOWER(email) = LOWER(${db.escape(email)});`
      );
      if (exists.length) {
        throw new Error(
          'This email is already in our system. Try resetting your password.'
        );
      }
      exists = await Mysql.query(
        `SELECT *
         FROM users
         WHERE LOWER(username) = LOWER(${db.escape(username)});`
      );
      if (exists.length) {
        throw new Error('Sorry, that username is already in use.');
      }
      const hash = await bcrypt.hash(password, 10);
      await Mysql.query(
        `INSERT INTO users (name, username, email, password)
         VALUES ('${name}',
                 ${db.escape(username)},
                 ${db.escape(email)},
                 ${db.escape(hash)})`
      );
      newUser.username = username;
      newUser.name = name;
      newUser.email = email;
    })();
    return newUser;
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
