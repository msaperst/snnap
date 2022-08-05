const { By } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('user page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.loginUser('userUser');
    await driver.get(`${Test.getApp()}/profile/userUser`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('allows us to navigate to the user profile', async () => {
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/profile/userUser`
    );
    expect(await driver.findElement(By.css('h2')).getText()).toEqual(
      'Test User'
    );
  });

  // TODO
  // verify links and content - all static data
  // verify links take to new page
  // verify links add http when not in them
  // verify links don't display when not set
});
