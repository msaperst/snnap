const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('profile notifications', () => {
  jest.setTimeout(10000);

  let test;
  let driver;
  let user;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    user = await test.loginUser('profileNotificationUser');
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the alert if no company name is input', async () => {
    await Test.setUpProfile(
      await user.getId(),
      null,
      null,
      null,
      null,
      null,
      [],
      [],
      []
    );
    await driver.get(`${Test.getApp()}/`);
    const modal = await driver.wait(
      until.elementLocated(
        By.css('[data-testid="setUpProfileNotificationModal"]')
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(modal), 5000);
    expect(await modal.isDisplayed()).toBeTruthy();
  });

  it('does not show the alert if company name is input', async () => {
    await driver.get(`${Test.getApp()}/`);
    const modals = await driver.findElements(
      By.css('[data-testid="setUpProfileNotificationModal"]')
    );
    expect(modals).toHaveLength(0);
  });

  it('links to the settings page when button is clicked @network @accessibility', async () => {
    await Test.setUpProfile(
      await user.getId(),
      null,
      null,
      null,
      null,
      null,
      [],
      [],
      []
    );
    await driver.get(`${Test.getApp()}/`);
    const modal = await driver.wait(
      until.elementLocated(
        By.css('[data-testid="setUpProfileNotificationModal"]')
      ),
      5000
    );
    await driver.wait(until.elementIsVisible(modal), 5000);
    await driver.findElement(By.linkText('Update Settings')).click();
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/settings`);
    driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formCompanyName'))),
      5000
    );
    const companyInformation = (await driver.findElements(By.css('form')))[4];
    await driver.wait(
      until.elementTextIs(
        companyInformation.findElement(By.css('h2')),
        'Company Information'
      ),
      5000
    );
    expect(
      await companyInformation.findElement(By.css('h2')).getText()
    ).toEqual('Company Information');
  });
});
