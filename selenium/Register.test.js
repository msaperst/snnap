/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');
const Mysql = require('../api/services/Mysql');

describe('register page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver('/register');
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('takes us to the register page @network @accessibility', async () => {
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/register`);
  });

  it('shows the register header', async () => {
    driver.wait(until.elementLocated(By.id('formFirstname')), 5000);
    expect(await driver.findElement(By.css('h1')).getText()).toEqual(
      'Register'
    );
  });

  it('shows error when you register with blank information @accessibility', async () => {
    const feedback = await driver.findElements(
      By.className('invalid-feedback')
    );
    expect(feedback).toHaveLength(7);
    for (let i = 0; i < feedback.length; i++) {
      expect(await feedback[i].getText()).toEqual('');
      expect(await feedback[i].isDisplayed()).toBeFalsy();
    }
    await driver.findElement(By.id('createAccountButton')).click();
    expect(await feedback[0].getText()).toEqual(
      'Please provide a valid first name.'
    );
    expect(await feedback[1].getText()).toEqual(
      'Please provide a valid last name.'
    );
    expect(await feedback[2].getText()).toEqual(
      'Please select a valid city from the drop down.'
    );
    expect(await feedback[3].getText()).toEqual(
      'Please provide a valid email.'
    );
    expect(await feedback[4].getText()).toEqual(
      'Please provide a valid username.'
    );

    expect(await feedback[5].getText()).toEqual(
      'Password must be 6 or more characters.'
    );
    expect(await feedback[6].getText()).toEqual(
      'You must agree before submitting.'
    );
    for (let i = 0; i < feedback.length; i++) {
      expect(await feedback[i].isDisplayed()).toBeTruthy();
    }
  });

  it('allows you to register with a valid information @network @accessibility', async () => {
    await register(
      'Test',
      'User',
      'Fairfax',
      'registerUser@example.org',
      'registerUser',
      'password',
      true
    );
    const dropDownMenu = driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    expect(await dropDownMenu.getText()).toEqual('registerUser');
    await Mysql.query(
      `DELETE
         FROM users
         WHERE username = 'registerUser';`
    );
  });

  it('does not allow you to register without a valid email @accessibility', async () => {
    await driver.findElement(By.id('formEmail')).sendKeys('example');
    driver.findElement(By.id('createAccountButton')).click();
    const feedback = await driver.findElements(
      By.className('invalid-feedback')
    );
    expect(await feedback[3].getText()).toEqual(
      'Please provide a valid email.'
    );
    expect(await feedback[3].isDisplayed()).toBeTruthy();
  });

  it('does not allow you to register with a duplicate email @network @accessibility', async () => {
    test.addUser('registerUser');
    await register(
      'Test',
      'User',
      'Fairfax',
      'registerUser@example.org',
      'registerUser',
      'password',
      true
    );
    const alert = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'This email is already in our system. Try resetting your password.'
    );
  });

  it('does not allow you to register with a duplicate username @network @accessibility', async () => {
    test.addUser('registerUser');
    await register(
      'Test',
      'User',
      'Fairfax',
      'registerUser1@example.org',
      'registerUser',
      'password',
      true
    );
    const alert = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'Sorry, that username is already in use.'
    );
  });

  it('does not allow you to register with an invalid city', async () => {
    test.addUser('registerUser');
    await register(
      'Test',
      'User',
      'Fairfax',
      'registerUser1@example.org',
      'registerUser',
      'password',
      true,
      false
    );
    const alert = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'Please select a valid city from the drop down.'
    );
  });

  // TODO - does not allow you to register with a short password
  // TODO - does not allow you to register with a username with special characters
  // TODO - does not allow you to register with a username without alphabetical characters

  async function register(
    firstName,
    lastName,
    city,
    email,
    username,
    password,
    agree,
    fullCity = true
  ) {
    await driver.findElement(By.id('formFirstname')).sendKeys(firstName);
    await driver.findElement(By.id('formLastname')).sendKeys(lastName);
    await driver.findElement(By.id('formCity')).sendKeys(city);
    if (fullCity) {
      const location = await driver.wait(
        until.elementLocated(By.xpath(`//*[text()="${city}"]`)),
        5000
      );
      await location.click();
      Test.sleep(1000);
    }
    await driver.findElement(By.id('formEmail')).sendKeys(email);
    await driver.findElement(By.id('formUsername')).sendKeys(username);
    await driver.findElement(By.id('formPassword')).sendKeys(password);
    if (agree) {
      await driver.findElement(By.id('agreeToTerms')).click();
    }
    driver.findElement(By.id('createAccountButton')).click();
  }
});
