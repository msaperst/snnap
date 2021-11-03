const bcrypt = require('bcryptjs');
const User = require('./User');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('throws an error looking up the user via login', async () => {
    Mysql.query.mockResolvedValue([]);

    await expect(User.login('Bob', 'password').getName()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('throws an error when no password is provided via login', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob' }]);

    await expect(User.login('Bob', 'password').getName()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('throws an error when the password does not match via login', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob', password: 'password' }]);

    await expect(User.login('Bob', 'password').getName()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('sets the user values on valid credentials via login', async () => {
    const hash = await bcrypt.hash('password', 10);
    Mysql.query.mockResolvedValue([
      {
        username: 'Bob',
        password: hash,
        name: 'Robert',
        email: 'bobert@gmail.com',
      },
    ]);

    const user = User.login('Bob', 'password');
    await expect(user.getToken()).resolves.not.toBeNull();
    await expect(user.getName()).resolves.toEqual('Robert');
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getEmail()).resolves.toEqual('bobert@gmail.com');
  });

  it('throws an error when the email is already in the system via register', async () => {
    Mysql.query.mockResolvedValue([{}]);

    await expect(
      User.register('Bob', 'password', 'Robert', 'bobert@gmail.com').getName()
    ).rejects.toEqual(
      new Error(
        'This email is already in our system. Try resetting your password.'
      )
    );
  });

  it('throws an error when the user is already in the system via register', async () => {
    Mysql.query.mockResolvedValueOnce([]).mockResolvedValue([{}]);

    await expect(
      User.register('Bob', 'password', 'Robert', 'bobert@gmail.com').getName()
    ).rejects.toEqual(new Error('Sorry, that username is already in use.'));
  });

  it('sets the user values on valid credentials via register', async () => {
    Mysql.query.mockResolvedValue([]);

    const user = User.register('Bob', 'password', 'Robert', 'bobert@gmail.com');
    await expect(user.getToken()).resolves.toEqual(undefined);
    await expect(user.getName()).resolves.toEqual('Robert');
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getEmail()).resolves.toEqual('bobert@gmail.com');
  });
});
