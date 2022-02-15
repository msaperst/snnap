const RequestToHire = require('./RequestToHire');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('sets the request to hire values on creation', async () => {
    Mysql.query.mockResolvedValue([]);

    const requestToHire = RequestToHire.create(
      5,
      'Fairfax, VA, United States of America',
      'Deetz',
      100,
      5,
      'Hours',
      '2022-02-16',
      '21:20',
      '',
      ''
    );
    await expect(requestToHire.getType()).resolves.toEqual(5);
    await expect(requestToHire.getLocation()).resolves.toEqual(
      'Fairfax, VA, United States of America'
    );
  });
});
