const { By, Key, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');
const Company = require('../api/components/company/Company');

describe('profile page', () => {
  jest.setTimeout(10000);

  let test;
  let driver;
  let user;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    user = await test.loginUser('profileCompanyUser');
    await driver.get(`${Test.getApp()}/profile`);
  }, 10000);

  afterEach(async () => {
    // delete the user
    await test.removeUser();
    await Test.removeProfile(await user.getId());
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('shows the company information', async () => {
    driver.wait(until.elementLocated(By.css('h2')));
    const companyInformation = (await driver.findElements(By.css('form')))[3];
    expect(
      await companyInformation.findElement(By.css('h3')).getText()
    ).toEqual('Company Information');
  });

  it('displays the company name', async () => {
    const companyName = driver.wait(
      until.elementLocated(By.id('formCompanyName'))
    );
    expect(await companyName.getAttribute('value')).toEqual('');
    expect(await companyName.getAttribute('disabled')).toBeNull();
  });

  it('displays the website', async () => {
    const website = driver.wait(until.elementLocated(By.id('formWebsite')));
    expect(await website.getAttribute('value')).toEqual('');
    expect(await website.getAttribute('disabled')).toBeNull();
  });

  it('displays the instagram link', async () => {
    const insta = driver.wait(until.elementLocated(By.id('formInstagramLink')));
    expect(await insta.getAttribute('value')).toEqual('');
    expect(await insta.getAttribute('disabled')).toBeNull();
  });

  it('displays the facebook link', async () => {
    const facebook = driver.wait(
      until.elementLocated(By.id('formFacebookLink'))
    );
    expect(await facebook.getAttribute('value')).toEqual('');
    expect(await facebook.getAttribute('disabled')).toBeNull();
  });

  function getFields() {
    const companyName = driver.wait(
      until.elementLocated(By.id('formCompanyName'))
    );
    const website = driver.wait(until.elementLocated(By.id('formWebsite')));
    const insta = driver.wait(until.elementLocated(By.id('formInstagramLink')));
    const facebook = driver.wait(
      until.elementLocated(By.id('formFacebookLink'))
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
      until.elementLocated(By.className('alert-success'))
    );
    expect(await success.getText()).toEqual('Company Information Updated');
    await Test.sleep(5000);
    expect(
      await driver.findElements(By.className('alert-success'))
    ).toHaveLength(0);
    driver.navigate().refresh();
  }

  it('allows keeping the company values empty', async () => {
    await checkForms();
    await saveWaitAndRefresh();
    await checkForms();
  });

  it('allows updating the company values', async () => {
    async function expected() {
      expect(await companyName.getAttribute('value')).toEqual('0');
      expect(await website.getAttribute('value')).toEqual('123.org');
      expect(await insta.getAttribute('value')).toEqual('instagram.com/snnap');
      expect(await facebook.getAttribute('value')).toEqual(
        'https://facebook.com/me'
      );
    }

    let { companyName, website, insta, facebook } = getFields();
    companyName.sendKeys('0');
    website.sendKeys('123.org');
    insta.sendKeys('instagram.com/snnap');
    facebook.sendKeys('https://facebook.com/me');
    await expected();
    await saveWaitAndRefresh();
    companyName = driver.wait(until.elementLocated(By.id('formCompanyName')));
    website = driver.wait(until.elementLocated(By.id('formWebsite')));
    insta = driver.wait(until.elementLocated(By.id('formInstagramLink')));
    facebook = driver.wait(until.elementLocated(By.id('formFacebookLink')));
    await expected();
  });

  async function inputLinkData(formData, textStart) {
    const website = driver.wait(until.elementLocated(By.id(formData)));
    website.sendKeys('123.o');
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await danger.getText()).toEqual(`${textStart} must be a valid URL`);
  }

  it('requires website url to be valid', async () => {
    await inputLinkData('formWebsite', 'Website');
  });

  it('requires insta url to be valid', async () => {
    await inputLinkData('formInstagramLink', 'Instagram Link');
  });

  it('requires fb url to be valid', async () => {
    await inputLinkData('formFacebookLink', 'Facebook Link');
  });

  it('url error message goes away once success is had', async () => {
    const facebook = driver.wait(
      until.elementLocated(By.id('formFacebookLink'))
    );
    facebook.sendKeys('123.o');
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const danger = driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await danger.getText()).toEqual('Facebook Link must be a valid URL');
    facebook.clear();
    facebook.sendKeys('123.org');
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    const success = driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await success.getText()).toEqual('Company Information Updated');
    expect(
      await driver.findElements(By.className('alert-danger'))
    ).toHaveLength(0);
  });

  async function getCompanyFields() {
    await driver.wait(until.elementLocated(By.css('h2')));
    const companyInformation = (await driver.findElements(By.css('form')))[3];
    const multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    const firstDiv = await multiSelects[0].findElement(By.css('div'));
    const nextDivs = await firstDiv.findElement(By.css('div'));
    return { companyInformation, multiSelects, firstDiv, nextDivs };
  }

  async function saveAndRefresh() {
    await driver.findElement(By.id('saveCompanyInformationButton')).click();
    driver.wait(until.elementLocated(By.className('alert-success')));
    driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h2')));
    return (await driver.findElements(By.css('form')))[3];
  }

  async function checkNextDivs(firstDiv) {
    const nextDivs = await firstDiv.findElement(By.css('div'));
    waitForNumber(nextDivs, 5);
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(5);
    return nextDivs;
  }

  it('does not allow adding and saving when no equipment list is provided', async () => {
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
    driver.wait(until.elementLocated(option1));
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

  it('allows adding and saving equipment', async () => {
    let { multiSelects, nextDivs } = await getCompanyFields();
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
    const equipmentMultiSelectInput = multiSelects[0].findElement(
      By.css('[role="combobox"]')
    );
    await equipmentMultiSelectInput.click();
    await equipmentMultiSelectInput.sendKeys(Key.ARROW_DOWN);
    await equipmentMultiSelectInput.sendKeys(Key.ENTER);
    let equipmentList = await driver.wait(
      until.elementLocated(By.id('formFlashEquipmentList'))
    );
    await equipmentList.sendKeys('Some Flashy Stuffs');
    const companyInformation = await saveAndRefresh();
    multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    const firstDiv = await multiSelects[0].findElement(By.css('div'));
    await checkNextDivs(firstDiv);
    equipmentList = await driver.wait(
      until.elementLocated(By.id('formFlashEquipmentList'))
    );
    await test.waitUntilInputFilled(By.id('formFlashEquipmentList'));
    expect(await equipmentList.getAttribute('value')).toEqual(
      'Some Flashy Stuffs'
    );
  });

  function waitForNumber(nextDivs, howMany) {
    driver.wait(() =>
      nextDivs
        .findElements(By.css('div'))
        .then((elements) => elements.length === howMany)
    );
  }

  it('allows removing a piece of equipment', async () => {
    const company = new Company(await user.getId());
    await company.setCompanyInformation(
      'Test',
      '123.org',
      'instagram.com/snnap',
      '',
      [
        {
          value: 1,
          label: 'Flash',
          what: 'flash machine',
        },
      ],
      []
    );
    driver.navigate().refresh();
    let { nextDivs } = await getCompanyFields();
    waitForNumber(nextDivs, 5);
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(5);
    await driver.findElement(By.css('[aria-label="Remove Camera"]')).click();
    const companyInformation = await saveAndRefresh();
    const multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    const firstDiv = await multiSelects[0].findElement(By.css('div'));
    nextDivs = await firstDiv.findElement(By.css('div'));
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
  });

  it('allows adding and saving skills', async () => {
    let { multiSelects, nextDivs } = await getCompanyFields();
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(2);
    const equipmentMultiSelectInput = multiSelects[1].findElement(
      By.css('[role="combobox"]')
    );
    const id = await equipmentMultiSelectInput.getAttribute('id');
    await equipmentMultiSelectInput.click();
    const option1 = By.id(id.replace('input', 'option-1'));
    driver.wait(until.elementLocated(option1));
    driver.findElement(option1).click();
    await equipmentMultiSelectInput.click();
    const option2 = By.id(id.replace('input', 'option-2'));
    driver.wait(until.elementLocated(option2));
    driver.findElement(option2).click();
    const companyInformation = await saveAndRefresh();
    multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    const firstDiv = await multiSelects[1].findElement(By.css('div'));
    nextDivs = await firstDiv.findElement(By.css('div'));
    waitForNumber(nextDivs, 9);
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(9);
  });

  it('allows removing a skill', async () => {
    const company = new Company(await user.getId());
    await company.setCompanyInformation(
      'Test',
      '',
      '',
      '',
      [],
      [
        { value: 1, label: 'Flash' },
        {
          value: 2,
          label: 'Flashy',
        },
      ]
    );
    driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('h2')));
    let companyInformation = (await driver.findElements(By.css('form')))[3];
    let multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    let firstDiv = await multiSelects[1].findElement(By.css('div'));
    const nextDivs = await firstDiv.findElement(By.css('div'));
    waitForNumber(nextDivs, 9);
    expect(await nextDivs.findElements(By.css('div'))).toHaveLength(9);
    await driver
      .findElement(By.css('[aria-label="Remove Photography"]'))
      .click();
    companyInformation = await saveAndRefresh();
    multiSelects = await companyInformation.findElements(
      By.className('multi-select-form')
    );
    firstDiv = await multiSelects[1].findElement(By.css('div'));
    await checkNextDivs(firstDiv);
  });
});
