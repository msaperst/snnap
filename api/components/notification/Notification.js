const Mysql = require('../../services/Mysql');
const Email = require('../../services/Email');
const { parseIntAndDbEscape } = require('../Common');

const Notification = class {
  constructor(job, sendEmail) {
    this.job = job;
    this.sendEmail = sendEmail;
  }

  async applicationSelected(jobApplicationId) {
    const jobApp = (
      await Mysql.query(
        `SELECT * FROM job_applications WHERE id = ${jobApplicationId};`
      )
    )[0];
    // set the notification in the application
    await Mysql.query(
      `INSERT INTO notifications (to_user, what, job, job_application) VALUES (${parseIntAndDbEscape(
        jobApp.user_id
      )}, 'selected', ${this.job.id}, ${jobApplicationId});`
    );
    const jobInfo = await this.job.getInfo();
    // send an email about the application getting selected
    if (this.sendEmail) {
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
        `${jobUser[0].first_name} ${jobUser[0].last_name} selected your job application\nhttps://snnap.app/job-applications#${jobApplicationId}`,
        `<a href='https://snnap.app/profile/${jobUser[0].username}'>${jobUser[0].first_name} ${jobUser[0].last_name}</a> selected your <a href='https://snnap.app/job-applications#${jobApplicationId}'>job application</a>`
      );
    }
  }

  async jobCreated() {
    // for each user check their distance
    const users = await Mysql.query(
      `SELECT id, lat, lon, email, email_notifications from users JOIN settings ON users.id = settings.user WHERE id != ${this.job.user};`
    );
    const jobInfo = await this.job.getInfo();
    const jobUser = await Mysql.query(
      `SELECT * FROM users WHERE id = ${jobInfo.user};`
    );
    for (let index = 0, l = users.length; index < l; index += 1) {
      const user = users[index];
      const distance = Notification.calculateDistance(user, this.job.location);
      // if distance is within range (250 miles from home)
      if (distance < 250) {
        // set the notification in the application
        Mysql.query(
          `INSERT INTO notifications (to_user, what, job) VALUES (${user.id}, 'created', ${this.job.id});`
        );
        // potentially send an email notification
        if (user.email_notifications) {
          // send out the email
          Email.sendMail(
            user.email,
            'SNNAP: Job In Your Area Created',
            `${jobUser[0].first_name} ${jobUser[0].last_name} created a job in your area\nhttps://snnap.app/#${this.job.id}`,
            `<a href='https://snnap.app/profile/${jobUser[0].username}'>${jobUser[0].first_name} ${jobUser[0].last_name}</a> created a <a href='https://snnap.app/#${this.job.id}'>job</a> in your area`
          );
        }
      }
    }
  }

  static calculateDistance(p1, p2) {
    // This uses the ‘haversine’ formula to calculate the great-circle distance between
    // two points – that is, the shortest distance over the earth’s surface – giving an
    // ‘as-the-crow-flies’ distance between the points (ignoring any hills they fly over, of course!).
    const R = 3959; // miles
    const φ1 = (p1.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lon - p1.lon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in miles
  }
};

module.exports = Notification;
