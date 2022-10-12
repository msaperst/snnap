/* eslint-disable no-await-in-loop */
const { addAttach } = require('jest-html-reporters/helper');
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const User = require('../../api/components/user/User');
const Mysql = require('../../api/services/Mysql');
const Job = require('../../api/components/job/Job');
const ApplicationForJob = require('../../api/components/jobApplication/JobApplication');
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
    const options = new Options().headless();
    options.addArguments('--ignore-certificate-errors');
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
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
      {
        lat: 38.8462236,
        lon: -77.3063733,
        loc: 'Fairfax, VA, United States of America',
      },
      `${username}@example.org`,
      username,
      'password'
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

  static async removeUserById(id) {
    const companies = await Mysql.query(
      `SELECT * FROM companies WHERE user = ${id} OR user = 0;`
    );
    const applications = await Mysql.query(
      `SELECT * FROM job_applications WHERE user_id = ${id} OR user_id = 0;`
    );
    const jobs = await Mysql.query(
      `SELECT * FROM jobs WHERE user = ${id} OR user = 0;`
    );
    // delete our user
    await Mysql.query(`DELETE FROM users WHERE id = ${id} OR id = 0;`);
    // delete our user's company(s)
    for (const company of companies) {
      await Mysql.query(`DELETE FROM companies WHERE id = ${company.id}`);
      await Mysql.query(
        `DELETE FROM company_equipment WHERE company = ${company.id}`
      );
      await Mysql.query(
        `DELETE FROM company_skills WHERE company = ${company.id}`
      );
      await Mysql.query(`DELETE FROM portfolio WHERE company = ${company.id}`);
    }
    // delete our user's application(s)
    for (const application of applications) {
      await Mysql.query(
        `DELETE FROM job_applications WHERE id = ${application.id}`
      );
      await Mysql.query(
        `DELETE FROM job_applications_equipment WHERE job_application = ${application.id}`
      );
      await Mysql.query(
        `DELETE FROM job_applications_skills WHERE job_application = ${application.id}`
      );
      await Mysql.query(
        `DELETE FROM job_applications_portfolios WHERE job_application = ${application.id}`
      );
    }
    // delete our user's job(s)
    for (const job of jobs) {
      await Mysql.query(`DELETE FROM jobs WHERE id = ${job.id}`);
      await Mysql.query(`DELETE FROM job_equipment WHERE job = ${job.id}`);
      await Mysql.query(`DELETE FROM job_skills WHERE job = ${job.id}`);
    }
  }

  async removeUser() {
    if (this.user) {
      await Test.removeUserById(await this.user.getId());
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

  static async addFullJob(user, type, date, location, details) {
    return Job.create(
      user,
      type,
      location,
      details,
      200,
      4,
      null,
      date,
      [],
      []
    );
  }

  static async addJob(user, type, date) {
    return this.addFullJob(
      user,
      type,
      date,
      {
        lat: 38.8461234,
        lon: -77.303452,
        loc: 'Chantilly, VA, United States of America',
      },
      'Some details'
    );
  }

  static async addJobApplication(jobId, userId, companyId) {
    return ApplicationForJob.create(
      jobId,
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

  static async addFullJobApplication(jobId, userId, companyId) {
    return ApplicationForJob.create(
      jobId,
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
      [{ value: 7 }, { value: 8 }],
      [
        { link: 'link1.com', description: 'description 1' },
        { link: 'link2.com', description: 'description 2' },
        { link: 'link3.com', description: 'description 3' },
      ]
    );
  }

  static async chooseJobApplication(jobId, applicationId) {
    const job = new Job(jobId);
    await job.selectApplication(applicationId);
  }

  async waitUntilNotPresent(locator) {
    const { driver } = this;
    await driver.wait(
      () =>
        driver.findElements(locator).then((elements) => elements.length === 0),
      5000
    );
  }

  async waitUntilInputFilled(locator) {
    const { driver } = this;
    await driver.wait(
      () =>
        driver
          .findElement(locator)
          .then(
            async (element) => (await element.getAttribute('value')) !== ''
          ),
      5000
    );
  }
}

module.exports = Test;
