/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('new job', () => {
  jest.setTimeout(15000);
  let test;
  let driver;
  let button;
  let modal;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    await test.loginUser('newJobUser');
    await driver.get(Test.getApp());
    const gigs = driver.wait(until.elementLocated(By.id('gig-dropdown')), 5000);
    gigs.click();
    button = driver.wait(until.elementLocated(By.id('openNewJobButton')), 5000);
    await button.click();
    modal = driver.wait(
      until.elementLocated(By.css('[data-testid="newJobModal"]')),
      5000
    );
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('has a link to open the modal', async () => {
    driver.navigate().refresh();
    const gigs = driver.wait(until.elementLocated(By.id('gig-dropdown')), 5000);
    gigs.click();
    const button = driver.wait(
      until.elementLocated(By.id('openNewJobButton')),
      5000
    );
    expect(await button.getText()).toEqual('Create New Job');
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
  });

  it('opens the modal', async () => {
    expect(await modal.findElement(By.css('.modal-header')).getText()).toEqual(
      'Create a new job'
    );
    expect(
      await driver.findElement(By.css('.modal-header')).isDisplayed()
    ).toBeTruthy();
  });

  it('shows no error messages upon opening the form', async () => {
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    expect(feedbacks).toHaveLength(8);
    for (let i = 0; i < feedbacks.length; i++) {
      expect(await feedbacks[i].isDisplayed()).toBeFalsy();
    }
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('shows errors when submitting an empty form', async () => {
    (await modal.findElement(By.id('createNewRequestButton'))).click();
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    for (let i = 0; i < feedbacks.length; i++) {
      if (i === 4) {
        // eslint-disable-next-line no-continue
        continue;
      }
      expect(await feedbacks[i].isDisplayed()).toBeTruthy();
    }
    expect(await feedbacks[0].getText()).toEqual(
      'Please provide a valid job type.'
    );
    expect(await feedbacks[1].getText()).toEqual(
      'Please provide a valid looking for.'
    );
    expect(await feedbacks[2].getText()).toEqual(
      'Please select a valid city from the drop down.'
    );
    expect(await feedbacks[3].getText()).toEqual(
      'Please provide a valid date.'
    );
    expect(await feedbacks[4].getText()).toEqual('');
    expect(await feedbacks[5].getText()).toEqual(
      'Please provide a valid job details.'
    );
    expect(await feedbacks[6].getText()).toEqual(
      'Please provide a valid duration.'
    );
    expect(await feedbacks[7].getText()).toEqual('Please provide a valid pay.');
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('shows errors upon submitting when selecting previous day', async () => {
    await enterData(2, 2, 'Fairfax', 'Deetz', '100', '100', '10/13/2021');
    const feedbacks = await modal.findElements(By.css('.invalid-feedback'));
    for (let i = 0; i < feedbacks.length; i++) {
      if (i === 3) {
        expect(await feedbacks[i].isDisplayed()).toBeTruthy();
        expect(await feedbacks[i].getText()).toEqual(
          'Please provide a valid date.'
        );
      } else {
        expect(await feedbacks[i].isDisplayed()).toBeFalsy();
      }
    }
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'Please provide a date today or later.'
    );
  });

  it('allows clearing of response alert', async () => {
    await enterData(2, 2, 'Fairfax', 'Deetz', '100', '100', '10/13/2021');
    await driver
      .wait(until.elementLocated(By.css('[aria-label="Close alert"]')))
      .click();
    const alerts = await modal.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('closes modal with successful submission of the form', async () => {
    const cards = (await driver.findElements(By.className('card'))).length;
    await enterData(2, 1, 'Fairfax', 'New Deetz', '100', '100', '10/13/2031');
    await driver.wait(
      () =>
        driver
          .findElements(By.css('.modal-header'))
          .then((elements) => elements.length === 0),
      6000
    );
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
    await driver.wait(
      () =>
        driver
          .findElements(By.className('card'))
          .then((elements) => elements.length === cards + 1),
      5000
    );
    expect(await driver.findElements(By.className('card'))).toHaveLength(
      cards + 1
    );
  });

  async function enterData(
    type,
    subtype,
    location,
    details,
    pay,
    duration,
    date
  ) {
    const select = driver.wait(
      until.elementLocated(By.id('formJobType')),
      5000
    );
    await driver.wait(until.elementIsEnabled(select), 5000);
    await (await select.findElements(By.css('option')))[type].click();
    const select2 = driver.wait(
      until.elementLocated(By.id('formLookingFor')),
      5000
    );
    await (await select2.findElements(By.css('option')))[subtype].click();
    await (
      await modal.findElement(By.css('[placeholder="City"]'))
    ).sendKeys(location);
    await driver
      .wait(until.elementLocated(By.className('geoapify-autocomplete-item')))
      .click();
    await (await modal.findElement(By.id('formJobDetails'))).sendKeys(details);
    await (await modal.findElement(By.id('formPay'))).sendKeys(pay);
    await (await modal.findElement(By.id('formDuration'))).sendKeys(duration);
    await (await modal.findElement(By.id('formDate'))).sendKeys(date);
    await Test.sleep(1000); // kludge for location not updating quick enough
    await (await modal.findElement(By.id('createNewRequestButton'))).click();
  }

  // TODO
  // ability to add/save skills and equipment
});
