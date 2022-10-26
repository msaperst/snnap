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
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await dropDownMenu.click();
    const profileLink = driver.wait(
      until.elementLocated(By.linkText('Profile')),
      5000
    );
    driver.wait(until.elementIsVisible(profileLink), 5000);
    await profileLink.click();
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/profile`);
    expect(await driver.findElement(By.css('h2')).getText()).toEqual('Profile');
  });

  it('has 3 different tabs for updating profile', async () => {
    const pills = driver.wait(until.elementLocated(By.css('.nav-pills')), 5000);
    const areas = await pills.findElements(By.css('.nav-link'));
    expect(areas).toHaveLength(3);

    expect(await areas[0].getText()).toEqual('Account Information');
    expect(await areas[0].getAttribute('class')).toContain('active');

    expect(await areas[1].getText()).toEqual('Personal Profile');
    expect(await areas[2].getText()).toEqual('Company Profile');

    // with 6 forms
    const forms = await driver.findElements(By.css('form'));
    expect(forms).toHaveLength(6);
  });

  it('has 3 different forms for account information', async () => {
    driver.wait(until.elementLocated(By.css('h2')), 5000);
    const forms = await driver.findElements(By.css('form'));
    expect(await forms[0].isDisplayed()).toBeTruthy();
    expect(await forms[1].isDisplayed()).toBeTruthy();
    expect(await forms[2].isDisplayed()).toBeTruthy();
    expect(await forms[3].isDisplayed()).toBeFalsy();
    expect(await forms[4].isDisplayed()).toBeFalsy();
    expect(await forms[5].isDisplayed()).toBeFalsy();
  });

  it('has 1 form for personal information', async () => {
    driver.wait(until.elementLocated(By.css('h2')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="personal"]')).click();
    const forms = await driver.findElements(By.css('form'));
    expect(await forms[0].isDisplayed()).toBeFalsy();
    expect(await forms[1].isDisplayed()).toBeFalsy();
    expect(await forms[2].isDisplayed()).toBeFalsy();
    expect(await forms[3].isDisplayed()).toBeTruthy();
    expect(await forms[4].isDisplayed()).toBeFalsy();
    expect(await forms[5].isDisplayed()).toBeFalsy();
  });

  it('has 2 different forms for company information', async () => {
    driver.wait(until.elementLocated(By.css('h2')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="company"]')).click();
    const forms = await driver.findElements(By.css('form'));
    expect(await forms[0].isDisplayed()).toBeFalsy();
    expect(await forms[1].isDisplayed()).toBeFalsy();
    expect(await forms[2].isDisplayed()).toBeFalsy();
    expect(await forms[3].isDisplayed()).toBeFalsy();
    expect(await forms[4].isDisplayed()).toBeTruthy();
    expect(await forms[5].isDisplayed()).toBeTruthy();
  });
});
