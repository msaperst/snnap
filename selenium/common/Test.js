const { addAttach } = require('jest-html-reporters/helper');
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const User = require('../../api/components/user/User');
const Mysql = require("../../api/services/Mysql");
const RequestToHire = require("../../api/components/requestToHire/RequestToHire");
const ApplicationForRequestToHire = require("../../api/components/applicationForRequestToHire/ApplicationForRequestToHire");

class Test {
  constructor() {
  }

  static sleep(ms) {
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
    await driver.get(Test.getApp() + url);
    await driver.manage().window().setSize(1200, 1800);
    this.driver = driver;
    return driver;
  }

  async cleanUp() {
    const image = await this.driver.takeScreenshot();
    await addAttach({
      attach: Buffer.from(image, "base64"),
    });
    await this.driver.quit();
  }

  addUser(username) {
    this.user = User.register('Test', 'User', username, `${username}@example.org`, 'Number', 'password', 'City', 'State', 'Zip');
  }

  async loginUser(username) {
    this.addUser(username);
    await this.user.getId();
    this.user = User.login(username, 'password');
    const userInfo = await this.user.getInfo();
    userInfo.token = await this.user.getToken();
    await this.driver.executeScript(async function (json) {
      localStorage.setItem("currentUser", JSON.stringify(json));
    }, userInfo);
    return this.user;
  }

  async removeUser() {
    if( this.user ) {
      await Mysql.query(
        `DELETE
         FROM users
         WHERE username = '${await this.user.getUsername()}';`
      );
      await Mysql.query(
        `DELETE
         FROM companies
         WHERE user = '${await this.user.getId()}';`
      );
    }
  }

  static async addRequestToHire(user, type, date) {
    return RequestToHire.create(user, type, 'Chantilly, VA, United States of America', 'Some details', 200, 4, null, date, [], []);
  }

  static async removeRequestToHire(id) {
    await Mysql.query(`DELETE FROM hire_requests WHERE id = ${id}`);
    await Mysql.query(`DELETE FROM hire_requests_equipment WHERE hire_request = ${id}`);
    await Mysql.query(`DELETE FROM hire_requests_skills WHERE hire_request = ${id}`);
  }

  static async addApplicationForRequestToHire(hireRequestId, userId, companyId) {
    return ApplicationForRequestToHire.create(hireRequestId,
      userId,
      companyId,
      'Test User',
      null,
      null,
      null,
      null,
      null,
      [],
      [],
      []);
  }

  static async removeApplicationForRequestToHire(id) {
    await Mysql.query(`DELETE FROM hire_request_applications WHERE id = ${id}`);
    await Mysql.query(`DELETE FROM hire_request_applications_equipment WHERE hire_request_application = ${id}`);
    await Mysql.query(`DELETE FROM hire_request_applications_skills WHERE hire_request_application = ${id}`);
    await Mysql.query(`DELETE FROM hire_request_applications_portfolios WHERE hire_request_application = ${id}`);
  }

  waitUntilNotPresent(locator) {
    const driver = this.driver;
    driver.wait(function() {
      return driver.findElements(locator).then(function(elements) {
        return elements.length === 0;
      });
    });
  }

  waitUntilInputFilled(locator) {
    const driver = this.driver;
    driver.wait(function() {
      return driver.findElement(locator).then(async function (element) {
        return await element.getAttribute('value') !== '';
      });
    });
  }
}

module.exports = Test;
