const db = require('mysql');
const Mysql = require('../../services/Mysql');

const RequestToHire = class {
  constructor(id) {
    this.id = db.escape(id);
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
    const newRequestToHire = new RequestToHire();
    newRequestToHire.instancePromise = (async () => {
      const dateTime = `${date} 00:00:00`;
      const result = await Mysql.query(
        `INSERT INTO hire_requests (user, type, location, details, pay, duration, durationMax, date_time) VALUES (${db.escape(
          user
        )}, ${db.escape(type)}, ${db.escape(location)}, ${db.escape(
          details
        )}, ${db.escape(pay)}, ${db.escape(duration)}, ${db.escape(
          durationMax
        )}, ${db.escape(dateTime)})`
      );
      equipment.map(async (equip) => {
        await Mysql.query(
          `INSERT INTO hire_requests_equipment (hire_request, equipment) VALUES (${
            result.insertId
          }, ${db.escape(equip)});`
        );
      });
      skills.map(async (skill) => {
        await Mysql.query(
          `INSERT INTO hire_requests_skills (hire_request, skill) VALUES (${
            result.insertId
          }, ${db.escape(skill)});`
        );
      });
      newRequestToHire.id = result.insertId;
      newRequestToHire.type = type;
      newRequestToHire.location = location;
    })();
    return newRequestToHire;
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

  static async getHireRequests() {
    return Mysql.query(
      `SELECT hire_requests.*, hire_requests.type as typeId, job_types.type FROM hire_requests INNER JOIN job_types ON hire_requests.type = job_types.id WHERE hire_requests.date_time > NOW();`
    );
  }

  async getInfo() {
    await this.instancePromise;
    const hireRequest = (
      await Mysql.query(
        `SELECT hire_requests.*, hire_requests.type as typeId, job_types.type FROM hire_requests INNER JOIN job_types ON hire_requests.type = job_types.id WHERE hire_requests.id = ${this.id};`
      )
    )[0];
    hireRequest.equipment = await Mysql.query(
      `SELECT equipment.id as value, equipment.name FROM hire_requests_equipment INNER JOIN equipment ON equipment.id = hire_requests_equipment.equipment WHERE hire_request = ${this.id};`
    );
    hireRequest.skills = await Mysql.query(
      `SELECT skills.id as value, skills.name FROM hire_requests_skills INNER JOIN skills ON skills.id = hire_requests_skills.skill WHERE hire_request = ${this.id};`
    );
    return hireRequest;
  }
};

module.exports = RequestToHire;
