const Test = require('./common/Test');
require('chromedriver');

describe('home page', () => {
  let test
  let driver;
  let user;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
  }, 10000);

  afterEach(async () => {
    //delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('redirects to home after going to login when authenticated', async () => {
    user = await test.loginUser('redirectUser');
    await driver.get(Test.getApp());
    const initialUrl = await driver.getCurrentUrl();
    await driver.get(Test.getApp() + '/login');
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/');
    // also, back goes to previous page, not login
    await driver.navigate().back();
    expect(await driver.getCurrentUrl()).toEqual(initialUrl);
  });

  it('stays on login when not authenticated', async () => {
    await driver.get(Test.getApp());
    await driver.get(Test.getApp() + '/login');
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/login');
  });

  it('redirects to profile after going to register when authenticated', async () => {
    user = await test.loginUser('redirectUser');
    await driver.get(Test.getApp());
    const initialUrl = await driver.getCurrentUrl();
    await driver.get(Test.getApp() + '/register');
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/profile');
    // also, back goes to previous page, not register
    await driver.navigate().back();
    expect(await driver.getCurrentUrl()).toEqual(initialUrl);
  });

  it('stays on register when not authenticated', async () => {
    await driver.get(Test.getApp());
    await driver.get(Test.getApp() + '/register');
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/register');
  });
});
