/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
const Home = require('./common/Home');
require('chromedriver');

describe('apply to job', () => {
  jest.setTimeout(20000);
  let test;
  let driver;
  let jobCreatorId;
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
    // create a job for our test user
    test.addUser('chooseJobApplicationJobCreatorUser');
    jobCreatorId = await test.user.getId();
    // login as a user
    user = await test.loginUser('chooseJobApplicationUser');
    // generate the required data
    jobs.push(await Test.addJob(await user.getId(), 1, '2024-03-12'));
    applicationsForJobs.push(
      await Test.addJobApplication(await jobs[0].getId(), jobCreatorId, 0)
    );
    applicationsForJobs.push(
      await Test.addFullJobApplication(await jobs[0].getId(), jobCreatorId, 0)
    );
    // load the main page
    await test.applyAllFilters();
    await driver.get(Test.getApp());
    const button = await home.getButton(await jobs[0].getId());
    await button.click();
    form = await driver.wait(
      until.elementLocated(By.id('compareJobApplicationsForm')),
      5000
    );
    await driver.wait(
      until.elementLocated(
        By.css(
          `[data-testid="jobApplication-${await applicationsForJobs[1].getId()}"]`
        )
      )
    );
  }, 10000);

  afterEach(async () => {
    // clean up the jobs
    jobs = [];
    // clean up the applications for jobs
    applicationsForJobs = [];
    // delete the user
    await Test.removeUserById(jobCreatorId);
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('opens the modal when clicked @network @accessibility', async () => {
    const modal = driver.wait(
      until.elementLocated(By.className('modal-dialog')),
      5000
    );
    driver.wait(until.elementIsVisible(modal), 5000);
    expect(await modal.isDisplayed()).toBeTruthy();
    expect(
      await modal.findElement(By.className('modal-title')).getText()
    ).toEqual('Applications for the Wedding Session');
    const rows = await modal.findElements(By.className('mb-3 row'));
    expect(rows).toHaveLength(17);
    await modal.findElement(By.className('btn-close')).click();
    await test.waitUntilNotPresent(By.className('modal-dialog'));
    expect(
      await driver.findElements(By.className('modal-dialog'))
    ).toHaveLength(0);
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
        By.name(`job-applications-${await jobs[0].getId()}`)
      )
    ).toHaveLength(2);

    expect(
      await accordion
        .findElement(
          By.css(
            `[aria-label="job-application-${await applicationsForJobs[0].getId()}"]`
          )
        )
        .isDisplayed()
    ).toBeTruthy();
    const avatar = accordion.findElement(By.className('circle'));
    await driver.wait(until.elementTextIs(avatar, 'TU'), 5000);
    expect(await avatar.getText()).toEqual('TU');
    expect(
      await accordion
        .findElement(
          By.id(`job-application-${await applicationsForJobs[0].getId()}-name`)
        )
        .getText()
    ).toEqual('Test User');
    expect(
      await accordion
        .findElement(
          By.id(
            `job-application-${await applicationsForJobs[0].getId()}-company`
          )
        )
        .getText()
    ).toEqual('Company');
  });

  it('each application can be expanded @accessibility', async () => {
    const accordionBody = driver.wait(
      until.elementLocated(By.className('accordion-body'))
    );
    await driver.wait(until.elementIsNotVisible(accordionBody), 5000);
    expect(await accordionBody.isDisplayed()).toBeFalsy();
    const header = driver.findElement(By.className('accordion-header'));
    await header.click();
    await driver.wait(until.elementIsVisible(accordionBody), 5000);
    expect(await accordionBody.isDisplayed()).toBeTruthy();
    await header.click();
    await driver.wait(until.elementIsNotVisible(accordionBody), 5000);
    expect(await accordionBody.isDisplayed()).toBeFalsy();
  });

  it('empty application has expected details listed @network', async () => {
    const applicationId = await applicationsForJobs[0].getId();
    const accordion = driver.findElement(
      By.css(`[data-testid="jobApplication-${applicationId}"]`)
    );
    const icons = await accordion.findElements(By.className('icon'));
    const experience = driver.findElement(
      By.id(`job-application-${applicationId}-experience`)
    );
    const equipment = driver.findElement(
      By.id(`job-application-${applicationId}-equipment`)
    );
    const skills = driver.findElement(
      By.id(`job-application-${applicationId}-skills`)
    );
    const portfolio = driver.findElement(
      By.id(`job-application-${applicationId}-portfolio`)
    );
    // wait until it's all hidden/ready
    await driver.wait(until.elementIsNotVisible(equipment), 5000);
    expect(icons).toHaveLength(0);
    expect(await experience.getText()).toEqual('');
    expect(await equipment.getText()).toEqual('');
    expect(await skills.getText()).toEqual('');
    expect(await portfolio.getText()).toEqual('');
    // make visible
    await accordion.findElement(By.className('accordion-header')).click();
    await driver.wait(until.elementIsVisible(equipment), 5000);
    // all things are now shown
    expect(await experience.getText()).toEqual('');
    expect(await equipment.getText()).toEqual('Equipment');
    expect(await skills.getText()).toEqual('Skills');
    expect(await portfolio.getText()).toEqual('Portfolio');
  });

  it('full application has all details listed @network', async () => {
    const applicationId = await applicationsForJobs[1].getId();
    const accordion = driver.findElement(
      By.css(`[data-testid="jobApplication-${applicationId}"]`)
    );
    const icons = await accordion.findElements(By.className('icon'));
    const experience = driver.findElement(
      By.id(`job-application-${applicationId}-experience`)
    );
    const equipment = driver.findElement(
      By.id(`job-application-${applicationId}-equipment`)
    );
    const skills = driver.findElement(
      By.id(`job-application-${applicationId}-skills`)
    );
    const portfolio = driver.findElement(
      By.id(`job-application-${applicationId}-portfolio`)
    );
    // wait until it's all hidden/ready
    await driver.wait(until.elementIsNotVisible(equipment), 5000);
    expect(icons).toHaveLength(3);
    // all things initially are hidden
    for (const icon of icons) {
      await driver.wait(until.elementIsNotVisible(icon), 5000);
      expect(await icon.isDisplayed()).toBeFalsy();
    }
    expect(await experience.getText()).toEqual('');
    expect(await equipment.getText()).toEqual('');
    expect(await skills.getText()).toEqual('');
    expect(await portfolio.getText()).toEqual('');
    // make visible
    await accordion.findElement(By.className('accordion-header')).click();
    await driver.wait(until.elementIsVisible(equipment), 5000);
    // all things are now shown
    for (const icon of icons) {
      expect(await icon.isDisplayed()).toBeTruthy();
    }
    expect(await experience.getText()).toEqual('some experience');
    // kludge as this is sometimes out of order
    const equipmentText = await equipment.getText();
    expect(equipmentText).toHaveLength(45);
    expect(equipmentText).toMatch(/^Equipment\n/);
    const flashText = await driver
      .findElement(By.id(`job-application-${applicationId}-equipment-Flash`))
      .getText();
    expect(flashText).toEqual('Flash\nother things');
    const cameraText = await driver
      .findElement(By.id(`job-application-${applicationId}-equipment-Camera`))
      .getText();
    expect(cameraText).toEqual('Camera\nsomething');
    const skillText = await skills.getText();
    expect(skillText).toHaveLength(40);
    expect(skillText).toMatch(/^Skills\n/);
    expect(skillText).toMatch(/Off Camera Flash/);
    expect(skillText).toMatch(/Solo Photography/);
    // kludge as this is sometimes out of order
    const portfolioText = await portfolio.getText();
    expect(portfolioText).toHaveLength(51);
    expect(portfolioText).toMatch(/^Portfolio\n/);
    expect(
      await portfolio
        .findElement(By.linkText('description 1'))
        .getAttribute('href')
    ).toEqual('http://link1.com/');
    expect(
      await portfolio
        .findElement(By.linkText('description 2'))
        .getAttribute('href')
    ).toEqual('http://link2.com/');
    expect(
      await portfolio
        .findElement(By.linkText('description 3'))
        .getAttribute('href')
    ).toEqual('http://link3.com/');
  });

  it('unable to submit without choosing an application @network @accessibility', async () => {
    const applyLink = await driver.findElement(
      By.id('selectJobApplicationButton')
    );
    await applyLink.click();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-danger')),
      5000
    );
    expect(await alert.getText()).toEqual('Please select an application');
  });

  it('selecting an application reloads the page @network @accessibility', async () => {
    await driver
      .findElement(
        By.css(
          `input[aria-label="job-application-${await applicationsForJobs[0].getId()}"]`
        )
      )
      .click();
    const applyLink = await driver.findElement(
      By.id('selectJobApplicationButton')
    );
    await applyLink.click();
    await driver.wait(until.elementIsDisabled(applyLink), 5000);
    expect(await applyLink.isEnabled()).toBeFalsy();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-success')),
      5000
    );
    expect(await alert.getText()).toEqual('Job Application Chosen');
    await driver.wait(
      () =>
        driver
          .findElements(By.css('.modal-header'))
          .then((elements) => elements.length === 0),
      6000
    );
    expect(await driver.findElements(By.css('.modal-header'))).toHaveLength(0);
  });

  it("no longer shows the application once it's been applied to", async () => {
    await driver
      .findElement(
        By.css(
          `input[aria-label="job-application-${await applicationsForJobs[0].getId()}"]`
        )
      )
      .click();
    const applyLink = await driver.findElement(
      By.id('selectJobApplicationButton')
    );
    await applyLink.click();
    await driver.wait(
      async () =>
        driver
          .findElements(
            By.css(
              `input[aria-label="job-application-${await applicationsForJobs[0].getId()}"]`
            )
          )
          .then((elements) => elements.length === 0),
      6000
    );
    expect(
      await driver.findElements(
        By.css(
          `input[aria-label="job-application-${await applicationsForJobs[0].getId()}"]`
        )
      )
    ).toHaveLength(0);
  });
});
