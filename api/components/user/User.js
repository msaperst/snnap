const db = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mysql = require('../../services/Mysql');
const Email = require('../../services/Email');
const { parseIntAndDbEscape } = require('../Common');

const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret-jwt-token';

const User = class {
  static register(firstName, lastName, location, email, username, password) {
    const newUser = new User();
    newUser.instancePromise = (async () => {
      let exists = await Mysql.query(
        `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(email)});`
      );
      if (exists.length) {
        throw new Error(
          'This email is already in our system. Try resetting your password.'
        );
      }
      exists = await Mysql.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER('${username
          .toString()
          .replace(/\W/gi, '')}');`
      );
      if (exists.length) {
        throw new Error('Sorry, that username is already in use.');
      }
      const hash = await bcrypt.hash(password, 10);
      const result = await Mysql.query(
        `INSERT INTO users (first_name, last_name, email, username, password, loc, lat, lon) VALUES (${db.escape(
          firstName
        )}, ${db.escape(lastName)}, ${db.escape(email)}, '${username
          .toString()
          .replace(/\W/gi, '')}', ${db.escape(hash)}, ${db.escape(
          location.loc
        )}, ${parseFloat(location.lat)}, ${parseFloat(location.lon)});`
      );
      newUser.id = result.insertId;
      newUser.username = username;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.loc = location.loc;
      newUser.lat = location.lat;
      newUser.lon = location.lon;
      newUser.email = email;
      // set up our default user settings
      await Mysql.query(`INSERT INTO settings (user) VALUE (${newUser.id});`);
      // set up our default user company
      await Mysql.query(`INSERT INTO companies (user) VALUE (${newUser.id});`);
    })();
    return newUser;
  }

  static decode(token) {
    if (token) {
      return jwt.verify(token, JWT_SECRET);
    }
    return { id: 0 };
  }

  static login(username, password, rememberMe) {
    const newUser = new User();
    newUser.instancePromise = (async () => {
      const user = await Mysql.query(
        `SELECT * FROM users WHERE username = '${username
          .toString()
          .replace(/\W/gi, '')}';`
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
        newUser.token = jwt.sign(
          { id: newUser.id, username },
          JWT_SECRET,
          options
        );
        await Mysql.query(
          `UPDATE users SET last_login = now() WHERE id = ${newUser.id};`
        );
        const u = await Mysql.query(
          `SELECT * FROM users WHERE id = ${newUser.id};`
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
    const decoded = User.decode(newUser.token);
    newUser.instancePromise = (async () => {
      const user = await Mysql.query(
        `SELECT * FROM users WHERE id = ${decoded.id};`
      );
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
      `UPDATE users SET avatar = ${db.escape(
        file
      )} WHERE id = ${await this.getId()}`
    );
    this.avatar = file;
  }

  async setAccountInformation(email) {
    const exists = await Mysql.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
        email
      )}) AND id != ${await this.getId()};`
    );
    if (exists.length) {
      throw new Error('This email is already in our system.');
    }
    await Mysql.query(
      `UPDATE users SET email  = ${db.escape(
        email
      )} WHERE id = ${await this.getId()}`
    );
    this.email = email;
  }

  async setPersonalInformation(firstName, lastName, location) {
    await Mysql.query(
      `UPDATE users SET first_name = ${db.escape(
        firstName
      )}, last_name = ${db.escape(lastName)}, loc = ${db.escape(
        location.loc
      )}, lat = ${parseFloat(location.lat)}, lon = ${parseFloat(
        location.lon
      )} WHERE id = ${await this.getId()}`
    );
    this.firstName = firstName;
    this.lastName = lastName;
    this.loc = location.loc;
    this.lat = location.lat;
    this.lon = location.lon;
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
        `UPDATE users SET password = ${db.escape(
          hash
        )} WHERE id = ${await this.getId()}`
      );
    } else {
      throw new Error("Current password doesn't match existing password.");
    }
  }

  static async forgot(email) {
    const user = await Mysql.query(
      `SELECT id, email FROM users WHERE email = ${db.escape(email)};`
    );
    if (user && user.length) {
      const n = (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
      await Mysql.query(
        `UPDATE users SET password_reset_code = ${db.escape(
          n
        )}, password_reset_count = 0 WHERE id = ${user[0].id};`
      );
      setTimeout(async () => {
        await Mysql.query(
          `UPDATE users SET password_reset_code = NULL WHERE id = ${user[0].id};`
        );
      }, 600000);
      Email.sendMail(
        user[0].email,
        'SNNAP: Password Reset',
        `We just received a password reset request from you.\nEnter the below code into the form.\n${n}\nThis code is only valid for 10 minutes, and will reset after 3 invalid reset attempts.`,
        `We just received a password reset request from you.<br/>Enter the below code into the form.<br/><b>${n}</b><br/>This code is only valid for 10 minutes, and will reset after 3 invalid reset attempts.`
      );
    }
  }

  static async reset(email, code, password) {
    await Mysql.query(
      `UPDATE users SET password_reset_count = password_reset_count+1 WHERE email = ${db.escape(
        email
      )};`
    );
    const user = await Mysql.query(
      `SELECT id, username FROM users WHERE email = ${db.escape(
        email
      )} AND password_reset_code = ${db.escape(
        code
      )} AND password_reset_count < 4;`
    );
    if (user && user.length) {
      const hash = await bcrypt.hash(password, 10);
      await Mysql.query(
        `UPDATE users SET password = ${db.escape(
          hash
        )}, password_reset_code = NULL WHERE id = ${user[0].id};`
      );
      return user[0].username;
    }
    throw new Error('Supplied code does not match!');
  }

  async updateNotificationSettings(email, push) {
    const id = await this.getId();
    await Mysql.query(
      `UPDATE settings SET email_notifications = ${Boolean(
        email
      )}, push_notifications = ${Boolean(push)} WHERE user = ${id};`
    );
  }

  async markNotificationRead(notification) {
    const id = await this.getId();
    await Mysql.query(
      `UPDATE notifications SET reviewed = true WHERE id = ${parseIntAndDbEscape(
        notification
      )} AND to_user = ${id};`
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
      loc: this.loc,
      lat: this.lat,
      lon: this.lon,
      rating: await User.getRating(this.id),
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

  async getSettings() {
    const id = await this.getId();
    if (id) {
      return (
        await Mysql.query(`SELECT * FROM settings WHERE user = ${id};`)
      )[0];
    }
    return {};
  }

  async getNeededRates() {
    const id = await this.getId();
    if (!id) {
      return [];
    }
    return Mysql.query(
      `SELECT id, ratee as userId, job as jobId FROM ratings WHERE rater = ${id} AND job_date < CURRENT_DATE AND date_rated IS NULL;`
    );
  }

  async rate(id, rating) {
    await Mysql.query(
      `UPDATE ratings SET rating = ${rating}, date_rated = CURRENT_TIMESTAMP WHERE id = ${id} AND rater = ${await this.getId()};`
    );
  }

  static async getRating(id) {
    if (!id) {
      return null;
    }
    const ratings = await Mysql.query(
      `SELECT * FROM ratings WHERE ratee = ${id} AND rating IS NOT NULL;`
    );
    if (ratings.length < 5) {
      return null;
    }
    const average =
      ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length;
    return Boolean(Math.round(average));
  }

  static async getBasicUserInfo(user) {
    const username = user.toString().replace(/\W/gi, '');
    let id;
    try {
      id = parseIntAndDbEscape(user);
    } catch (e) {
      id = "'NaN'";
    }

    const userInfo = (
      await Mysql.query(
        `SELECT id, username, first_name, last_name, avatar FROM users WHERE id = ${id} OR username = '${username}';`
      )
    )[0];
    if (userInfo) {
      userInfo.rating = await this.getRating(userInfo.id);
    }
    return userInfo;
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
