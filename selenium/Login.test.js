const { By, until } = require('selenium-webdriver');
const Base = require('./common/base');
require('chromedriver');

describe('log in page', () => {
  let driver;
  let user;

  beforeEach(async () => {
    //add a user
    user = Base.addUser('loginUser');
    // load the default page
    driver = await Base.getDriver();
  }, 10000);

  afterEach(async () => {
    //delete the user
    await Base.removeUser(user.username);
    // close the driver
    await driver.quit();
  }, 15000);

  it('takes you to the login page when not authenticated', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/login');
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Login');
  });

  it('shows error when you login with blank credentials', async () => {
    expect((await driver.findElements(By.id('username-error'))).length).toEqual(0);
    expect((await driver.findElements(By.id('password-error'))).length).toEqual(0);
    driver.findElement(By.id('loginButton')).click();
    expect(await driver.findElement(By.id('username-error')).getText()).toEqual('Username is required');
    expect(await driver.findElement(By.id('password-error')).getText()).toEqual('Password is required');
  });

  it('allows you to login with a valid user', async () => {
    await driver.findElement(By.id('username')).sendKeys(user.username);
    await driver.findElement(By.id('password')).sendKeys('password');
    driver.findElement(By.id('loginButton')).click();
    const header = driver.wait(until.elementLocated(By.id('welcome')));
    expect(await header.getText()).toEqual('Hi Test User!');
  });

  it('does not allow you to login with an invalid user', async () => {
    await driver.findElement(By.id('username')).sendKeys('some bad user');
    await driver.findElement(By.id('password')).sendKeys('password');
    driver.findElement(By.id('loginButton')).click();
    const header = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await header.getText()).toEqual('Username or password is incorrect!');
  });

  it('does not allow you to login with an invalid password', async () => {
    await driver.findElement(By.id('username')).sendKeys(user.username);
    await driver.findElement(By.id('password')).sendKeys('passwor');
    driver.findElement(By.id('loginButton')).click();
    const header = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await header.getText()).toEqual('Username or password is incorrect!');
  });

  it('allows you to navigate to the register page', async () => {
    driver.findElement(By.linkText('Register')).click();
    driver.wait(until.elementLocated(By.id('name')));
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Register');
  });

  //TODO - able to navigate to forgot password
});