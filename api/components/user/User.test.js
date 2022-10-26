const bcrypt = require('bcryptjs');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const User = require('./User');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('User', () => {
  const location = {
    loc: 'Fairfax, VA, United States of America',
    lat: 5,
    lon: -71.2345,
  };
  const token = jwt.sign({ id: 123 }, 'some-super-secret-jwt-token');

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
    await expect(user.getInfo()).resolves.toEqual({
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
    await expect(user.getInfo()).resolves.toEqual({
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
    await expect(user.getInfo()).resolves.toEqual({
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
        {},
        'bobert@gmail.com',
        'Robert',
        ''
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
      location,
      `bobert@example.org`,
      'Bobert',
      'password'
    );
    await expect(user.getToken()).resolves.toEqual(undefined);
    await expect(user.getId()).resolves.toEqual(15);
    await expect(user.getUsername()).resolves.toEqual('Bobert');
    await expect(user.getInfo()).resolves.toEqual({
      avatar: undefined,
      email: 'bobert@example.org',
      firstName: 'Bob',
      id: 15,
      lastName: 'Robert',
      username: 'Bobert',
      lat: 5,
      loc: 'Fairfax, VA, United States of America',
      lon: -71.2345,
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
    expect(() => {
      User.auth('sometoken');
    }).toThrow(new JsonWebTokenError('jwt malformed'));
  });

  it('throws an error on a badly signed token', async () => {
    expect(() => {
      User.auth(jwt.sign({ id: 123 }, 'some-secret'));
    }).toThrow(new JsonWebTokenError('invalid signature'));
  });

  it('sets the user values on valid credentials via token', async () => {
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
    await expect(user.getInfo()).resolves.toEqual({
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
    const user = await User.auth(token);
    expect(await user.setAvatar('123')).toBeUndefined();
  });

  it('will not update account information if the email already exists', async () => {
    Mysql.query.mockResolvedValue([{}]);
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

  it('throws an error when the password has an error via update password', async () => {
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
    const user = await User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue([{ username: 'password' }]);
    await expect(user.updatePassword('Bob', 'password')).rejects.toEqual(
      new Error("Current password doesn't match existing password.")
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('throws an error when the password does not match via update password', async () => {
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
    const user = await User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue([{ password: 'password' }]);
    await expect(user.updatePassword('Bob', 'password')).rejects.toEqual(
      new Error("Current password doesn't match existing password.")
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('sets the password on valid credentials', async () => {
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
    const user = User.auth(token);
    const hash = await bcrypt.hash('password', 10);
    const spy = jest.spyOn(Mysql, 'query');
    Mysql.query.mockResolvedValue([{ password: hash }]);
    await user.updatePassword('password', 'password');
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('gets nothing with bad id', async () => {
    Mysql.query.mockResolvedValueOnce([]);
    const user = User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await user.getNotifications()).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can get all notifications', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]).mockResolvedValue([1, 2]);
    const user = User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await user.getNotifications()).toEqual([1, 2]);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM notifications WHERE to_user = 1 ORDER BY timestamp desc;'
    );
  });

  it('updates notification settings', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]);
    const user = User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    await user.updateNotificationSettings(1, false);
    await user.updateNotificationSettings('cheese', 0);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'UPDATE settings SET email_notifications = true, push_notifications = false WHERE user = 1;'
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      'UPDATE settings SET email_notifications = true, push_notifications = false WHERE user = 1;'
    );
  });

  it('marks a notification as read', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]);
    const user = User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    await user.markNotificationRead(5);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'UPDATE notifications SET reviewed = true WHERE id = 5 AND to_user = 1;'
    );
  });

  it('gets notification settings', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]).mockResolvedValueOnce([
      {
        user: 1,
        email_notifications: 0,
        push_notifications: 1,
      },
    ]);
    const user = User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await user.getSettings()).toEqual({
      user: 1,
      email_notifications: 0,
      push_notifications: 1,
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM settings WHERE user = 1;'
    );
  });

  it('does not gets notification settings without id', async () => {
    Mysql.query.mockResolvedValueOnce([]);
    const user = User.auth(token);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await user.getSettings()).toEqual({});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('gets basic user info as int', async () => {
    Mysql.query.mockResolvedValueOnce([
      {
        id: 1,
        first_name: 'max',
      },
    ]);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await User.getBasicUserInfo(1)).toEqual([
      {
        id: 1,
        first_name: 'max',
      },
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
    // issue #574 addresses this issue with username/id overlap
    expect(spy).toHaveBeenCalledWith(
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 1 OR username = '1';"
    );
  });

  it('gets basic user info as string', async () => {
    Mysql.query.mockResolvedValueOnce([
      {
        id: 1,
        first_name: 'max',
      },
    ]);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await User.getBasicUserInfo('max')).toEqual([
      {
        id: 1,
        first_name: 'max',
      },
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
    // issue #574 addresses this issue with username/id overlap
    expect(spy).toHaveBeenCalledWith(
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 0 OR username = 'max';"
    );
  });

  it('gets basic user info as mixed', async () => {
    Mysql.query.mockResolvedValueOnce([
      {
        id: 1,
        first_name: 'max',
      },
    ]);
    const spy = jest.spyOn(Mysql, 'query');
    expect(await User.getBasicUserInfo('*max1')).toEqual([
      {
        id: 1,
        first_name: 'max',
      },
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
    // issue #574 addresses this issue with username/id overlap
    expect(spy).toHaveBeenCalledWith(
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 0 OR username = 'max1';"
    );
  });
});
