const { By, until } = require('selenium-webdriver');
const Base = require('./common/base');
require('chromedriver');

describe('new request to hire', () => {
  let driver;
  let user;
  let button;
  let modal;

  beforeEach(async () => {
    // load the default page
    driver = await Base.getDriver();
    // login as a user
    user = await Base.loginUser(driver, 'newRequestToHireUser');
    await driver.get(Base.getApp());
    button = driver.wait(until.elementLocated(By.id('openNewRequestToHireButton')));
    await button.click();
    modal = driver.wait(until.elementLocated(By.css('[data-testid="newRequestToHireModal"]')));
  }, 10000);

  afterEach(async () => {
    //delete the user
    await Base.removeUser(user.username);
    // close the driver
    await driver.quit();
  }, 15000);

  it('has a button to open the modal', async () => {
    driver.navigate().refresh();
    const button = driver.wait(until.elementLocated(By.id('openNewRequestToHireButton')));
    expect(await button.getText()).toEqual('New Request to Hire');
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
  });

  it('opens the modal', async () => {
    expect(await modal.findElement(By.css('.modal-header')).getText()).toEqual('Create a new request to hire');
    expect(await driver.findElement(By.css('.modal-header')).isDisplayed()).toBeTruthy();
  });


  it('shows no error messages upon opening the form', async () => {
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    expect(feedbacks).toHaveLength(6);
    for(let i = 0; i < 6; i++) {
      expect(await feedbacks[i].isDisplayed()).toBeFalsy();
    }
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('shows errors when submitting an empty form', async () => {
    (await modal.findElement(By.id('newRequestToHireButton'))).click();
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    for(let i = 1; i < 6; i++) {
      expect(await feedbacks[i].isDisplayed()).toBeTruthy();
    }
    expect(await feedbacks[0].getText()).toEqual('');     // this is a defect; putting in a test for it that will need to be fixed once the bug is fixed
    expect(await feedbacks[1].getText()).toEqual('Please provide a valid location.');
    expect(await feedbacks[2].getText()).toEqual('Please provide a valid date.');
    expect(await feedbacks[3].getText()).toEqual('Please provide a valid job details.');
    expect(await feedbacks[4].getText()).toEqual('Please provide a valid duration.');
    expect(await feedbacks[5].getText()).toEqual('Please provide a valid pay.');
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
    // this is a defect; putting in a test for it that will need to be fixed once the bug is fixed
    expect(await feedbacks[0].isDisplayed()).toBeFalsy();
  });

  it('shows errors upon submitting when selecting bad job type', async () => {
    const alerts = await basicEnterAndCheck();
    expect(await alerts[0].getText()).toEqual('Please provide a valid job type.');
  });

  it('shows errors upon submitting when selecting previous day', async () => {
    await enterOtherData()
    const alerts = await basicEnterAndCheck();
    expect(await alerts[0].getText()).toEqual('Please provide a date after today.');
  });

  it('allows clearing of response alert', async () => {
    await enterData('Fairfax', 'Deetz', '100', '100', '10/13/2021');
    (driver.wait(until.elementLocated(By.css('[aria-label="Close alert"]')))).click();
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('closes modal with successful submission of the form', async () => {
    const cards = (await driver.findElements(By.className('card'))).length;
    await enterOtherData()
    await enterData('Fairfax', 'New Deetz', '100', '100', '10/13/2031');
    driver.wait(function() {
      return driver.findElements(By.css('.modal-header')).then(function(elements) {
        return elements.length === 0;
      });
    });
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
    expect(await driver.findElements(By.className('card'))).toHaveLength(cards + 1);
  });

  async function enterData(location, details, pay, duration, date) {
    (await modal.findElement(By.css('[placeholder="Location"]'))).sendKeys(location);
    (driver.wait(until.elementLocated(By.className('geoapify-autocomplete-item')))).click();
    (await modal.findElement(By.id('formJobDetails'))).sendKeys(details);
    (await modal.findElement(By.id('formPay'))).sendKeys(pay);
    (await modal.findElement(By.id('formDuration'))).sendKeys(duration);
    (await modal.findElement(By.id('formDate'))).sendKeys(date);
    (await modal.findElement(By.id('newRequestToHireButton'))).click();
  }

  async function enterOtherData() {
    const select = await modal.findElement(By.id('formJobType'));
    (await select.findElements(By.tagName('option')))[2].click();
  }

  async function basicEnterAndCheck() {
    await enterData('Fairfax', 'Deetz', '100', '100', '10/13/2021');
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    for(let i = 0; i < 6; i++) {
      expect(await feedbacks[i].isDisplayed()).toBeFalsy();
    }
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(1);
    return alerts;
  }
});