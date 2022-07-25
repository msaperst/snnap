const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('new request to hire', () => {
  jest.setTimeout(10000);
  let test;
  let driver;
  let user;
  let button;
  let modal;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    user = await test.loginUser('newRequestToHireUser');
    await driver.get(Test.getApp());
    const gigs = driver.wait(until.elementLocated(By.id('gig-dropdown')));
    gigs.click();
    button = driver.wait(until.elementLocated(By.id('openNewRequestToHireButton')));
    await button.click();
    modal = driver.wait(until.elementLocated(By.css('[data-testid="newRequestToHireModal"]')));
  }, 10000);

  afterEach(async () => {
    //delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('has a link to open the modal', async () => {
    driver.navigate().refresh();
    const gigs = driver.wait(until.elementLocated(By.id('gig-dropdown')));
    gigs.click();
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
    (await modal.findElement(By.id('createNewRequestButton'))).click();
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    for(let i = 0; i < 6; i++) {
      expect(await feedbacks[i].isDisplayed()).toBeTruthy();
    }
    expect(await feedbacks[0].getText()).toEqual('Please provide a valid job type.');
    expect(await feedbacks[1].getText()).toEqual('Please provide a valid location.');
    expect(await feedbacks[2].getText()).toEqual('Please provide a valid date.');
    expect(await feedbacks[3].getText()).toEqual('Please provide a valid job details.');
    expect(await feedbacks[4].getText()).toEqual('Please provide a valid duration.');
    expect(await feedbacks[5].getText()).toEqual('Please provide a valid pay.');
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('shows errors upon submitting when selecting previous day', async () => {
    const alerts = await basicEnterAndCheck();
    expect(await alerts[0].getText()).toEqual('Please provide a date after today.');
  });

  it('allows clearing of response alert', async () => {
    await enterData(2, 'Fairfax', 'Deetz', '100', '100', '10/13/2021');
    (driver.wait(until.elementLocated(By.css('[aria-label="Close alert"]')))).click();
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('closes modal with successful submission of the form', async () => {
    const cards = (await driver.findElements(By.className('card'))).length;
    await enterData(2, 'Fairfax', 'New Deetz', '100', '100', '10/13/2031');
    driver.wait(function() {
      return driver.findElements(By.css('.modal-header')).then(function(elements) {
        return elements.length === 0;
      });
    });
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
    expect(await driver.findElements(By.className('card'))).toHaveLength(cards + 1);
  });

  async function enterData(option, location, details, pay, duration, date) {
    const select = driver.wait(until.elementLocated(By.id('formJobType')));
    driver.wait(until.elementIsEnabled(select));
    (await select.findElements(By.css('option')))[option].click();
    (await modal.findElement(By.css('[placeholder="Location"]'))).sendKeys(location);
    (driver.wait(until.elementLocated(By.className('geoapify-autocomplete-item')))).click();
    (await modal.findElement(By.id('formJobDetails'))).sendKeys(details);
    (await modal.findElement(By.id('formPay'))).sendKeys(pay);
    (await modal.findElement(By.id('formDuration'))).sendKeys(duration);
    (await modal.findElement(By.id('formDate'))).sendKeys(date);
    (await modal.findElement(By.id('createNewRequestButton'))).click();
  }

  async function basicEnterAndCheck() {
    await enterData(2, 'Fairfax', 'Deetz', '100', '100', '10/13/2021');
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    for(let i = 0; i < 6; i++) {
      expect(await feedbacks[i].isDisplayed()).toBeFalsy();
    }
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(1);
    return alerts;
  }

  // TODO
  // ability to add/save skills and equipment
});