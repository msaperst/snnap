const { By, until, Key } = require('selenium-webdriver');
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
    await test.loginUser('profilePortfolioUser');
    await driver.get(`${Test.getApp()}/profile`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the portfolio information', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const portfolioInfo = (await driver.findElements(By.css('form')))[4];
    expect(await portfolioInfo.findElement(By.css('h3')).getText()).toEqual(
      'Portfolio'
    );
  });

  it('displays the experience', async () => {
    const experience = driver.wait(
      until.elementLocated(By.id('formExperience'))
    );
    expect(await experience.getAttribute('value')).toEqual('');
    expect(await experience.getAttribute('disabled')).toBeNull();
  });

  async function verifyNoErrors() {
    driver.wait(until.elementLocated(By.css('h2')));
    const portfolio = (await driver.findElements(By.css('form')))[4];
    driver.wait(until.elementLocated(By.id('galleryDescription-0')));
    const feedbacks = await portfolio.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(3);
    for (const feedback of feedbacks) {
      expect(await feedback.getText()).toEqual('');
      expect(await feedback.isDisplayed()).toBeFalsy();
    }
    const experience = driver.wait(
      until.elementLocated(By.id('formExperience'))
    );
    return { feedback: feedbacks, experience };
  }

  it('throws an error if you try to submit with only a description filled out', async () => {
    const { feedback, experience } = await verifyNoErrors();
    const description = driver.wait(
      until.elementLocated(By.id('galleryDescription-0'))
    );
    experience.sendKeys('Some Experience');
    description.sendKeys('Some Description');
    driver.findElement(By.id('savePortfolioButton')).click();
    expect(await feedback[0].getText()).toEqual('');
    expect(await feedback[0].isDisplayed()).toBeFalsy();
    expect(await feedback[1].getText()).toEqual('');
    expect(await feedback[1].isDisplayed()).toBeFalsy();
    expect(await feedback[2].getText()).toEqual(
      'Please provide a valid gallery link.'
    );
    expect(await feedback[2].isDisplayed()).toBeTruthy();
  });

  it('throws an error if you try to submit with only a link filled out', async () => {
    const { feedback, experience } = await verifyNoErrors();
    const link = driver.wait(until.elementLocated(By.id('galleryLink-0')));
    experience.sendKeys('Some Experience');
    link.sendKeys('Linky');
    driver.findElement(By.id('savePortfolioButton')).click();
    expect(await feedback[0].getText()).toEqual('');
    expect(await feedback[0].isDisplayed()).toBeFalsy();
    expect(await feedback[1].getText()).toEqual(
      'Please provide a valid gallery description.'
    );
    expect(await feedback[1].isDisplayed()).toBeTruthy();
    expect(await feedback[2].getText()).toEqual('');
    expect(await feedback[2].isDisplayed()).toBeFalsy();
  });

  function fillOutPortfilio() {
    const experience = driver.wait(
      until.elementLocated(By.id('formExperience'))
    );
    const description = driver.wait(
      until.elementLocated(By.id('galleryDescription-0'))
    );
    const link = driver.wait(until.elementLocated(By.id('galleryLink-0')));
    experience.sendKeys('Some Experience');
    description.sendKeys('Description');
    return { experience, description, link };
  }

  it('allows updating the portfolio values', async () => {
    let { experience, description, link } = fillOutPortfilio();
    link.sendKeys('https://Link.com');
    expect(await experience.getAttribute('value')).toEqual('Some Experience');
    expect(await description.getAttribute('value')).toEqual('Description');
    expect(await link.getAttribute('value')).toEqual('https://Link.com');
    await driver.findElement(By.id('savePortfolioButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await success.getText()).toEqual('Portfolio Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
    driver.navigate().refresh();
    experience = driver.wait(until.elementLocated(By.id('formExperience')));
    description = driver.wait(
      until.elementLocated(By.id('galleryDescription-0'))
    );
    link = driver.wait(until.elementLocated(By.id('galleryLink-0')));
    expect(await experience.getAttribute('value')).toEqual('Some Experience');
    expect(await description.getAttribute('value')).toEqual('Description');
    expect(await link.getAttribute('value')).toEqual('https://Link.com');
  });

  it('adds a new row when you fill out both description and link', async () => {
    const description = driver.wait(
      until.elementLocated(By.id('galleryDescription-0'))
    );
    const link = driver.wait(until.elementLocated(By.id('galleryLink-0')));
    expect(
      await driver.findElements(By.id('galleryDescription-1'))
    ).toHaveLength(0);
    expect(await driver.findElements(By.id('galleryLink-1'))).toHaveLength(0);
    await description.sendKeys('Description');
    await link.sendKeys('Link');
    expect(
      await driver.findElements(By.id('galleryDescription-1'))
    ).toHaveLength(1);
    expect(await driver.findElements(By.id('galleryLink-1'))).toHaveLength(1);
  });

  it('removes a row when you remove both description and link', async () => {
    const description = driver.wait(
      until.elementLocated(By.id('galleryDescription-0'))
    );
    const link = driver.wait(until.elementLocated(By.id('galleryLink-0')));
    await description.sendKeys('Description');
    await link.sendKeys('Link');
    expect(
      await driver.findElements(By.id('galleryDescription-1'))
    ).toHaveLength(1);
    expect(await driver.findElements(By.id('galleryLink-1'))).toHaveLength(1);
    for (let i = 0; i < 11; i++) {
      await description.sendKeys(Key.BACK_SPACE);
    }
    for (let i = 0; i < 4; i++) {
      await link.sendKeys(Key.BACK_SPACE);
    }
    expect(
      await driver.findElements(By.id('galleryDescription-1'))
    ).toHaveLength(0);
    expect(await driver.findElements(By.id('galleryLink-1'))).toHaveLength(0);
  });

  it('requires a valid link when updating the portfolio values', async () => {
    const { experience, description, link } = fillOutPortfilio();
    link.sendKeys('Link');
    expect(await experience.getAttribute('value')).toEqual('Some Experience');
    expect(await description.getAttribute('value')).toEqual('Description');
    expect(await link.getAttribute('value')).toEqual('Link');
    await driver.findElement(By.id('savePortfolioButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await danger.getText()).toEqual(
      'Portfolio Link must be a valid URL'
    );
  });
});
