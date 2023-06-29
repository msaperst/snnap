/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');
const Mysql = require('../api/services/Mysql');

describe('notifications', () => {
  jest.setTimeout(10000);

  let test;
  let user;
  let otherUser;
  let driver;
  let jobs = [];
  let applicationsForJobs = [];

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    test.addUser('otherUser');
    otherUser = test.user;
    user = await test.loginUser('notificationUser');
  }, 10000);

  afterEach(async () => {
    jobs = [];
    // clean up the applications for jobs
    applicationsForJobs = [];
    // delete the user
    await test.removeUser();
    await Mysql.query(
      `DELETE
         FROM users
         WHERE username = 'otherUser';`
    );
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('applying to a job creates a notification @network @accessibility', async () => {
    const notification = await createAppliedToJobNotification();
    expect(await notification.isDisplayed()).toBeTruthy();
  });

  it('choosing a job creates a notification @network @accessibility', async () => {
    const notification = await createChosenJobApplicationNotification();
    expect(await notification.isDisplayed()).toBeTruthy();
  });

  it('creating a job creates a notification @network @accessibility', async () => {
    const notification = await createCreatedJobNotification();
    expect(await notification.isDisplayed()).toBeTruthy();
  });

  it('new notification shows unread icon', async () => {
    const notification = await createAppliedToJobNotification();
    expect(
      await notification
        .findElement(By.css('[style="cursor: pointer;"]'))
        .getAttribute('fill')
    ).toEqual('red');
  });

  it('clicking unread icon marks the notification as read @network @accessibility', async () => {
    const notification = await createAppliedToJobNotification();
    await notification.findElement(By.css('svg')).click();
    await test.waitUntilNotPresent(By.css('svg'));
    expect(await notification.findElements(By.css('svg'))).toHaveLength(0);
  });

  it('read notification has no icon', async () => {
    let notification = await createAppliedToJobNotification();
    await notification.findElement(By.css('svg')).click();
    await driver.navigate().refresh();
    notification = await driver.wait(
      until.elementLocated(By.css('div.card')),
      5000
    );
    expect(await notification.findElements(By.css('svg'))).toHaveLength(0);
  });

  it('navigates to the user page when clicking on the user name @network @accessibility', async () => {
    await createAppliedToJobNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('Test User')),
      5000
    );
    await link.click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/profile/otherUser`
    );
  });

  it('navigates to the job when clicking on the job for applied to job @network @accessibility', async () => {
    await createAppliedToJobNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('job')),
      5000
    );
    await link.click();
    const jobId = await jobs[0].getId();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/jobs#${jobId}`
    );
    // ensure job is popped up
    const card = await driver.wait(
      until.elementLocated(By.css(`*[data-testid='job-${jobId}']`)),
      5000
    );
    expect(await card.getAttribute('class')).toContain('highlight');
    await driver.wait(
      until.elementLocated(
        By.css(`*[data-testid='compareJobApplicationsModal-${jobId}']`)
      ),
      5000
    );
  });

  it('navigates to the job application when clicking on the application for selected job @network @accessibility', async () => {
    await createChosenJobApplicationNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('job application')),
      5000
    );
    await link.click();
    const jobId = await applicationsForJobs[0].getId();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/job-applications#${jobId}`
    );
    // ensure job is popped up
    const card = await driver.wait(
      until.elementLocated(By.css(`*[data-testid='job-application-${jobId}']`)),
      5000
    );
    expect(await card.getAttribute('class')).toContain('highlight');
  });

  it('navigates to the job when clicking on the job for new job creation @network @accessibility', async () => {
    await createCreatedJobNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('job')),
      5000
    );
    await link.click();
    const jobId = await jobs[0].getId();
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/#${jobId}`);
    // ensure job is popped up
    const card = await driver.wait(
      until.elementLocated(By.css(`*[data-testid='job-${jobId}']`)),
      5000
    );
    expect(await card.getAttribute('class')).toContain('highlight');
    await driver.wait(
      until.elementLocated(By.css(`*[data-testid='applyToJobModal-${jobId}']`)),
      5000
    );
  });

  it('shows an icon in the menu when there is a new notification', async () => {
    await driver.get(Test.getApp());
    let dropDown = await driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    expect(await dropDown.getText()).toEqual('notificationUser');
    await createAppliedToJobNotification();
    dropDown = await driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await driver.wait(
      until.elementTextIs(dropDown, 'notificationUser 🔔'),
      5000
    );
    expect(await dropDown.getText()).toEqual('notificationUser 🔔');
  });

  it('shows the unread notification count in the menu for all notifications @network @accessibility', async () => {
    await driver.get(Test.getApp());
    let dropDown = await driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await dropDown.click();
    expect(
      await driver.findElement(By.css('[href="/notifications"]')).getText()
    ).toEqual('Notifications');
    await createAppliedToJobNotification();
    dropDown = await driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await driver.wait(
      until.elementTextIs(dropDown, 'notificationUser 🔔'),
      5000
    );
    await dropDown.click();
    expect(
      await driver.findElement(By.css('[href="/notifications"]')).getText()
    ).toEqual('Notifications\n1');
    await driver.findElement(By.css('svg')).click();
    await driver.navigate().refresh();
    dropDown = driver.wait(until.elementLocated(By.id('user-dropdown')), 5000);
    await dropDown.click();
    expect(
      await driver.findElement(By.css('[href="/notifications"]')).getText()
    ).toEqual('Notifications');
  });

  async function createAppliedToJobNotification() {
    const job = await Test.addJob(await user.getId(), 1, '2024-03-12');
    jobs.push(job);
    applicationsForJobs.push(
      await Test.addJobApplication(
        await job.getId(),
        await otherUser.getId(),
        0
      )
    );
    await driver.get(`${Test.getApp()}/notifications`);
    return driver.wait(until.elementLocated(By.css('div.card')), 5000);
  }

  async function createChosenJobApplicationNotification() {
    const job = await Test.addJob(await otherUser.getId(), 1, '2024-03-12');
    jobs.push(job);
    const application = await Test.addJobApplication(
      await job.getId(),
      await user.getId(),
      1
    );
    applicationsForJobs.push(application);
    await Test.chooseJobApplication(
      await job.getId(),
      await application.getId()
    );
    await driver.get(`${Test.getApp()}/notifications`);
    return driver.wait(until.elementLocated(By.css('div.card')), 5000);
  }

  async function createCreatedJobNotification() {
    const job = await Test.addJob(await otherUser.getId(), 1, '2024-03-12');
    jobs.push(job);
    await driver.get(`${Test.getApp()}/notifications`);
    return driver.wait(until.elementLocated(By.css('div.card')), 5000);
  }
});
