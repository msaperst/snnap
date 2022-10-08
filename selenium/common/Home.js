const { until, By } = require('selenium-webdriver');

class Home {
  constructor(driver) {
    this.driver = driver;
  }

  async getButton(jobId) {
    await this.driver.wait(
      until.elementLocated(By.css(`button[job="${jobId}"]`))
    );
    return this.driver.findElement(By.css(`button[job="${jobId}"]`));
  }

  async hasJobInfo(form) {
    expect(
      await (await form.findElements(By.className('mb-3 row')))[0].getText()
    ).toEqual('Job Information');

    const jobType = await this.driver.findElement(By.id('formJobType'));
    expect(await jobType.getAttribute('disabled')).toBeTruthy();
    expect(await jobType.getAttribute('value')).toEqual('Wedding');

    const date = await this.driver.findElement(By.id('formDate'));
    expect(await date.getAttribute('disabled')).toBeTruthy();
    expect(await date.getAttribute('value')).toEqual('Sunday, March 12, 2023');

    const duration = await this.driver.findElement(By.id('formDuration'));
    expect(await duration.getAttribute('disabled')).toBeTruthy();
    expect(await duration.getAttribute('value')).toEqual('4 hours');

    const location = await this.driver.findElement(By.id('formCity'));
    expect(await location.getAttribute('disabled')).toBeTruthy();
    expect(await location.getAttribute('value')).toEqual('Chantilly, VA');

    const pay = await this.driver.findElement(By.id('formPay'));
    expect(await pay.getAttribute('disabled')).toBeTruthy();
    expect(await pay.getAttribute('value')).toEqual('$200 per hour');

    const details = await this.driver.findElement(By.id('formJobDetails'));
    expect(await details.getAttribute('disabled')).toBeTruthy();
    expect(await details.getAttribute('value')).toEqual('Some details');

    const equipment = await this.driver.findElement(By.id('formEquipment'));
    expect(await equipment.getAttribute('disabled')).toBeTruthy();
    expect(await equipment.getAttribute('value')).toEqual('');

    const skills = await this.driver.findElement(By.id('formSkills'));
    expect(await skills.getAttribute('disabled')).toBeTruthy();
    expect(await skills.getAttribute('value')).toEqual('');
  }
}

module.exports = Home;
