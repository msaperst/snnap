const { By } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('profile page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.loginUser('profileUser');
    await driver.get(`${Test.getApp()}/profile/profileUser`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('allows us to navigate to the user profile', async () => {
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/profile/profileUser`
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
  // verify ratings show in profile
  // verify link to chat shown in profile
});
