const db = require('mysql');
const Mysql = require('../../services/Mysql');
const Email = require('../../services/Email');

const Job = class {
  constructor(id) {
    this.id = parseInt(id, 10);
  }

  static create(
    user,
    type,
    location,
    details,
    pay,
    duration,
    durationMax,
    date,
    equipment,
    skills
  ) {
    const newJob = new Job();
    newJob.instancePromise = (async () => {
      const dateTime = `${date} 00:00:00`;
      const result = await Mysql.query(
        `INSERT INTO jobs (user, type, details, pay, duration, durationMax, date_time, loc, lat, lon) VALUES (${parseInt(
          user,
          10
        )}, ${parseInt(type, 10)}, ${db.escape(details)}, ${parseFloat(
          pay
        )}, ${parseInt(duration, 10)}, ${
          durationMax ? parseInt(durationMax, 10) : null
        }, ${db.escape(dateTime)}, ${db.escape(location.loc)}, ${parseFloat(
          location.lat
        )},${parseFloat(location.lon)});`
      );
      equipment.map(async (equip) => {
        await Mysql.query(
          `INSERT INTO job_equipment (job, equipment) VALUES (${
            result.insertId
          }, ${parseInt(equip.value, 10)});`
        );
      });
      skills.map(async (skill) => {
        await Mysql.query(
          `INSERT INTO job_skills (job, skill) VALUES (${
            result.insertId
          }, ${parseInt(skill.value, 10)});`
        );
      });
      newJob.id = result.insertId;
      newJob.type = type;
      newJob.location = location;
    })();
    return newJob;
  }

  async getId() {
    await this.instancePromise;
    return this.id;
  }

  async getType() {
    await this.instancePromise;
    return this.type;
  }

  async getLocation() {
    await this.instancePromise;
    return this.location;
  }

  static async getJobs() {
    return Mysql.query(
      `SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.date_time > NOW() AND jobs.application_selected IS NULL ORDER BY jobs.date_time;`
    );
  }

  static async getUserJobs(user) {
    return Mysql.query(
      `SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.user = ${parseInt(
        user,
        10
      )} ORDER BY jobs.date_time;`
    );
  }

  static async getEquipment() {
    return Mysql.query(`SELECT * FROM equipment ORDER BY name;`);
  }

  static async getSkills() {
    return Mysql.query(`SELECT * FROM skills ORDER BY name;`);
  }

  static async getJobTypes() {
    const jobTypes = await Mysql.query(
      `SELECT * FROM job_types ORDER BY type;`
    );
    let i = 0;
    for (i; i < jobTypes.length; i++) {
      if (jobTypes[i].type === 'Other') {
        break;
      }
    }
    const other = jobTypes.splice(i, 1);
    return [...jobTypes, ...other];
  }

  async getInfo() {
    await this.instancePromise;
    const job = (
      await Mysql.query(
        `SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.id = ${this.id};`
      )
    )[0];
    if (job) {
      job.equipment = await Mysql.query(
        `SELECT equipment.id as value, equipment.name FROM job_equipment INNER JOIN equipment ON equipment.id = job_equipment.equipment WHERE job = ${this.id};`
      );
      job.skills = await Mysql.query(
        `SELECT skills.id as value, skills.name FROM job_skills INNER JOIN skills ON skills.id = job_skills.skill WHERE job = ${this.id};`
      );
    }
    return job;
  }

  async selectApplication(jobApplication) {
    await this.instancePromise;
    await Mysql.query(
      `UPDATE jobs SET jobs.application_selected = ${parseInt(
        jobApplication,
        10
      )}, jobs.date_application_selected = CURRENT_TIMESTAMP WHERE jobs.id = ${
        this.id
      };`
    );
    // set the notification
    const jobApp = (
      await Mysql.query(
        `SELECT * FROM job_applications WHERE id = ${parseInt(
          jobApplication,
          10
        )};`
      )
    )[0];
    await Mysql.query(
      `INSERT INTO notifications (to_user, what, job, job_application) VALUES (${parseInt(
        jobApp.user_id,
        10
      )}, 'selected', ${this.id}, ${parseInt(jobApplication, 10)});`
    );
    // send out the email
    const jobUser = await Mysql.query(
      `SELECT * FROM users WHERE id = ${(await this.getInfo()).user};`
    );
    const applicationUser = await Mysql.query(
      `SELECT * FROM users WHERE id = ${jobApp.user_id};`
    );
    Email.sendMail(
      applicationUser[0].email,
      'SNNAP: Job Application Selected',
      `${jobUser[0].first_name} ${
        jobUser[0].last_name
      } selected your job application\nhttps://snnap.app/job-applications#${parseInt(
        jobApplication,
        10
      )}`,
      `<a href='https://snnap.app/profile/${jobUser[0].username}'>${
        jobUser[0].first_name
      } ${
        jobUser[0].last_name
      }</a> selected your <a href='https://snnap.app/job-applications#${parseInt(
        jobApplication,
        10
      )}'>job application</a>`
    );
  }
};

module.exports = Job;
