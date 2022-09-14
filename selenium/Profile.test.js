const { By, until } = require('selenium-webdriver');
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
    await driver.get(`${Test.getApp()}/profile`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('allows us to navigate to the profile', async () => {
    await driver.get(Test.getApp());
    const dropDownMenu = driver.wait(
      until.elementLocated(By.id('user-dropdown'))
    );
    await dropDownMenu.click();
    const profileLink = driver.wait(
      until.elementLocated(By.linkText('Profile'))
    );
    driver.wait(until.elementIsVisible(profileLink));
    await profileLink.click();
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/profile`);
    expect(await driver.findElement(By.css('h2')).getText()).toEqual('Profile');
  });

  it('has 5 different forms for updated data', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const forms = await driver.findElements(By.css('form'));
    expect(forms).toHaveLength(5);
  });
});
