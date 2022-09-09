const db = require('mysql');
const Mysql = require('../../services/Mysql');

const ApplicationForRequestToHire = class {
  constructor(id) {
    this.id = db.escape(id);
  }

  static create(
    hireRequestId,
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
    const newApplicationForRequestToHire = new ApplicationForRequestToHire();
    newApplicationForRequestToHire.instancePromise = (async () => {
      const result = await Mysql.query(
        `INSERT INTO hire_request_applications (hire_request_id, user_id, company_id, user_name, company_name, website, insta, fb, experience) VALUES (${db.escape(
          hireRequestId
        )}, ${db.escape(userId)}, ${db.escape(companyId)}, ${db.escape(
          userName
        )}, ${db.escape(companyName)}, ${db.escape(website)}, ${db.escape(
          insta
        )}, ${db.escape(fb)}, ${db.escape(experience)});`
      );
      equipment.map(async (equip) => {
        await Mysql.query(
          `INSERT INTO hire_request_applications_equipment (hire_request_application, equipment, what) VALUES (${
            result.insertId
          }, ${db.escape(equip.value)}, ${db.escape(equip.what)});`
        );
      });
      skills.map(async (skill) => {
        await Mysql.query(
          `INSERT INTO hire_request_applications_skills (hire_request_application, skill) VALUES (${
            result.insertId
          }, ${db.escape(skill.value)});`
        );
      });
      portfolio.map(async (portfolioItem) => {
        // set new portfolio info
        if (portfolioItem.description && portfolioItem.link) {
          await Mysql.query(
            `INSERT INTO hire_request_applications_portfolios (hire_request_application, link, description) VALUES (${
              result.insertId
            }, ${db.escape(portfolioItem.link)}, ${db.escape(
              portfolioItem.description
            )});`
          );
        }
      });
      newApplicationForRequestToHire.id = result.insertId;
      // set the notification
      const hireRequest = (
        await Mysql.query(
          `SELECT * FROM hire_requests WHERE id = ${db.escape(hireRequestId)};`
        )
      )[0];
      const fromUser = (
        await Mysql.query(
          `SELECT * FROM users WHERE id = ${db.escape(userId)};`
        )
      )[0];
      await Mysql.query(
        `INSERT INTO notifications (to_user, from_user, hire_request, hire_request_application, notification) VALUES (${
          hireRequest.user
        }, ${db.escape(userId)}, ${db.escape(hireRequestId)}, ${db.escape(
          result.insertId
        )}, '<a href="/profile/${db.escape(fromUser.username)}">${db.escape(
          userName
        )}</a> applied to your hire request');`
      );
    })();
    return newApplicationForRequestToHire;
  }

  async getId() {
    await this.instancePromise;
    return this.id;
  }

  static async getApplications(hireRequestId) {
    return Mysql.query(
      `SELECT * FROM hire_request_applications WHERE hire_request_id = ${db.escape(
        hireRequestId
      )};`
    );
  }

  static async getUserApplications(user) {
    return Mysql.query(
      `SELECT * FROM hire_request_applications WHERE hire_request_applications.user_id = ${db.escape(
        user
      )};`
    );
  }

  async getInfo() {
    await this.instancePromise;
    const hireRequestApplication = (
      await Mysql.query(
        `SELECT * FROM hire_request_applications WHERE hire_request_applications.id = ${this.id};`
      )
    )[0];
    hireRequestApplication.equipment = await Mysql.query(
      `SELECT equipment.id as value, equipment.name, hire_request_applications_equipment.what FROM hire_request_applications_equipment INNER JOIN equipment ON equipment.id = hire_request_applications_equipment.equipment WHERE hire_request_application = ${this.id};`
    );
    hireRequestApplication.skills = await Mysql.query(
      `SELECT skills.id as value, skills.name FROM hire_request_applications_skills INNER JOIN skills ON skills.id = hire_request_applications_skills.skill WHERE hire_request_application = ${this.id};`
    );
    hireRequestApplication.portfolio = await Mysql.query(
      `SELECT * FROM hire_request_applications_portfolios WHERE hire_request_application = ${this.id};`
    );
    return hireRequestApplication;
  }
};

module.exports = ApplicationForRequestToHire;
