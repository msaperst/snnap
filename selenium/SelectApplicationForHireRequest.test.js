/* eslint-disable no-await-in-loop,no-restricted-syntax */
const { until, By } = require('selenium-webdriver');
const Test = require('./common/Test');
const Home = require('./common/Home');

describe('apply to request to hire', () => {
  jest.setTimeout(15000);
  let test;
  let driver;
  let user;
  const company = { id: 0 };
  let requestToHires = [];
  let applicationsForRequestToHires = [];
  let form;
  let home;

  beforeEach(async () => {
    test = new Test();
    // load the default page
    driver = await test.getDriver();
    home = new Home(driver);
    // login as a user
    user = await test.loginUser('chooseRequestToHireApplicationUser');
    // generate the required data
    requestToHires.push(
      await Test.addRequestToHire(await user.getId(), 1, '2023-03-12')
    );
    applicationsForRequestToHires.push(
      await Test.addApplicationForRequestToHire(
        await requestToHires[0].getId(),
        0,
        0
      )
    );
    applicationsForRequestToHires.push(
      await Test.addFullApplicationForRequestToHire(
        await requestToHires[0].getId(),
        0,
        0
      )
    );
    // load the main page
    await driver.get(Test.getApp());
    const button = await home.getButton(await requestToHires[0].getId());
    await button.click();
    form = await driver.wait(
      until.elementLocated(By.id('compareHireRequestApplicationsForm'))
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
  it('displays hire request information', async () => {
    await home.hasHireRequestInfo(form);
  });

  it('has all of the applications listed', async () => {
    const accordion = driver.findElement(By.className('accordion'));
    expect(
      await accordion.findElements(By.className('accordion-item'))
    ).toHaveLength(2);
    expect(
      await driver.findElements(
        By.name(`hireRequestApplications-${await requestToHires[0].getId()}`)
      )
    ).toHaveLength(2);

    expect(
      await accordion
        .findElement(
          By.css(
            `[aria-label="hireRequestApplication-${await applicationsForRequestToHires[0].getId()}"]`
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
    driver.wait(until.elementIsVisible(accordianBody));
    expect(await accordianBody.isDisplayed()).toBeTruthy();
    await header.click();
    driver.wait(until.elementIsNotVisible(accordianBody));
    expect(await accordianBody.isDisplayed()).toBeFalsy();
  });

  it('empty application has expected details listed', async () => {
    const accordion = driver.findElement(
      By.css(
        `[data-testid="hireRequestApplication-${await applicationsForRequestToHires[0].getId()}"]`
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
    driver.wait(until.elementIsVisible(avatar));
    // all things are now shown
    expect(await avatar.isDisplayed()).toBeTruthy();
    expect(await rows[1].getText()).toEqual('');
    expect(await rows[2].getText()).toEqual('');
    expect(await rows[3].getText()).toEqual('');
  });

  it('full application has all details listed', async () => {
    const accordion = driver.findElement(
      By.css(
        `[data-testid="hireRequestApplication-${await applicationsForRequestToHires[1].getId()}"]`
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
    driver.wait(until.elementIsVisible(avatar));
    // all things are now shown
    expect(await avatar.isDisplayed()).toBeTruthy();
    for (const icon of icons) {
      expect(await icon.isDisplayed()).toBeTruthy();
    }
    await Test.sleep(500);
    expect(await rows[1].getText()).toEqual('some experience');
    expect(await rows[2].getText()).toEqual(
      'Equipment\n' +
        'Flash: other things\n' +
        'Camera: something\n' +
        'Skills\n' +
        'Retouch\n' +
        'Photography'
    );
    expect(await rows[3].getText()).toEqual(
      'description 3\ndescription 1\ndescription 2'
    );
  });

  it('unable to submit without choosing an application', async () => {
    const applyLink = await driver.findElement(
      By.id('selectRequestToHireApplicationButton')
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
          `input[aria-label="hireRequestApplication-${await applicationsForRequestToHires[0].getId()}"]`
        )
      )
      .click();
    const applyLink = await driver.findElement(
      By.id('selectRequestToHireApplicationButton')
    );
    await applyLink.click();
    expect(await applyLink.isEnabled()).toBeFalsy();
    const alert = await driver.wait(
      until.elementLocated(By.className('alert-success'))
    );
    expect(await alert.getText()).toEqual('Hire Request Application Chosen');
    driver.wait(() =>
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
          `input[aria-label="hireRequestApplication-${await applicationsForRequestToHires[0].getId()}"]`
        )
      )
      .click();
    const applyLink = await driver.findElement(
      By.id('selectRequestToHireApplicationButton')
    );
    await applyLink.click();
    await driver.wait(until.elementLocated(By.className('alert-success')));
    await driver.wait(async () =>
      driver
        .findElements(
          By.css(
            `input[aria-label="hireRequestApplication-${await applicationsForRequestToHires[0].getId()}"]`
          )
        )
        .then((elements) => elements.length === 0)
    );
    expect(
      await driver.findElements(
        By.css(
          `input[aria-label="hireRequestApplication-${await applicationsForRequestToHires[0].getId()}"]`
        )
      )
    ).toHaveLength(0);
  });
});
