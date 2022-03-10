const bcrypt = require('bcryptjs');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
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

    await expect(User.login('Bob', 'password').getUsername()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('throws an error when no password is provided via login', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob' }]);

    await expect(User.login('Bob', 'password').getUsername()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('throws an error when the password does not match via login', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob', password: 'password' }]);

    await expect(User.login('Bob', 'password').getUsername()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
  });

  it('sets the user values on valid credentials via login', async () => {
    const hash = await bcrypt.hash('password', 10);
    Mysql.query.mockResolvedValue([
      {
        id: '1',
        first_name: 'Bob',
        last_name: 'Robert',
        username: 'Bob',
        password: hash,
        name: 'Robert',
        email: 'bobert@gmail.com',
        last_login: 123,
      },
    ]);

    const user = User.login('Bob', 'password');
    await expect(user.getToken()).resolves.not.toBeNull();
    await expect(user.getId()).resolves.toEqual('1');
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getUserInfo()).resolves.toEqual({
      city: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: '1',
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
    });
  });

  it('sets the user values on valid credentials via login with remember me', async () => {
    const hash = await bcrypt.hash('password', 10);
    Mysql.query.mockResolvedValue([
      {
        id: '1',
        first_name: 'Bob',
        last_name: 'Robert',
        username: 'Bob',
        password: hash,
        name: 'Robert',
        email: 'bobert@gmail.com',
        last_login: 123,
      },
    ]);

    const user = User.login('Bob', 'password', true);
    await expect(user.getToken()).resolves.not.toBeNull();
    await expect(user.getId()).resolves.toEqual('1');
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getUserInfo()).resolves.toEqual({
      city: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: '1',
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
    });
  });

  it('sets the user values on valid credentials via login without remember me', async () => {
    const hash = await bcrypt.hash('password', 10);
    Mysql.query.mockResolvedValue([
      {
        id: '1',
        first_name: 'Bob',
        last_name: 'Robert',
        username: 'Bob',
        password: hash,
        name: 'Robert',
        email: 'bobert@gmail.com',
        last_login: 123,
      },
    ]);

    const user = User.login('Bob', 'password', false);
    await expect(user.getToken()).resolves.not.toBeNull();
    await expect(user.getId()).resolves.toEqual('1');
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getUserInfo()).resolves.toEqual({
      city: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: '1',
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
    });
  });

  it('throws an error when the email is already in the system via register', async () => {
    Mysql.query.mockResolvedValue([{}]);

    await expect(
      User.register(
        'Bob',
        'password',
        'Robert',
        'bobert@gmail.com'
      ).getUsername()
    ).rejects.toEqual(
      new Error(
        'This email is already in our system. Try resetting your password.'
      )
    );
  });

  it('throws an error when the user is already in the system via register', async () => {
    Mysql.query.mockResolvedValueOnce([]).mockResolvedValue([{}]);

    await expect(
      User.register(
        'Bob',
        'password',
        'Robert',
        'bobert@gmail.com'
      ).getUsername()
    ).rejects.toEqual(new Error('Sorry, that username is already in use.'));
  });

  it('sets the user values on valid credentials via register', async () => {
    Mysql.query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValue({ insertId: 15 });

    const user = User.register(
      'Bob',
      'Robert',
      'Robert',
      `bobert@example.org`,
      'Number',
      'password',
      'City',
      'State',
      'Zip'
    );
    await expect(user.getToken()).resolves.toEqual(undefined);
    await expect(user.getId()).resolves.toEqual(15);
    await expect(user.getUsername()).resolves.toEqual('Robert');
    await expect(user.getUserInfo()).resolves.toEqual({
      city: 'City',
      email: 'bobert@example.org',
      firstName: 'Bob',
      id: 15,
      lastName: 'Robert',
      number: 'Number',
      state: 'State',
      username: 'Robert',
      zip: 'Zip',
    });
  });

  it('fails if no token is set', () => {
    expect(() => {
      User.getToken(null);
    }).toThrow('Please provide the access token');
  });

  it('fails if token does not start with bearer', () => {
    expect(() => {
      User.getToken('123');
    }).toThrow('Please provide the access token');
  });

  it('fails if token does not have a space', () => {
    expect(() => {
      User.getToken('Bearer123');
    }).toThrow('Please provide the access token');
  });

  it('sends back the token', () => {
    expect(User.getToken('Bearer 123')).toEqual('123');
  });

  it('throws an error on a bad token', async () => {
    await expect(User.auth('sometoken').getUsername()).rejects.toEqual(
      new JsonWebTokenError('jwt malformed')
    );
  });

  it('throws an error on a badly signed token', async () => {
    await expect(
      User.auth(jwt.sign({ id: 123 }, 'some-secret')).getUsername()
    ).rejects.toEqual(new JsonWebTokenError('invalid signature'));
  });

  it('sets the user values on valid credentials via token', async () => {
    const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');
    Mysql.query.mockResolvedValue([
      {
        id: 1,
        first_name: 'Bob',
        last_name: 'Robert',
        username: 'Bob',
        name: 'Robert',
        email: 'bobert@gmail.com',
        last_login: '123',
      },
    ]);

    const user = User.auth(token);
    await expect(user.getToken()).resolves.toEqual(token);
    await expect(user.getId()).resolves.toEqual(1);
    await expect(user.getUsername()).resolves.toEqual('Bob');
    await expect(user.getUserInfo()).resolves.toEqual({
      city: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: 1,
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
    });
  });

  it('recognizes an invalid token and rejects with an error', async () => {
    const token = jwt.sign({ id: 123 }, 'some-secret');
    await expect(User.isAuth(`Bearer ${token}`)).rejects.toEqual(
      new JsonWebTokenError('invalid signature')
    );
  });

  it('recognizes an valid token and rejects with an error', async () => {
    const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');
    Mysql.query.mockResolvedValue([
      {
        first_name: 'Bob',
        last_name: 'Robert',
        username: 'Bob',
        name: 'Robert',
        email: 'bobert@gmail.com',
        last_login: '123',
      },
    ]);
    expect(await User.isAuth(`Bearer ${token}`)).toEqual(token);
  });

  it('updates the avatar in the db', async () => {
    Mysql.query.mockResolvedValue([
      {
        id: 1,
        first_name: 'Bob',
        last_name: 'Robert',
        username: 'Bob',
        name: 'Robert',
        email: 'bobert@gmail.com',
        last_login: '123',
      },
    ]);
    const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');
    const user = await User.auth(token);
    expect(await user.setAvatar('123')).toBeUndefined();
  });

  it('will not update account information if the email already exists', async () => {
    Mysql.query.mockResolvedValue([{}]);
    const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');
    const user = await User.auth(token);
    await expect(
      user.setAccountInformation('msaperst@gmail.com', '1234567890')
    ).rejects.toEqual(new Error('This email is already in our system.'));
  });

  it('updates the account information in the db', async () => {
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 1,
          first_name: 'Bob',
          last_name: 'Robert',
          username: 'Bob',
          name: 'Robert',
          email: 'bobert@gmail.com',
          last_login: '123',
        },
      ])
      .mockResolvedValue([]);
    const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');
    const user = await User.auth(token);
    expect(
      await user.setAccountInformation('msaperst@gmail.com', '1234567890')
    ).toBeUndefined();
  });

  it('updates the personal information in the db', async () => {
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 1,
          first_name: 'Bob',
          last_name: 'Robert',
          username: 'Bob',
          name: 'Robert',
          email: 'bobert@gmail.com',
          last_login: '123',
        },
      ])
      .mockResolvedValue([]);
    const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');
    const user = await User.auth(token);
    expect(
      await user.setPersonalInformation(
        'Max',
        'Saperstone',
        'Fairfax',
        'VA',
        '22030'
      )
    ).toBeUndefined();
  });
});
