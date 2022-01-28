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
    const header = driver.wait(until.elementLocated(By.id('tagline')));
    expect(await header.getText()).toEqual('Photography help in a snap');
  });

  //TODO - fill me out as we get more functionality

});