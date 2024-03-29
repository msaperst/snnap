const { By, until } = require('selenium-webdriver');
require('chromedriver');
const Test = require('./common/Test');

describe('log in page', () => {
  let test;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // add a user
    test.addUser('loginUser');
    // load the default page
    driver = await test.getDriver();
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('takes you to the login page when not authenticated @network @accessibility', async () => {
    expect(await driver.getCurrentUrl()).toEqual(`${Test.getApp()}/login`);
    expect(await driver.findElement(By.css('h1')).getText()).toEqual('Login');
  });

  it('shows error when you login with blank credentials @network @accessibility', async () => {
    const feedback = await driver.findElements(
      By.className('invalid-feedback')
    );
    expect(feedback).toHaveLength(2);
    expect(await feedback[0].getText()).toEqual('');
    expect(await feedback[1].getText()).toEqual('');
    expect(await feedback[0].isDisplayed()).toBeFalsy();
    expect(await feedback[1].isDisplayed()).toBeFalsy();
    await driver.findElement(By.id('loginButton')).click();
    expect(await feedback[0].getText()).toEqual(
      'Please provide a valid username.'
    );
    expect(await feedback[1].getText()).toEqual(
      'Please provide a valid password.'
    );
    expect(await feedback[0].isDisplayed()).toBeTruthy();
    expect(await feedback[1].isDisplayed()).toBeTruthy();
  });

  it('allows you to login with a valid user @network @accessibility', async () => {
    await driver.findElement(By.id('formUsername')).sendKeys('loginUser');
    await driver.findElement(By.id('formPassword')).sendKeys('password');
    await driver.findElement(By.id('loginButton')).click();
    const dropDownMenu = driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    expect(await dropDownMenu.getText()).toEqual('loginUser');
  });

  it('does not allow you to login with an invalid user @network @accessibility', async () => {
    await driver.findElement(By.id('formUsername')).sendKeys('some bad user');
    await driver.findElement(By.id('formPassword')).sendKeys('password');
    await driver.findElement(By.id('loginButton')).click();
    const header = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await header.getText()).toEqual(
      'Username or password is incorrect!'
    );
  });

  it('does not allow you to login with an invalid password', async () => {
    await driver.findElement(By.id('formUsername')).sendKeys('loginUser');
    await driver.findElement(By.id('formPassword')).sendKeys('passwor');
    await driver.findElement(By.id('loginButton')).click();
    const alert = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual('Username or password is incorrect!');
  });

  it('allows you to navigate to the register page @network @accessibility', async () => {
    await driver.findElement(By.linkText('Sign Up')).click();
    await driver.wait(until.elementLocated(By.id('formFirstname')), 5000);
    const header = driver.findElement(By.css('h1'));
    expect(await header.getText()).toEqual('Register');
  });

  // TODO - able to navigate to forgot password

  // TODO - verify remains logged in works
});
