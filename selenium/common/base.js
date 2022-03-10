const { addAttach } = require('jest-html-reporters/helper');
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
    await driver.manage().window().setSize(1200, 800);
    return driver;
  }

  getApp() {
    return Base.getApp();
  }

  async cleanUp(driver) {
    const image = await driver.takeScreenshot();
    await addAttach({
      attach: Buffer.from(image, "base64"),
    });
    await driver.quit();
  }

  addUser(username) {
    return User.register('Test', 'User', username, `${username}@example.org`, 'Number', 'password', 'City', 'State', 'Zip');
  }

  async loginUser(driver, username) {
    let user = this.addUser(username);
    user = await User.login(await user.getUsername(), 'password');
    const userInfo = await user.getUserInfo();
    userInfo.token = await user.getToken();
    await driver.executeScript(async function (json) {
      localStorage.setItem("currentUser", JSON.stringify(json));
    }, userInfo);
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

  waitUntilNotPresent(driver, locator) {
    driver.wait(function() {
      return driver.findElements(locator).then(function(elements) {
        return elements.length === 0;
      });
    });
  }
}

module.exports = new Base();
