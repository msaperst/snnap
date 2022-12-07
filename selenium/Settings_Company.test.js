/* eslint-disable no-await-in-loop */
const { By, Key, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('settings company page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;
  let user;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    user = await test.loginUser('settingsCompanyUser');
    await driver.get(`${Test.getApp()}/settings`);
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="company"]')).click();
    driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formCompanyName'))),
      5000
    );
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the company information @network @accessibility', async () => {
    const companyInformation = (await driver.findElements(By.css('form')))[4];
    await driver.wait(
      until.elementTextIs(
        companyInformation.findElement(By.css('h3')),
        'Company Information'
      ),
      5000
    );
    expect(
      await companyInformation.findElement(By.css('h3')).getText()
    ).toEqual('Company Information');
  });

  it('displays the company name', async () => {
    const companyName = driver.wait(
      until.elementLocated(By.id('formCompanyName')),
      5000
    );
    expect(await companyName.getAttribute('value')).toEqual('');
    expect(await companyName.getAttribute('disabled')).toBeNull();
  });

  it('displays the website', async () => {
    const website = driver.wait(
      until.elementLocated(By.id('formWebsite')),
      5000
    );
    expect(await website.getAttribute('value')).toEqual('');
    expect(await website.getAttribute('disabled')).toBeNull();
  });

  it('displays the instagram link', async () => {
    const insta = driver.wait(
      until.elementLocated(By.id('formInstagramLink')),
      5000
    );
    expect(await insta.getAttribute('value')).toEqual('');
    expect(await insta.getAttribute('disabled')).toBeNull();
  });

  it('displays the facebook link', async () => {
    const facebook = driver.wait(
      until.elementLocated(By.id('formFacebookLink')),
      5000
    );
    expect(await facebook.getAttribute('value')).toEqual('');
    expect(await facebook.getAttribute('disabled')).toBeNull();
  });

  // asserts in checkForms method
  // eslint-disable-next-line jest/expect-expect
  it('allows keeping the company values empty @network @accessibility', async () => {
    await checkForms();
    await saveWaitAndRefresh();
    await checkForms();
  });

  it('allows updating the company values @network @accessibility', async () => {
    async function expected() {
      expect(await companyName.getAttribute('value')).toEqual('0');
      expect(await website.getAttribute('value')).toEqual('123.org');
      expect(await insta.getAttribute('value')).toEqual('instagram.com/snnap');
      expect(await facebook.getAttribute('value')).toEqual(
        'https://facebook.com/me'
      );
    }

    let { companyName, website, insta, facebook } = getFields();
    await companyName.sendKeys('0');
    await website.sendKeys('123.org');
    await insta.sendKeys('instagram.com/snnap');
    await facebook.sendKeys('https://facebook.com/me');
    await expected();
    await saveWaitAndRefresh();
    companyName = await driver.wait(
      until.elementLocated(By.id('formCompanyName')),
      5000
    );
    website = await driver.wait(
      until.elementLocated(By.id('formWebsite')),
      5000
    );
    insta = await driver.wait(
      until.elementLocated(By.id('formInstagramLink')),
      5000
    );
    facebook = await driver.wait(
      until.elementLocated(By.id('formFacebookLink')),
      5000
    );
    await expected();
  });

  // asserts in inputLinkData method
  // eslint-disable-next-line jest/expect-expect
  it('requires website url to be valid @network @accessibility', async () => {
    await inputLinkData('formWebsite', 'Website');
  });

  // asserts in inputLinkData method
  // eslint-disable-next-line jest/expect-expect
  it('requires insta url to be valid', async () => {
    await inputLinkData('formInstagramLink', 'Instagram Link');
  });

  // asserts in inputLinkData method
  // eslint-disable-next-line jest/expect-expect
  it('requires fb url to be valid', async () => {
    await inputLinkData('formFacebookLink', 'Facebook Link');
  });

  it('url error message goes away once success is had @network @accessibility', async () => {
    const facebook = driver.wait(
      until.elementLocated(By.id('formFacebookLink')),
      5000
    );
    await facebook.sendKeys('123.o');
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await danger.getText()).toEqual('Facebook Link must be a valid URL');
    await facebook.clear();
    await facebook.sendKeys('123.org');
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Company Information Updated');
    expect(
      await driver.findElements(By.className('alert-danger'))
    ).toHaveLength(0);
  });

  it('does not allow adding and saving when no equipment list is provided @network @accessibility', async () => {
    const { companyInformation, multiSelects, nextDivs } =
      await getCompanyFields();
    let feedbacks = await companyInformation.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(4);
    for (const feedback of feedbacks) {
      expect(await feedback.getText()).toEqual('');
      expect(await feedback.isDisplayed()).toBeFalsy();
    }
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
    const equipmentMultiSelectInput = multiSelects[0].findElement(
      By.css('[role="combobox"]')
    );
    const id = await equipmentMultiSelectInput.getAttribute('id');
    await equipmentMultiSelectInput.click();
    const option1 = By.id(id.replace('input', 'option-1'));
    driver.wait(until.elementLocated(option1), 5000);
    driver.findElement(option1).click();
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    feedbacks = await companyInformation.findElements(
      By.className('invalid-feedback')
    );
    expect(feedbacks).toHaveLength(5);
    for (let i = 1; i < feedbacks.length - 1; i++) {
      expect(await feedbacks[i].getText()).toEqual('');
      expect(await feedbacks[i].isDisplayed()).toBeFalsy();
    }
    expect(await feedbacks[4].getText()).toEqual(
      'Please provide a valid flash equipment list.'
    );
    expect(await feedbacks[4].isDisplayed()).toBeTruthy();
  });

  it('allows adding and saving equipment @network @accessibility', async () => {
    const { nextDivs } = await getCompanyFields();
    let { multiSelects } = await getCompanyFields();
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
    const equipmentMultiSelectInput = multiSelects[0].findElement(
      By.css('[role="combobox"]')
    );
    await equipmentMultiSelectInput.click();
    await equipmentMultiSelectInput.sendKeys(Key.ARROW_DOWN);
    await equipmentMultiSelectInput.sendKeys(Key.ENTER);
    let equipmentList = await driver.wait(
      until.elementLocated(By.id('formFlashEquipmentList')),
      5000
    );
    await equipmentList.sendKeys('Some Flashy Stuffs');
    const companyInformation = await saveAndRefresh();
    multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    const firstDiv = await multiSelects[0].findElement(By.css('div'));
    await checkNextDivs(firstDiv);
    equipmentList = await driver.wait(
      until.elementLocated(By.id('formFlashEquipmentList')),
      5000
    );
    await test.waitUntilInputFilled(By.id('formFlashEquipmentList'));
    expect(await equipmentList.getAttribute('value')).toEqual(
      'Some Flashy Stuffs'
    );
  });

  // TODO - need to fix these tests

  // it('allows removing a piece of equipment @network @accessibility', async () => {
  //   await Test.setUpProfile(
  //     await user.getId(),
  //     'Test',
  //     '123.org',
  //     'instagram.com/snnap',
  //     '',
  //     '',
  //     [
  //       {
  //         value: 1,
  //         label: 'Flash',
  //         what: 'flash machine',
  //       },
  //     ],
  //     []
  //   );
  //   await driver.navigate().refresh();
  //   await driver.wait(until.elementLocated(By.css('h2')), 5000);
  //   driver.findElement(By.css('[data-rr-ui-event-key="company"]')).click();
  //   driver.wait(
  //     until.elementIsVisible(driver.findElement(By.id('formCompanyName'))),
  //     5000
  //   );
  //   let { nextDivs } = await getCompanyFields();
  //   waitForNumber(nextDivs, 5);
  //   expect(await nextDivs.findElements(By.css('div'))).toHaveLength(5);
  //   await driver.findElement(By.css('[aria-label="Remove Camera"]')).click();
  //   const companyInformation = await saveAndRefresh();
  //   const multiSelects = await companyInformation.findElements(
  //     By.className('multi-select-form')
  //   );
  //   const firstDiv = await multiSelects[0].findElement(By.css('div'));
  //   nextDivs = await firstDiv.findElement(By.css('div'));
  //   expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
  //   console.log('got here');
  // });
  //
  // it('allows adding and saving skills @network @accessibility', async () => {
  //   let { multiSelects, nextDivs } = await getCompanyFields();
  //   expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
  //   const equipmentMultiSelectInput = multiSelects[1].findElement(
  //     By.css('[role="combobox"]')
  //   );
  //   const id = await equipmentMultiSelectInput.getAttribute('id');
  //   await equipmentMultiSelectInput.click();
  //   const option1 = By.id(id.replace('input', 'option-1'));
  //   driver.wait(until.elementLocated(option1), 5000);
  //   await driver.findElement(option1).click();
  //   await equipmentMultiSelectInput.click();
  //   const option2 = By.id(id.replace('input', 'option-2'));
  //   driver.wait(until.elementLocated(option2), 5000);
  //   await driver.findElement(option2).click();
  //   const companyInformation = await saveAndRefresh();
  //   multiSelects = await companyInformation.findElements(
  //     By.className('multi-select-form')
  //   );
  //   const firstDiv = await multiSelects[1].findElement(By.css('div'));
  //   nextDivs = await firstDiv.findElement(By.css('div'));
  //   waitForNumber(nextDivs, 9);
  //   expect(await nextDivs.findElements(By.css('div'))).toHaveLength(9);
  // });
  //
  // it('allows removing a skill @network @accessibility', async () => {
  //   await Test.setUpProfile(
  //     await user.getId(),
  //     'Test',
  //     '',
  //     '',
  //     '',
  //     '',
  //     [],
  //     [
  //       { value: 8, label: 'Flash' },
  //       {
  //         value: 9,
  //         label: 'Flashy',
  //       },
  //     ]
  //   );
  //   await driver.navigate().refresh();
  //   await driver.wait(until.elementLocated(By.css('h2')), 5000);
  //   driver.findElement(By.css('[data-rr-ui-event-key="company"]')).click();
  //   driver.wait(until.elementLocated(By.id('formCompanyName')), 5000);
  //   let companyInformation = (await driver.findElements(By.css('form')))[4];
  //   let multiSelects = await companyInformation.findElements(
  //     By.className('multi-select-form')
  //   );
  //   let firstDiv = await multiSelects[1].findElement(By.css('div'));
  //   const nextDivs = await firstDiv.findElement(By.css('div'));
  //   waitForNumber(nextDivs, 9);
  //   expect(await nextDivs.findElements(By.css('div'))).toHaveLength(9);
  //   await driver
  //     .findElement(By.css('[aria-label="Remove Natural Light"]'))
  //     .click();
  //   companyInformation = await saveAndRefresh();
  //   multiSelects = await companyInformation.findElements(
  //     By.className('multi-select-form')
  //   );
  //   firstDiv = await multiSelects[1].findElement(By.css('div'));
  //   await checkNextDivs(firstDiv);
  // });

  function getFields() {
    const companyName = driver.wait(
      until.elementLocated(By.id('formCompanyName')),
      5000
    );
    const website = driver.wait(
      until.elementLocated(By.id('formWebsite')),
      5000
    );
    const insta = driver.wait(
      until.elementLocated(By.id('formInstagramLink')),
      5000
    );
    const facebook = driver.wait(
      until.elementLocated(By.id('formFacebookLink')),
      5000
    );
    return { companyName, website, insta, facebook };
  }

  async function checkForms() {
    const { companyName, website, insta, facebook } = getFields();
    expect(await companyName.getAttribute('value')).toEqual('');
    expect(await website.getAttribute('value')).toEqual('');
    expect(await insta.getAttribute('value')).toEqual('');
    expect(await facebook.getAttribute('value')).toEqual('');
    return { companyName, website, insta, facebook };
  }

  async function saveWaitAndRefresh() {
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await success.getText()).toEqual('Company Information Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
    driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="company"]')).click();
    driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formCompanyName'))),
      5000
    );
  }

  async function inputLinkData(formData, textStart) {
    const website = driver.wait(until.elementLocated(By.id(formData)), 5000);
    await website.sendKeys('123.o');
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await danger.getText()).toEqual(`${textStart} must be a valid URL`);
  }

  async function getCompanyFields() {
    const companyInformation = (await driver.findElements(By.css('form')))[4];
    const multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    const firstDiv = await multiSelects[0].findElement(By.css('div'));
    const nextDivs = await firstDiv.findElement(By.css('div'));
    return { companyInformation, multiSelects, firstDiv, nextDivs };
  }

  async function saveAndRefresh() {
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    driver.wait(until.elementLocated(By.className('alert-success')), 5000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h2')), 5000);
    driver.findElement(By.css('[data-rr-ui-event-key="company"]')).click();
    driver.wait(
      until.elementIsVisible(driver.findElement(By.id('formCompanyName'))),
      5000
    );
    return (await driver.findElements(By.css('form')))[4];
  }

  async function checkNextDivs(firstDiv) {
    const nextDivs = await firstDiv.findElement(By.css('div'));
    waitForNumber(nextDivs, 5);
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(5);
    return nextDivs;
  }

  function waitForNumber(nextDivs, howMany) {
    driver.wait(
      () =>
        nextDivs
          .findElements(By.css('div'))
          .then((elements) => elements.length === howMany),
      5000
    );
  }
});
