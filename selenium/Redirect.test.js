const Base = require('./common/base');
require('chromedriver');

describe('home page', () => {
  let driver;
  let user;

  beforeEach(async () => {
    // load the default page
    driver = await Base.getDriver();
  }, 10000);

  afterEach(async () => {
    //delete the user
    await Base.removeUser(user.username);
    // close the driver
    await driver.quit();
  }, 15000);

  it('redirects to home after going to login when authenticated', async () => {
    user = await Base.loginUser(driver, 'homeUser');
    await driver.get(Base.getApp());
    const initialUrl = await driver.getCurrentUrl();
    await driver.get(Base.getApp() + '/login');
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/');
    // also, back goes to previous page, not login
    await driver.navigate().back();
    expect(await driver.getCurrentUrl()).toEqual(initialUrl);
  });

  it('stays on login when not authenticated', async () => {
    await driver.get(Base.getApp());
    await driver.get(Base.getApp() + '/login');
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/login');
  });

  it('redirects to profile after going to register when authenticated', async () => {
    user = await Base.loginUser(driver, 'homeUser');
    await driver.get(Base.getApp());
    const initialUrl = await driver.getCurrentUrl();
    await driver.get(Base.getApp() + '/register');
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/profile');
    // also, back goes to previous page, not register
    await driver.navigate().back();
    expect(await driver.getCurrentUrl()).toEqual(initialUrl);
  });

  it('stays on register when not authenticated', async () => {
    await driver.get(Base.getApp());
    await driver.get(Base.getApp() + '/register');
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/register');
  });
});
