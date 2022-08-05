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
    await test.loginUser('profilePersonalUser');
    await driver.get(`${Test.getApp()}/profile`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the personal information', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const personalInfo = (await driver.findElements(By.css('form')))[1];
    expect(await personalInfo.findElement(By.css('h3')).getText()).toEqual(
      'Personal Information'
    );
  });

  it('displays the first name', async () => {
    const firstName = driver.wait(until.elementLocated(By.id('formFirstName')));
    test.waitUntilInputFilled(By.id('formFirstName'));
    expect(await firstName.getAttribute('value')).toEqual('Test');
    expect(await firstName.getAttribute('disabled')).toBeNull();
  });

  it('displays the last name', async () => {
    const lastName = driver.wait(until.elementLocated(By.id('formLastName')));
    test.waitUntilInputFilled(By.id('formLastName'));
    expect(await lastName.getAttribute('value')).toEqual('User');
    expect(await lastName.getAttribute('disabled')).toBeNull();
  });

  it('displays the city', async () => {
    const city = driver.wait(until.elementLocated(By.id('formCity')));
    test.waitUntilInputFilled(By.id('formCity'));
    expect(await city.getAttribute('value')).toEqual('City');
    expect(await city.getAttribute('disabled')).toBeNull();
  });

  it('displays the state', async () => {
    const state = driver.wait(until.elementLocated(By.id('formState')));
    test.waitUntilInputFilled(By.id('formState'));
    expect(await state.getAttribute('value')).toEqual('State');
    expect(await state.getAttribute('disabled')).toBeNull();
  });

  it('displays the zip', async () => {
    const zip = driver.wait(until.elementLocated(By.id('formZip')));
    test.waitUntilInputFilled(By.id('formZip'));
    expect(await zip.getAttribute('value')).toEqual('Zip');
    expect(await zip.getAttribute('disabled')).toBeNull();
  });

  it('shows error when you update profile blank information', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const profile = (await driver.findElements(By.css('form')))[1];
    const feedbacks = await profile.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(5);
    for (const feedback of feedbacks) {
      expect(await feedback.getText()).toEqual('');
      expect(await feedback.isDisplayed()).toBeFalsy();
    }
    driver.findElement(By.id('formFirstName')).clear();
    driver.findElement(By.id('formLastName')).clear();
    driver.findElement(By.id('formCity')).clear();
    driver.findElement(By.id('formState')).clear();
    driver.findElement(By.id('formZip')).clear();
    driver.findElement(By.id('savePersonalInformationButton')).click();
    expect(await feedbacks[0].getText()).toEqual(
      'Please provide a valid first name.'
    );
    expect(await feedbacks[1].getText()).toEqual(
      'Please provide a valid last name.'
    );
    expect(await feedbacks[2].getText()).toEqual(
      'Please provide a valid city.'
    );
    expect(await feedbacks[3].getText()).toEqual(
      'Please provide a valid state.'
    );
    expect(await feedbacks[4].getText()).toEqual('Please provide a valid zip.');
    for (const feedback of feedbacks) {
      expect(await feedback.isDisplayed()).toBeTruthy();
    }
  });

  async function checkFields(firstName, lastName, city, state, zip) {
    expect(await firstName.getAttribute('value')).toEqual('Test0');
    expect(await lastName.getAttribute('value')).toEqual('User0');
    expect(await city.getAttribute('value')).toEqual('City0');
    expect(await state.getAttribute('value')).toEqual('State0');
    expect(await zip.getAttribute('value')).toEqual('Zip0');
  }

  it('allows updating the personal values', async () => {
    let firstName = driver.wait(until.elementLocated(By.id('formFirstName')));
    let lastName = driver.wait(until.elementLocated(By.id('formLastName')));
    let city = driver.wait(until.elementLocated(By.id('formCity')));
    let state = driver.wait(until.elementLocated(By.id('formState')));
    let zip = driver.wait(until.elementLocated(By.id('formZip')));
    test.waitUntilInputFilled(By.id('formFirstName'));
    firstName.sendKeys('0');
    lastName.sendKeys('0');
    city.sendKeys('0');
    state.sendKeys('0');
    zip.sendKeys('0');
    await checkFields(firstName, lastName, city, state, zip);
    await driver.findElement(By.id('savePersonalInformationButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await success.getText()).toEqual('Personal Information Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
    driver.navigate().refresh();
    firstName = driver.wait(until.elementLocated(By.id('formFirstName')));
    lastName = driver.wait(until.elementLocated(By.id('formLastName')));
    city = driver.wait(until.elementLocated(By.id('formCity')));
    state = driver.wait(until.elementLocated(By.id('formState')));
    zip = driver.wait(until.elementLocated(By.id('formZip')));
    await checkFields(firstName, lastName, city, state, zip);
  });
});
