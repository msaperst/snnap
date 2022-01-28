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
    driver.wait(until.elementLocated(By.id('name')));
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Register');
  });

  it('shows error when you register with blank information', async () => {
    expect((await driver.findElements(By.id('name-error'))).length).toEqual(0);
    expect((await driver.findElements(By.id('username-error'))).length).toEqual(0);
    expect((await driver.findElements(By.id('email-error'))).length).toEqual(0);
    expect((await driver.findElements(By.id('password-error'))).length).toEqual(0);
    driver.findElement(By.id('registerButton')).click();
    expect(await driver.findElement(By.id('name-error')).getText()).toEqual('Name is required');
    expect(await driver.findElement(By.id('username-error')).getText()).toEqual('Username is required');
    expect(await driver.findElement(By.id('email-error')).getText()).toEqual('Email is required');
    expect(await driver.findElement(By.id('password-error')).getText()).toEqual('Password is required');
  });

  it('allows you to register with a valid information', async () => {
    await driver.findElement(By.id('name')).sendKeys('Test User');
    await driver.findElement(By.id('username')).sendKeys('registerUser');
    await driver.findElement(By.id('email')).sendKeys('registerUser@example.org');
    await driver.findElement(By.id('password')).sendKeys('password');
    driver.findElement(By.id('registerButton')).click();
    const dropDownMenu = driver.wait(until.elementLocated(By.id('nav-dropdown')));
    expect(await dropDownMenu.getText()).toEqual('registerUser');
  });

  it('does not allow you to register without a valid email', async () => {
    await driver.findElement(By.id('email')).sendKeys('registerUser@example');
    driver.findElement(By.id('registerButton')).click();
    expect(await driver.findElement(By.id('email-error')).getText()).toEqual('Email is not valid');
  });

  it('does not allow you to register with a duplicate email', async () => {
    user = Base.addUser('registerUser');
    await driver.findElement(By.id('name')).sendKeys('Test User');
    await driver.findElement(By.id('username')).sendKeys('registerUser');
    await driver.findElement(By.id('email')).sendKeys('registerUser@example.org');
    await driver.findElement(By.id('password')).sendKeys('password');
    driver.findElement(By.id('registerButton')).click();
    const alert = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await alert.getText()).toEqual('This email is already in our system. Try resetting your password.');
  });

  it('does not allow you to register with a duplicate username', async () => {
    user = Base.addUser('registerUser');
    await driver.findElement(By.id('name')).sendKeys('Test User');
    await driver.findElement(By.id('username')).sendKeys('registerUser');
    await driver.findElement(By.id('email')).sendKeys('registerUser1@example.org');
    await driver.findElement(By.id('password')).sendKeys('password');
    driver.findElement(By.id('registerButton')).click();
    const alert = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await alert.getText()).toEqual('Sorry, that username is already in use.');
  });
});