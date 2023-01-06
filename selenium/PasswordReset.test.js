/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const bcrypt = require('bcryptjs');
const Test = require('./common/Test');
require('chromedriver');
const Mysql = require('../api/services/Mysql');

describe('password reset', () => {
  jest.setTimeout(10000);

  let test;
  let driver;
  let resetLink;
  let forgot;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.addUser('passwordResetUser');
    await driver.get(`${Test.getApp()}/login`);
    resetLink = await driver.wait(
      until.elementLocated(By.id('forgotPasswordLink')),
      5000
    );
    await resetLink.click();
    forgot = await driver.wait(
      until.elementLocated(By.css('[data-testid="forgotPasswordModal"]')),
      5000
    );
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the form when clicked @network @accessibility', async () => {
    expect(await forgot.isDisplayed()).toBeTruthy();
  });

  it('does not allow you to submit with empty email @accessibility', async () => {
    const feedback = await driver.findElements(
      By.className('invalid-feedback')
    );
    expect(feedback).toHaveLength(3);
    for (let i = 0; i < feedback.length; i++) {
      expect(await feedback[i].getText()).toEqual('');
      expect(await feedback[i].isDisplayed()).toBeFalsy();
    }
    await driver.findElement(By.id('requestResetPasswordButton')).click();
    expect(await feedback[2].getText()).toEqual(
      'Please provide a valid email.'
    );
    expect(await feedback[2].isDisplayed()).toBeTruthy();
  });

  it('shows error with bad email @network @accessibility', async () => {
    const alert = await fillAndSubmitWithEmail('forgotPasswordUser@exampl');
    expect(await alert.getText()).toEqual('Please provide a valid email.');
  });

  it('shows success with good email @network @accessibility', async () => {
    const alert = await fillAndSubmitWithEmail('passwordResetUser@example.org');
    expect(await alert.getText()).toEqual(
      'A reset code was sent to your email. This code is only valid for 10 minutes.'
    );
  });

  // TODO it('sends an email with reset code', () => {});

  it('properly auto-shows reset code form @network @accessibility', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await test.waitUntilNotPresent(
      By.css('[data-testid="forgotPasswordModal"]'),
      7000
    );
    expect(
      await driver.findElement(By.id('formEmail')).getAttribute('value')
    ).toEqual('passwordResetUser@example.org');
  });

  it('does not allow you to submit with empty fields @accessibility', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await test.waitUntilNotPresent(
      By.css('[data-testid="forgotPasswordModal"]'),
      7000
    );
    await driver.findElement(By.id('formEmail')).clear();
    const feedback = await driver.findElements(
      By.className('invalid-feedback')
    );
    expect(feedback).toHaveLength(5);
    for (let i = 0; i < feedback.length; i++) {
      expect(await feedback[i].getText()).toEqual('');
      expect(await feedback[i].isDisplayed()).toBeFalsy();
    }
    await driver.findElement(By.id('resetPasswordButton')).click();
    expect(await feedback[2].getText()).toEqual(
      'Please provide a valid email.'
    );
    expect(await feedback[3].getText()).toEqual('Please provide a valid code.');
    expect(await feedback[4].getText()).toEqual(
      'Password must be 6 or more characters.'
    );
    for (let i = 2; i < feedback.length; i++) {
      expect(await feedback[i].isDisplayed()).toBeTruthy();
    }
  });

  it('does not let you reset with bad code @network @accessibility', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      1234,
      'newPassword'
    );
    const alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    expect(await alert.getText()).toEqual('Supplied code does not match!');
  });

  it('does not let you reset with bad password @network @accessibility', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await fillAndSubmitWithCode('passwordResetUser@example.org', 1234, 'newPa');
    const alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'Password must be 6 or more characters.'
    );
  });

  it('does not let you reset with too many attempts @network @accessibility', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await test.waitUntilNotPresent(
      By.css('[data-testid="forgotPasswordModal"]'),
      7000
    );
    const user = await Mysql.query(
      `SELECT * FROM users WHERE email = 'passwordResetUser@example.org'`
    );
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      1234,
      'newPassword'
    );
    let alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    await alert.findElement(By.css('.btn-close')).click();
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      1234,
      'newPassword'
    );
    alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    await alert.findElement(By.css('.btn-close')).click();
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      1234,
      'newPassword'
    );
    alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    await alert.findElement(By.css('.btn-close')).click();
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      user[0].password_reset_code,
      'newPassword'
    );
    alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    expect(await alert.getText()).toEqual('Supplied code does not match!');
  });

  it('lets you reset password, and logs you in @network @accessibility', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await test.waitUntilNotPresent(
      By.css('[data-testid="forgotPasswordModal"]'),
      7000
    );
    let user = await Mysql.query(
      `SELECT * FROM users WHERE email = 'passwordResetUser@example.org'`
    );
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      user[0].password_reset_code,
      'newPassword'
    );
    const dropDownMenu = await driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    expect(await dropDownMenu.getText()).toEqual('passwordResetUser');
    user = await Mysql.query(
      `SELECT * FROM users WHERE email = 'passwordResetUser@example.org'`
    );
    expect(await bcrypt.compare('newPassword', user[0].password)).toBeTruthy();
  });

  it('let you login with two bad attempts', async () => {
    await fillAndSubmitWithEmail('passwordResetUser@example.org');
    await test.waitUntilNotPresent(
      By.css('[data-testid="forgotPasswordModal"]'),
      7000
    );
    const user = await Mysql.query(
      `SELECT * FROM users WHERE email = 'passwordResetUser@example.org'`
    );
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      1234,
      'newPassword'
    );
    let alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    await alert.findElement(By.css('.btn-close')).click();
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      1234,
      'newPassword'
    );
    alert = await driver.wait(
      until.elementLocated(By.className('alert')),
      5000
    );
    await alert.findElement(By.css('.btn-close')).click();
    await fillAndSubmitWithCode(
      'passwordResetUser@example.org',
      user[0].password_reset_code,
      'newPassword'
    );
    const dropDownMenu = await driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    expect(await dropDownMenu.getText()).toEqual('passwordResetUser');
  });

  async function fillAndSubmitWithEmail(email) {
    await driver.findElement(By.id('formEmail')).sendKeys(email);
    await driver.findElement(By.id('requestResetPasswordButton')).click();
    return driver.wait(until.elementLocated(By.className('alert')), 5000);
  }

  async function fillAndSubmitWithCode(email, code, password) {
    await test.waitUntilNotPresent(
      By.css('[data-testid="forgotPasswordModal"]'),
      7000
    );
    await driver.findElement(By.id('formEmail')).clear();
    await driver.findElement(By.id('formEmail')).sendKeys(email);
    await driver.findElement(By.id('formCode')).clear();
    await driver.findElement(By.id('formCode')).sendKeys(code);
    await driver.findElement(By.id('formNewPassword')).clear();
    await driver.findElement(By.id('formNewPassword')).sendKeys(password);
    await driver.findElement(By.id('resetPasswordButton')).click();
  }
});
