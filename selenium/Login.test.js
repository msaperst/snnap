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
    await Base.cleanUp(driver);
  }, 15000);

  it('takes you to the login page when not authenticated', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/login');
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Login');
  });

  it('shows error when you login with blank credentials', async () => {
    const feedback = (await driver.findElements(By.className('invalid-feedback')));
    expect(feedback.length).toEqual(2);
    expect(await feedback[0].getText()).toEqual('');
    expect(await feedback[1].getText()).toEqual('');
    expect(await feedback[0].isDisplayed()).toBeFalsy();
    expect(await feedback[1].isDisplayed()).toBeFalsy();
    driver.findElement(By.id('loginButton')).click();
    expect(await feedback[0].getText()).toEqual('Please provide a valid username.');
    expect(await feedback[1].getText()).toEqual('Please provide a valid password.');
    expect(await feedback[0].isDisplayed()).toBeTruthy();
    expect(await feedback[1].isDisplayed()).toBeTruthy();
  });

  it('allows you to login with a valid user', async () => {
    await driver.findElement(By.id('formUsername')).sendKeys(user.username);
    await driver.findElement(By.id('formPassword')).sendKeys('password');
    await driver.findElement(By.id('loginButton')).click();
    const dropDownMenu = driver.wait(until.elementLocated(By.id('nav-dropdown')));
    expect(await dropDownMenu.getText()).toEqual(user.username);
  });

  it('does not allow you to login with an invalid user', async () => {
    await driver.findElement(By.id('formUsername')).sendKeys('some bad user');
    await driver.findElement(By.id('formPassword')).sendKeys('password');
    driver.findElement(By.id('loginButton')).click();
    const header = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await header.getText()).toEqual('Username or password is incorrect!');
  });

  it('does not allow you to login with an invalid password', async () => {
    await driver.findElement(By.id('formUsername')).sendKeys(user.username);
    await driver.findElement(By.id('formPassword')).sendKeys('passwor');
    driver.findElement(By.id('loginButton')).click();
    const header = driver.wait(until.elementLocated(By.className('alert-danger')));
    expect(await header.getText()).toEqual('Username or password is incorrect!');
  });

  it('allows you to navigate to the register page', async () => {
    driver.findElement(By.id('registerButton')).click();
    driver.wait(until.elementLocated(By.id('formFirstname')));
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Register');
  });

  //TODO - able to navigate to forgot password

  //TODO - verify remains logged in works
});