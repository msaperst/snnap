/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('gdpr', () => {
  jest.setTimeout(15000);

  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    driver = await test.getDriver();
  }, 10000);

  afterEach(async () => {
    // close the driver
    await test.cleanUp();
  }, 15000);

  async function removeCookies() {
    await driver.executeScript(async () => {
      localStorage.removeItem('cookies');
    });
    await driver.get(`${Test.getApp()}/`);
  }

  it('shows the gdpr modal when not set @accessibility', async () => {
    await removeCookies();
    const modal = await driver.wait(
      until.elementLocated(By.css('[aria-label="Cookies & Privacy Policy"]')),
      5000
    );
    expect(await modal.isDisplayed()).toBeTruthy();
    expect(await driver.findElement(By.css('.modal-header')).getText()).toEqual(
      'Cookies & Privacy Policy'
    );
    expect(await driver.findElement(By.css('.modal-body')).getText()).toEqual(
      "This site uses cookies in order to provide you with the best experience possible, provide social media features, analyze our traffic, and personalize jobs shown.\nPlease click 'Accept' to accept this use of your data. Alternatively, you may click 'Customize' to accept (or reject) specific categories of data processing.\nFor more information on how we process your personal data - or to update your preferences at any time - please visit our Privacy Policy"
    );
  });

  it('does not show the gdpr modal when set', async () => {
    const modal = await driver.findElements(
      By.css('[aria-label="Cookies & Privacy Policy"]')
    );
    expect(modal).toHaveLength(0);
  });

  it('takes you to the privacy policy page', async () => {
    await removeCookies();
    await driver.findElement(By.css('p > a[href="/privacy-policy"]')).click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/privacy-policy`
    );
  });

  it('link on privacy policy opens gdpr modal', async () => {
    await driver.get(`${Test.getApp()}/privacy-policy`);
    const button = await driver.wait(
      until.elementLocated(By.css('.btn-link')),
      5000
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', button);
    await button.click();
    const modal = await driver.wait(
      until.elementLocated(By.css('[aria-label="Cookies & Privacy Policy"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(modal), 5000);
    expect(await modal.isDisplayed()).toBeTruthy();
  });

  it('accepting gdpr accepts all', async () => {
    await removeCookies();
    await driver.findElement(By.id('acceptPolicy')).click();
    const cookies = await driver.executeScript(async () =>
      localStorage.getItem('cookies')
    );
    expect(cookies).toEqual(
      '{"necessary":true,"preferences":true,"analytics":true}'
    );
  });

  it('customizing gdpr allows setting custom settings @accessibility', async () => {
    await removeCookies();
    await driver.findElement(By.id('customizePolicy')).click();
    expect(await driver.findElement(By.css('.modal-body')).getText()).toEqual(
      "This site uses cookies in order to provide you with the best experience possible, provide social media features, analyze our traffic, and personalize jobs shown.\nPlease click 'Accept' to accept this use of your data. Alternatively, you may click 'Customize' to accept (or reject) specific categories of data processing.\nFor more information on how we process your personal data - or to update your preferences at any time - please visit our Privacy Policy\nSelect which cookies you want to accept:\nNecessary\nSite Preferences\nAnalytics"
    );
  });

  it('rejecting gdpr preferences removes remember me option', async () => {
    let rememberMe = await driver.findElements(By.id('rememberMe'));
    expect(rememberMe).toHaveLength(1);
    await removeCookies();
    await driver.findElement(By.id('customizePolicy')).click();
    await driver.findElement(By.id('acceptPolicy')).click();
    rememberMe = await driver.findElements(By.id('rememberMe'));
    expect(rememberMe).toHaveLength(0);
  });

  it('accepting custom cookies saves them', async () => {
    await removeCookies();
    await driver.findElement(By.id('customizePolicy')).click();
    await driver.findElement(By.id('acceptPolicy')).click();
    const cookies = await driver.executeScript(async () =>
      localStorage.getItem('cookies')
    );
    expect(cookies).toEqual(
      '{"necessary":true,"preferences":false,"analytics":false}'
    );
  });

  it('accepting custom cookies saves them - part 2', async () => {
    await removeCookies();
    await driver.findElement(By.id('customizePolicy')).click();
    await driver.findElement(By.id('analyticsCookies')).click();
    await driver.findElement(By.id('acceptPolicy')).click();
    const cookies = await driver.executeScript(async () =>
      localStorage.getItem('cookies')
    );
    expect(cookies).toEqual(
      '{"necessary":true,"preferences":false,"analytics":true}'
    );
  });

  it('reopening gdpr remembers settings', async () => {
    await driver.get(`${Test.getApp()}/privacy-policy`);
    const button = await driver.wait(
      until.elementLocated(By.css('.btn-link')),
      5000
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', button);
    await button.click();
    await driver.wait(
      until.elementLocated(By.css('[aria-label="Cookies & Privacy Policy"]')),
      5000
    );
    await driver.findElement(By.id('customizePolicy')).click();
    expect(
      await driver.findElement(By.id('necessaryCookies')).isSelected()
    ).toBeTruthy();
    expect(
      await driver.findElement(By.id('sitePreferencesCookies')).isSelected()
    ).toBeTruthy();
    expect(
      await driver.findElement(By.id('analyticsCookies')).isSelected()
    ).toBeTruthy();
  });

  it('clicking on privacy policy in footer takes you to privacy policy page', async () => {
    await driver.findElement(By.linkText('Privacy Policy')).click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/privacy-policy`
    );
  });

  it('clicking on terms of use in footer takes you to terms of use page', async () => {
    await driver.findElement(By.linkText('Terms of Use')).click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/terms-of-use`
    );
  });
});
