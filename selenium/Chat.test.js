/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('chat', () => {
  jest.setTimeout(15000);

  let test;
  let chatUser;
  let chatDriver;
  let driver;

  beforeEach(async () => {
    test = new Test();
    // create driver and user to chat with
    chatDriver = await test.getDriver();
    chatUser = await test.loginUser('userToChatWith');
    // login as another user
    driver = await test.getDriver();
    await test.loginUser('userToChat');
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

  it('navigates to chat without user from the menu @network @accessibility', async () => {
    const menu = driver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await menu.click();
    const chatLink = driver.wait(
      until.elementLocated(By.css('a[href="/chat"]')),
      5000
    );
    await chatLink.click();
    const headers = await driver.findElements(By.css('h1'));
    expect(headers).toHaveLength(0);
  });

  it('navigates to chat with user from profile @network @accessibility', async () => {
    const chatLink = driver.wait(
      until.elementLocated(By.css('a[alt="Chat with userToChatWith"]')),
      5000
    );
    await chatLink.click();
    const conversationHeader = driver.wait(
      until.elementLocated(By.css('h1')),
      5000
    );
    expect(await conversationHeader.getText()).toEqual(
      'Chat with userToChatWith'
    );
  });

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

  it('shows unread messages in menu when some @network @accessibility', async () => {
    await sendSingleMessage();
    // check for a message notification
    await chatDriver.get(`${Test.getApp()}/`);
    const menu = chatDriver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await menu.click();
    const chatLink = chatDriver.wait(
      until.elementLocated(By.css('a[href="/chat"]')),
      5000
    );
    expect(await chatLink.getText()).toEqual('Chat\n1');
  });

  it('shows notifications on user in chat', async () => {
    await sendSingleMessage();
    // check messages of other user
    await chatDriver.get(`${Test.getApp()}/chat`);
    const userChat = await chatDriver.wait(
      until.elementLocated(By.css('li[href="#userToChat"]')),
      5000
    );
    expect(await userChat.getText()).toEqual('userToChat\n1');
  });

  it('removes notifications when selecting a chat @network @accessibility', async () => {
    await sendSingleMessage();
    // check messages of other user
    await chatDriver.get(`${Test.getApp()}/chat`);
    const userChat = await chatDriver.wait(
      until.elementLocated(By.css('li[href="#userToChat"]')),
      5000
    );
    await userChat.click();
    const menu = chatDriver.wait(
      until.elementLocated(By.id('user-dropdown')),
      5000
    );
    await menu.click();
    const chatLink = chatDriver.wait(
      until.elementLocated(By.linkText('Chat')),
      5000
    );
    expect(await chatLink.getText()).toEqual('Chat');
    expect(await userChat.getText()).toEqual('userToChat');
  });

  it('switches to different user chat when selected @network @accessibility', async () => {
    await sendSingleMessage();
    // check messages of other user
    await chatDriver.get(`${Test.getApp()}/chat`);
    const userChat = await chatDriver.wait(
      until.elementLocated(By.css('li[href="#userToChat"]')),
      5000
    );
    await userChat.click();
    const conversationHeader = chatDriver.wait(
      until.elementLocated(By.css('h1')),
      5000
    );
    expect(await conversationHeader.getText()).toEqual('Chat with userToChat');
  });

  it('shows sent message as unread when sending to user who is not there', async () => {
    // send a message to one user
    const chatLink = driver.wait(
      until.elementLocated(By.css('a[alt="Chat with userToChatWith"]')),
      5000
    );
    await chatLink.click();
    const chatContainer = await driver.wait(
      until.elementLocated(By.id('chat-view-container')),
      5000
    );
    let chat = await chatContainer.findElements(By.css('div'));
    expect(chat).toHaveLength(1);
    const messageInput = driver.wait(
      until.elementLocated(By.id('formMessage')),
      5000
    );
    await messageInput.sendKeys('Hello');
    const now = new Date().toLocaleTimeString(undefined, {
      timeStyle: 'short',
    });
    await messageInput.submit();
    const message = await driver.wait(
      until.elementLocated(By.css('.bubble-message')),
      5000
    );
    chat = await chatContainer.findElements(By.css('div'));
    expect(chat).toHaveLength(2);
    expect(await message.getText()).toEqual('Hello');
    expect(await message.getAttribute('class')).toEqual(
      'bubble-message self-message unread'
    );
    expect(await message.getAttribute('data-is')).toEqual(`you - ${now}`);
  });

  it('shows sent message as read when sending to user who is there', async () => {
    await sendSingleMessage();
    // send a message to the other user
    await chatDriver.get(`${Test.getApp()}/profile/userToChat`);
    const chatLink = chatDriver.wait(
      until.elementLocated(By.css('a[alt="Chat with userToChat"]')),
      5000
    );
    await chatLink.click();
    const chatContainer = await chatDriver.wait(
      until.elementLocated(By.id('chat-view-container')),
      5000
    );
    await chatDriver.wait(
      until.elementLocated(By.css('.bubble-message')),
      5000
    );
    let chat = await chatContainer.findElements(By.css('div'));
    expect(chat).toHaveLength(2);
    const messageInput = await chatDriver.wait(
      until.elementLocated(By.id('formMessage')),
      5000
    );
    await messageInput.sendKeys('Hi');
    const now = new Date().toLocaleTimeString(undefined, {
      timeStyle: 'short',
    });
    await messageInput.submit();
    const message = await chatDriver.wait(
      until.elementLocated(By.css('.self-message')),
      5000
    );
    chat = await chatContainer.findElements(By.css('div'));
    expect(chat).toHaveLength(3);
    expect(await message.getText()).toEqual('Hi');
    expect(await message.getAttribute('class')).toEqual(
      'bubble-message self-message'
    );
    expect(await message.getAttribute('data-is')).toEqual(`you - ${now}`);
  });

  it('updates sent message to read when user sends message @network @accessibility', async () => {
    await sendSingleMessage();
    const message = await driver.wait(
      until.elementLocated(By.css('.bubble-message')),
      5000
    );
    const chatContainer = await driver.wait(
      until.elementLocated(By.id('chat-view-container')),
      5000
    );
    let chat = await chatContainer.findElements(By.css('div'));
    expect(chat).toHaveLength(2);
    // send a message to the other user
    await chatDriver.get(`${Test.getApp()}/profile/userToChat`);
    const chatLink = chatDriver.wait(
      until.elementLocated(By.css('a[alt="Chat with userToChat"]')),
      5000
    );
    await chatLink.click();
    await chatDriver.wait(
      until.elementLocated(By.css('.bubble-message')),
      5000
    );
    const messageInput = await chatDriver.wait(
      until.elementLocated(By.id('formMessage')),
      5000
    );
    await messageInput.sendKeys('Hi');
    await messageInput.submit();
    await chatDriver.wait(until.elementLocated(By.css('.self-message')), 5000);
    // ensure old message shows as read
    chat = await chatContainer.findElements(By.css('div'));
    expect(chat).toHaveLength(3);
    expect(await message.getAttribute('class')).toEqual(
      'bubble-message self-message'
    );
  });

  async function sendSingleMessage() {
    const chatLink = driver.wait(
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
  }
});
