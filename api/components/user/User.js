const db = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mysql = require('../../services/Mysql');

const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret-jwt-token';

const User = class {
  static register(firstName, lastName, location, email, username, password) {
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
        `INSERT INTO users (first_name, last_name, email, username, password, loc, lat, lon)
         VALUES (${db.escape(firstName)}, ${db.escape(lastName)},
                 ${db.escape(email)}, ${db.escape(username)}, 
                 ${db.escape(hash)}, ${db.escape(location.loc)},
                 ${db.escape(location.lat)}, ${db.escape(location.lon)});`
      );
      newUser.id = result.insertId;
      newUser.username = username;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.loc = location.loc;
      newUser.lat = location.lat;
      newUser.lon = location.lon;
      newUser.email = email;
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
        const u = await Mysql.query(
          `SELECT *
           FROM users
           WHERE id = '${newUser.id}'`
        );
        newUser.id = u[0].id;
        newUser.username = u[0].username;
        newUser.avatar = u[0].avatar;
        newUser.firstName = u[0].first_name;
        newUser.lastName = u[0].last_name;
        newUser.email = u[0].email;
        newUser.loc = u[0].loc;
        newUser.lat = u[0].lat;
        newUser.lon = u[0].lon;
      } else {
        throw new Error('Username or password is incorrect!');
      }
    })();
    return newUser;
  }

  static auth(token) {
    const newUser = new User();
    newUser.token = token;
    const decoded = jwt.verify(newUser.token, JWT_SECRET);
    newUser.instancePromise = (async () => {
      const user = await Mysql.query(`SELECT *
                                      FROM users
                                      where id = ${decoded.id}`);
      if (user.length) {
        newUser.id = user[0].id;
        newUser.username = user[0].username;
        newUser.avatar = user[0].avatar;
        newUser.firstName = user[0].first_name;
        newUser.lastName = user[0].last_name;
        newUser.email = user[0].email;
        newUser.loc = user[0].loc;
        newUser.lat = user[0].lat;
        newUser.lon = user[0].lon;
      }
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

  async setAccountInformation(email) {
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
      `UPDATE users SET email  = ${db.escape(
        email
      )} WHERE id = ${await this.getId()}`
    );
  }

  async setPersonalInformation(firstName, lastName, location) {
    await Mysql.query(
      `UPDATE users
       SET first_name = ${db.escape(firstName)},
           last_name  = ${db.escape(lastName)},
           loc       = ${db.escape(location.loc)},
           lat       = ${db.escape(location.lat)},
           lon       = ${db.escape(location.lon)}
       WHERE id = ${await this.getId()}`
    );
  }

  async updatePassword(currentPassword, newPassword) {
    const user = await Mysql.query(
      `SELECT password FROM users WHERE id = ${await this.getId()};`
    );
    let bcryptResult;
    try {
      bcryptResult = await bcrypt.compare(currentPassword, user[0].password);
    } catch (error) {
      throw new Error("Current password doesn't match existing password.");
    }
    if (bcryptResult) {
      const hash = await bcrypt.hash(newPassword, 10);
      await Mysql.query(
        `UPDATE users
         SET password = ${db.escape(hash)}
         WHERE id = ${await this.getId()}`
      );
    } else {
      throw new Error("Current password doesn't match existing password.");
    }
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
      loc: this.loc,
      lat: this.lat,
      lon: this.lon,
    };
  }

  async getNotifications() {
    const id = await this.getId();
    if (id) {
      return Mysql.query(
        `SELECT * FROM notifications WHERE to_user = ${id} ORDER BY timestamp desc;`
      );
    }
    return [];
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
