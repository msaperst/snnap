const db = require('mysql');
const Mysql = require('../../services/Mysql');

const RequestToHire = class {
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
      const result = await Mysql.query(
        `INSERT INTO hire_requests (user, type, location, details, pay, duration, durationMax, date_time, equipment, skills)
         VALUES (${db.escape(user)}, ${db.escape(type)}, 
                 ${db.escape(location)}, ${db.escape(details)}, 
                 ${db.escape(pay)}, ${db.escape(duration)}, 
                 ${db.escape(durationMax)}, ${db.escape(`${date} 00:00:00`)}, 
                 ${db.escape(equipment)}, ${db.escape(skills)})`
      );
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
};

module.exports = RequestToHire;
