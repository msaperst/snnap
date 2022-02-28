const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const User = require('../../api/components/user/User');
const Mysql = require("../../api/services/Mysql");
const RequestToHire = require("../../api/components/requestToHire/RequestToHire");

class Base {

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  static getApp() {
    return process.env.APP || 'http://localhost:3000';
  }

  async getDriver(url = '') {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().headless())
      .build();
    await driver.get(Base.getApp() + url);
    return driver;
  }

  getApp() {
    return Base.getApp();
  }

  addUser(username) {
    return User.register('Test', 'User', username, `${username}@example.org`, 'Number', 'password', 'City', 'State', 'Zip');
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

  async addRequestToHire(type, date) {
    return RequestToHire.create(1, type, 'Chantilly, VA, United States of America', 'Some details', 200, 4, null, date, '', '');
  }

  async removeRequestToHire(id) {
    await Mysql.query(`DELETE FROM hire_requests WHERE id = ${id}`);
  }
}

module.exports = new Base();
