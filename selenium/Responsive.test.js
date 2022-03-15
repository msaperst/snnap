const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('home page', () => {
  let test;
  let driver;
  let user;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    user = await test.loginUser('responsiveUser');
    await driver.get(Test.getApp());
  }, 10000);

  afterEach(async () => {
    //delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('displays full menu at large size', async () => {
    const navBar = driver.wait(until.elementLocated(By.id('responsive-navbar-nav')));
    expect( await navBar.isDisplayed()).toBeTruthy();
    const navBurger = driver.wait(until.elementLocated(By.className('navbar-toggler collapsed')));
    expect(await navBurger.isDisplayed()).toBeFalsy();
  });

  it('displays burger menu at medium size', async () => {
    await driver.manage().window().setSize(800, 800);
    const navBar = driver.wait(until.elementLocated(By.id('responsive-navbar-nav')));
    expect( await navBar.isDisplayed()).toBeFalsy();
    const navBurger = driver.wait(until.elementLocated(By.className('navbar-toggler collapsed')));
    expect(await navBurger.isDisplayed()).toBeTruthy();
  });

  it('displays search guy at large size', async () => {
    const searchGuy = driver.wait(until.elementLocated(By.className('searchGuy')));
    expect( await searchGuy.isDisplayed()).toBeTruthy();
  });

  it('displays search guy at medium size', async () => {
    await driver.manage().window().setSize(800, 800);
    const searchGuy = driver.wait(until.elementLocated(By.className('searchGuy')));
    expect( await searchGuy.isDisplayed()).toBeFalsy();
  });

  it('displays no search guy at extra small size', async () => {
    await driver.manage().window().setSize(400, 800);
    const searchGuy = driver.wait(until.elementLocated(By.className('searchGuy')));
    expect( await searchGuy.isDisplayed()).toBeFalsy();
  });
});
