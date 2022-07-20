const ApplicationForRequestToHire = require('./ApplicationForRequestToHire');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('application for request to hire', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('sets the request to hire with basic values on creation', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const applicationForRequestToHire = ApplicationForRequestToHire.create(
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
      []
    );
    await expect(applicationForRequestToHire.getId()).resolves.toEqual(15);
    // verify the sql calls
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "INSERT INTO hire_request_applications (hire_request_id, user_id, company_id, user_name, company_name, website, insta, fb, experience) VALUES (1, 5, 3, 'Max Saperstone', 'Butts R Us', NULL, 'insta', NULL, 'some experience');"
    );
  });

  it('sets the request to hire with skills and equipment and portfolio on creation', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const applicationForRequestToHire = ApplicationForRequestToHire.create(
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
      [
        { description: 'description1', link: 'link1' },
        {},
        { description: 'description2', link: 'link2' },
        { description: 'description3' },
        { link: 'link4' },
      ]
    );
    await expect(applicationForRequestToHire.getId()).resolves.toEqual(15);
    // verify the sql calls
    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO hire_request_applications (hire_request_id, user_id, company_id, user_name, company_name, website, insta, fb, experience) VALUES (1, 5, 3, 'Max Saperstone', 'Butts R Us', 'website', NULL, 'fb', NULL);"
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO hire_request_applications_equipment (hire_request_application, equipment, what) VALUES (15, 3, 'Flashy Thang');"
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      "INSERT INTO hire_request_applications_equipment (hire_request_application, equipment, what) VALUES (15, 4, 'Camera Thingy');"
    );
    expect(spy).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO hire_request_applications_skills (hire_request_application, skill) VALUES (15, 2);'
    );
    expect(spy).toHaveBeenNthCalledWith(
      5,
      "INSERT INTO hire_request_applications_portfolios (hire_request_application, link, description) VALUES (15, 'link1', 'description1');"
    );
    expect(spy).toHaveBeenNthCalledWith(
      6,
      "INSERT INTO hire_request_applications_portfolios (hire_request_application, link, description) VALUES (15, 'link2', 'description2');"
    );
  });

  it('retrieves all of the info for the request', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query
      .mockResolvedValueOnce([
        {
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
        },
      ])
      .mockResolvedValueOnce([{ value: 1, name: 'Camera' }])
      .mockResolvedValueOnce([])
      .mockResolvedValue([{ description: 1, link: 'link' }]);
    const applicationForRequestToHire = new ApplicationForRequestToHire(5);
    await expect(applicationForRequestToHire.getInfo()).resolves.toEqual({
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
      portfolio: [{ description: 1, link: 'link' }],
    });

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM hire_request_applications WHERE hire_request_applications.id = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'SELECT equipment.id as value, equipment.name, hire_request_applications_equipment.what FROM hire_request_applications_equipment INNER JOIN equipment ON equipment.id = hire_request_applications_equipment.equipment WHERE hire_request_application = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'SELECT skills.id as value, skills.name FROM hire_request_applications_skills INNER JOIN skills ON skills.id = hire_request_applications_skills.skill WHERE hire_request_application = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM hire_request_applications_portfolios WHERE hire_request_application = 5;'
    );
  });

  it('gets all of our hire requests', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue([
      {
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
      },
      {
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
      },
    ]);
    await expect(
      ApplicationForRequestToHire.getApplications(2)
    ).resolves.toEqual([
      {
        date_time: '2023-10-13 00:00:00',
        details: "Max's 40th Birthday, woot!!!",
        duration: 8,
        durationMax: null,
        id: 1,
        location: 'Fairfax, VA, United States of America',
        pay: 0.5,
        type: "B'nai Mitzvah",
        typeId: 2,
        user: 1,
      },
      {
        date_time: '2033-10-13 00:00:00',
        details: "Max's 50th Birthday, woot!!!",
        duration: 1,
        durationMax: null,
        id: 2,
        location: 'Fairfax, VA, United States of America',
        pay: 50,
        type: 'Event',
        typeId: 2,
        user: 1,
      },
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM hire_request_applications WHERE hire_request_id = 2;'
    );
  });
});
