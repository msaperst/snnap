const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');
const Mysql = require("../api/services/Mysql");

describe('register page', () => {
  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver('/register');
  }, 10000);

  afterEach(async () => {
    //delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('takes us to the register page', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/register');
  });

  it('shows the register header', async () => {
    driver.wait(until.elementLocated(By.id('formFirstname')));
    expect(await driver.findElement(By.css('h2')).getText()).toEqual('Register');
  });

  it('shows error when you register with blank information', async () => {
    const feedback = (await driver.findElements(By.className('invalid-feedback')));
    expect(feedback.length).toEqual(10);
    for (let i = 0; i < feedback.length; i++) {
      expect(await feedback[i].getText()).toEqual('');
      expect(await feedback[i].isDisplayed()).toBeFalsy();
    }
    driver.findElement(By.id('registerButton')).click();
    expect(await feedback[0].getText()).toEqual('Please provide a valid first name.');
    expect(await feedback[1].getText()).toEqual('Please provide a valid last name.');
    expect(await feedback[2].getText()).toEqual('Please provide a valid username.');
    expect(await feedback[3].getText()).toEqual('Please provide a valid email.');
    expect(await feedback[4].getText()).toEqual('Please provide a valid phone number.');
    expect(await feedback[5].getText()).toEqual('Please provide a valid password.');
    expect(await feedback[6].getText()).toEqual('Please provide a valid city.');
    expect(await feedback[7].getText()).toEqual('Please provide a valid state.');
    expect(await feedback[8].getText()).toEqual('Please provide a valid zip.');
    expect(await feedback[9].getText()).toEqual('You must agree before submitting.');
    for (let i = 0; i < feedback.length; i++) {
      expect(await feedback[i].isDisplayed()).toBeTruthy();
    }
  });

  it('allows you to register with a valid information', async () => {
    await register('Test', 'User', 'registerUser', 'registerUser@example.org', '0123456789', 'password', 'City', 'State', 'Zip', true);
    const dropDownMenu = driver.wait(until.elementLocated(By.id('user-dropdown')));
    expect(await dropDownMenu.getText()).toEqual('registerUser');
    await Mysql.query(
      `DELETE
         FROM users
         WHERE username = 'registerUser';`
    );
  });

  it('does not allow you to register without a valid email', async () => {
    await driver.findElement(By.id('formEmail')).sendKeys('example');
    driver.findElement(By.id('registerButton')).click();
    const feedback = (await driver.findElements(By.className('invalid-feedback')));
    expect(await feedback[3].getText()).toEqual('Please provide a valid email.');
    expect(await feedback[3].isDisplayed()).toBeTruthy();
  });

  it('does not allow you to register with a duplicate email', async () => {
    test.addUser('registerUser');
    await register('Test', 'User', 'registerUser', 'registerUser@example.org', '0123456789', 'password', 'City', 'State', 'Zip', true);
    const alert = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await alert.getText()).toEqual('This email is already in our system. Try resetting your password.');
  });

  it('does not allow you to register with a duplicate username', async () => {
    test.addUser('registerUser');
    await register('Test', 'User', 'registerUser', 'registerUser1@example.org', '0123456789', 'password', 'City', 'State', 'Zip', true);
    const alert = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await alert.getText()).toEqual('Sorry, that username is already in use.');
  });

  async function register(firstName, lastName, username, email, phoneNumber, password, city, state, zip, agree) {
    await driver.findElement(By.id('formFirstname')).sendKeys(firstName);
    await driver.findElement(By.id('formLastname')).sendKeys(lastName);
    await driver.findElement(By.id('formUsername')).sendKeys(username);
    await driver.findElement(By.id('formEmail')).sendKeys(email);
    await driver.findElement(By.id('formPhonenumber')).sendKeys(phoneNumber);
    await driver.findElement(By.id('formPassword')).sendKeys(password);
    await driver.findElement(By.id('formCity')).sendKeys(city);
    await driver.findElement(By.id('formState')).sendKeys(state);
    await driver.findElement(By.id('formZip')).sendKeys(zip);
    if (agree) {
      await driver.findElement(By.id('agreeToTerms')).click();
    }
    driver.findElement(By.id('registerButton')).click();
  }
});