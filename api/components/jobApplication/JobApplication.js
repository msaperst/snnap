const db = require('mysql');
const Mysql = require('../../services/Mysql');
const Email = require('../../services/Email');

const JobApplication = class {
  constructor(id) {
    this.id = parseInt(id, 10);
  }

  static create(
    jobId,
    userId,
    companyId,
    userName,
    companyName,
    website,
    insta,
    fb,
    experience,
    equipment,
    skills,
    portfolio
  ) {
    const newJobApplication = new JobApplication();
    newJobApplication.instancePromise = (async () => {
      const result = await Mysql.query(
        `INSERT INTO job_applications (job_id, user_id, company_id, user_name, company_name, website, insta, fb, experience) VALUES (${parseInt(
          jobId,
          10
        )}, ${parseInt(userId, 10)}, ${parseInt(companyId, 10)}, ${db.escape(
          userName
        )}, ${db.escape(companyName)}, ${db.escape(website)}, ${db.escape(
          insta
        )}, ${db.escape(fb)}, ${db.escape(experience)});`
      );
      equipment.map(async (equip) => {
        await Mysql.query(
          `INSERT INTO job_applications_equipment (job_application, equipment, what) VALUES (${
            result.insertId
          }, ${parseInt(equip.value, 10)}, ${db.escape(equip.what)});`
        );
      });
      skills.map(async (skill) => {
        await Mysql.query(
          `INSERT INTO job_applications_skills (job_application, skill) VALUES (${
            result.insertId
          }, ${parseInt(skill.value, 10)});`
        );
      });
      if (portfolio && Array.isArray(portfolio)) {
        portfolio.map(async (portfolioItem) => {
          // set new portfolio info
          if (portfolioItem.description && portfolioItem.link) {
            await Mysql.query(
              `INSERT INTO job_applications_portfolios (job_application, link, description) VALUES (${
                result.insertId
              }, ${db.escape(portfolioItem.link)}, ${db.escape(
                portfolioItem.description
              )});`
            );
          }
        });
      }
      newJobApplication.id = result.insertId;
      // set the notification
      const job = await Mysql.query(
        `SELECT * FROM jobs WHERE id = ${parseInt(jobId, 10)};`
      );
      if (job && job.length) {
        await Mysql.query(
          `INSERT INTO notifications (to_user, what, job, job_application) VALUES (${
            job[0].user
          }, 'applied', ${parseInt(jobId, 10)}, ${result.insertId});`
        );
        // send out the email
        const user = await Mysql.query(
          `SELECT * FROM users WHERE id = ${job[0].user};`
        );
        Email.sendMail(
          user[0].email,
          'SNNAP: New Job Application',
          `${userName} applied to your job\nhttps://snnap.app/jobs#${parseInt(
            jobId,
            10
          )}`,
          `<a href='https://snnap.app/profile/${
            user[0].username
          }'>${userName}</a> applied to your <a href='https://snnap.app/jobs#${parseInt(
            jobId,
            10
          )}'>job</a>`
        );
      }
    })();
    return newJobApplication;
  }

  async getId() {
    await this.instancePromise;
    return this.id;
  }

  static async getApplications(jobId) {
    return Mysql.query(
      `SELECT * FROM job_applications WHERE job_id = ${parseInt(jobId, 10)};`
    );
  }

  static async getUserApplications(user) {
    return Mysql.query(
      `SELECT * FROM job_applications WHERE job_applications.user_id = ${parseInt(
        user,
        10
      )};`
    );
  }

  async getInfo() {
    await this.instancePromise;
    const jobApplication = (
      await Mysql.query(
        `SELECT * FROM job_applications WHERE job_applications.id = ${this.id};`
      )
    )[0];
    if (jobApplication) {
      jobApplication.equipment = await Mysql.query(
        `SELECT equipment.id as value, equipment.name, job_applications_equipment.what FROM job_applications_equipment INNER JOIN equipment ON equipment.id = job_applications_equipment.equipment WHERE job_application = ${this.id};`
      );
      jobApplication.skills = await Mysql.query(
        `SELECT skills.id as value, skills.name FROM job_applications_skills INNER JOIN skills ON skills.id = job_applications_skills.skill WHERE job_application = ${this.id};`
      );
      jobApplication.portfolio = await Mysql.query(
        `SELECT * FROM job_applications_portfolios WHERE job_application = ${this.id};`
      );
    }
    return jobApplication;
  }
};

module.exports = JobApplication;
