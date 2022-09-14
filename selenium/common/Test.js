const { addAttach } = require('jest-html-reporters/helper');
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const User = require('../../api/components/user/User');
const Mysql = require('../../api/services/Mysql');
const RequestToHire = require('../../api/components/requestToHire/RequestToHire');
const ApplicationForRequestToHire = require('../../api/components/applicationForRequestToHire/ApplicationForRequestToHire');
const Company = require('../../api/components/company/Company');

class Test {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    // do nothing
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
    await driver.manage().window().setRect({ height: 1600, width: 1800 });
    this.driver = driver;
    return driver;
  }

  async cleanUp() {
    const image = await this.driver.takeScreenshot();
    await addAttach({
      attach: Buffer.from(image, 'base64'),
    });
    await this.driver.quit();
  }

  addUser(username) {
    this.user = User.register(
      'Test',
      'User',
      username,
      `${username}@example.org`,
      'Number',
      'password',
      'City',
      'State',
      'Zip'
    );
  }

  async loginUser(username) {
    this.addUser(username);
    await this.user.getId();
    this.user = User.login(username, 'password');
    const userInfo = await this.user.getInfo();
    userInfo.token = await this.user.getToken();
    await this.driver.executeScript(async (json) => {
      localStorage.setItem('currentUser', JSON.stringify(json));
    }, userInfo);
    return this.user;
  }

  async removeUser() {
    if (this.user) {
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

  static async setUpProfile(
    user,
    name,
    website,
    instagram,
    facebook,
    experience,
    equipment,
    skills,
    portfolio
  ) {
    const company = new Company(user);
    await company.setPortfolio(experience, portfolio);
    await company.setCompanyInformation(
      name,
      website,
      instagram,
      facebook,
      equipment,
      skills
    );
    return company.getInfo();
  }

  static async removeProfile(id) {
    await Mysql.query(`DELETE FROM companies WHERE id = ${id}`);
    await Mysql.query(`DELETE FROM company_equipment WHERE company = ${id}`);
    await Mysql.query(`DELETE FROM company_skills WHERE company = ${id}`);
    await Mysql.query(`DELETE FROM portfolio WHERE company = ${id}`);
  }

  static async addRequestToHire(user, type, date) {
    return RequestToHire.create(
      user,
      type,
      'Chantilly, VA, United States of America',
      'Some details',
      200,
      4,
      null,
      date,
      [],
      []
    );
  }

  static async removeRequestToHire(id) {
    await Mysql.query(`DELETE FROM hire_requests WHERE id = ${id}`);
    await Mysql.query(
      `DELETE FROM hire_requests_equipment WHERE hire_request = ${id}`
    );
    await Mysql.query(
      `DELETE FROM hire_requests_skills WHERE hire_request = ${id}`
    );
  }

  static async addApplicationForRequestToHire(
    hireRequestId,
    userId,
    companyId
  ) {
    return ApplicationForRequestToHire.create(
      hireRequestId,
      userId,
      companyId,
      'Test User',
      'Company',
      null,
      null,
      null,
      null,
      [],
      [],
      []
    );
  }

  static async addFullApplicationForRequestToHire(
    hireRequestId,
    userId,
    companyId
  ) {
    return ApplicationForRequestToHire.create(
      hireRequestId,
      userId,
      companyId,
      'Test User',
      'Company',
      'website.com',
      'insta.com',
      'facebook.com',
      'some experience',
      [
        { value: 1, what: 'something' },
        { value: 2, what: 'other things' },
      ],
      [{ value: 1 }, { value: 2 }],
      [
        { link: 'link1.com', description: 'description 1' },
        { link: 'link2.com', description: 'description 2' },
        { link: 'link3.com', description: 'description 3' },
      ]
    );
  }

  static async removeApplicationForRequestToHire(id) {
    await Mysql.query(`DELETE FROM hire_request_applications WHERE id = ${id}`);
    await Mysql.query(
      `DELETE FROM hire_request_applications_equipment WHERE hire_request_application = ${id}`
    );
    await Mysql.query(
      `DELETE FROM hire_request_applications_skills WHERE hire_request_application = ${id}`
    );
    await Mysql.query(
      `DELETE FROM hire_request_applications_portfolios WHERE hire_request_application = ${id}`
    );
  }

  static async chooseApplicationForRequestToHire(hireRequestId, applicationId) {
    const hireRequest = new RequestToHire(hireRequestId);
    await hireRequest.selectApplication(applicationId);
  }

  async waitUntilNotPresent(locator) {
    const { driver } = this;
    await driver.wait(() =>
      driver.findElements(locator).then((elements) => elements.length === 0)
    );
  }

  async waitUntilInputFilled(locator) {
    const { driver } = this;
    await driver.wait(() =>
      driver
        .findElement(locator)
        .then(async (element) => (await element.getAttribute('value')) !== '')
    );
  }
}

module.exports = Test;
