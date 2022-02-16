const db = require('mysql');
const Mysql = require('../../services/Mysql');

const RequestToHire = class {
  static create(
    type,
    location,
    details,
    pay,
    duration,
    units,
    date,
    time,
    equipment,
    skills
  ) {
    const newRequestToHire = new RequestToHire();
    newRequestToHire.instancePromise = (async () => {
      await Mysql.query(
        `INSERT INTO hire_requests (type, location, details, pay, duration, units, date_time, equipment, skills)
         VALUES (${db.escape(type)}, ${db.escape(location)}, 
                 ${db.escape(details)}, ${db.escape(pay)}, 
                 ${db.escape(duration)}, ${db.escape(units)},
                 ${db.escape(`${date} ${time}:00`)}, ${db.escape(
          equipment
        )}, ${db.escape(skills)})`
      );
      newRequestToHire.type = type;
      newRequestToHire.location = location;
    })();
    return newRequestToHire;
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
