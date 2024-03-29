/* eslint-disable no-await-in-loop */
const { addAttach, addMsg } = require('jest-html-reporters/helper');
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const axe = require('axe-core');
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
    const options = new Options();
    options.addArguments('--headless=new');
    options.addArguments('--ignore-certificate-errors');
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    await driver.get(Test.getApp());

    // set our gdpr as already entered
    const cookies = {};
    cookies.necessary = true;
    cookies.preferences = true;
    cookies.analytics = true;
    await driver.executeScript(async (json) => {
      localStorage.setItem('cookies', JSON.stringify(json));
    }, cookies);

    // load our page
    await driver.get(Test.getApp() + url);
    await driver.manage().window().setRect({ height: 1600, width: 1800 });
    this.driver = driver;

    if (process.env.NETWORK) {
      console.log('TODO STUFF FOR A NETWORKING TEST');
    }

    return driver;
  }

  async cleanUp() {
    let result;
    if (process.env.ACCESSIBILITY) {
      await this.driver.executeScript(axe.source.toString());
      result = await this.driver.executeAsyncScript(
        'var callback = arguments[arguments.length - 1];axe.run().then(results => callback(results))',
      );
      await addMsg({
        message:
          `Inapplicable: ${result.inapplicable.length}\n` +
          `Incomplete: ${result.incomplete.length}\n` +
          `Passes: ${result.passes.length}\n` +
          `Violations: ${result.violations.length}\n`,
      });
      if (result.violations.length) {
        await addMsg({
          message: `Violations:${result.violations.map(
            (violation) => `\n${violation.description}: ${violation.help}`,
          )}`,
        });
        await addMsg({
          message: JSON.stringify(result.violations),
        });
      }
    }

    const image = await this.driver.takeScreenshot();
    await addAttach({
      attach: Buffer.from(image, 'base64'),
    });
    await this.driver.quit();

    if (process.env.ACCESSIBILITY) {
      await addMsg({ message: JSON.stringify(result) });
      if (result.violations.length) {
        throw new Error(
          result.violations.map((violation) => `${violation.help}\n`),
        );
      }
    }
  }

  addUser(username) {
    this.user = User.register(
      'Test',
      'User',
      {
        lat: 38.8462236,
        lon: -77.3063733,
        loc: 'Fairfax, VA 20030, United States of America',
      },
      `${username}@example.org`,
      username,
      'password',
    );
  }

  async loginUser(username) {
    this.addUser(username);
    const id = await this.user.getId();
    const company = new Company(id);
    await company.setCompanyInformation('My Company', null, null, null, [], []);
    this.user = User.login(username, 'password');
    const userInfo = await this.user.getInfo();
    userInfo.token = await this.user.getToken();
    await this.driver.executeScript(async (json) => {
      localStorage.setItem('currentUser', JSON.stringify(json));
    }, userInfo);
    return this.user;
  }

  async applyAllFilters() {
    await this.driver.executeScript(async () => {
      localStorage.setItem(
        'filters',
        JSON.stringify({
          jobTypes: [1, 2, 3, 4, 5, 6],
          jobSubtypes: [1, 2, 3, 4, 5, 6],
        }),
      );
    });
  }

  static async removeUserById(id) {
    const companies = await Mysql.query(
      `SELECT * FROM companies WHERE user = ${id} OR user = 0;`,
    );
    const applications = await Mysql.query(
      `SELECT * FROM job_applications WHERE user_id = ${id} OR user_id = 0;`,
    );
    const jobs = await Mysql.query(
      `SELECT * FROM jobs WHERE user = ${id} OR user = 0;`,
    );
    // delete our user
    await Mysql.query(`DELETE FROM users WHERE id = ${id} OR id = 0;`);
    await Mysql.query(`DELETE FROM settings WHERE user = ${id} OR user = 0;`);
    // delete our user's company(s)
    for (const company of companies) {
      await Mysql.query(`DELETE FROM companies WHERE id = ${company.id}`);
      await Mysql.query(
        `DELETE FROM company_equipment WHERE company = ${company.id}`,
      );
      await Mysql.query(
        `DELETE FROM company_skills WHERE company = ${company.id}`,
      );
      await Mysql.query(`DELETE FROM portfolio WHERE company = ${company.id}`);
    }
    // delete our user's application(s)
    for (const application of applications) {
      await Mysql.query(
        `DELETE FROM job_applications WHERE id = ${application.id}`,
      );
      await Mysql.query(
        `DELETE FROM job_applications_equipment WHERE job_application = ${application.id}`,
      );
      await Mysql.query(
        `DELETE FROM job_applications_skills WHERE job_application = ${application.id}`,
      );
      await Mysql.query(
        `DELETE FROM job_applications_portfolios WHERE job_application = ${application.id}`,
      );
    }
    // delete our user's job(s)
    for (const job of jobs) {
      await Mysql.query(`DELETE FROM jobs WHERE id = ${job.id}`);
      await Mysql.query(`DELETE FROM job_skills WHERE job = ${job.id}`);
    }
    // delete all ratings
    await Mysql.query(`DELETE FROM ratings WHERE rater = ${id} OR rater = 0;`);
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
    portfolio,
  ) {
    const company = new Company(user);
    await company.setPortfolio(experience, portfolio);
    await company.setCompanyInformation(
      name,
      website,
      instagram,
      facebook,
      equipment,
      skills,
    );
    return company.getInfo();
  }

  static async addFullJob(user, type, subtype, date, location, details) {
    return Job.create(
      user,
      type,
      subtype,
      location,
      details,
      200,
      4,
      null,
      date,
      '',
      [],
    );
  }

  static async addJob(user, type, date) {
    return this.addFullJob(
      user,
      type,
      1,
      date,
      {
        lat: 38.8461234,
        lon: -77.303452,
        loc: 'Chantilly, VA, United States of America',
      },
      'Some details',
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
      '',
      [],
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
      [{ value: 1 }, { value: 2 }],
      'a comment',
      [
        { link: 'link1.com', description: 'description 1' },
        { link: 'link2.com', description: 'description 2' },
        { link: 'link3.com', description: 'description 3' },
      ],
    );
  }

  static async chooseJobApplication(jobId, applicationId) {
    const job = new Job(jobId);
    await job.selectApplication(applicationId);
  }

  async addRating(job, ratee, rating = null) {
    const info = await job.getInfo();
    const date = new Date(info.date_time)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    if (rating) {
      await Mysql.query(
        `INSERT INTO ratings (job, job_date, rater, ratee, rating, date_rated)
         VALUES (${
           info.id
         }, '${date}', ${await this.user.getId()}, ${ratee}, ${rating}, CURRENT_TIMESTAMP);`,
      );
    } else {
      await Mysql.query(
        `INSERT INTO ratings (job, job_date, rater, ratee)
         VALUES (${info.id}, '${date}', ${await this.user.getId()}, ${ratee});`,
      );
    }
  }

  async waitUntilNotPresent(locator, wait = 5000) {
    const { driver } = this;
    await driver.wait(
      () =>
        driver.findElements(locator).then((elements) => elements.length === 0),
      wait,
    );
  }

  async waitUntilInputFilled(locator) {
    const { driver } = this;
    await driver.wait(
      () =>
        driver
          .findElement(locator)
          .then(
            async (element) => (await element.getAttribute('value')) !== '',
          ),
      5000,
    );
  }
}

module.exports = Test;
