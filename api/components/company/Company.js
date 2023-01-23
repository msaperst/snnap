const db = require('mysql');
const Mysql = require('../../services/Mysql');
const { parseIntAndDbEscape, handleNewSkill } = require('../Common');

class Company {
  constructor(userId) {
    this.userId = parseIntAndDbEscape(userId);
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
    company.equipment = await Mysql.query(
      `SELECT equipment.id as value, equipment.name, company_equipment.what FROM company_equipment INNER JOIN equipment ON equipment.id = company_equipment.equipment WHERE company = ${company.id};`
    );
    company.skills = await Mysql.query(
      `SELECT skills.id as value, skills.name FROM company_skills INNER JOIN skills ON skills.id = company_skills.skill WHERE company = ${company.id};`
    );
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
    // wipe out all old portfolio info
    await Mysql.query(
      `DELETE FROM portfolio WHERE company = ${this.companyId};`
    );
    // set new portfolio info
    if (portfolioItems && Array.isArray(portfolioItems)) {
      portfolioItems.forEach(async (portfolioItem) => {
        if (portfolioItem.description && portfolioItem.link) {
          await Mysql.query(
            `INSERT INTO portfolio (company, link, description) VALUES (${
              this.companyId
            }, ${db.escape(portfolioItem.link)}, ${db.escape(
              portfolioItem.description
            )});`
          );
        }
      });
    }
  }

  async setCompanyInformation(name, website, insta, fb, equipment, skills) {
    await this.initialize;
    // set our basic company information
    await Mysql.query(
      `UPDATE companies SET name = ${db.escape(name)}, website = ${db.escape(
        website
      )}, insta = ${db.escape(insta)}, fb = ${db.escape(fb)} WHERE user = ${
        this.userId
      }`
    );
    // wipe out all old equipment
    await Mysql.query(
      `DELETE FROM company_equipment WHERE company = ${this.companyId};`
    );
    // set new equipment
    await equipment.map(async (equip) => {
      await Mysql.query(
        `INSERT INTO company_equipment (company, equipment, what) VALUES (${
          this.companyId
        }, ${parseIntAndDbEscape(equip.value)}, ${db.escape(equip.what)});`
      );
    });
    // wipe out all old skills
    await Mysql.query(
      `DELETE FROM company_skills WHERE company = ${this.companyId};`
    );
    // set new skills
    await skills.map(async (skill) => {
      const skillId = await handleNewSkill(skill, this.userId);
      await Mysql.query(
        `INSERT INTO company_skills (company, skill) VALUES (${
          this.companyId
        }, ${parseIntAndDbEscape(skillId)});`
      );
    });
  }
}

module.exports = Company;
