/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('settings personal page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    await test.loginUser('settingsPersonalUser');
    await driver.get(`${Test.getApp()}/settings`);
    await driver.wait(until.elementLocated(By.css('h1')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="personal"]')).click();
    driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formFirstName'))),
      5000
    );
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the personal information @network @accessibility', async () => {
    const personalInfo = (await driver.findElements(By.css('form')))[3];
    await driver.wait(
      until.elementTextIs(
        personalInfo.findElement(By.css('h2')),
        'Personal Information'
      ),
      5000
    );
    expect(await personalInfo.findElement(By.css('h2')).getText()).toEqual(
      'Personal Information'
    );
  });

  it('displays the first name', async () => {
    const firstName = driver.wait(
      until.elementLocated(By.id('formFirstName')),
      5000
    );
    await test.waitUntilInputFilled(By.id('formFirstName'));
    expect(await firstName.getAttribute('value')).toEqual('Test');
    expect(await firstName.getAttribute('disabled')).toBeNull();
  });

  it('displays the last name', async () => {
    const lastName = driver.wait(
      until.elementLocated(By.id('formLastName')),
      5000
    );
    await test.waitUntilInputFilled(By.id('formLastName'));
    expect(await lastName.getAttribute('value')).toEqual('User');
    expect(await lastName.getAttribute('disabled')).toBeNull();
  });

  it('displays the city', async () => {
    const city = driver.wait(until.elementLocated(By.id('formCity')), 5000);
    await test.waitUntilInputFilled(By.id('formCity'));
    expect(await city.getAttribute('value')).toEqual(
      'Fairfax, VA, United States of America'
    );
    expect(await city.getAttribute('disabled')).toBeNull();
  });

  it('shows error when you update settings blank information @accessibility', async () => {
    const settings = (await driver.findElements(By.css('form')))[3];
    const feedbacks = await settings.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(3);
    for (const feedback of feedbacks) {
      expect(await feedback.getText()).toEqual('');
      expect(await feedback.isDisplayed()).toBeFalsy();
    }
    await driver.findElement(By.id('formFirstName')).clear();
    await driver.findElement(By.id('formLastName')).clear();
    await driver.findElement(By.id('formCity')).clear();
    await driver.findElement(By.id('savePersonalInformationButton')).click();
    expect(await feedbacks[0].getText()).toEqual(
      'Please provide a valid first name.'
    );
    expect(await feedbacks[1].getText()).toEqual(
      'Please provide a valid last name.'
    );
    expect(await feedbacks[2].getText()).toEqual(
      'Please select a valid city from the drop down.'
    );
    for (const feedback of feedbacks) {
      expect(await feedback.isDisplayed()).toBeTruthy();
    }
  });

  async function checkFields(firstName, lastName) {
    expect(await firstName.getAttribute('value')).toEqual('Test0');
    expect(await lastName.getAttribute('value')).toEqual('User0');
  }

  it('allows updating the personal values @network @accessibility', async () => {
    let firstName = await driver.wait(
      until.elementLocated(By.id('formFirstName')),
      5000
    );
    let lastName = await driver.wait(
      until.elementLocated(By.id('formLastName')),
      5000
    );
    await test.waitUntilInputFilled(By.id('formFirstName'));
    await firstName.sendKeys('0');
    await lastName.sendKeys('0');
    await checkFields(firstName, lastName);
    await driver.findElement(By.id('savePersonalInformationButton')).click();
    const success = await driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Personal Information Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h1')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="personal"]')).click();
    firstName = driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formFirstName'))),
      5000
    );
    lastName = await driver.wait(
      until.elementLocated(By.id('formLastName')),
      5000
    );
    await checkFields(firstName, lastName);
  });

  it('allows updating the city @network', async () => {
    let city = await driver.wait(until.elementLocated(By.id('formCity')), 5000);
    await test.waitUntilInputFilled(By.id('formCity'));
    await city.clear();
    await city.sendKeys('Chantilly');
    const location = await driver.wait(
      until.elementLocated(By.xpath('//*[text()="Chantilly"]')),
      5000
    );
    await location.click();
    expect(await city.getAttribute('value')).toEqual(
      'Chantilly, VA, United States of America'
    );
    await Test.sleep(1000);
    await driver.findElement(By.id('savePersonalInformationButton')).click();
    await driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h1')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="personal"]')).click();
    city = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formCity'))),
      5000
    );
    await test.waitUntilInputFilled(By.id('formCity'));
    expect(await city.getAttribute('value')).toEqual(
      'Chantilly, VA, United States of America'
    );
  });
});
