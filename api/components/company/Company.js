const db = require('mysql');
const Mysql = require('../../services/Mysql');

class Company {
  constructor(userId) {
    this.userId = db.escape(userId);
    this.initialize = this.initializeCompany();
  }

  async initializeCompany() {
    const company = await Mysql.query(
      `SELECT * FROM companies WHERE user = ${this.userId};`
    );
    if (!company.length) {
      const result = await Mysql.query(
        `INSERT INTO companies (user) VALUE (${this.userId});`
      );
      this.companyId = result.insertId;
    } else {
      this.companyId = company[0].id;
    }
  }

  async getInfo() {
    await this.initialize;
    const company = (
      await Mysql.query(`SELECT * FROM companies WHERE user = ${this.userId};`)
    )[0];
    company.portfolio = await Mysql.query(
      `SELECT * FROM portfolio WHERE company = ${company.id};`
    );
    if (company.equipment) {
      company.equipment = company.equipment.split(',').map(Number);
    } else {
      company.equipment = [];
    }
    if (company.skills) {
      company.skills = company.skills.split(',').map(Number);
    } else {
      company.skills = [];
    }
    return company;
  }

  async setPortfolio(experience, portfolioItems) {
    await this.initialize;
    // update the experience
    await Mysql.query(
      `UPDATE companies SET experience = ${db.escape(
        experience
      )} WHERE user = ${this.userId}`
    );
    // wipe out all old experiences
    await Mysql.query(
      `DELETE FROM portfolio WHERE company = ${this.companyId};`
    );
    // set new experiences
    for (let i = 0; i < portfolioItems.length; i++) {
      const portfolioItem = portfolioItems[i];
      if (portfolioItem.description && portfolioItem.link) {
        // eslint-disable-next-line no-await-in-loop
        await Mysql.query(
          `INSERT INTO portfolio (company, link, description) VALUES (${
            this.companyId
          }, ${db.escape(portfolioItem.link)}, ${db.escape(
            portfolioItem.description
          )});`
        );
      }
    }
  }

  async setCompanyInformation(name, website, insta, fb, equipment, skills) {
    await this.initialize;
    await Mysql.query(
      `UPDATE companies
       SET name = ${db.escape(name)},
           website  = ${db.escape(website)},
           insta       = ${db.escape(insta)},
           fb      = ${db.escape(fb)},
           equipment        = ${db.escape(equipment)},
           skills        = ${db.escape(skills)}
       WHERE user = ${this.userId}`
    );
  }
}

module.exports = Company;
