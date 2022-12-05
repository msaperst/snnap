/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
const Home = require('./common/Home');
require('chromedriver');

describe('chat', () => {
  jest.setTimeout(15000);

  let test;
  let chatUser;
  let user;
  let chatDriver;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // create driver and user to chat with
    chatDriver = await test.getDriver();
    chatUser = await test.loginUser('userToChatWith');
    // login as another user
    driver = await test.getDriver();
    user = await test.loginUser('userToChat');
    await driver.get(`${Test.getApp()}/profile/userToChatWith`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await Test.removeUserById(await chatUser.getId());
    await test.removeUser();
    // close the driver
    chatDriver.quit();
    await test.cleanUp();
  }, 15000);

  it('navigates to chat without user from the menu', async () => {});

  it('navigates to chat with user from profile', async () => {});

  it('shows no unread messages in menu when none', async () => {
    const menu = driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await menu.click();
    const chatLink = driver.wait(
      until.elementLocated(By.css('a[href="/chat"]')),
      5000
    );
    expect(await chatLink.getText()).toEqual('Chat');
  });

  it('shows unread messages in menu when some', async () => {
    // send a message to one user
    let chatLink = driver.wait(
      until.elementLocated(By.css('a[alt="Chat with userToChatWith"]')),
      5000
    );
    await chatLink.click();
    const messageInput = driver.wait(
      until.elementLocated(By.id('formMessage')),
      5000
    );
    await messageInput.sendKeys('Hello');
    await messageInput.submit();
    // check for a message notification
    await chatDriver.get(`${Test.getApp()}/`);
    const menu = chatDriver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await menu.click();
    chatLink = chatDriver.wait(
      until.elementLocated(By.css('a[href="/chat"]')),
      5000
    );
    expect(await chatLink.getText()).toEqual('Chat\n1');
  });

  it('shows sent message as unread when sending to user who is not there', async () => {});
  it('shows sent message as read when sending to user who is there', async () => {});
  it('updates sent message to read when user sends message', async () => {});
  it('switches to different user chat when selected', async () => {});
});
