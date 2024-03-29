/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('settings password page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.loginUser('settingsPasswordUser');
    await driver.get(`${Test.getApp()}/settings`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the password', async () => {
    driver.wait(until.elementLocated(By.css('h1')), 5000);
    const password = (await driver.findElements(By.css('form')))[1];
    expect(await password.findElement(By.css('h2')).getText()).toEqual(
      'Password'
    );
  });

  it('displays the current password', async () => {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword')),
      5000
    );
    expect(await currentPassword.getAttribute('value')).toEqual('');
    expect(await currentPassword.getAttribute('disabled')).toBeNull();
  });

  it('displays the new password', async () => {
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword')),
      5000
    );
    expect(await newPassword.getAttribute('value')).toEqual('');
    expect(await newPassword.getAttribute('disabled')).toBeNull();
  });

  it('shows error when you update password blank information @network @accessibility', async () => {
    driver.wait(until.elementLocated(By.css('h1')), 5000);
    const settings = (await driver.findElements(By.css('form')))[1];
    const feedbacks = await settings.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(2);
    for (const feedback of feedbacks) {
      expect(await feedback.getText()).toEqual('');
      expect(await feedback.isDisplayed()).toBeFalsy();
    }
    await driver.findElement(By.id('updatePasswordButton')).click();
    expect(await feedbacks[0].getText()).toEqual(
      'Please provide a valid current password.'
    );
    expect(await feedbacks[1].getText()).toEqual(
      'Please provide a valid new password.'
    );
    for (const feedback of feedbacks) {
      expect(await feedback.isDisplayed()).toBeTruthy();
    }
  });

  it('allows updating the password values @network @accessibility', async () => {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword')),
      5000
    );
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword')),
      5000
    );
    await currentPassword.sendKeys('password');
    await newPassword.sendKeys('password1');
    expect(await currentPassword.getAttribute('value')).toEqual('password');
    expect(await newPassword.getAttribute('value')).toEqual('password1');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Password Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
  });

  it('does not allow updating with a bad password @network @accessibility', async () => {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword')),
      5000
    );
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword')),
      5000
    );
    await currentPassword.sendKeys('pass');
    await newPassword.sendKeys('password1');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await danger.getText()).toEqual(
      "Current password doesn't match existing password."
    );
  });

  async function checkPasswordFields() {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword')),
      5000
    );
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword')),
      5000
    );
    currentPassword.sendKeys('pass');
    newPassword.sendKeys('pass');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const danger = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    return { danger, currentPassword, newPassword };
  }

  it('does not allow updating with a too short password @network @accessibility', async () => {
    const { danger } = await checkPasswordFields();
    expect(await danger.getText()).toEqual(
      'Password must be 6 or more characters'
    );
  });

  it('password error message goes away once success is had @network @accessibility', async () => {
    const { danger, currentPassword, newPassword } =
      await checkPasswordFields();
    expect(await danger.getText()).toEqual(
      'Password must be 6 or more characters'
    );
    currentPassword.sendKeys('word');
    newPassword.sendKeys('word');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Password Updated');
    expect(
      await driver.findElements(By.className('alert-danger'))
    ).toHaveLength(0);
  });
});
