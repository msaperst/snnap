/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('profile page', () => {
  jest.setTimeout(15000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.loginUser('profileNotificationsUser');
    await driver.get(`${Test.getApp()}/profile`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the notifications', async () => {
    driver.wait(until.elementLocated(By.css('h2')), 5000);
    const password = (await driver.findElements(By.css('form')))[2];
    expect(await password.findElement(By.css('h3')).getText()).toEqual(
      'Notification Settings'
    );
  });

  it('displays the current email notification', async () => {
    const emailNotification = driver.wait(
      until.elementLocated(By.id('emailNotifications')),
      5000
    );
    expect(await emailNotification.isSelected()).toBeTruthy();
    expect(await emailNotification.isEnabled()).toBeTruthy();
  });

  it('displays the current push notification', async () => {
    const pushNotification = driver.wait(
      until.elementLocated(By.id('pushNotifications')),
      5000
    );
    expect(await pushNotification.isSelected()).toBeFalsy();
    expect(await pushNotification.isEnabled()).toBeFalsy();
  });

  it('allows updating the notification settings', async () => {
    let emailNotification = driver.wait(
      until.elementLocated(By.id('emailNotifications')),
      5000
    );
    await emailNotification.click();
    expect(await emailNotification.isSelected()).toBeFalsy();
    await driver.findElement(By.id('saveNotificationSettingsButton')).click();
    let success = driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Notification Settings Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);

    // ensure new value loads;
    await driver.navigate().refresh();
    emailNotification = driver.wait(
      until.elementLocated(By.id('emailNotifications')),
      5000
    );
    expect(await emailNotification.isSelected()).toBeFalsy();
    await emailNotification.click();
    expect(await emailNotification.isSelected()).toBeTruthy();
    await driver.findElement(By.id('saveNotificationSettingsButton')).click();
    success = driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Notification Settings Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);

    // ensure new value loads;
    await driver.navigate().refresh();
    emailNotification = driver.wait(
      until.elementLocated(By.id('emailNotifications')),
      5000
    );
    Test.sleep(200);
    expect(await emailNotification.isSelected()).toBeTruthy();
  });
});
