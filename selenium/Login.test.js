const { Key, By } = require('selenium-webdriver');
const Base = require('./common/base');
require('chromedriver');

describe('main menu', () => {
  let driver;

  beforeEach(async () => {
    driver = await Base.getDriver();
  }, 10000);

  afterEach(async () => {
    await driver.quit();
  }, 15000);

  it('takes you to the login page when not authenticated', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/login');
  });

  it('shows error when you login with blank credentials', async () => {
    expect((await driver.findElements(By.id('username-error'))).length).toEqual(0);
    expect((await driver.findElements(By.id('password-error'))).length).toEqual(0);
    driver.findElement(By.id('loginButton')).click();
    expect(await driver.findElement(By.id('username-error')).getText()).toEqual('Username is required');
    expect(await driver.findElement(By.id('password-error')).getText()).toEqual('Password is required');
  });

  //TODO - able to login with correct user
  //TODO - unable to login with bad user
  //TODO - unable to login with bad password
  //TODO - able to navigate to register
  //TODO - able to navigate to forgot password
});