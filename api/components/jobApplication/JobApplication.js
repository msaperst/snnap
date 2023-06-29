const db = require('mysql2');
const Mysql = require('../../services/Mysql');
const { parseIntAndDbEscape, handleNewSkill } = require('../Common');
const Notification = require('../notification/Notification');

const JobApplication = class {
  constructor(id) {
    if (id) {
      this.id = parseIntAndDbEscape(id);
    }
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
    comment,
    portfolio
  ) {
    const newJobApplication = new JobApplication();
    newJobApplication.instancePromise = (async () => {
      const result = await Mysql.query(
        `INSERT INTO job_applications (job_id, user_id, company_id, user_name, company_name, website, insta, fb, experience, comment) VALUES (${parseIntAndDbEscape(
          jobId
        )}, ${parseIntAndDbEscape(userId)}, ${parseIntAndDbEscape(
          companyId
        )}, ${db.escape(userName)}, ${db.escape(companyName)}, ${db.escape(
          website
        )}, ${db.escape(insta)}, ${db.escape(fb)}, ${db.escape(
          experience
        )}, ${db.escape(comment)});`
      );
      await equipment.map(async (equip) => {
        await Mysql.query(
          `INSERT INTO job_applications_equipment (job_application, equipment, what) VALUES (${
            result.insertId
          }, ${parseIntAndDbEscape(equip.value)}, ${db.escape(equip.what)});`
        );
      });
      await skills.map(async (skill) => {
        const skillId = await handleNewSkill(skill, userId);
        await Mysql.query(
          `INSERT INTO job_applications_skills (job_application, skill) VALUES (${
            result.insertId
          }, ${parseIntAndDbEscape(skillId)});`
        );
      });
      if (portfolio && Array.isArray(portfolio)) {
        portfolio.forEach(async (portfolioItem) => {
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
        `SELECT * FROM jobs WHERE id = ${parseIntAndDbEscape(jobId)};`
      );
      if (job && job.length) {
        const notification = new Notification(job[0]);
        notification.applicationSubmitted(newJobApplication.id, userName); // do this async - don't wait
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
      `SELECT * FROM job_applications WHERE job_id = ${parseIntAndDbEscape(
        jobId,
        10
      )};`
    );
  }

  static async getUserApplications(user) {
    return Mysql.query(
      `SELECT * FROM job_applications WHERE job_applications.user_id = ${parseIntAndDbEscape(
        user
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
