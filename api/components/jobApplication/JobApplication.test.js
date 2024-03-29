const JobApplication = require('./JobApplication');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

jest.mock('../notification/Notification');
const Notification = require('../notification/Notification');

describe('application for job', () => {
  const dataItem1 = {
    id: 1,
    location: 'Fairfax, VA 20030, United States of America',
    details: "Max's 40th Birthday, woot!!!",
    pay: 0.5,
    duration: 8,
    date_time: '2024-10-13 00:00:00',
    user: 1,
    durationMax: null,
    typeId: 2,
    type: "B'nai Mitzvah",
  };
  const dataItem2 = {
    date_time: '2033-10-13 00:00:00',
    details: "Max's 50th Birthday, woot!!!",
    duration: 1,
    durationMax: null,
    id: 2,
    location: 'Fairfax, VA 20030, United States of America',
    pay: 50,
    type: 'Event',
    typeId: 2,
    user: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('sets the job with basic values on creation', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce([{ user: 1 }]);
    const jobApplication = JobApplication.create(
      1,
      5,
      3,
      'Max Saperstone',
      'Butts R Us',
      null,
      'insta',
      null,
      'some experience',
      [],
      [],
      '',
      [],
    );
    await expect(jobApplication.getId()).resolves.toEqual(15);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO job_applications (job_id, user_id, company_id, user_name, company_name, website, insta, fb, experience, comment) VALUES (1, 5, 3, 'Max Saperstone', 'Butts R Us', NULL, 'insta', NULL, 'some experience', '');",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM jobs WHERE id = 1;',
    );
    expect(Notification).toHaveBeenCalledTimes(1);
    const mockNotificationInstance = Notification.mock.instances[0];
    const mockJobCreated = mockNotificationInstance.applicationSubmitted;
    expect(mockJobCreated).toHaveBeenCalledWith(15, 'Max Saperstone');
  });

  it('skips portfolio when no portfolio', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce([]);
    const jobApplication = JobApplication.create(
      1,
      5,
      3,
      'Max Saperstone',
      'Butts R Us',
      null,
      'insta',
      null,
      'some experience',
      [],
      [],
    );
    await expect(jobApplication.getId()).resolves.toEqual(15);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO job_applications (job_id, user_id, company_id, user_name, company_name, website, insta, fb, experience, comment) VALUES (1, 5, 3, 'Max Saperstone', 'Butts R Us', NULL, 'insta', NULL, 'some experience', NULL);",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM jobs WHERE id = 1;',
    );
    expect(Notification).toHaveBeenCalledTimes(0);
  });

  it('sets the job with skills and equipment and portfolio on creation', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce([{ user: 1 }])
      .mockResolvedValueOnce([{ username: 'max' }])
      .mockResolvedValueOnce([
        { user: 'max', email: 'email@address.com', email_notifications: 1 },
      ])
      .mockResolvedValueOnce([{ username: 'othermax' }]);
    const jobApplication = JobApplication.create(
      1,
      5,
      3,
      'Max Saperstone',
      'Butts R Us',
      'website',
      null,
      'fb',
      null,
      [
        { value: 3, label: 'Flash', what: 'Flashy Thang' },
        { value: 4, label: 'Camera', what: 'Camera Thingy' },
      ],
      [{ value: 2, label: 'Posing', what: 'babies' }],
      'some comment',
      [
        { description: 'description1', link: 'link1' },
        {},
        { description: 'description2', link: 'link2' },
        { description: 'description3' },
        { link: 'link4' },
      ],
    );
    await expect(jobApplication.getId()).resolves.toEqual(15);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(7);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO job_applications (job_id, user_id, company_id, user_name, company_name, website, insta, fb, experience, comment) VALUES (1, 5, 3, 'Max Saperstone', 'Butts R Us', 'website', NULL, 'fb', NULL, 'some comment');",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO job_applications_equipment (job_application, equipment, what) VALUES (15, 3, 'Flashy Thang');",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      "INSERT INTO job_applications_equipment (job_application, equipment, what) VALUES (15, 4, 'Camera Thingy');",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO job_applications_skills (job_application, skill) VALUES (15, 2);',
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      5,
      "INSERT INTO job_applications_portfolios (job_application, link, description) VALUES (15, 'link1', 'description1');",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      6,
      "INSERT INTO job_applications_portfolios (job_application, link, description) VALUES (15, 'link2', 'description2');",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      7,
      'SELECT * FROM jobs WHERE id = 1;',
    );
    expect(Notification).toHaveBeenCalledTimes(1);
    const mockNotificationInstance = Notification.mock.instances[0];
    const mockJobCreated = mockNotificationInstance.applicationSubmitted;
    expect(mockJobCreated).toHaveBeenCalledWith(15, 'Max Saperstone');
  });

  it('creates the new skill', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 12 })
      .mockResolvedValueOnce([]);
    const jobApplication = JobApplication.create(
      1,
      5,
      3,
      'Max Saperstone',
      'Butts R Us',
      null,
      'insta',
      null,
      'some experience',
      [],
      [{ value: 'new1', label: 'a new skill' }],
    );
    await expect(jobApplication.getId()).resolves.toEqual(15);
    // verify the sql calls
    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO job_applications (job_id, user_id, company_id, user_name, company_name, website, insta, fb, experience, comment) VALUES (1, 5, 3, 'Max Saperstone', 'Butts R Us', NULL, 'insta', NULL, 'some experience', NULL);",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO skills (name, who, date_created) VALUES ('a new skill', 5, CURRENT_TIMESTAMP);",
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT * FROM jobs WHERE id = 1;',
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO job_applications_skills (job_application, skill) VALUES (15, 12);',
    );
    expect(Notification).toHaveBeenCalledTimes(0);
  });

  it('retrieves nothing when application is missing', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValueOnce([]);
    const jobApplication = new JobApplication(5);
    await expect(jobApplication.getInfo()).resolves.toBeUndefined();

    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM job_applications WHERE job_applications.id = 5;',
    );
    expect(Notification).toHaveBeenCalledTimes(0);
  });

  it('retrieves all of the info for the request', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce([dataItem1])
      .mockResolvedValueOnce([{ value: 1, name: 'Camera' }])
      .mockResolvedValueOnce([])
      .mockResolvedValue([{ description: 1, link: 'link' }]);
    const jobApplication = new JobApplication(5);
    await expect(jobApplication.getInfo()).resolves.toEqual({
      date_time: '2024-10-13 00:00:00',
      details: "Max's 40th Birthday, woot!!!",
      duration: 8,
      durationMax: null,
      equipment: [{ name: 'Camera', value: 1 }],
      id: 1,
      location: 'Fairfax, VA 20030, United States of America',
      pay: 0.5,
      skills: [],
      type: "B'nai Mitzvah",
      typeId: 2,
      user: 1,
      portfolio: [{ description: 1, link: 'link' }],
    });

    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM job_applications WHERE job_applications.id = 5;',
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT equipment.id as value, equipment.name, job_applications_equipment.what FROM job_applications_equipment INNER JOIN equipment ON equipment.id = job_applications_equipment.equipment WHERE job_application = 5;',
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT skills.id as value, skills.name FROM job_applications_skills INNER JOIN skills ON skills.id = job_applications_skills.skill WHERE job_application = 5;',
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM job_applications_portfolios WHERE job_application = 5;',
    );
    expect(Notification).toHaveBeenCalledTimes(0);
  });

  it('gets all of our jobs', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue([dataItem1, dataItem2]);
    await expect(JobApplication.getApplications(2)).resolves.toEqual([
      dataItem1,
      dataItem2,
    ]);

    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM job_applications WHERE job_id = 2;',
    );
    expect(Notification).toHaveBeenCalledTimes(0);
  });

  it('gets all of a users applications', async () => {
    const sqlSpy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue([dataItem1, dataItem2]);
    await expect(JobApplication.getUserApplications(2)).resolves.toEqual([
      dataItem1,
      dataItem2,
    ]);

    expect(sqlSpy).toHaveBeenCalledTimes(1);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM job_applications WHERE job_applications.user_id = 2;',
    );
    expect(Notification).toHaveBeenCalledTimes(0);
  });
});
