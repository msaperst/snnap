/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('home page', () => {
  let test;
  let driver;
  let requestToHires = [];

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    requestToHires.push(
      await Test.addRequestToHire(
        0,
        2,
        '2023-03-12',
        {
          lat: 38.8051095,
          loc: 'Alexandria, VA, United States of America',
          lon: -77.0470229,
        },
        'Gig in Alexandria'
      )
    );
    requestToHires.push(await Test.addRequestToHire(0, 2, '2023-03-10'));

    await test.loginUser('homeUser');
    await driver.get(Test.getApp());
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    for (const requestToHire of requestToHires) {
      await Test.removeRequestToHire(await requestToHire.getId());
    }
    requestToHires = [];
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('takes us to the homepage', async () => {
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/`);
  });

  it('allows us to log out', async () => {
    const dropDownMenu = driver.wait(
      until.elementLocated(By.id('user-dropdown'))
    );
    await dropDownMenu.click();
    const logoutButton = driver.wait(
      until.elementLocated(By.linkText('Logout'))
    );
    driver.wait(until.elementIsVisible(logoutButton));
    await logoutButton.click();
    await driver.wait(until.elementLocated(By.css('h2')));
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/login`);
    expect(await driver.findElement(By.css('h2')).getText()).toEqual('Login');
  });

  it('shows the tagline', async () => {
    const header = driver.wait(until.elementLocated(By.id('tagline')));
    expect(await header.getText()).toEqual('Photography help in a snap');
  });

  it('has 4 filter buttons', async () => {
    const filterButtons = await driver.wait(
      until.elementsLocated(By.className('btn-filter'))
    );
    expect(filterButtons).toHaveLength(4);
    expect(await filterButtons[0].getText()).toEqual('Weddings');
    expect(await filterButtons[1].getText()).toEqual("B'nai Mitzvahs");
    expect(await filterButtons[2].getText()).toEqual('Commercial Events');
    expect(await filterButtons[3].getText()).toEqual('Misc');
  });

  it('displays all entries unfiltered', async () => {
    const foundText = await getFoundText(0);
    const foundDigit = parseInt(foundText.replace(/\D/g, ''), 10);
    expect(foundText).toMatch(/Found \d+ Job(s)?/);
    expect(foundDigit).toBeGreaterThanOrEqual(1);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(foundDigit);
  });

  it("hides created b'nai mitzvahs we created when filtered out", async () => {
    const initialFoundText = await getFoundText(0);
    const initialFoundDigit = parseInt(initialFoundText.replace(/\D/g, ''), 10);
    const filterButtons = await driver.wait(
      until.elementsLocated(By.className('btn-filter'))
    );
    await filterButtons[1].click();
    const afterFoundText = await getFoundText(initialFoundDigit);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeLessThanOrEqual(initialFoundDigit - 2);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  it('hides weddings, but not others when filtered out', async () => {
    const filterButtons = await driver.wait(
      until.elementsLocated(By.className('btn-filter'))
    );
    await filterButtons[0].click();
    const afterFoundText = await getFoundText(0);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeGreaterThanOrEqual(1);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  it('displays soonest at the top', async () => {
    const cards = await driver.wait(
      until.elementsLocated(By.className('card'))
    );
    let last = Date.now() - 24 * 60 * 60 * 1000; // makes this yesterday
    for (let i = 0; i < cards.length; i++) {
      const cardDate = await getCardDate(i);
      expect(cardDate).toBeGreaterThanOrEqual(last);
      last = cardDate;
    }
  });

  it('updates displayed jobs based on text in search box', async () => {
    const searchInput = await driver.wait(
      until.elementLocated(By.id('searchForJobInput'))
    );
    await searchInput.sendKeys('Alexandria');
    const cards = await driver.findElements(By.className('card'));
    // eslint-disable-next-line no-restricted-syntax
    for (const card of cards) {
      const details = card.findElement(By.className('details'));
      expect(details.getText()).toContain('Alexandria');
    }
  });

  it('updates displayed jobs based on mileage dropdown', async () => {
    const initialFoundText = await getFoundText(0);
    const initialFoundDigit = parseInt(initialFoundText.replace(/\D/g, ''), 10);
    const select = await driver.wait(
      until.elementLocated(By.id('select-mileage'))
    );
    await (await select.findElements(By.css('option')))[2].click();
    const afterFoundText = await getFoundText(initialFoundDigit);
    const afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''), 10);
    expect(afterFoundDigit).toBeGreaterThanOrEqual(2);
    const cards = await driver.findElements(By.className('card'));
    expect(cards).toHaveLength(afterFoundDigit);
  });

  // TODO - remove the above when this test is completed
  // eslint-disable-next-line jest/expect-expect
  it('updates displayed jobs based on from where dropdown', () => {
    // TODO - unable to do this currently as allowing location isn't possible/simple through Selenium
  });

  it('updates displayed jobs based on custom where dropdown', async () => {
    const select = await driver.wait(
      until.elementLocated(By.id('select-location'))
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
      const found = driver.wait(until.elementLocated(By.css('h3')));
      foundText = await found.getText();
    }
    return foundText;
  }

  async function getCardDate(i) {
    driver.wait(until.elementsLocated(By.className('card')));
    const cards = await driver.findElements(By.className('card'));
    const first = await cards[i].findElements(By.className('col-md-3'));
    const firstDate = await first[1].getText();
    return Date.parse(firstDate);
  }
});
