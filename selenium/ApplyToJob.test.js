/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
const Home = require('./common/Home');
require('chromedriver');

describe('apply to job', () => {
  jest.setTimeout(15000);
  let test;
  let driver;
  let jobCreatorId;
  let user;
  let jobs = [];
  let form;
  let home;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    home = new Home(driver);
    // create a job for our test user
    test.addUser('newApplyToJobCreatorUser');
    jobCreatorId = await test.user.getId();
    jobs.push(await Test.addJob(jobCreatorId, 1, '2023-03-12'));
    // login as a user
    user = await test.loginUser('newApplyToJobUser');
    await driver.get(Test.getApp());
    const button = await home.getButton(await jobs[0].getId());
    await button.click();
    form = await driver.wait(
      until.elementLocated(By.id('applyToJobForm')),
      5000
    );
  }, 10000);

  afterEach(async () => {
    // clean up the jobs
    jobs = [];
    // delete the user
    await Test.removeUserById(jobCreatorId);
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('can be viewed from any job', async () => {
    jobs.push(await Test.addJob(jobCreatorId, 2, '2023-03-10'));
    jobs.push(await Test.addJob(await user.getId(), 4, '2023-03-10'));
    await driver.navigate().refresh();
    for (const job of jobs) {
      const button = await home.getButton(await job.getId());
      expect(await button.isDisplayed()).toBeTruthy();
    }
  });

  it('has the submit button when someone else created the request', async () => {
    await driver.navigate().refresh();
    const button = await home.getButton(await jobs[0].getId());
    expect(await button.isDisplayed()).toBeTruthy();
    expect(await button.isEnabled()).toBeTruthy();
    expect(await button.getText()).toEqual('Submit For Job');
  });

  it('has the view applications button when you created the request', async () => {
    jobs.push(await Test.addJob(await user.getId(), 4, '2023-03-10'));
    await driver.navigate().refresh();
    const button = await home.getButton(await jobs[1].getId());
    expect(await button.isDisplayed()).toBeTruthy();
    expect(await button.isEnabled()).toBeTruthy();
    expect(await button.getText()).toEqual('Select Application0');
  });

  // checks are in the methods
  // eslint-disable-next-line jest/expect-expect
  it('has the button disabled when you already applied to the request', async () => {
    await Test.addJobApplication(await jobs[0].getId(), await user.getId(), 0);
    await driver.navigate().refresh();
    await checkAlreadyApplied();
  });

  it('displays job application', async () => {
    const events = ['Wedding', "B'nai Mitzvah", 'Commercial Event', 'Other'];
    jobs.push(await Test.addJob(jobCreatorId, 2, '2024-03-10'));
    jobs.push(await Test.addJob(jobCreatorId, 3, '2025-03-10'));
    jobs.push(await Test.addJob(jobCreatorId, 4, '2026-03-10'));
    await driver.navigate().refresh();
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const button = driver.wait(
        until.elementLocated(
          By.id(`openApplyToJobButton-${await job.getId()}`)
        ),
        5000
      );
      await button.click();
      const modal = driver.wait(
        until.elementLocated(By.className('modal-dialog')),
        5000
      );
      driver.wait(until.elementIsVisible(modal), 5000);
      expect(await modal.isDisplayed()).toBeTruthy();
      expect(
        await modal.findElement(By.className('modal-title')).getText()
      ).toEqual(`Submit to work the ${events[i]} Session`);
      await driver.wait(
        // eslint-disable-next-line no-loop-func
        () =>
          driver
            .findElements(By.className('mb-3 row'))
            .then((elements) => elements.length === 14),
        // verifies that 12 elements are present, or wait fails
        5000
      );
      await modal.findElement(By.className('btn-close')).click();
    }
  });

  // checks are in the method
  // eslint-disable-next-line jest/expect-expect
  it('displays job information', async () => {
    await home.hasJobInfo(form);
  });

  it('displays profile information', async () => {
    expect(
      await (await form.findElements(By.className('mb-3 row')))[6].getText()
    ).toEqual('Your Information');

    const name = await driver.findElement(By.id('formName'));
    expect(await name.getAttribute('disabled')).toBeFalsy();
    expect(await name.getAttribute('value')).toEqual('Test User');

    const companyName = await driver.findElement(By.id('formCompany'));
    expect(await companyName.getAttribute('disabled')).toBeFalsy();
    expect(await companyName.getAttribute('value')).toEqual('');

    const website = await driver.findElement(By.id('formWebsite'));
    expect(await website.getAttribute('disabled')).toBeFalsy();
    expect(await website.getAttribute('value')).toEqual('');

    const insta = await driver.findElement(By.id('formInstagramLink'));
    expect(await insta.getAttribute('disabled')).toBeFalsy();
    expect(await insta.getAttribute('value')).toEqual('');

    const fb = await driver.findElement(By.id('formFacebookLink'));
    expect(await fb.getAttribute('disabled')).toBeFalsy();
    expect(await fb.getAttribute('value')).toEqual('');

    const experience = await driver.findElement(By.id('formExperience'));
    expect(await experience.getAttribute('disabled')).toBeFalsy();
    expect(await experience.getAttribute('value')).toEqual('');

    // TODO - experience/skills - pull from profile

    const galleryDescription = await driver.findElement(
      By.id('galleryDescription-0')
    );
    expect(await galleryDescription.getAttribute('disabled')).toBeFalsy();
    expect(await galleryDescription.getAttribute('value')).toEqual('');

    const galleryLink = await driver.findElement(By.id('galleryLink-0'));
    expect(await galleryLink.getAttribute('disabled')).toBeFalsy();
    expect(await galleryLink.getAttribute('value')).toEqual('');
  });

  it('displays filled out profile information', async () => {
    await Test.setUpProfile(
      await user.getId(),
      'Company',
      'https://website.com',
      'https://instagram.com',
      'https://facebook.com',
      'Experience',
      [
        { name: 'Camera', value: 1, what: 'some camera' },
        { value: 3, name: 'Lights', what: 'Some lights' },
      ],
      [{ value: 5 }],
      [{ description: 'some link', link: 'https://link.com' }]
    );
    await driver.navigate().refresh();
    await driver.wait(
      until.elementLocated(
        By.id(`openApplyToJobButton-${await jobs[0].getId()}`),
        5000
      )
    );
    await driver
      .findElement(By.id(`openApplyToJobButton-${await jobs[0].getId()}`))
      .click();
    form = await driver.wait(
      until.elementLocated(By.id('applyToJobForm')),
      5000
    );
    expect(
      await (await form.findElements(By.className('mb-3 row')))[6].getText()
    ).toEqual('Your Information');

    const name = await driver.findElement(By.id('formName'));
    expect(await name.getAttribute('disabled')).toBeFalsy();
    expect(await name.getAttribute('value')).toEqual('Test User');

    const companyName = await driver.findElement(By.id('formCompany'));
    expect(await companyName.getAttribute('disabled')).toBeFalsy();
    expect(await companyName.getAttribute('value')).toEqual('Company');

    const website = await driver.findElement(By.id('formWebsite'));
    expect(await website.getAttribute('disabled')).toBeFalsy();
    expect(await website.getAttribute('value')).toEqual('https://website.com');

    const insta = await driver.findElement(By.id('formInstagramLink'));
    expect(await insta.getAttribute('disabled')).toBeFalsy();
    expect(await insta.getAttribute('value')).toEqual('https://instagram.com');

    const fb = await driver.findElement(By.id('formFacebookLink'));
    expect(await fb.getAttribute('disabled')).toBeFalsy();
    expect(await fb.getAttribute('value')).toEqual('https://facebook.com');

    const experience = await driver.findElement(By.id('formExperience'));
    expect(await experience.getAttribute('disabled')).toBeFalsy();
    expect(await experience.getAttribute('value')).toEqual('Experience');

    // TODO - experience/skills - pull from profile

    const galleryDescription0 = await driver.findElement(
      By.id('galleryDescription-0')
    );
    expect(await galleryDescription0.getAttribute('disabled')).toBeFalsy();
    expect(await galleryDescription0.getAttribute('value')).toEqual(
      'some link'
    );

    const galleryLink0 = await driver.findElement(By.id('galleryLink-0'));
    expect(await galleryLink0.getAttribute('disabled')).toBeFalsy();
    expect(await galleryLink0.getAttribute('value')).toEqual(
      'https://link.com'
    );

    const galleryDescription1 = await driver.findElement(
      By.id('galleryDescription-1')
    );
    expect(await galleryDescription1.getAttribute('disabled')).toBeFalsy();
    expect(await galleryDescription1.getAttribute('value')).toEqual('');

    const galleryLink1 = await driver.findElement(By.id('galleryLink-1'));
    expect(await galleryLink1.getAttribute('disabled')).toBeFalsy();
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
    expect(await galleryDescription1.getAttribute('disabled')).toBeFalsy();
    expect(await galleryDescription1.getAttribute('value')).toEqual('');

    const galleryLink1 = await driver.findElement(By.id('galleryLink-1'));
    expect(await galleryLink1.getAttribute('disabled')).toBeFalsy();
    expect(await galleryLink1.getAttribute('value')).toEqual('');

    await applyForJob();
  });

  it('can not be submitted if name is missing', async () => {
    const name = await driver.findElement(By.id('formName'));
    await name.clear();
    const applyLink = await driver.findElement(By.id('applyToJobButton'));
    await applyLink.click();
    const feedbacks = await form.findElements(By.css('.invalid-feedback'));
    expect(feedbacks).toHaveLength(18);
    for (let i = 0; i < feedbacks.length; i++) {
      if (i === 9) {
        expect(await feedbacks[i].isDisplayed()).toBeTruthy();
        expect(await feedbacks[i].getText()).toEqual(
          'Please provide a valid name.'
        );
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
    const applyLink = await driver.findElement(By.id('applyToJobButton'));
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual('Website must be a valid URL');
  });

  it('gets rejected with bad insta value', async () => {
    const insta = await driver.findElement(By.id('formInstagramLink'));
    await insta.sendKeys('somebadurl');
    const applyLink = await driver.findElement(By.id('applyToJobButton'));
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual('Instagram Link must be a valid URL');
  });

  it('gets rejected with bad fb value', async () => {
    const fb = await driver.findElement(By.id('formFacebookLink'));
    await fb.sendKeys('somebadurl');
    const applyLink = await driver.findElement(By.id('applyToJobButton'));
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
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
    const applyLink = await driver.findElement(By.id('applyToJobButton'));
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual('Portfolio Link must be a valid URL');
  });

  async function applyForJob() {
    const applyLink = await driver.findElement(By.id('applyToJobButton'));
    await applyLink.click();
    expect(await applyLink.isEnabled()).toBeFalsy();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await alert.getText()).toEqual('Job Filing Submitted');
    await driver.wait(
      () =>
        driver
          .findElements(By.css('.modal-header'))
          .then((elements) => elements.length === 0),
      6000
    );
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
    await checkAlreadyApplied();
  }

  async function checkAlreadyApplied() {
    let button = await home.getButton(await jobs[0].getId());
    await driver.wait(until.elementIsDisabled(button), 5000);
    button = await home.getButton(await jobs[0].getId());
    expect(await button.isDisplayed()).toBeTruthy();
    expect(await button.isEnabled()).toBeFalsy();
    expect(await button.getText()).toEqual('Already Applied');
  }
});
