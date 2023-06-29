/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
const Home = require('./common/Home');
require('chromedriver');

describe('view job', () => {
  jest.setTimeout(15000);
  let test;
  let driver;
  let user;
  let jobs = [];
  let form;
  let home;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    home = new Home(driver);
    // login as a user
    user = await test.loginUser('viewJobUser');
    await test.applyAllFilters();
    // create a job for our test user
    jobs.push(await Test.addJob(await user.getId(), 1, '2024-03-12'));
    // reload the main page
    await driver.get(Test.getApp());
  }, 10000);

  afterEach(async () => {
    // clean up the jobs
    jobs = [];
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the job without a border around it when no hash passed in', async () => {
    const card = await driver.wait(
      until.elementLocated(
        By.css(`*[data-testid='job-${await jobs[0].getId()}']`)
      ),
      5000
    );
    expect(card.getAttribute('class')).not.toContain('highlight');
  });

  // checks are in the method
  // eslint-disable-next-line jest/expect-expect
  it('displays job information on click @network @accessibility', async () => {
    const jobId = await jobs[0].getId();
    const button = await home.getButton(jobId);
    await button.click();
    form = await driver.wait(
      until.elementLocated(
        By.css(`*[data-testid='compareJobApplicationsModal-${jobId}']`)
      ),
      5000
    );
    await home.hasJobInfo(form);
  });

  it('shows the job with a border around it when hash passed in @accessibility', async () => {
    const jobId = await jobs[0].getId();
    await driver.get(`${Test.getApp()}/#${jobId}`);
    await driver.navigate().refresh();
    const card = await driver.wait(
      until.elementLocated(By.css(`*[data-testid='job-${jobId}']`)),
      5000
    );
    expect(await card.getAttribute('class')).toContain('highlight');
  });

  // checks are in the method
  // eslint-disable-next-line jest/expect-expect
  it('displays job information when hash passed in', async () => {
    const jobId = await jobs[0].getId();
    await driver.get(`${Test.getApp()}/#${jobId}`);
    await driver.navigate().refresh();
    form = await driver.wait(
      until.elementLocated(
        By.css(`*[data-testid='compareJobApplicationsModal-${jobId}']`)
      ),
      5000
    );
    await home.hasJobInfo(form);
  });

  it('shows the job with a border around it when hash passed in on job page @accessibility', async () => {
    const jobId = await jobs[0].getId();
    await driver.get(`${Test.getApp()}/jobs#${jobId}`);
    await driver.navigate().refresh();
    const card = await driver.wait(
      until.elementLocated(By.css(`*[data-testid='job-${jobId}']`)),
      5000
    );
    expect(await card.getAttribute('class')).toContain('highlight');
  });

  // checks are in the method
  // eslint-disable-next-line jest/expect-expect
  it('displays job information when hash passed in on job page', async () => {
    const jobId = await jobs[0].getId();
    await driver.get(`${Test.getApp()}/jobs#${jobId}`);
    await driver.navigate().refresh();
    form = await driver.wait(
      until.elementLocated(
        By.css(`*[data-testid='compareJobApplicationsModal-${jobId}']`)
      ),
      5000
    );
    await home.hasJobInfo(form);
  });
});
