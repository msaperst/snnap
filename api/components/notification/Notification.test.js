const Notification = require('./Notification');
const Job = require('../job/Job');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

jest.mock('../../services/Email');
const Email = require('../../services/Email');

describe('notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('on job creation does nothing when no other users', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 5, user: 7 }])
      .mockResolvedValueOnce();

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(await notification.jobCreated()).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT id, lat, lon, email, email_notifications from users JOIN settings ON users.id = settings.user WHERE id != 2;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT jobs.*, jobs.type as typeId, jobs.subtype as subtypeId, job_types.type as type, job_subtypes.type as subtype FROM jobs INNER JOIN job_types ON jobs.type = job_types.id INNER JOIN job_subtypes ON jobs.subtype = job_subtypes.id WHERE jobs.id = 1;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT skills.id as value, skills.name FROM job_skills INNER JOIN skills ON skills.id = job_skills.skill WHERE job = 1;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM users WHERE id = 7;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on job creation does nothing when no users inside distance', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([{ id: 3, lat: 0, lon: 0 }])
      .mockResolvedValueOnce([{ id: 5, user: 7 }])
      .mockResolvedValueOnce();

    const job = new Job();
    job.id = 1;
    job.user = 2;
    job.location = {};
    job.location.lat = 99;
    job.location.lon = 99;
    const notification = new Notification(job);
    expect(await notification.jobCreated()).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on job creation does nothing when no users inside distance with email notification', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([
        { id: 3, lat: 99, lon: 99, email_notifications: 0 },
      ])
      .mockResolvedValueOnce([{ id: 5, user: 7 }])
      .mockResolvedValueOnce();

    const job = new Job();
    job.id = 1;
    job.user = 2;
    job.location = {};
    job.location.lat = 99;
    job.location.lon = 99;
    const notification = new Notification(job);
    expect(await notification.jobCreated()).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(5);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      5,
      "INSERT INTO notifications (to_user, what, job) VALUES (3, 'created', 1);"
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on job creation sends email when users inside distance with email notification', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 3,
          lat: 99,
          lon: 99,
          email_notifications: 1,
          email: 'email.3@example.org',
        },
        {
          id: 4,
          lat: 99,
          lon: 99,
          email_notifications: 0,
          email: 'email.4@example.org',
        },
        {
          id: 5,
          lat: 99,
          lon: 99,
          email_notifications: 1,
          email: 'email.5@example.org',
        },
      ])
      .mockResolvedValueOnce([{ id: 5, user: 7 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([
        {
          username: 'max',
          first_name: 'Max',
          last_name: 'Saperstone',
        },
      ]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    job.location = {};
    job.location.lat = 99;
    job.location.lon = 99;
    const notification = new Notification(job);
    expect(await notification.jobCreated()).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(7);
    expect(emailSpy).toHaveBeenCalledTimes(2);
    expect(emailSpy).toHaveBeenNthCalledWith(
      1,
      'email.3@example.org',
      'SNNAP: Job In Your Area Created',
      'Max Saperstone created a job in your area\nhttps://snnap.app/#1',
      "<a href='https://snnap.app/profile/max'>Max Saperstone</a> created a <a href='https://snnap.app/#1'>job</a> in your area"
    );
    expect(emailSpy).toHaveBeenNthCalledWith(
      2,
      'email.5@example.org',
      'SNNAP: Job In Your Area Created',
      'Max Saperstone created a job in your area\nhttps://snnap.app/#1',
      "<a href='https://snnap.app/profile/max'>Max Saperstone</a> created a <a href='https://snnap.app/#1'>job</a> in your area"
    );
  });

  it('on application submission sends no email when no user', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValue();

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(
      await notification.applicationSubmitted(2, 'MaxMax')
    ).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO notifications (to_user, what, job, job_application) VALUES (2, 'applied', 1, 2);"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM users JOIN settings WHERE users.id = 2;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on application submission sends no email when empty user', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValueOnce().mockResolvedValueOnce([]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(
      await notification.applicationSubmitted(2, 'MaxMax')
    ).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on application submission sends no email when email off', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ email_notifications: 0 }]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(
      await notification.applicationSubmitted(2, 'MaxMax')
    ).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on application submission sends email when email on', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValueOnce().mockResolvedValueOnce([
      {
        username: 'maxmax',
        email: 'maxmax@address.com',
        email_notifications: 1,
      },
    ]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(
      await notification.applicationSubmitted(2, 'MaxMax')
    ).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(
      'maxmax@address.com',
      'SNNAP: New Job Application',
      'MaxMax applied to your job\nhttps://snnap.app/jobs#1',
      "<a href='https://snnap.app/profile/maxmax'>MaxMax</a> applied to your <a href='https://snnap.app/jobs#1'>job</a>"
    );
  });

  it('on application selection sends no email when no user', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([{ id: 5, user_id: 6 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ id: 5 }]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(await notification.applicationSelected(2)).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(5);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM job_applications WHERE id = 2;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO notifications (to_user, what, job, job_application) VALUES (6, 'selected', 1, 2);"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT jobs.*, jobs.type as typeId, jobs.subtype as subtypeId, job_types.type as type, job_subtypes.type as subtype FROM jobs INNER JOIN job_types ON jobs.type = job_types.id INNER JOIN job_subtypes ON jobs.subtype = job_subtypes.id WHERE jobs.id = 1;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT skills.id as value, skills.name FROM job_skills INNER JOIN skills ON skills.id = job_skills.skill WHERE job = 1;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      5,
      'SELECT * FROM users JOIN settings WHERE id = 6;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on application selection sends no email when empty user', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([{ id: 5, user_id: 6 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ id: 5 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(await notification.applicationSelected(2)).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(5);
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on application selection sends no email when email off', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([{ id: 5, user_id: 6 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ id: 5 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ email_notifications: 0 }]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(await notification.applicationSelected(2)).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(5);
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('on application selection sends email when email on', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([{ id: 5, user_id: 6 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ id: 8, user: 18 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([
        {
          email: 'maxmax@address.com',
          email_notifications: 1,
        },
      ])
      .mockResolvedValueOnce([
        {
          username: 'max',
          first_name: 'Max',
          last_name: 'Saperstone',
        },
      ]);

    const job = new Job();
    job.id = 1;
    job.user = 2;
    const notification = new Notification(job);
    expect(await notification.applicationSelected(2)).toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(6);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      6,
      'SELECT * FROM users WHERE id = 18;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(
      'maxmax@address.com',
      'SNNAP: Job Application Selected',
      'Max Saperstone selected your job application\nhttps://snnap.app/job-applications#2',
      "<a href='https://snnap.app/profile/max'>Max Saperstone</a> selected your <a href='https://snnap.app/job-applications#2'>job application</a>"
    );
  });

  it('calculates distance properly', () => {
    const p1 = { lat: 37, lon: 78 };
    const p2 = { lat: 37, lon: 78 };
    const p3 = { lat: 37, lon: 79 };
    expect(Notification.calculateDistance(p1, p2)).toEqual(0);
    expect(Notification.calculateDistance(p1, p3)).toEqual(55.18353142701608);
    expect(Notification.calculateDistance(p2, p3)).toEqual(55.18353142701608);
  });
});
