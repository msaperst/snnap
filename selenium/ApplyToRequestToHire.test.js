const Test = require("./common/Test");
const {until, By} = require("selenium-webdriver");
describe('apply to request to hire', () => {
  jest.setTimeout(15000);
  let test;
  let driver;
  let user;
  let requestToHires = [];
  let modal;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    user = await test.loginUser('newApplyToRequestToHireUser');
    requestToHires.push(await Test.addRequestToHire(1, '2023-03-12'));
    await driver.get(Test.getApp());
    const card = driver.wait(until.elementLocated(By.className('card-body')));
    await card.findElement(By.id(`openApplyToRequestToHireButton-${await requestToHires[0].getId()}`)).click();
    modal = driver.wait(until.elementLocated(By.className('modal-dialog')));
  }, 10000);

  afterEach(async () => {
    // clean up the hire requests
    for (const requestToHire of requestToHires) {
      await Test.removeRequestToHire(await requestToHire.getId());
    }
    requestToHires = [];
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('can be viewed from any hire request', async () => {
    requestToHires.push(await Test.addRequestToHire(2, '2023-03-10'));
    requestToHires.push(await Test.addRequestToHire(4, '2023-03-10'));
    driver.navigate().refresh();
    const cards = await driver.findElements(By.className('card-body'));
    for (const card in cards) {
      expect(await card.findElement(By.tagName('button')).isDisplayed()).toBeTruthy();
    }
  });

  it('displays hire request application', async () => {
    const events = ['Wedding', "B'nai Mitzvah", 'Commercial Event', 'Misc'];
    requestToHires.push(await Test.addRequestToHire(2, '2024-03-10'));
    requestToHires.push(await Test.addRequestToHire(3, '2025-03-10'));
    requestToHires.push(await Test.addRequestToHire(4, '2026-03-10'));
    driver.navigate().refresh();
    const cards = await driver.findElements(By.className('card-body'));
    let i = 0;
    for (const card in cards) {
      i++;
      await card.findElement(By.tagName('button')).click();
      modal = driver.wait(until.elementLocated(By.className('modal-dialog')));
      expect(modal.isDisplayed()).toBeTruthy();
      expect(await modal.findElement(By.className('modal-title')).getText()).toEqual(`Submit to work the ${events[i]} Session`);
      const rows = await modal.findElements(By.className('mb-3 row'));
      expect(rows).toHaveLength(12);
    }
  });

  it('displays hire request information', async () => {
    const form = await driver.findElement(By.id('applyToRequestToHireForm'));
    expect(await (await form.findElements(By.className('mb-3 row')))[0].getText()).toEqual('Job Information');

    const jobType = await driver.findElement(By.id('formJobType'));
    expect(await jobType.getAttribute('readonly')).toBeTruthy();
    expect(await jobType.getAttribute('value')).toEqual('Wedding');

    const date = await driver.findElement(By.id('formDate'));
    expect(await date.getAttribute('readonly')).toBeTruthy();
    expect(await date.getAttribute('value')).toEqual('Sunday, March 12, 2023');

    const duration = await driver.findElement(By.id('formDuration'));
    expect(await duration.getAttribute('readonly')).toBeTruthy();
    expect(await duration.getAttribute('value')).toEqual('4 hours');

    const location = await driver.findElement(By.id('formLocation'));
    expect(await location.getAttribute('readonly')).toBeTruthy();
    expect(await location.getAttribute('value')).toEqual('Chantilly, VA');

    const pay = await driver.findElement(By.id('formPay'));
    expect(await pay.getAttribute('readonly')).toBeTruthy();
    expect(await pay.getAttribute('value')).toEqual('$200 per hour');

    const details = await driver.findElement(By.id('formJobDetails'));
    expect(await details.getAttribute('readonly')).toBeTruthy();
    expect(await details.getAttribute('value')).toEqual('Some details');

    const equipment = await driver.findElement(By.id('formEquipment'));
    expect(await equipment.getAttribute('readonly')).toBeTruthy();
    expect(await equipment.getAttribute('value')).toEqual('');

    const skills = await driver.findElement(By.id('formSkills'));
    expect(await skills.getAttribute('readonly')).toBeTruthy();
    expect(await skills.getAttribute('value')).toEqual('');
  });

  it('displays profile information', async () => {
    const form = await driver.findElement(By.id('applyToRequestToHireForm'));
    expect(await (await form.findElements(By.className('mb-3 row')))[5].getText()).toEqual('Your Information');

    const name = await driver.findElement(By.id('formName'));
    expect(await name.getAttribute('readonly')).toBeFalsy();
    expect(await name.getAttribute('value')).toEqual('Test User');

    const company = await driver.findElement(By.id('formCompany'));
    expect(await company.getAttribute('readonly')).toBeFalsy();
    expect(await company.getAttribute('value')).toEqual('');

    const website = await driver.findElement(By.id('formWebsite'));
    expect(await website.getAttribute('readonly')).toBeFalsy();
    expect(await website.getAttribute('value')).toEqual('');

    const insta = await driver.findElement(By.id('formInstagramLink'));
    expect(await insta.getAttribute('readonly')).toBeFalsy();
    expect(await insta.getAttribute('value')).toEqual('');

    const fb = await driver.findElement(By.id('formFacebookLink'));
    expect(await fb.getAttribute('readonly')).toBeFalsy();
    expect(await fb.getAttribute('value')).toEqual('');

    const experience = await driver.findElement(By.id('formExperience'));
    expect(await experience.getAttribute('readonly')).toBeFalsy();
    expect(await experience.getAttribute('value')).toEqual('');

    //TODO - experience/skills - pull from profile

    const galleryDescription = await driver.findElement(By.id('galleryDescription-0'));
    expect(await galleryDescription.getAttribute('readonly')).toBeFalsy();
    expect(await galleryDescription.getAttribute('value')).toEqual('');

    const galleryLink = await driver.findElement(By.id('galleryLink-0'));
    expect(await galleryLink.getAttribute('readonly')).toBeFalsy();
    expect(await galleryLink.getAttribute('value')).toEqual('');
  });

  it('can be submitted with profile information', () => {
    // TODO
  });
  it('can be submitted with updated information', () => {
    // TODO
  });
  it('can not be submitted if name is missing', () => {
    // TODO
  });
  it('gets rejected with bad values', () => {
    // TODO - expand for all the bad values
  });

  // TODO - add tests for different button types
});