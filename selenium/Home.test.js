/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('home page', () => {
  let test;
  let driver;
  let jobCreatorId;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // create a job for our test user
    test.addUser('homeJobCreatorUser');
    jobCreatorId = await test.user.getId();
    // login as a user
    await Test.addFullJob(
      jobCreatorId,
      2,
      1,
      '2023-03-12',
      {
        lat: 38.8051095,
        loc: 'Alexandria, VA, United States of America',
        lon: -77.0470229,
      },
      'Gig in Alexandria'
    );
    await Test.addJob(jobCreatorId, 2, '2023-03-10');

    await test.loginUser('homeUser');
    await driver.get(Test.getApp());
  }, 10000);

  afterEach(async () => {
    // delete the user
    await Test.removeUserById(jobCreatorId);
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('takes us to the homepage @network @accessibility', async () => {
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/`);
  });

  it('allows us to log out @network @accessibility', async () => {
    const dropDownMenu = driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await dropDownMenu.click();
    const logoutButton = driver.wait(
      until.elementLocated(By.linkText('Logout')),
      5000
    );
    driver.wait(until.elementIsVisible(logoutButton), 5000);
    await logoutButton.click();
    await driver.wait(until.elementLocated(By.css('h1')), 5000);
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/login`);
    expect(await driver.findElement(By.css('h1')).getText()).toEqual('Login');
  });

  it('shows the tagline', async () => {
    const header = driver.wait(until.elementLocated(By.id('tagline')), 5000);
    expect(await header.getText()).toEqual('Photography help in a snap');
  });

  it('has 6 filter buttons', async () => {
    const filterButtons = await driver.wait(
      until.elementsLocated(By.className('btn-filter')),
      5000
    );
    expect(filterButtons).toHaveLength(11);
    expect(await filterButtons[0].getText()).toEqual("B'nai Mitzvahs");
    expect(await filterButtons[1].getText()).toEqual('Commercial Events');
    expect(await filterButtons[2].getText()).toEqual('Portraits');
    expect(await filterButtons[3].getText()).toEqual('Studio Work');
    expect(await filterButtons[4].getText()).toEqual('Weddings');
    expect(await filterButtons[5].getText()).toEqual('Other');

    expect(await filterButtons[6].getText()).toEqual('Assistants');
    expect(await filterButtons[7].getText()).toEqual('Lead Photographers');
    expect(await filterButtons[8].getText()).toEqual('Photobooth Attendants');
    expect(await filterButtons[9].getText()).toEqual('Second Photographers');
    expect(await filterButtons[10].getText()).toEqual('Other');
  });

  it('displays all entries unfiltered', async () => {
    const foundText = await getFoundText(0);
    const foundDigit = parseInt(foundText.replace(/\D/g, ''), 10);
    expect(foundText).toMatch(/Found \d+ Job(s)?/);
    expect(foundDigit).toBeGreaterThanOrEqual(1);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(foundDigit);
  });

  it("hides created b'nai mitzvahs we created when filtered out @network @accessibility", async () => {
    const initialFoundText = await getFoundText(0);
    const initialFoundDigit = parseInt(initialFoundText.replace(/\D/g, ''), 10);
    const filterButtons = await driver.wait(
      until.elementsLocated(By.className('btn-filter')),
      5000
    );
    await filterButtons[0].click(); // b'nai mitzvahs button
    const afterFoundText = await getFoundText(initialFoundDigit);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeLessThanOrEqual(initialFoundDigit - 1);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  it('hides weddings, but not others when filtered out', async () => {
    const filterButtons = await driver.wait(
      until.elementsLocated(By.className('btn-filter')),
      5000
    );
    await filterButtons[4].click(); // weddings button
    const afterFoundText = await getFoundText(0);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeGreaterThanOrEqual(1);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  it('displays soonest at the top', async () => {
    const cards = await driver.wait(
      until.elementsLocated(By.className('card')),
      5000
    );
    let last = Date.now() - 24 * 60 * 60 * 1000; // makes this yesterday
    for (let i = 0; i < cards.length; i++) {
      const cardDate = await getCardDate(i);
      expect(cardDate).toBeGreaterThanOrEqual(last);
      last = cardDate;
    }
  });

  it('updates displayed jobs based on text in search box @network @accessibility', async () => {
    const searchInput = await driver.wait(
      until.elementLocated(By.id('searchForJobInput')),
      5000
    );
    await searchInput.sendKeys('Alexandria');
    const cards = await driver.findElements(By.className('card'));
    for (const card of cards) {
      const details = card.findElement(By.className('details'));
      expect(await details.getText()).toContain('Alexandria');
    }
  });

  it('updates displayed jobs based on mileage dropdown @network @accessibility', async () => {
    const initialFoundText = await getFoundText(0);
    const initialFoundDigit = parseInt(initialFoundText.replace(/\D/g, ''), 10);
    const select = await driver.wait(
      until.elementLocated(By.id('select-mileage')),
      5000
    );
    await (await select.findElements(By.css('option')))[0].click();
    const afterFoundText = await getFoundText(initialFoundDigit);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeGreaterThanOrEqual(2);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  // TODO - remove the below when this test is completed
  // eslint-disable-next-line jest/expect-expect
  it('updates displayed jobs based on from where dropdown @network @accessibility', () => {
    // TODO - unable to do this currently as allowing location isn't possible/simple through Selenium
  });

  it('updates displayed jobs based on custom where dropdown @network @accessibility', async () => {
    const select = await driver.wait(
      until.elementLocated(By.id('select-location')),
      5000
    );
    await (await select.findElements(By.css('option')))[2].click();
    await (
      await driver.findElement(By.css('[placeholder="Enter City"]'))
    ).sendKeys('Alexandria, VA');
    await driver
      .wait(until.elementLocated(By.className('geoapify-autocomplete-item')))
      .click();
    const afterFoundText = await getFoundText(0);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeGreaterThanOrEqual(1);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  async function getFoundText(waitUntilNot) {
    let foundText = `Found ${waitUntilNot} results`;
    while (parseInt(foundText.replace(/\D/g, ''), 10) === waitUntilNot) {
      const found = driver.wait(until.elementLocated(By.css('h3')), 5000);
      foundText = await found.getText();
    }
    return foundText;
  }

  async function getCardDate(i) {
    driver.wait(until.elementsLocated(By.className('card')), 5000);
    const cards = await driver.findElements(By.className('card'));
    const dateTime = await (
      await cards[i].findElement(By.className('font-italic'))
    ).getText();
    const date = dateTime.split(' ')[0];
    return Date.parse(date);
  }
});
