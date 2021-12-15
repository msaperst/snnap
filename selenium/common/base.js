const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const User = require('../../api/components/user/User');
const Mysql = require("../../api/services/Mysql");

class Base {

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  static getApp() {
    return process.env.APP || 'http://localhost:3000';
  }

  async getDriver() {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().headless())
      .build();
    await driver.get(Base.getApp());
    return driver;
  }

  getApp() {
    return Base.getApp();
  }

  addUser(username) {
    return User.register(username, 'password', 'Test User', `${username}@example.org`);
  }

  async loginUser(driver, username) {
    let user = this.addUser(username);
    user = await User.login(await user.getUsername(), 'password');
    const userJson = {
      token: await user.getToken(),
      name: await user.getName(),
      username: await user.getUsername(),
      email: await user.getEmail(),
    };
    await driver.executeScript(async function (json) {
      localStorage.setItem("currentUser", JSON.stringify(json));
    }, userJson);
    return user;
  }

  async removeUser(username) {
    await Mysql.query(
      `DELETE
       FROM users
       WHERE username = '${username}';`
    );
  }
}

module.exports = new Base();
