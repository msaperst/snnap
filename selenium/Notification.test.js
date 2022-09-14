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
  let requestToHires = [];
  let applicationsForRequestToHires = [];

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    test.addUser('otherUser');
    otherUser = test.user;
    user = await test.loginUser('notificationUser');
  }, 10000);

  afterEach(async () => {
    for (const requestToHire of requestToHires) {
      await Test.removeRequestToHire(await requestToHire.getId());
    }
    requestToHires = [];
    // clean up the applications for hire requests
    for (const applicationsForRequestToHire of applicationsForRequestToHires) {
      await Test.removeApplicationForRequestToHire(
        await applicationsForRequestToHire.getId()
      );
    }
    applicationsForRequestToHires = [];
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

  it('applying to a hire request creates a notification', async () => {
    const notification = await createAppliedToHireRequestNotification();
    expect(await notification.isDisplayed()).toBeTruthy();
  });

  it('choosing a hire request creates a notification', async () => {
    const notification = await createChosenHireRequestApplicationNotification();
    expect(await notification.isDisplayed()).toBeTruthy();
  });

  it('new notification shows unread icon', async () => {
    const notification = await createAppliedToHireRequestNotification();
    expect(
      await notification
        .findElement(By.css('[style="cursor: pointer;"]'))
        .getAttribute('fill')
    ).toEqual('red');
  });

  it('clicking unread icon marks the notification as read', async () => {
    const notification = await createAppliedToHireRequestNotification();
    await notification.findElement(By.css('svg')).click();
    await test.waitUntilNotPresent(By.css('svg'));
    expect(await notification.findElements(By.css('svg'))).toHaveLength(0);
  });

  it('read notification has no icon', async () => {
    let notification = await createAppliedToHireRequestNotification();
    await notification.findElement(By.css('svg')).click();
    await driver.navigate().refresh();
    notification = await driver.wait(until.elementLocated(By.css('div.card')));
    expect(await notification.findElements(By.css('svg'))).toHaveLength(0);
  });

  it('navigates to the user page when clicking on the user name', async () => {
    await createAppliedToHireRequestNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('Test User'))
    );
    await link.click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/profile/otherUser`
    );
  });

  it('navigates to the hire request when clicking on the hire request', async () => {
    await createAppliedToHireRequestNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('hire request'))
    );
    await link.click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/hire-requests#${await requestToHires[0].getId()}`
    );
  });

  it('navigates to the hire request application when clicking on the application', async () => {
    await createChosenHireRequestApplicationNotification();
    const link = await driver.wait(
      until.elementLocated(By.linkText('hire request application'))
    );
    await link.click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/hire-request-applications#${await applicationsForRequestToHires[0].getId()}`
    );
  });

  it('shows an icon in the menu when there is a new notification', async () => {
    await driver.get(Test.getApp());
    let dropDown = driver.wait(until.elementLocated(By.id('user-dropdown')));
    expect(await dropDown.getText()).toEqual('notificationUser');
    await createAppliedToHireRequestNotification();
    dropDown = driver.wait(until.elementLocated(By.id('user-dropdown')));
    expect(await dropDown.getText()).toEqual('notificationUser 🔔');
  });

  it('shows the unread notification count in the menu for all notifications', async () => {
    await driver.get(Test.getApp());
    let dropDown = driver.wait(until.elementLocated(By.id('user-dropdown')));
    await dropDown.click();
    expect(
      await driver.findElement(By.css('[href="/notifications"]')).getText()
    ).toEqual('Notifications');
    await createAppliedToHireRequestNotification();
    dropDown = driver.wait(until.elementLocated(By.id('user-dropdown')));
    await dropDown.click();
    expect(
      await driver.findElement(By.css('[href="/notifications"]')).getText()
    ).toEqual('Notifications1');
    await driver.findElement(By.css('svg')).click();
    await driver.navigate().refresh();
    dropDown = driver.wait(until.elementLocated(By.id('user-dropdown')));
    await dropDown.click();
    expect(
      await driver.findElement(By.css('[href="/notifications"]')).getText()
    ).toEqual('Notifications');
  });

  async function createAppliedToHireRequestNotification() {
    const hireRequest = await Test.addRequestToHire(
      await user.getId(),
      1,
      '2023-03-12'
    );
    requestToHires.push(hireRequest);
    applicationsForRequestToHires.push(
      await Test.addApplicationForRequestToHire(
        await hireRequest.getId(),
        await otherUser.getId(),
        0
      )
    );
    await driver.get(`${Test.getApp()}/notifications`);
    return driver.wait(until.elementLocated(By.css('div.card')));
  }

  async function createChosenHireRequestApplicationNotification() {
    const hireRequest = await Test.addRequestToHire(
      await otherUser.getId(),
      1,
      '2023-03-12'
    );
    requestToHires.push(hireRequest);
    const application = await Test.addApplicationForRequestToHire(
      await hireRequest.getId(),
      await user.getId(),
      1
    );
    applicationsForRequestToHires.push(application);
    await Test.chooseApplicationForRequestToHire(
      await hireRequest.getId(),
      await application.getId()
    );
    await driver.get(`${Test.getApp()}/notifications`);
    return driver.wait(until.elementLocated(By.css('div.card')));
  }
});
