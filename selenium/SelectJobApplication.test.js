/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
const Home = require('./common/Home');
require('chromedriver');

describe('apply to job', () => {
  jest.setTimeout(20000);
  let test;
  let driver;
  let user;
  let jobs = [];
  let applicationsForJobs = [];
  let form;
  let home;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    home = new Home(driver);
    // login as a user
    user = await test.loginUser('chooseJobApplicationUser');
    // generate the required data
    jobs.push(await Test.addJob(await user.getId(), 1, '2023-03-12'));
    applicationsForJobs.push(
      await Test.addJobApplication(await jobs[0].getId(), 0, 0)
    );
    applicationsForJobs.push(
      await Test.addFullJobApplication(await jobs[0].getId(), 0, 0)
    );
    // load the main page
    await driver.get(Test.getApp());
    const button = await home.getButton(await jobs[0].getId());
    await button.click();
    form = await driver.wait(
      until.elementLocated(By.id('compareJobApplicationsForm'))
    );
  }, 10000);

  afterEach(async () => {
    // clean up the jobs
    jobs = [];
    // clean up the applications for jobs
    applicationsForJobs = [];
    // delete the user
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('opens the modal when clicked', async () => {
    const modal = driver.wait(
      until.elementLocated(By.className('modal-dialog'))
    );
    driver.wait(until.elementIsVisible(modal));
    expect(await modal.isDisplayed()).toBeTruthy();
    expect(
      await modal.findElement(By.className('modal-title')).getText()
    ).toEqual('Applications for the Wedding Session');
    const rows = await modal.findElements(By.className('mb-3 row'));
    expect(rows).toHaveLength(7);
    await modal.findElement(By.className('btn-close')).click();
  });

  // checks are in the method
  // eslint-disable-next-line jest/expect-expect
  it('displays job information', async () => {
    await home.hasJobInfo(form);
  });

  it('has all of the applications listed', async () => {
    const accordion = driver.findElement(By.className('accordion'));
    expect(
      await accordion.findElements(By.className('accordion-item'))
    ).toHaveLength(2);
    expect(
      await driver.findElements(
        By.name(`jobApplications-${await jobs[0].getId()}`)
      )
    ).toHaveLength(2);

    expect(
      await accordion
        .findElement(
          By.css(
            `[aria-label="jobApplication-${await applicationsForJobs[0].getId()}"]`
          )
        )
        .isDisplayed()
    ).toBeTruthy();
    expect(
      await accordion.findElement(By.className('col-md-5')).getText()
    ).toEqual('Test User');
    expect(
      await accordion.findElement(By.className('col-md-6')).getText()
    ).toEqual('Company');
  });

  it('each application can be expanded', async () => {
    const accordianBody = driver.findElement(By.className('accordion-body'));
    expect(await accordianBody.isDisplayed()).toBeFalsy();
    const header = driver.findElement(By.className('accordion-header'));
    await header.click();
    await driver.wait(until.elementIsVisible(accordianBody));
    expect(await accordianBody.isDisplayed()).toBeTruthy();
    await header.click();
    await driver.wait(until.elementIsNotVisible(accordianBody));
    expect(await accordianBody.isDisplayed()).toBeFalsy();
  });

  it('empty application has expected details listed', async () => {
    const accordion = driver.findElement(
      By.css(
        `[data-testid="jobApplication-${await applicationsForJobs[0].getId()}"]`
      )
    );
    const rows = await accordion.findElements(By.className('mt-3 row'));
    expect(rows).toHaveLength(4);
    const avatar = accordion.findElement(By.className('circle'));
    const icons = await accordion.findElements(By.className('icon'));
    expect(icons).toHaveLength(0);
    expect(await rows[1].getText()).toEqual('');
    expect(await rows[2].getText()).toEqual('');
    expect(await rows[3].getText()).toEqual('');
    // all things initially are hidden
    expect(await avatar.isDisplayed()).toBeFalsy();
    // make visible
    await accordion.findElement(By.className('accordion-header')).click();
    await driver.wait(until.elementIsVisible(avatar));
    // all things are now shown
    expect(await avatar.isDisplayed()).toBeTruthy();
    expect(await rows[1].getText()).toEqual('');
    expect(await rows[2].getText()).toEqual('Equipment\nSkills');
    expect(await rows[3].getText()).toEqual('');
  });

  it('full application has all details listed', async () => {
    const accordion = driver.findElement(
      By.css(
        `[data-testid="jobApplication-${await applicationsForJobs[1].getId()}"]`
      )
    );
    const rows = await accordion.findElements(By.className('mt-3 row'));
    expect(rows).toHaveLength(4);
    const avatar = accordion.findElement(By.className('circle'));
    const icons = await accordion.findElements(By.className('icon'));
    expect(icons).toHaveLength(3);
    // all things initially are hidden
    expect(await avatar.isDisplayed()).toBeFalsy();
    for (const icon of icons) {
      expect(await icon.isDisplayed()).toBeFalsy();
    }
    expect(await rows[1].getText()).toEqual('');
    expect(await rows[2].getText()).toEqual('');
    expect(await rows[3].getText()).toEqual('');
    // make visible
    await accordion.findElement(By.className('accordion-header')).click();
    await driver.wait(until.elementIsVisible(avatar));
    // all things are now shown
    expect(await avatar.isDisplayed()).toBeTruthy();
    for (const icon of icons) {
      expect(await icon.isDisplayed()).toBeTruthy();
    }
    await Test.sleep(500);
    expect(await rows[1].getText()).toEqual('some experience');
    // kludge as this is sometimes out of order
    const equipmentSkillText = await rows[2].getText();
    expect(equipmentSkillText).toHaveLength(74);
    expect(equipmentSkillText).toMatch(/^Equipment\n/);
    expect(equipmentSkillText).toMatch(/Flash: other things\n/);
    expect(equipmentSkillText).toMatch(/Camera: something\n/);
    expect(equipmentSkillText).toMatch(/Skills\n/);
    expect(equipmentSkillText).toMatch(/Retouch/);
    expect(equipmentSkillText).toMatch(/Photography/);
    // kludge as this is sometimes out of order
    const descriptionText = await rows[3].getText();
    expect(descriptionText).toHaveLength(41);
    expect(descriptionText).toMatch(/description 1/);
    expect(descriptionText).toMatch(/description 2/);
    expect(descriptionText).toMatch(/description 3/);
  });

  it('unable to submit without choosing an application', async () => {
    const applyLink = await driver.findElement(
      By.id('selectJobApplicationButton')
    );
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger'))
    );
    expect(await alert.getText()).toEqual('Please select an application');
  });

  it('selecting an application reloads the page', async () => {
    await driver
      .findElement(
        By.css(
          `input[aria-label="jobApplication-${await applicationsForJobs[0].getId()}"]`
        )
      )
      .click();
    const applyLink = await driver.findElement(
      By.id('selectJobApplicationButton')
    );
    await applyLink.click();
    await driver.wait(until.elementIsDisabled(applyLink));
    expect(await applyLink.isEnabled()).toBeFalsy();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await alert.getText()).toEqual('Job Application Chosen');
    await driver.wait(() =>
      driver
        .findElements(By.css('.modal-header'))
        .then((elements) => elements.length === 0)
    );
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
  });

  it("no longer shows the application once it's been applied to", async () => {
    await driver
      .findElement(
        By.css(
          `input[aria-label="jobApplication-${await applicationsForJobs[0].getId()}"]`
        )
      )
      .click();
    const applyLink = await driver.findElement(
      By.id('selectJobApplicationButton')
    );
    await applyLink.click();
    await driver.wait(until.elementLocated(By.className('alert-success')));
    await driver.wait(async () =>
      driver
        .findElements(
          By.css(
            `input[aria-label="jobApplication-${await applicationsForJobs[0].getId()}"]`
          )
        )
        .then((elements) => elements.length === 0)
    );
    expect(
      await driver.findElements(
        By.css(
          `input[aria-label="jobApplication-${await applicationsForJobs[0].getId()}"]`
        )
      )
    ).toHaveLength(0);
  });
});
