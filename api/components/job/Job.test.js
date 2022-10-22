const Job = require('./Job');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

jest.mock('../../services/Email');
const Email = require('../../services/Email');

describe('job', () => {
  const item1 = {
    id: 1,
    location: 'Fairfax, VA, United States of America',
    details: "Max's 40th Birthday, woot!!!",
    pay: 0.5,
    duration: 8,
    date_time: '2023-10-13 00:00:00',
    user: 1,
    durationMax: null,
    typeId: 2,
    type: "B'nai Mitzvah",
  };
  const item2 = {
    id: 2,
    location: 'Fairfax, VA, United States of America',
    details: "Max's 50th Birthday, woot!!!",
    pay: 50,
    duration: 1,
    date_time: '2033-10-13 00:00:00',
    user: 1,
    durationMax: null,
    typeId: 2,
    type: 'Event',
  };
  const location = {
    loc: 'Fairfax, VA, United States of America',
    lat: 5,
    lon: -71.2345,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('sets the job with basic values on creation', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const job = Job.create(
      1,
      5,
      location,
      'Deetz',
      100,
      5,
      null,
      '2022-02-16',
      [],
      []
    );
    await expect(job.getId()).resolves.toEqual(15);
    await expect(job.getType()).resolves.toEqual(5);
    await expect(job.getLocation()).resolves.toEqual(location);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenCalledWith(
      "INSERT INTO jobs (user, type, details, pay, duration, durationMax, date_time, loc, lat, lon) VALUES (1, 5, 'Deetz', 100, 5, null, '2022-02-16 00:00:00', 'Fairfax, VA, United States of America', 5,-71.2345);"
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('sets the job with max duration on creation', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const job = Job.create(
      1,
      5,
      location,
      'Deetz',
      100,
      5,
      10,
      '2022-02-16',
      [],
      []
    );
    await expect(job.getId()).resolves.toEqual(15);
    await expect(job.getType()).resolves.toEqual(5);
    await expect(job.getLocation()).resolves.toEqual(location);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenCalledWith(
      "INSERT INTO jobs (user, type, details, pay, duration, durationMax, date_time, loc, lat, lon) VALUES (1, 5, 'Deetz', 100, 5, 10, '2022-02-16 00:00:00', 'Fairfax, VA, United States of America', 5,-71.2345);"
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('sets the job with skills and equipment on creation', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const job = Job.create(
      1,
      5,
      location,
      'Deetz',
      100,
      5,
      null,
      '2022-02-16',
      [
        { value: 3, label: 'Flash' },
        { value: 4, label: 'Camera' },
      ],
      [{ value: 2, label: 'Posing' }]
    );
    await expect(job.getId()).resolves.toEqual(15);
    await expect(job.getType()).resolves.toEqual(5);
    await expect(job.getLocation()).resolves.toEqual(location);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO jobs (user, type, details, pay, duration, durationMax, date_time, loc, lat, lon) VALUES (1, 5, 'Deetz', 100, 5, null, '2022-02-16 00:00:00', 'Fairfax, VA, United States of America', 5,-71.2345);"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO job_equipment (job, equipment) VALUES (15, 3);'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'INSERT INTO job_equipment (job, equipment) VALUES (15, 4);'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO job_skills (job, skill) VALUES (15, 2);'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('retrieves nothing when request is missing', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValueOnce([]);
    const job = new Job(5);
    await expect(job.getInfo()).resolves.toBeUndefined();
    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.id = 5;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('retrieves all of the info for the request', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([item1])
      .mockResolvedValueOnce([{ value: 1, name: 'Camera' }])
      .mockResolvedValue([]);
    const job = new Job(5);
    await expect(job.getInfo()).resolves.toEqual({
      date_time: '2023-10-13 00:00:00',
      details: "Max's 40th Birthday, woot!!!",
      duration: 8,
      durationMax: null,
      equipment: [{ name: 'Camera', value: 1 }],
      id: 1,
      location: 'Fairfax, VA, United States of America',
      pay: 0.5,
      skills: [],
      type: "B'nai Mitzvah",
      typeId: 2,
      user: 1,
    });

    expect(sqlSpy).toHaveBeenCalledTimes(3);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.id = 5;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT equipment.id as value, equipment.name FROM job_equipment INNER JOIN equipment ON equipment.id = job_equipment.equipment WHERE job = 5;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT skills.id as value, skills.name FROM job_skills INNER JOIN skills ON skills.id = job_skills.skill WHERE job = 5;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('gets all of our jobs', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValue([item1, item2]);
    await expect(Job.getJobs()).resolves.toEqual([item1, item2]);

    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.date_time > NOW() AND jobs.application_selected IS NULL ORDER BY jobs.date_time;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it("gets all of a user's jobs", async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValue([item1, item2]);
    await expect(Job.getUserJobs(1)).resolves.toEqual([item1, item2]);

    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.user = 1 ORDER BY jobs.date_time;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('adds a selected application', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ user_id: 5 }])
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([{ user: 6 }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { first_name: 'bob', last_name: 'smith', username: 'bsmith' },
      ])
      .mockResolvedValueOnce([{ email: 'email@address.com' }]);

    const job = new Job(4);
    await job.selectApplication(3);
    expect(sqlSpy).toHaveBeenCalledTimes(8);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'UPDATE jobs SET jobs.application_selected = 3, jobs.date_application_selected = CURRENT_TIMESTAMP WHERE jobs.id = 4;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM job_applications WHERE id = 3;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      "INSERT INTO notifications (to_user, what, job, job_application) VALUES (5, 'selected', 4, 3);"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT jobs.*, jobs.type as typeId, job_types.type FROM jobs INNER JOIN job_types ON jobs.type = job_types.id WHERE jobs.id = 4;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      5,
      'SELECT equipment.id as value, equipment.name FROM job_equipment INNER JOIN equipment ON equipment.id = job_equipment.equipment WHERE job = 4;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      6,
      'SELECT skills.id as value, skills.name FROM job_skills INNER JOIN skills ON skills.id = job_skills.skill WHERE job = 4;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      7,
      'SELECT * FROM users WHERE id = 6;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      8,
      'SELECT * FROM users WHERE id = 5;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(
      'email@address.com',
      'SNNAP: Job Application Selected',
      'bob smith selected your job application\nhttps://snnap.app/job-applications#3',
      "<a href='https://snnap.app/profile/bsmith'>bob smith</a> selected your <a href='https://snnap.app/job-applications#3'>job application</a>"
    );
  });

  it('properly pulls and sorts the equipment', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValueOnce([
      { id: 1, name: 'Camera' },
      { id: 2, name: 'Flash' },
      { id: 3, name: 'Lights' },
    ]);
    expect(await Job.getEquipment()).toEqual([
      { id: 1, name: 'Camera' },
      { id: 2, name: 'Flash' },
      { id: 3, name: 'Lights' },
    ]);
    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM equipment ORDER BY name;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('properly pulls and sorts the skills', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValueOnce([
      { id: 1, name: 'Camera' },
      { id: 2, name: 'Flash' },
      { id: 3, name: 'Lights' },
    ]);
    expect(await Job.getSkills()).toEqual([
      { id: 1, name: 'Camera' },
      { id: 2, name: 'Flash' },
      { id: 3, name: 'Lights' },
    ]);
    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenCalledWith('SELECT * FROM skills ORDER BY name;');
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('properly pulls and sorts the job type', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    const emailSpy = jest.spyOn(Email, 'sendMail');
    Mysql.query.mockResolvedValueOnce([
      { id: 2, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 3, type: 'Commercial Event', plural: 'Commercial Events' },
      { id: 4, type: 'Other', plural: 'Other' },
      { id: 6, type: 'Portrait', plural: 'Portraits' },
      { id: 5, type: 'Studio Work', plural: 'Studio Work' },
      { id: 1, type: 'Wedding', plural: 'Weddings' },
    ]);
    expect(await Job.getJobTypes()).toEqual([
      { id: 2, type: "B'nai Mitzvah", plural: "B'nai Mitzvahs" },
      { id: 3, type: 'Commercial Event', plural: 'Commercial Events' },
      { id: 6, type: 'Portrait', plural: 'Portraits' },
      { id: 5, type: 'Studio Work', plural: 'Studio Work' },
      { id: 1, type: 'Wedding', plural: 'Weddings' },
      { id: 4, type: 'Other', plural: 'Other' },
    ]);
    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM job_types ORDER BY type;'
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });
});
