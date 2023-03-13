const { until, By } = require('selenium-webdriver');

class Home {
  constructor(driver) {
    this.driver = driver;
  }

  async getButton(jobId) {
    return this.driver.wait(
      until.elementLocated(By.css(`button[job="${jobId}"]`)),
      5000
    );
  }

  async hasJobInfo(form) {
    const rows = await form.findElements(By.className('mb-3 row'));
    await this.driver.wait(
      until.elementTextIs(rows[0], 'Job Information'),
      5000
    );
    expect(await rows[0].getText()).toEqual('Job Information');

    const jobType = await this.driver.findElement(By.id('formJobType'));
    expect(await jobType.getAttribute('disabled')).toBeTruthy();
    expect(await jobType.getAttribute('value')).toEqual('Wedding');

    const jobSubtype = await this.driver.findElement(By.id('formLookingFor'));
    expect(await jobSubtype.getAttribute('disabled')).toBeTruthy();
    expect(await jobSubtype.getAttribute('value')).toEqual(
      'Second Photographer'
    );

    const location = await this.driver.findElement(By.id('formCity'));
    expect(await location.getAttribute('disabled')).toBeTruthy();
    expect(await location.getAttribute('value')).toEqual('Chantilly, VA');

    const date = await this.driver.findElement(By.id('formDate'));
    expect(await date.getAttribute('disabled')).toBeTruthy();
    expect(await date.getAttribute('value')).toEqual('Sunday, March 12, 2024');

    const equipment = await this.driver.findElement(
      By.id('formDesiredEquipment')
    );
    expect(await equipment.getAttribute('disabled')).toBeTruthy();
    expect(await equipment.getAttribute('value')).toEqual(' ');

    const skills = await this.driver.findElement(By.id('formSkillsRequired'));
    expect(await skills.getAttribute('disabled')).toBeTruthy();
    expect(await skills.getAttribute('value')).toEqual(' ');

    const details = await this.driver.findElement(By.id('formJobDetails'));
    expect(await details.getAttribute('disabled')).toBeTruthy();
    expect(await details.getAttribute('value')).toEqual('Some details');

    const duration = await this.driver.findElement(By.id('formDuration'));
    expect(await duration.getAttribute('disabled')).toBeTruthy();
    expect(await duration.getAttribute('value')).toEqual('4 hours');

    const pay = await this.driver.findElement(By.id('formPay'));
    expect(await pay.getAttribute('disabled')).toBeTruthy();
    expect(await pay.getAttribute('value')).toEqual('$200 per hour');
  }
}

module.exports = Home;
