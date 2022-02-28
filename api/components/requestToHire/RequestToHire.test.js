const RequestToHire = require('./RequestToHire');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('sets the request to hire values on creation', async () => {
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
      '',
      ''
    );
    await expect(requestToHire.getId()).resolves.toEqual(15);
    await expect(requestToHire.getType()).resolves.toEqual(5);
    await expect(requestToHire.getLocation()).resolves.toEqual(
      'Fairfax, VA, United States of America'
    );
  });
});
