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
      await Mysql.query(`INSERT INTO companies (user) VALUE (${this.userId});`);
    }
  }

  async getInfo() {
    await this.initialize;
    const company = (
      await Mysql.query(`SELECT * FROM companies WHERE user = ${this.userId};`)
    )[0];
    company.portfolio = await Mysql.query(
      `SELECT * FROM portfolio WHERE company = ${company.id}`
    );
    return company;
  }

  async setPortfolio(experience, portfolioItems) {
    await this.initialize;
    // update the experience
    await Mysql.query(
      `UPDATE companies
       SET experience  = ${db.escape(experience)}
       WHERE user = ${this.userId}`
    );
    // wipe out all old experiences
    // TODO
    // set new experiences
    // TODO
  }
}

module.exports = Company;
