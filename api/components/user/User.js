const db = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mysql = require('../../services/Mysql');

const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret-jwt-token';

const User = class {
  static register(
    firstName,
    lastName,
    username,
    email,
    number,
    password,
    city,
    state,
    zip
  ) {
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
      const result = await Mysql.query(
        `INSERT INTO users (first_name, last_name, username, email, number, password, city, state, zip)
         VALUES (${db.escape(firstName)}, ${db.escape(lastName)},
                 ${db.escape(username)}, ${db.escape(email)},
                 ${db.escape(number)}, ${db.escape(hash)},
                 ${db.escape(city)}, ${db.escape(state)},
                 ${db.escape(zip)})`
      );
      newUser.id = result.insertId;
      newUser.username = username;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.number = number;
      newUser.city = city;
      newUser.state = state;
      newUser.zip = zip;
    })();
    return newUser;
  }

  static login(username, password, rememberMe) {
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
        let options = {};
        if (!rememberMe) {
          options = { expiresIn: '1h' };
        }
        newUser.token = jwt.sign({ id: newUser.id }, JWT_SECRET, options);
        await Mysql.query(
          `UPDATE users
           SET last_login = now()
           WHERE id = '${newUser.id}'`
        );
        const user = await Mysql.query(
          `SELECT *
           FROM users
           WHERE id = '${newUser.id}'`
        );
        newUser.id = user[0].id;
        newUser.username = user[0].username;
        newUser.avatar = user[0].avatar;
        newUser.firstName = user[0].first_name;
        newUser.lastName = user[0].last_name;
        newUser.email = user[0].email;
        newUser.number = user[0].number;
        newUser.city = user[0].city;
        newUser.state = user[0].state;
        newUser.zip = user[0].zip;
      } else {
        throw new Error('Username or password is incorrect!');
      }
    })();
    return newUser;
  }

  static auth(token) {
    const newUser = new User();
    newUser.token = token;
    newUser.instancePromise = (async () => {
      const decoded = jwt.verify(newUser.token, JWT_SECRET);
      const user = await Mysql.query(`SELECT *
                                      FROM users
                                      where id = ${decoded.id}`);
      newUser.id = user[0].id;
      newUser.username = user[0].username;
      newUser.avatar = user[0].avatar;
      newUser.firstName = user[0].first_name;
      newUser.lastName = user[0].last_name;
      newUser.email = user[0].email;
      newUser.number = user[0].number;
      newUser.city = user[0].city;
      newUser.state = user[0].state;
      newUser.zip = user[0].zip;
    })();
    return newUser;
  }

  static async isAuth(authorizationHeader) {
    const token = User.getToken(authorizationHeader);
    const user = User.auth(token);
    return user.getToken();
  }

  async setAvatar(file) {
    await Mysql.query(
      `UPDATE users
       SET avatar = ${db.escape(file)}
       WHERE id = ${await this.getId()}`
    );
  }

  async setAccountInformation(email, number) {
    const exists = await Mysql.query(
      `SELECT *
       FROM users
       WHERE LOWER(email) = LOWER(${db.escape(email)})
         AND id != ${await this.getId()};`
    );
    if (exists.length) {
      throw new Error('This email is already in our system.');
    }
    await Mysql.query(
      `UPDATE users
       SET email  = ${db.escape(email)},
           number = ${db.escape(number)}
       WHERE id = ${await this.getId()}`
    );
  }

  async setPersonalInformation(firstName, lastName, city, state, zip) {
    await Mysql.query(
      `UPDATE users
       SET first_name = ${db.escape(firstName)},
           last_name  = ${db.escape(lastName)},
           city       = ${db.escape(city)},
           state      = ${db.escape(state)},
           zip        = ${db.escape(zip)}
       WHERE id = ${await this.getId()}`
    );
  }

  async getToken() {
    await this.instancePromise;
    return this.token;
  }

  async getId() {
    await this.instancePromise;
    return this.id;
  }

  async getUsername() {
    await this.instancePromise;
    return this.username;
  }

  async getInfo() {
    await this.instancePromise;
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      number: this.number,
      city: this.city,
      state: this.state,
      zip: this.zip,
    };
  }

  static getToken(authorization) {
    if (
      !authorization ||
      !authorization.startsWith('Bearer') ||
      !authorization.split(' ')[1]
    ) {
      throw new Error('Please provide the access token');
    }
    return authorization.split(' ')[1];
  }
};

module.exports = User;
