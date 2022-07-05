const RequestToHire = require('./RequestToHire');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('sets the request to hire with basic values on creation', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const requestToHire = RequestToHire.create(
      1,
      5,
      'Fairfax, VA, United States of America',
      'Deetz',
      100,
      5,
      null,
      '2022-02-16',
      [],
      []
    );
    await expect(requestToHire.getId()).resolves.toEqual(15);
    await expect(requestToHire.getType()).resolves.toEqual(5);
    await expect(requestToHire.getLocation()).resolves.toEqual(
      'Fairfax, VA, United States of America'
    );
    // verify the sql calls
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "INSERT INTO hire_requests (user, type, location, details, pay, duration, durationMax, date_time) VALUES (1, 5, 'Fairfax, VA, United States of America', 'Deetz', 100, 5, NULL, '2022-02-16 00:00:00')"
    );
  });

  it('sets the request to hire with skills and equipment on creation', async () => {
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue({ insertId: 15 });
    const requestToHire = RequestToHire.create(
      1,
      5,
      'Fairfax, VA, United States of America',
      'Deetz',
      100,
      5,
      null,
      '2022-02-16',
      [3, 4],
      [2]
    );
    await expect(requestToHire.getId()).resolves.toEqual(15);
    await expect(requestToHire.getType()).resolves.toEqual(5);
    await expect(requestToHire.getLocation()).resolves.toEqual(
      'Fairfax, VA, United States of America'
    );
    // verify the sql calls
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO hire_requests (user, type, location, details, pay, duration, durationMax, date_time) VALUES (1, 5, 'Fairfax, VA, United States of America', 'Deetz', 100, 5, NULL, '2022-02-16 00:00:00')"
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO hire_requests_equipment (hire_request, equipment) VALUES (15, 3);'
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'INSERT INTO hire_requests_equipment (hire_request, equipment) VALUES (15, 4);'
    );
    expect(spy).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO hire_requests_skills (hire_request, skill) VALUES (15, 2);'
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
      .mockResolvedValue([]);
    const requestToHire = new RequestToHire(5);
    await expect(requestToHire.getInfo()).resolves.toEqual({
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

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      'SELECT hire_requests.*, hire_requests.type as typeId, job_types.type FROM hire_requests INNER JOIN job_types ON hire_requests.type = job_types.id WHERE hire_requests.id = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'SELECT equipment.id as value, equipment.name FROM hire_requests_equipment INNER JOIN equipment ON equipment.id = hire_requests_equipment.equipment WHERE hire_request = 5;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'SELECT skills.id as value, skills.name FROM hire_requests_skills INNER JOIN skills ON skills.id = hire_requests_skills.skill WHERE hire_request = 5;'
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
    await expect(RequestToHire.getHireRequests()).resolves.toEqual([
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
      'SELECT hire_requests.*, hire_requests.type as typeId, job_types.type FROM hire_requests INNER JOIN job_types ON hire_requests.type = job_types.id WHERE hire_requests.date_time > NOW();'
    );
  });
});
