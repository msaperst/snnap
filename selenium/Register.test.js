const { By, until } = require('selenium-webdriver');
const Base = require('./common/base');
require('chromedriver');

describe('register page', () => {
  let driver;
  let user;

  beforeEach(async () => {
    // load the default page
    driver = await Base.getDriver('/register');
  }, 10000);

  afterEach(async () => {
    //delete the user
    await Base.removeUser('registerUser');
    // close the driver
    await driver.quit();
  }, 15000);

  it('takes us to the register page', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/register');
  });

  it('shows the register header', async () => {
    driver.wait(until.elementLocated(By.id('validationFirstname')));
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Register');
  });

  it('shows error when you register with blank information', async () => {
    const feedback = (await driver.findElements(By.className('invalid-feedback')));
    expect(feedback.length).toEqual(10);
    for (let i = 0; i < 10; i++) {
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
    for (let i = 0; i < 10; i++) {
      expect(await feedback[i].isDisplayed()).toBeTruthy();
    }
  });

  it('allows you to register with a valid information', async () => {
    await register('Test', 'User', 'registerUser', 'registerUser@example.org', '0123456789', 'password', 'City', 'State', 'Zip', true);
    const dropDownMenu = driver.wait(until.elementLocated(By.id('nav-dropdown')));
    expect(await dropDownMenu.getText()).toEqual('registerUser');
  });

  it('does not allow you to register without a valid email', async () => {
    await driver.findElement(By.id('validationEmail')).sendKeys('example');
    driver.findElement(By.id('registerButton')).click();
    const feedback = (await driver.findElements(By.className('invalid-feedback')));
    expect(await feedback[3].getText()).toEqual('Please provide a valid email.');
    expect(await feedback[3].isDisplayed()).toBeTruthy();
  });

  it('does not allow you to register with a duplicate email', async () => {
    user = Base.addUser('registerUser');
    await register('Test', 'User', 'registerUser', 'registerUser@example.org', '0123456789', 'password', 'City', 'State', 'Zip', true);
    const alert = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await alert.getText()).toEqual('This email is already in our system. Try resetting your password.');
  });

  it('does not allow you to register with a duplicate username', async () => {
    user = Base.addUser('registerUser');
    await register('Test', 'User', 'registerUser', 'registerUser1@example.org', '0123456789', 'password', 'City', 'State', 'Zip', true);
    const alert = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await alert.getText()).toEqual('Sorry, that username is already in use.');
  });

  async function register(firstName, lastName, username, email, phoneNumber, password, city, state, zip, agree) {
    await driver.findElement(By.id('validationFirstname')).sendKeys(firstName);
    await driver.findElement(By.id('validationLastname')).sendKeys(lastName);
    await driver.findElement(By.id('validationUsername')).sendKeys(username);
    await driver.findElement(By.id('validationEmail')).sendKeys(email);
    await driver.findElement(By.id('validationPhonenumber')).sendKeys(phoneNumber);
    await driver.findElement(By.id('validationPassword')).sendKeys(password);
    await driver.findElement(By.id('validationCity')).sendKeys(city);
    await driver.findElement(By.id('validationState')).sendKeys(state);
    await driver.findElement(By.id('validationZip')).sendKeys(zip);
    if (agree) {
      await driver.findElement(By.id('agreeToTerms')).click();
    }
    driver.findElement(By.id('registerButton')).click();
  }
});