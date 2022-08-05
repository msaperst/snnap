const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('profile page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.loginUser('profilePasswordUser');
    await driver.get(`${Test.getApp()}/profile`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the password', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const password = (await driver.findElements(By.css('form')))[2];
    expect(await password.findElement(By.css('h3')).getText()).toEqual(
      'Password'
    );
  });

  it('displays the current password', async () => {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword'))
    );
    expect(await currentPassword.getAttribute('value')).toEqual('');
    expect(await currentPassword.getAttribute('disabled')).toBeNull();
  });

  it('displays the new password', async () => {
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword'))
    );
    expect(await newPassword.getAttribute('value')).toEqual('');
    expect(await newPassword.getAttribute('disabled')).toBeNull();
  });

  it('shows error when you update password blank information', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const profile = (await driver.findElements(By.css('form')))[2];
    const feedbacks = await profile.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(2);
    for (const feedback of feedbacks) {
      expect(await feedback.getText()).toEqual('');
      expect(await feedback.isDisplayed()).toBeFalsy();
    }
    driver.findElement(By.id('updatePasswordButton')).click();
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

  it('allows updating the password values', async () => {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword'))
    );
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword'))
    );
    currentPassword.sendKeys('password');
    newPassword.sendKeys('password1');
    expect(await currentPassword.getAttribute('value')).toEqual('password');
    expect(await newPassword.getAttribute('value')).toEqual('password1');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await success.getText()).toEqual('Password Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
  });

  it('does not allow updating with a bad password', async () => {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword'))
    );
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword'))
    );
    currentPassword.sendKeys('pass');
    newPassword.sendKeys('password1');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await danger.getText()).toEqual(
      "Current password doesn't match existing password."
    );
  });

  async function checkPasswordFields() {
    const currentPassword = driver.wait(
      until.elementLocated(By.id('formCurrentPassword'))
    );
    const newPassword = driver.wait(
      until.elementLocated(By.id('formNewPassword'))
    );
    currentPassword.sendKeys('pass');
    newPassword.sendKeys('pass');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const danger = await driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    return { danger, currentPassword, newPassword };
  }

  it('does not allow updating with a too short password', async () => {
    const { danger } = await checkPasswordFields();
    expect(await danger.getText()).toEqual(
      'Password must be 6 or more characters'
    );
  });

  it('password error message goes away once success is had', async () => {
    const { danger, currentPassword, newPassword } =
      await checkPasswordFields();
    expect(await danger.getText()).toEqual(
      'Password must be 6 or more characters'
    );
    currentPassword.sendKeys('word');
    newPassword.sendKeys('word');
    await driver.findElement(By.id('updatePasswordButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await success.getText()).toEqual('Password Updated');
    expect(
      await driver.findElements(By.className('alert-danger'))
    ).toHaveLength(0);
  });
});
