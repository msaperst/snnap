const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('profile page', () => {
  jest.setTimeout(10000);

  let test;
  let user;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    user = await test.loginUser('profileUser');
    await driver.get(`${Test.getApp()}/profile/profileUser`);
    driver.wait(
      until.elementTextIs(driver.findElement(By.css('h1')), 'Test User'),
      5000
    );
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('allows us to navigate to the user profile @network @accessibility', async () => {
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/profile/profileUser`
    );
    expect(await driver.findElement(By.css('h1')).getText()).toEqual(
      'Test User'
    );
    expect(await driver.findElements(By.css('h2'))).toHaveLength(4);
  });

  it('has all of the users data filled out @accessibility', async () => {
    await Test.setUpProfile(
      await user.getId(),
      'Company',
      'https://website.com',
      'https://instagram.com',
      'https://facebook.com',
      'Experience',
      [
        { name: 'Camera', value: 1, what: 'some camera' },
        { value: 3, name: 'Lights', what: 'Some lights' },
      ],
      [{ value: 5 }],
      [{ description: 'some link', link: 'https://link.com' }]
    );
    await driver.navigate().refresh();
    driver.wait(
      until.elementTextIs(driver.findElement(By.css('h1')), 'Test User'),
      5000
    );
    expect(await driver.findElement(By.css('h1')).getText()).toEqual(
      'Test User'
    );
    driver.wait(
      until.elementTextIs(driver.findElement(By.css('h2')), 'Company'),
      5000
    );
    expect(await driver.findElement(By.css('h2')).getText()).toEqual('Company');
    // TODO - verify links and content - all static data
  });

  // TODO
  // verify links take to new page
  // verify links add http when not in them
  // verify links don't display when not set
  // verify ratings show in profile
  // verify link to chat shown in profile
});
