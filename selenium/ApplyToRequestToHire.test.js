/* eslint-disable no-await-in-loop */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');

describe('apply to request to hire', () => {
  jest.setTimeout(15000);
  let test;
  let driver;
  let user;
  let company = { id: 0 };
  let requestToHires = [];
  let applicationsForRequestToHires = [];
  let form;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    // login as a user
    requestToHires.push(await Test.addRequestToHire(0, 1, '2023-03-12'));
    user = await test.loginUser('newApplyToRequestToHireUser');
    await driver.get(Test.getApp());
    const button = await getButton(await requestToHires[0].getId());
    await button.click();
    form = await driver.wait(
      until.elementLocated(By.id('applyToRequestToHireForm'))
    );
  }, 10000);

  afterEach(async () => {
    // clean up the hire requests
    for (const requestToHire of requestToHires) {
      await Test.removeRequestToHire(await requestToHire.getId());
    }
    requestToHires = [];
    // clean up the applications for hire requests
    for (const applicationsForRequestToHire of applicationsForRequestToHires) {
      await Test.removeApplicationForRequestToHire(
        await applicationsForRequestToHire.getId()
      );
    }
    applicationsForRequestToHires = [];
    // delete the user
    await test.removeUser();
    await Test.removeProfile(company.id);
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('can be viewed from any hire request', async () => {
    requestToHires.push(await Test.addRequestToHire(0, 2, '2023-03-10'));
    requestToHires.push(await Test.addRequestToHire(1, 4, '2023-03-10'));
    await driver.navigate().refresh();
    for (const requestToHire of requestToHires) {
      const button = await getButton(await requestToHire.getId());
      expect(await button.isDisplayed()).toBeTruthy();
    }
  });

  it('has the submit button when someone else created the request', async () => {
    await driver.navigate().refresh();
    const button = await getButton(await requestToHires[0].getId());
    expect(await button.isDisplayed()).toBeTruthy();
    expect(await button.isEnabled()).toBeTruthy();
    expect(await button.getText()).toEqual('Submit For Job');
  });

  it('has the view applications button when you created the request', async () => {
    requestToHires.push(
      await Test.addRequestToHire(await user.getId(), 4, '2023-03-10')
    );
    await driver.navigate().refresh();
    const button = await getButton(await requestToHires[1].getId());
    expect(await button.isDisplayed()).toBeTruthy();
    expect(await button.isEnabled()).toBeTruthy();
    expect(await button.getText()).toEqual('Show Applications');
  });

  it('has the button disabled when you already applied to the request', async () => {
    applicationsForRequestToHires.push(
      await Test.addApplicationForRequestToHire(
        await requestToHires[0].getId(),
        await user.getId(),
        0
      )
    );
    await driver.navigate().refresh();
    await checkAlreadyApplied();
  });

  it('displays hire request application', async () => {
    const events = ['Wedding', "B'nai Mitzvah", 'Commercial Event', 'Misc'];
    requestToHires.push(await Test.addRequestToHire(0, 2, '2024-03-10'));
    requestToHires.push(await Test.addRequestToHire(0, 3, '2025-03-10'));
    requestToHires.push(await Test.addRequestToHire(0, 4, '2026-03-10'));
    await driver.navigate().refresh();
    for (let i = 0; i < requestToHires.length; i++) {
      const requestToHire = requestToHires[i];
      const button = driver.wait(
        until.elementLocated(
          By.id(`openApplyToRequestToHireButton-${await requestToHire.getId()}`)
        )
      );
      await button.click();
      const modal = driver.wait(
        until.elementLocated(By.className('modal-dialog'))
      );
      driver.wait(until.elementIsVisible(modal));
      expect(await modal.isDisplayed()).toBeTruthy();
      expect(
        await modal.findElement(By.className('modal-title')).getText()
      ).toEqual(`Submit to work the ${events[i]} Session`);
      const rows = await modal.findElements(By.className('mb-3 row'));
      expect(rows).toHaveLength(12);
      await modal.findElement(By.className('btn-close')).click();
    }
  });

  it('displays hire request information', async () => {
    expect(
      await (await form.findElements(By.className('mb-3 row')))[0].getText()
    ).toEqual('Job Information');

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
    expect(
      await (await form.findElements(By.className('mb-3 row')))[5].getText()
    ).toEqual('Your Information');

    const name = await driver.findElement(By.id('formName'));
    expect(await name.getAttribute('readonly')).toBeFalsy();
    expect(await name.getAttribute('value')).toEqual('Test User');

    const companyName = await driver.findElement(By.id('formCompany'));
    expect(await companyName.getAttribute('readonly')).toBeFalsy();
    expect(await companyName.getAttribute('value')).toEqual('');

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

    // TODO - experience/skills - pull from profile

    const galleryDescription = await driver.findElement(
      By.id('galleryDescription-0')
    );
    expect(await galleryDescription.getAttribute('readonly')).toBeFalsy();
    expect(await galleryDescription.getAttribute('value')).toEqual('');

    const galleryLink = await driver.findElement(By.id('galleryLink-0'));
    expect(await galleryLink.getAttribute('readonly')).toBeFalsy();
    expect(await galleryLink.getAttribute('value')).toEqual('');
  });

  it('displays filled out profile information', async () => {
    company = await Test.setUpProfile(
      await user.getId(),
      'Company',
      'https://website.com',
      'https://instagram.com',
      'https://facebook.com',
      'Experience',
      [1, 3],
      [5],
      [{ description: 'some link', link: 'https://link.com' }]
    );
    await driver.navigate().refresh();
    await driver.wait(
      until.elementLocated(
        By.id(
          `openApplyToRequestToHireButton-${await requestToHires[0].getId()}`
        )
      )
    );
    await driver
      .findElement(
        By.id(
          `openApplyToRequestToHireButton-${await requestToHires[0].getId()}`
        )
      )
      .click();
    form = await driver.wait(
      until.elementLocated(By.id('applyToRequestToHireForm'))
    );
    expect(
      await (await form.findElements(By.className('mb-3 row')))[5].getText()
    ).toEqual('Your Information');

    const name = await driver.findElement(By.id('formName'));
    expect(await name.getAttribute('readonly')).toBeFalsy();
    expect(await name.getAttribute('value')).toEqual('Test User');

    const companyName = await driver.findElement(By.id('formCompany'));
    expect(await companyName.getAttribute('readonly')).toBeFalsy();
    expect(await companyName.getAttribute('value')).toEqual('Company');

    const website = await driver.findElement(By.id('formWebsite'));
    expect(await website.getAttribute('readonly')).toBeFalsy();
    expect(await website.getAttribute('value')).toEqual('https://website.com');

    const insta = await driver.findElement(By.id('formInstagramLink'));
    expect(await insta.getAttribute('readonly')).toBeFalsy();
    expect(await insta.getAttribute('value')).toEqual('https://instagram.com');

    const fb = await driver.findElement(By.id('formFacebookLink'));
    expect(await fb.getAttribute('readonly')).toBeFalsy();
    expect(await fb.getAttribute('value')).toEqual('https://facebook.com');

    const experience = await driver.findElement(By.id('formExperience'));
    expect(await experience.getAttribute('readonly')).toBeFalsy();
    expect(await experience.getAttribute('value')).toEqual('Experience');

    // TODO - experience/skills - pull from profile

    const galleryDescription0 = await driver.findElement(
      By.id('galleryDescription-0')
    );
    expect(await galleryDescription0.getAttribute('readonly')).toBeFalsy();
    expect(await galleryDescription0.getAttribute('value')).toEqual(
      'some link'
    );

    const galleryLink0 = await driver.findElement(By.id('galleryLink-0'));
    expect(await galleryLink0.getAttribute('readonly')).toBeFalsy();
    expect(await galleryLink0.getAttribute('value')).toEqual(
      'https://link.com'
    );

    const galleryDescription1 = await driver.findElement(
      By.id('galleryDescription-1')
    );
    expect(await galleryDescription1.getAttribute('readonly')).toBeFalsy();
    expect(await galleryDescription1.getAttribute('value')).toEqual('');

    const galleryLink1 = await driver.findElement(By.id('galleryLink-1'));
    expect(await galleryLink1.getAttribute('readonly')).toBeFalsy();
    expect(await galleryLink1.getAttribute('value')).toEqual('');
  });

  // eslint-disable-next-line jest/expect-expect
  it('can be submitted with profile information', async () => {
    // assertions in function call
    await applyForJob();
  });

  it('can be submitted with updated information', async () => {
    const name = await driver.findElement(By.id('formName'));
    await name.sendKeys('New Name');
    const companyName = await driver.findElement(By.id('formCompany'));
    await companyName.sendKeys('New Company');
    const website = await driver.findElement(By.id('formWebsite'));
    await website.sendKeys('https://new.website');
    const insta = await driver.findElement(By.id('formInstagramLink'));
    await insta.sendKeys('https://new.insta');
    const fb = await driver.findElement(By.id('formFacebookLink'));
    await fb.sendKeys('https://new.fb');
    const experience = await driver.findElement(By.id('formExperience'));
    await experience.sendKeys('some other experience');
    // TODO - experience/skills - pull from profile
    const galleryDescription = await driver.findElement(
      By.id('galleryDescription-0')
    );
    await galleryDescription.sendKeys('a new description');
    const galleryLink = await driver.findElement(By.id('galleryLink-0'));
    await galleryLink.sendKeys('https://otherLink.com');

    const galleryDescription1 = await driver.findElement(
      By.id('galleryDescription-1')
    );
    expect(await galleryDescription1.getAttribute('readonly')).toBeFalsy();
    expect(await galleryDescription1.getAttribute('value')).toEqual('');

    const galleryLink1 = await driver.findElement(By.id('galleryLink-1'));
    expect(await galleryLink1.getAttribute('readonly')).toBeFalsy();
    expect(await galleryLink1.getAttribute('value')).toEqual('');

    await applyForJob();
  });

  it('can not be submitted if name is missing', async() => {
    const name = await driver.findElement(By.id('formName'));
    await name.clear();
    const applyLink = await driver.findElement(
      By.id('applyToRequestToHireButton')
    );
    await applyLink.click();
    const feedbacks = await form.findElements(By.css('.invalid-feedback'));
    expect(feedbacks).toHaveLength(16);
    for(let i = 0; i < feedbacks.length; i++) {
      if(i === 8) {
        expect(await feedbacks[i].isDisplayed()).toBeTruthy();
        expect(await feedbacks[i].getText()).toEqual('Please provide a valid name.');
      } else {
        expect(await feedbacks[i].isDisplayed()).toBeFalsy();
        expect(await feedbacks[i].getText()).toEqual('');
      }
    }
    const alerts = await form.findElements(By.className('alert-danger'));
    expect(alerts).toHaveLength(0);
  });

  it('gets rejected with bad website value', async () => {
    const website = await driver.findElement(By.id('formWebsite'));
    await website.sendKeys('somebadurl');
    const applyLink = await driver.findElement(
      By.id('applyToRequestToHireButton')
    );
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await alert.getText()).toEqual('Website must be a valid URL');
  });

  it('gets rejected with bad insta value', async () => {
    const insta = await driver.findElement(By.id('formInstagramLink'));
    await insta.sendKeys('somebadurl');
    const applyLink = await driver.findElement(
      By.id('applyToRequestToHireButton')
    );
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await alert.getText()).toEqual('Instagram Link must be a valid URL');
  });

  it('gets rejected with bad fb value', async () => {
    const fb = await driver.findElement(By.id('formFacebookLink'));
    await fb.sendKeys('somebadurl');
    const applyLink = await driver.findElement(
      By.id('applyToRequestToHireButton')
    );
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await alert.getText()).toEqual('Facebook Link must be a valid URL');
  });

  it('gets rejected with bad portfolio value', async () => {
    const galleryDescription = await driver.findElement(
      By.id('galleryDescription-0')
    );
    await galleryDescription.sendKeys('a new description');
    const galleryLink = await driver.findElement(By.id('galleryLink-0'));
    await galleryLink.sendKeys('somebadurl');
    const applyLink = await driver.findElement(
      By.id('applyToRequestToHireButton')
    );
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await alert.getText()).toEqual('Portfolio Link must be a valid URL');
  });

  async function getButton(hireRequestId) {
    await driver.wait(
      until.elementLocated(By.css(`button[hire-request="${hireRequestId}"]`))
    );
    return driver.findElement(
      By.css(`button[hire-request="${hireRequestId}"]`)
    );
  }

  async function applyForJob() {
    const applyLink = await driver.findElement(
      By.id('applyToRequestToHireButton')
    );
    await applyLink.click();
    expect(await applyLink.isEnabled()).toBeFalsy();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await alert.getText()).toEqual('Job Filing Submitted');
    driver.wait(() =>
      driver
        .findElements(By.css('.modal-header'))
        .then((elements) => elements.length === 0)
    );
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
    await checkAlreadyApplied()
  }

  async function checkAlreadyApplied() {
    await Test.sleep(500); // TODO - fix me instead of waiting for the redraw
    const button = await getButton(await requestToHires[0].getId());
    expect(await button.isDisplayed()).toBeTruthy();
    expect(await button.isEnabled()).toBeFalsy();
    expect(await button.getText()).toEqual('Already Applied');
  }
});
