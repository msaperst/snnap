const { By, until } = require('selenium-webdriver');
const Base = require('./common/base');
require('chromedriver');

describe('home page', () => {
  let driver;
  let user;

  beforeEach(async () => {
    // load the default page
    driver = await Base.getDriver();
    // login as a user
    user = await Base.loginUser(driver, 'homeUser');
    await driver.get(Base.getApp());
  }, 10000);

  afterEach(async () => {
    //delete the user
    await Base.removeUser(user.username);
    // close the driver
    await driver.quit();
  }, 15000);

  it('takes us to the homepage', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/');
  });

  it('shows the username', async () => {
    const header = driver.wait(until.elementLocated(By.id('welcome')));
    expect(await header.getText()).toEqual(`Hi ${await user.getName()}!`);
  });

  it('shows the last login time', async () => {
    const login = driver.wait(until.elementLocated(By.id('last-login')));
    expect(await login.getText()).toMatch(/You last logged in at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.000Z/);

  });

});