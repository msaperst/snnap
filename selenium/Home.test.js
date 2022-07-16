const { By, Key, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('home page', () => {
  let test;
  let driver;
  let user;
  let requestToHires = [];

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    requestToHires.push(await Test.addRequestToHire(0, 2, '2023-03-12'));
    requestToHires.push(await Test.addRequestToHire(0, 2, '2023-03-10'));

    user = await test.loginUser('homeUser');
    await driver.get(Test.getApp());
  }, 10000);

  afterEach(async () => {
    //delete the user
    await test.removeUser();
    for (const requestToHire of requestToHires) {
      await Test.removeRequestToHire(await requestToHire.getId());
    }
    requestToHires = [];
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('takes us to the homepage', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/');
  });

  it('allows us to log out', async () => {
    const dropDownMenu = driver.wait(until.elementLocated(By.id('user-dropdown')));
    await dropDownMenu.click();
    const logoutButton = driver.wait(until.elementLocated(By.linkText('Logout')));
    driver.wait(until.elementIsVisible(logoutButton));
    await logoutButton.click();
    expect(await driver.getCurrentUrl()).toEqual(Test.getApp() + '/login');
    expect(await driver.findElement(By.tagName('h2')).getText()).toEqual('Login');
  });

  it('shows the tagline', async () => {
    const header = driver.wait(until.elementLocated(By.id('tagline')));
    expect(await header.getText()).toEqual('Photography help in a snap');
  });

  it('has 4 filter buttons', async () => {
    driver.wait(until.elementsLocated(By.className('btn-filter')));
    const filterButtons = await driver.findElements(By.className('btn-filter'));
    expect(filterButtons).toHaveLength(4);
    expect(await filterButtons[0].getText()).toEqual('Weddings');
    expect(await filterButtons[1].getText()).toEqual("B'nai Mitzvahs");
    expect(await filterButtons[2].getText()).toEqual('Commercial Events');
    expect(await filterButtons[3].getText()).toEqual('Misc');

  });

  it('displays all entries unfiltered', async () => {
    const foundText = await getFoundText(0);
    const foundDigit = parseInt(foundText.replace(/\D/g, ''));
    expect(foundText).toMatch(/Found \d+ results/);
    expect(foundDigit).toBeGreaterThanOrEqual(1);
  });

  it('displays only filtered entries', async () => {
    const initialFoundText = await getFoundText(0);
    const initialFoundDigit = parseInt(initialFoundText.replace(/\D/g, ''));
    driver.wait(until.elementsLocated(By.className('btn-filter')));
    const filterButtons = await driver.findElements(By.className('btn-filter'));
    // ensure weddings filters out the rest (is missing at least the one we added)
    await filterButtons[0].click();
    let afterFoundText = await getFoundText(initialFoundDigit);
    let afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''));
    expect(afterFoundDigit).toBeLessThanOrEqual(initialFoundDigit - 1);
    // ensure b'nai filters out the rest (has at least the one we added)
    await filterButtons[1].click();
    afterFoundText = await getFoundText(afterFoundDigit);
    afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''));
    expect(afterFoundDigit).toBeLessThanOrEqual(initialFoundDigit);
    expect(afterFoundDigit).toBeGreaterThanOrEqual(1);
  });

  it('displays no employers when unchecked, and employers when rechecked', async () => {
    const initialFoundText = await getFoundText(0);
    const initialFoundDigit = parseInt(initialFoundText.replace(/\D/g, ''));
    const employersButton = driver.wait(until.elementLocated(By.id('showEmployers')));
    await employersButton.sendKeys(Key.SPACE);
    let afterFoundText = await getFoundText(initialFoundDigit);
    let afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''));
    // now we're looking for zero, afterward we implement hirings, we'll need to update this
    expect(afterFoundDigit).toEqual(0);
    await employersButton.sendKeys(Key.SPACE);
    afterFoundText = await getFoundText(0);
    afterFoundDigit = parseInt(afterFoundText.replace(/\D/g, ''));
    // now we're looking for zero, afterward we implement hirings, we'll need to update this
    expect(afterFoundDigit).toEqual(initialFoundDigit);
  });

  it('displays soonest at the top', async () => {
    driver.wait(until.elementsLocated(By.className('card')));
    const cards = await driver.findElements(By.className('card'));
    let last = Date.now() - 24*60*60*1000;  // makes this yesterday
    for (let i = 0; i < cards.length; i++) {
      const cardDate = await getCardDate(i);
      expect(cardDate).toBeGreaterThanOrEqual(last);
      last = cardDate;
    }
  });

  it('displays soonest at the bottom when resorted', async () => {
    // resort
    const firstDate = await getCardDate(0);
    const select = await driver.findElement(By.className('form-select'));
    (await select.findElements(By.tagName('option')))[1].click();
    driver.wait(function () {
      return getCardDate(0).then(function (date) {
        return date !== firstDate;
      });
    });
    // check the cards
    driver.wait(until.elementsLocated(By.className('card')));
    const cards = await driver.findElements(By.className('card'));
    let last = Date.now() - 24*60*60*1000;  // makes this yesterday
    for (let i = cards.length - 1; i >= 0; i--) {
      const cardDate = await getCardDate(i);
      expect(cardDate).toBeGreaterThanOrEqual(last);
      last = cardDate;
    }
  });

  it('displays soonest at the top when reresorted', async () => {
    // resort
    const firstDate = await getCardDate(0);
    const select = await driver.findElement(By.className('form-select'));
    (await select.findElements(By.tagName('option')))[1].click();
    driver.wait(function () {
      return getCardDate(0).then(function (date) {
        return date !== firstDate;
      })
    });
    // resort
    (await select.findElements(By.tagName('option')))[0].click();
    driver.wait(function () {
      return getCardDate(0).then(function (date) {
        return date === firstDate;
      })
    });
    // check the cards
    driver.wait(until.elementsLocated(By.className('card')));
    const cards = await driver.findElements(By.className('card'));
    let last = Date.now() - 24*60*60*1000;  // makes this yesterday
    for (let i = 0; i < cards.length; i++) {
      const cardDate = await getCardDate(i);
      expect(cardDate).toBeGreaterThanOrEqual(last);
      last = cardDate;
    }
  });

  //TODO - fill me out as we get more functionality

  async function getFoundText(waitUntilNot) {
    let foundText = `Found ${waitUntilNot} results`;
    while (parseInt(foundText.replace(/\D/g, '')) === waitUntilNot) {
      const found = driver.wait(until.elementLocated(By.tagName('h3')));
      foundText = await found.getText();
    }
    return foundText;
  }

  async function getCardDate(i) {
    driver.wait(until.elementsLocated(By.className('card')));
    let cards = await driver.findElements(By.className('card'));
    const first = await cards[i].findElements(By.className('col-md-3'));
    const firstDate = await first[1].getText();
    return Date.parse(firstDate);
  }
});