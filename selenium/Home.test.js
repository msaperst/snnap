const { By, until } = require('selenium-webdriver');
const Base = require('./common/base');
require('chromedriver');

describe('home page', () => {
  let driver;
  let user;
  let requestToHire;

  beforeEach(async () => {
    // load the default page
    driver = await Base.getDriver();
    // login as a user
    requestToHire = await Base.addRequestToHire();
    user = await Base.loginUser(driver, 'homeUser');
    await driver.get(Base.getApp());
  }, 10000);

  afterEach(async () => {
    //delete the user
    await Base.removeUser(user.username);
    await Base.removeRequestToHire(await requestToHire.getId());
    // close the driver
    await driver.quit();
  }, 15000);

  it('takes us to the homepage', async () => {
    expect(await driver.getCurrentUrl()).toEqual(Base.getApp() + '/');
  });

  it('shows the username', async () => {
    const header = driver.wait(until.elementLocated(By.id('tagline')));
    expect(await header.getText()).toEqual('Photography help in a snap');
  });

  it('displays all entries unfiltered', () => {});
  it('displays only filtered entries', () => {});
  it('displays no employers when unchecked', () => {});
  it('displays employers when rechecked', () => {});
  it('displays soonest at the top', () => {});
  it('displays soonest at the bottom when resorted', () => {});
  it('displays soonest at the top when reresorted', () => {});

  //TODO - fill me out as we get more functionality

});