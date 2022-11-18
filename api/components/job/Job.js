const db = require('mysql');
const Mysql = require('../../services/Mysql');
const Email = require('../../services/Email');
const parseIntAndDbEscape = require('../Common');

const Job = class {
  constructor(id) {
    if (id) {
      this.id = parseIntAndDbEscape(id);
    }
  }

  static create(
    user,
    type,
    subtype,
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
        `INSERT INTO jobs (user, type, subtype, details, pay, duration, durationMax, date_time, equipment, loc, lat, lon) VALUES (${parseIntAndDbEscape(
          user
        )}, ${parseIntAndDbEscape(type)}, ${parseIntAndDbEscape(
          subtype
        )}, ${db.escape(details)}, ${parseFloat(pay)}, ${parseIntAndDbEscape(
          duration
        )}, ${
          durationMax ? parseIntAndDbEscape(durationMax) : null
        }, ${db.escape(dateTime)}, ${db.escape(equipment)}, ${db.escape(
          location.loc
        )}, ${parseFloat(location.lat)},${parseFloat(location.lon)});`
      );
      skills.map(async (skill) => {
        await Mysql.query(
          `INSERT INTO job_skills (job, skill) VALUES (${
            result.insertId
          }, ${parseIntAndDbEscape(skill.value)});`
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
      `SELECT jobs.*, jobs.type as typeId, jobs.subtype as subtypeId, job_types.type, job_subtypes.type as subtype FROM jobs INNER JOIN job_types ON jobs.type = job_types.id INNER JOIN job_subtypes ON jobs.subtype = job_subtypes.id WHERE jobs.date_time >= CURDATE() AND jobs.application_selected IS NULL ORDER BY jobs.date_time;`
    );
  }

  static async getUserJobs(user) {
    return Mysql.query(
      `SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.user = ${parseIntAndDbEscape(
        user
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

  static async getJobSubtypes() {
    const jobSubtypes = await Mysql.query(
      `SELECT * FROM job_subtypes ORDER BY type;`
    );
    let i = 0;
    for (i; i < jobSubtypes.length; i++) {
      if (jobSubtypes[i].type === 'Other') {
        break;
      }
    }
    const other = jobSubtypes.splice(i, 1);
    return [...jobSubtypes, ...other];
  }

  async getInfo() {
    await this.instancePromise;
    const job = (
      await Mysql.query(
        `SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.id = ${this.id};`
      )
    )[0];
    if (job) {
      job.skills = await Mysql.query(
        `SELECT skills.id as value, skills.name FROM job_skills INNER JOIN skills ON skills.id = job_skills.skill WHERE job = ${this.id};`
      );
    }
    return job;
  }

  async selectApplication(jobApplication) {
    await this.instancePromise;
    await Mysql.query(
      `UPDATE jobs SET jobs.application_selected = ${parseIntAndDbEscape(
        jobApplication
      )}, jobs.date_application_selected = CURRENT_TIMESTAMP WHERE jobs.id = ${
        this.id
      };`
    );
    // set the notification
    const jobApp = (
      await Mysql.query(
        `SELECT * FROM job_applications WHERE id = ${parseIntAndDbEscape(
          jobApplication
        )};`
      )
    )[0];
    await Mysql.query(
      `INSERT INTO notifications (to_user, what, job, job_application) VALUES (${parseIntAndDbEscape(
        jobApp.user_id
      )}, 'selected', ${this.id}, ${parseIntAndDbEscape(jobApplication)});`
    );
    const jobInfo = await this.getInfo();
    if ((await Job.getUserSettings(jobInfo.user)).email_notifications) {
      // send out the email
      const jobUser = await Mysql.query(
        `SELECT * FROM users WHERE id = ${jobInfo.user};`
      );
      const applicationUser = await Mysql.query(
        `SELECT * FROM users WHERE id = ${jobApp.user_id};`
      );
      Email.sendMail(
        applicationUser[0].email,
        'SNNAP: Job Application Selected',
        `${jobUser[0].first_name} ${
          jobUser[0].last_name
        } selected your job application\nhttps://snnap.app/job-applications#${parseIntAndDbEscape(
          jobApplication
        )}`,
        `<a href='https://snnap.app/profile/${jobUser[0].username}'>${
          jobUser[0].first_name
        } ${
          jobUser[0].last_name
        }</a> selected your <a href='https://snnap.app/job-applications#${parseIntAndDbEscape(
          jobApplication
        )}'>job application</a>`
      );
    }
    // create an entry for the rating of the job
    await Mysql.query(
      `INSERT INTO ratings (job, job_date, ratee, rater) VALUES (${
        this.id
      }, ${db.escape(jobInfo.date_time)}, ${jobApp.user_id}, ${jobInfo.user});`
    );
    await Mysql.query(
      `INSERT INTO ratings (job, job_date, ratee, rater) VALUES (${
        this.id
      }, ${db.escape(jobInfo.date_time)}, ${jobInfo.user}, ${jobApp.user_id});`
    );
  }

  static async getUserSettings(jobUser) {
    const settings = await Mysql.query(
      `SELECT * FROM settings WHERE user = ${parseIntAndDbEscape(jobUser)};`
    );
    return settings[0];
  }
};

module.exports = Job;
