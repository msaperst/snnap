/* eslint-disable no-await-in-loop */
const { By, until } = require('selenium-webdriver');
const Test = require('./common/Test');
require('chromedriver');

describe('profile page', () => {
  jest.setTimeout(20000);

  let test;
  let driver;
  let jobCreatorId;
  let jobs;

  beforeEach(async () => {
    test = new Test();
    jobs = [];
    // load the default page
    driver = await test.getDriver();
    // create a job for our test user
    test.addUser('rateJobCreatorUser');
    jobCreatorId = await test.user.getId();
    jobs.push(await Test.addJob(jobCreatorId, 1, '2022-03-12'));
    jobs.push(await Test.addJob(jobCreatorId, 1, '2030-03-12'));
    // login as a user
    await test.loginUser('rateUser');
  }, 10000);

  afterEach(async () => {
    // delete the user
    await Test.removeUserById(jobCreatorId);
    await test.removeUser();
    // close the driver
    await test.cleanUp();
  }, 15000);

  it('does not display a rating modal when a job date is today or prior', async () => {
    await test.addRating(jobs[1], jobCreatorId);
    await driver.get(`${Test.getApp()}/`);
    await Test.sleep(1000);
    expect(
      await driver.findElements(By.css('[data-testid="rateModal"]'))
    ).toHaveLength(0);
  });

  it('does displays a rating modal when a job date is after today', async () => {
    const ratingModal = await waitForRatingModal();
    expect(await ratingModal.getText()).toEqual(
      'Please Rate Your Experience\n' +
        'We hope working with Test User on the Wedding was a good experience. Please let us know if you would work with them again.\n' +
        "I didn't work this job"
    );
  });

  it('can be dismissed, but will pop back up on new page load', async () => {
    let ratingModal = await waitForRatingModal();
    await ratingModal.findElement(By.css('.btn-close')).click();
    await test.waitUntilNotPresent(By.css('[data-testid="rateModal"]'));
    await driver.navigate().refresh();
    ratingModal = await driver.wait(
      until.elementLocated(By.css('[data-testid="rateModal"]')),
      5000
    );
    expect(await ratingModal.isDisplayed()).toBeTruthy();
  });

  it('clicking thumbs up sends a positive rating', async () => {
    const ratingModal = await waitForRatingModal();
    await ratingModal
      .findElement(
        By.css(`[data-testid="rate-job-${await jobs[0].getId()}-good"]`)
      )
      .click();
    const alert = await driver.wait(
      until.elementLocated(By.css('.alert-success')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'Thank you for submitting your rating.'
    );
    await test.waitUntilNotPresent(By.css('[data-testid="rateModal"]'));
    await driver.navigate().refresh();
    await Test.sleep(1000);
    expect(
      await driver.findElements(By.css('[data-testid="rateModal"]'))
    ).toHaveLength(0);
  });

  it('clicking thumbs down sends a negative rating', async () => {
    const ratingModal = await waitForRatingModal();
    await ratingModal
      .findElement(
        By.css(`[data-testid="rate-job-${await jobs[0].getId()}-bad"]`)
      )
      .click();
    const alert = await driver.wait(
      until.elementLocated(By.css('.alert-success')),
      5000
    );
    expect(await alert.getText()).toEqual(
      'Thank you for submitting your rating.'
    );
    await test.waitUntilNotPresent(By.css('[data-testid="rateModal"]'));
    await driver.navigate().refresh();
    await Test.sleep(1000);
    expect(
      await driver.findElements(By.css('[data-testid="rateModal"]'))
    ).toHaveLength(0);
  });

  it('clicking i did not work sends no rating', async () => {
    const ratingModal = await waitForRatingModal();
    await ratingModal.findElement(By.css('.btn-link')).click();
    const alert = await driver.wait(
      until.elementLocated(By.css('.alert-success')),
      5000
    );
    expect(await alert.getText()).toEqual('Thank you letting us know.');
    await test.waitUntilNotPresent(By.css('[data-testid="rateModal"]'));
    await driver.navigate().refresh();
    await Test.sleep(1000);
    expect(
      await driver.findElements(By.css('[data-testid="rateModal"]'))
    ).toHaveLength(0);
  });

  it('takes you to the user profile when clicked', async () => {
    const ratingModal = await waitForRatingModal();
    await ratingModal.findElement(By.linkText('Test User')).click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/profile/rateJobCreatorUser`
    );
    expect(await ratingModal.isDisplayed()).toBeTruthy();
  });

  it('takes you to the job posting when clicked', async () => {
    const ratingModal = await waitForRatingModal();
    await ratingModal.findElement(By.linkText('the Wedding')).click();
    expect(await driver.getCurrentUrl()).toEqual(
      `${Test.getApp()}/jobs#${await jobs[0].getId()}`
    );
    expect(await ratingModal.isDisplayed()).toBeTruthy();
  });

  it('gives a plus mark on a user after submitting 5 positive reviews', async () => {
    for (let i = 0; i < 5; i++) {
      await waitForRatingModal();
      const thumbsUp = await driver.wait(
        until.elementLocated(
          By.css(`[data-testid="rate-job-${await jobs[0].getId()}-good"]`)
        )
      );
      await thumbsUp.click();
      await test.waitUntilNotPresent(By.css('[data-testid="rateModal"]'));
    }
    await driver.get(`${Test.getApp()}/profile/rateJobCreatorUser`);
    const rating = driver.wait(until.elementLocated(By.css('.rating title')));
    expect(await rating.getText()).toEqual('Thumbs Up');
  });

  async function waitForRatingModal() {
    await test.addRating(jobs[0], jobCreatorId);
    await driver.get(`${Test.getApp()}/`);
    return driver.wait(
      until.elementLocated(By.css('[data-testid="rateModal"]')),
      5000
    );
  }
});
