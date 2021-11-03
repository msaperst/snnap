const bcrypt = require('bcryptjs');
const User = require('./User');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('throws an error looking up the user', async () => {
    Mysql.query.mockResolvedValue([]);

    await expect(new User('Bob', 'password').getName()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('throws an error when no password is provided', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob' }]);

    await expect(new User('Bob', 'password').getName()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('throws an error when the password does not match', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob', password: 'password' }]);

    await expect(new User('Bob', 'password').getName()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('sets the user values on valid credentials', async () => {
    const hash = await bcrypt.hash('password', 10);
    Mysql.query.mockResolvedValue([
      {
        username: 'Bob',
        password: hash,
        name: 'Robert',
        email: 'bobert@gmail.com',
      },
    ]);

    const user = new User('Bob', 'password');
    await expect(user.getToken()).resolves.not.toBeNull();
    await expect(user.getName()).resolves.toEqual('Robert');
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getEmail()).resolves.toEqual('bobert@gmail.com');
  });
});
