const bcrypt = require('bcryptjs');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const User = require('./User');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

jest.mock('../../services/Email');
const Email = require('../../services/Email');

describe('User', () => {
  const location = {
    loc: 'Fairfax, VA, United States of America',
    lat: 5,
    lon: -71.2345,
  };
  const token = jwt.sign(
    { id: 123, username: 'bob' },
    'some-super-secret-jwt-token',
    {}
  );
  let hash;
  let mysqlSpy;
  let emailSpy;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mysqlSpy = jest.spyOn(Mysql, 'query');
    emailSpy = jest.spyOn(Email, 'sendMail');
    hash = await bcrypt.hash('password', 10);
  });

  it('return 0 (invalid) when no token to decode', () => {
    expect(User.decode()).toEqual({ id: 0 });
  });

  it('returns id and username when valid token to decode', () => {
    expect(User.decode(token)).toMatchObject({
      iat: expect.any(Number),
      id: 123,
      username: 'bob',
    });
  });

  it('throws an error looking up the user via login', async () => {
    Mysql.query.mockResolvedValue([]);

    await expect(
      User.login('Bob123@#$', 'password').getUsername()
    ).rejects.toEqual(new Error('Username or password is incorrect!'));
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE username = 'Bob123';"
    );
  });

  it('throws an error when no password is provided via login', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob123' }]);

    await expect(
      User.login('Bob123', 'password').getUsername()
    ).rejects.toEqual(new Error('Username or password is incorrect!'));
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE username = 'Bob123';"
    );
  });

  it('throws an error when the password does not match via login', async () => {
    Mysql.query.mockResolvedValue([{ username: 'Bob', password: 'password' }]);

    await expect(User.login('Bob', 'password').getUsername()).rejects.toEqual(
      new Error('Username or password is incorrect!')
    );
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE username = 'Bob';"
    );
  });

  it('sets the user values on valid credentials via login', async () => {
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
      avatar: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: '1',
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
      lat: undefined,
      loc: undefined,
      lon: undefined,
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(4);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE username = 'Bob';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'UPDATE users SET last_login = now() WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT * FROM users WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
  });

  it('sets the user values on valid credentials via login with remember me', async () => {
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
      avatar: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: '1',
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
      lat: undefined,
      loc: undefined,
      lon: undefined,
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(4);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE username = 'Bob';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'UPDATE users SET last_login = now() WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT * FROM users WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
  });

  it('sets the user values on valid credentials via login without remember me', async () => {
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
      avatar: undefined,
      email: 'bobert@gmail.com',
      firstName: 'Bob',
      id: '1',
      lastName: 'Robert',
      number: undefined,
      state: undefined,
      username: 'Bob',
      zip: undefined,
      lat: undefined,
      loc: undefined,
      lon: undefined,
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(4);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE username = 'Bob';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'UPDATE users SET last_login = now() WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      'SELECT * FROM users WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      4,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
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
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE LOWER(email) = LOWER('bobert@gmail.com');"
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
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE LOWER(email) = LOWER('bobert@gmail.com');"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM users WHERE LOWER(username) = LOWER('Robert');"
    );
  });

  it('sets the user values on valid credentials via register', async () => {
    Mysql.query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce({ insertId: 15 })
      .mockResolvedValueOnce([]);

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
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(6);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM users WHERE LOWER(email) = LOWER('bobert@example.org');"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM users WHERE LOWER(username) = LOWER('Bobert');"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(
        /^INSERT INTO users \(first_name, last_name, email, username, password, loc, lat, lon\) VALUES \('Bob', 'Robert', 'bobert@example.org', 'Bobert', '.*', 'Fairfax, VA, United States of America', 5, -71.2345\);/
      )
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO settings (user) VALUE (15);'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      5,
      'INSERT INTO companies (user) VALUE (15);'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      6,
      'SELECT * FROM ratings WHERE ratee = 15 AND rating IS NOT NULL;'
    );
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
      lat: undefined,
      loc: undefined,
      lon: undefined,
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
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
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
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
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "UPDATE users SET avatar = '123' WHERE id = 1"
    );
  });

  it('will not update account information if the email already exists', async () => {
    Mysql.query.mockResolvedValue([{}]);
    const user = await User.auth(token);
    await expect(
      user.setAccountInformation('msaperst@gmail.com', '1234567890')
    ).rejects.toEqual(new Error('This email is already in our system.'));
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM users WHERE LOWER(email) = LOWER('msaperst@gmail.com') AND id != undefined;"
    );
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
    expect(mysqlSpy).toHaveBeenCalledTimes(3);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM users WHERE LOWER(email) = LOWER('msaperst@gmail.com') AND id != 1;"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      "UPDATE users SET email  = 'msaperst@gmail.com' WHERE id = 1"
    );
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
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "UPDATE users SET first_name = 'Max', last_name = 'Saperstone', loc = NULL, lat = NaN, lon = NaN WHERE id = 1"
    );
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
    Mysql.query.mockResolvedValue([{ username: 'password' }]);
    await expect(user.updatePassword('Bob', 'password')).rejects.toEqual(
      new Error("Current password doesn't match existing password.")
    );
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT password FROM users WHERE id = 1;'
    );
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
    Mysql.query.mockResolvedValue([{ password: 'password' }]);
    await expect(user.updatePassword('Bob', 'password')).rejects.toEqual(
      new Error("Current password doesn't match existing password.")
    );
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT password FROM users WHERE id = 1;'
    );
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
    Mysql.query.mockResolvedValue([{ password: hash }]);
    await user.updatePassword('password', 'password');
    expect(mysqlSpy).toHaveBeenCalledTimes(3);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT password FROM users WHERE id = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(/UPDATE users SET password = '.*' WHERE id = 1/)
    );
  });

  it('gets nothing with bad id', async () => {
    Mysql.query.mockResolvedValueOnce([]);
    const user = User.auth(token);
    expect(await user.getNotifications()).toEqual([]);
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
  });

  it('can get all notifications', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]).mockResolvedValue([1, 2]);
    const user = User.auth(token);
    expect(await user.getNotifications()).toEqual([1, 2]);
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM notifications WHERE to_user = 1 ORDER BY timestamp desc;'
    );
  });

  it('updates notification settings', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]);
    const user = User.auth(token);
    await user.updateNotificationSettings(1, false);
    await user.updateNotificationSettings('cheese', 0);
    expect(mysqlSpy).toHaveBeenCalledTimes(3);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'UPDATE settings SET email_notifications = true, push_notifications = false WHERE user = 1;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      'UPDATE settings SET email_notifications = true, push_notifications = false WHERE user = 1;'
    );
  });

  it('marks a notification as read', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 1 }]);
    const user = User.auth(token);
    await user.markNotificationRead(5);
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
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
    expect(await user.getSettings()).toEqual({
      user: 1,
      email_notifications: 0,
      push_notifications: 1,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM settings WHERE user = 1;'
    );
  });

  it('does not gets notification settings without id', async () => {
    Mysql.query.mockResolvedValueOnce([]);
    const user = User.auth(token);
    expect(await user.getSettings()).toEqual({});
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
  });

  it('gets basic user info as int', async () => {
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 1,
          first_name: 'max',
        },
      ])
      .mockResolvedValueOnce([]);
    expect(await User.getBasicUserInfo(1)).toEqual({
      id: 1,
      first_name: 'max',
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    // issue #574 addresses this issue with username/id overlap
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 1 OR username = '1';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
  });

  it('gets basic user info as string', async () => {
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 1,
          first_name: 'max',
        },
      ])
      .mockResolvedValue([]);
    expect(await User.getBasicUserInfo('max')).toEqual({
      id: 1,
      first_name: 'max',
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    // issue #574 addresses this issue with username/id overlap
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 'NaN' OR username = 'max';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
  });

  it('gets basic user info as mixed', async () => {
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 1,
          first_name: 'max',
        },
      ])
      .mockResolvedValueOnce([]);
    expect(await User.getBasicUserInfo('*max1')).toEqual({
      id: 1,
      first_name: 'max',
      rating: null,
    });
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    // issue #574 addresses this issue with username/id overlap
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 'NaN' OR username = 'max1';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM ratings WHERE ratee = 1 AND rating IS NOT NULL;'
    );
  });

  it('gets empty basic user info when there is no match', async () => {
    Mysql.query.mockResolvedValue([]);
    expect(await User.getBasicUserInfo('*max1')).toBeUndefined();
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    // issue #574 addresses this issue with username/id overlap
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, username, first_name, last_name, avatar FROM users WHERE id = 'NaN' OR username = 'max1';"
    );
  });

  it('does not set forget if nothing is not found', async () => {
    Mysql.query.mockResolvedValueOnce();
    await User.forgot('someemail@email.email');
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, email FROM users WHERE email = 'someemail@email.email';"
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('does not set forget if no user is found', async () => {
    Mysql.query.mockResolvedValueOnce([]);
    await User.forgot('someemail@email.email');
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, email FROM users WHERE email = 'someemail@email.email';"
    );
    expect(emailSpy).toHaveBeenCalledTimes(0);
  });

  it('sets forget if user is found', async () => {
    jest.useFakeTimers();
    Mysql.query.mockResolvedValueOnce([
      { id: 4, email: 'someemail@email.email' },
    ]);
    await User.forgot('someemail@email.email');
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT id, email FROM users WHERE email = 'someemail@email.email';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(
        /UPDATE users SET password_reset_code = '[a-f0-9]{6}', password_reset_count = 0 WHERE id = 4;/
      )
    );
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenNthCalledWith(
      1,
      'someemail@email.email',
      'SNNAP: Password Reset',
      expect.stringMatching(
        /We just received a password reset request from you.\nEnter the below code into the form.\n[a-f0-9]{6}\nThis code is only valid for 10 minutes, and will reset after 3 invalid reset attempts./
      ),
      expect.stringMatching(
        /We just received a password reset request from you.<br\/>Enter the below code into the form.<br\/><b>[a-f0-9]{6}<\/b><br\/>This code is only valid for 10 minutes, and will reset after 3 invalid reset attempts./
      )
    );
    jest.runOnlyPendingTimers();
    expect(mysqlSpy).toHaveBeenCalledTimes(3);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      'UPDATE users SET password_reset_code = NULL WHERE id = 4;'
    );
  });

  it('does not set reset if nothing is not found', async () => {
    Mysql.query.mockResolvedValue();
    await expect(
      User.reset('someemail@email.email', '123456', 'password')
    ).rejects.toEqual(new Error('Supplied code does not match!'));
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "UPDATE users SET password_reset_count = password_reset_count+1 WHERE email = 'someemail@email.email';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT id, username FROM users WHERE email = 'someemail@email.email' AND password_reset_code = '123456' AND password_reset_count < 4;"
    );
  });

  it('does not set reset if no user is found - bad code or high count', async () => {
    Mysql.query.mockResolvedValue([]);
    await expect(
      User.reset('someemail@email.email', '123456', 'password')
    ).rejects.toEqual(new Error('Supplied code does not match!'));
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "UPDATE users SET password_reset_count = password_reset_count+1 WHERE email = 'someemail@email.email';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT id, username FROM users WHERE email = 'someemail@email.email' AND password_reset_code = '123456' AND password_reset_count < 4;"
    );
  });

  it('resets password when correct information provided', async () => {
    Mysql.query.mockResolvedValue([{ id: 4, username: 'someuser' }]);
    expect(
      await User.reset('someemail@email.email', '123456', 'password')
    ).toEqual('someuser');
    expect(mysqlSpy).toHaveBeenCalledTimes(3);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      "UPDATE users SET password_reset_count = password_reset_count+1 WHERE email = 'someemail@email.email';"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT id, username FROM users WHERE email = 'someemail@email.email' AND password_reset_code = '123456' AND password_reset_count < 4;"
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(
        /UPDATE users SET password = '.*', password_reset_code = NULL WHERE id = 4;/
      )
    );
  });

  it('shows empty when invalid user id', async () => {
    Mysql.query.mockResolvedValueOnce([]);
    const user = User.auth(token);
    expect(await user.getNeededRates()).toEqual([]);
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
  });

  it('allows retrieving all jobs requiring being rated', async () => {
    const results = [{ id: 1, userId: 2, jobId: 3 }];
    Mysql.query
      .mockResolvedValueOnce([
        {
          id: 123,
        },
      ])
      .mockResolvedValueOnce(results);
    const user = User.auth(token);
    expect(await user.getNeededRates()).toEqual(results);
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT id, ratee as userId, job as jobId FROM ratings WHERE rater = 123 AND job_date < CURRENT_DATE AND date_rated IS NULL;'
    );
  });

  it('allows setting a rating for the user', async () => {
    Mysql.query.mockResolvedValue([{ id: 123 }]);
    const user = User.auth(token);
    await user.rate(12, true);
    expect(mysqlSpy).toHaveBeenCalledTimes(2);
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM users WHERE id = 123;'
    );
    expect(mysqlSpy).toHaveBeenNthCalledWith(
      2,
      'UPDATE ratings SET rating = true, date_rated = CURRENT_TIMESTAMP WHERE id = 12 AND rater = 123;'
    );
  });

  it('returns null when no user', async () => {
    expect(await User.getRating()).toBeNull();
    expect(mysqlSpy).toHaveBeenCalledTimes(0);
    expect(await User.getRating(null)).toBeNull();
    expect(mysqlSpy).toHaveBeenCalledTimes(0);
    expect(await User.getRating(0)).toBeNull();
    expect(mysqlSpy).toHaveBeenCalledTimes(0);
  });

  it('returns null when no ratings exist for a user', async () => {
    Mysql.query.mockResolvedValue([]);
    expect(await User.getRating(2)).toBeNull();
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM ratings WHERE ratee = 2 AND rating IS NOT NULL;'
    );
  });

  it('returns null when 4 ratings exist for a user', async () => {
    Mysql.query.mockResolvedValue([
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
    ]);
    expect(await User.getRating(2)).toBeNull();
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM ratings WHERE ratee = 2 AND rating IS NOT NULL;'
    );
  });

  it('returns false when 3 bad, 2 good ratings exist for a user', async () => {
    Mysql.query.mockResolvedValue([
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 1 },
      { rating: 1 },
    ]);
    expect(await User.getRating(2)).toBeFalsy();
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM ratings WHERE ratee = 2 AND rating IS NOT NULL;'
    );
  });

  it('returns true when 2 bad, 3 good ratings exist for a user', async () => {
    Mysql.query.mockResolvedValue([
      { rating: 0 },
      { rating: 0 },
      { rating: 1 },
      { rating: 1 },
      { rating: 1 },
    ]);
    expect(await User.getRating(2)).toBeTruthy();
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM ratings WHERE ratee = 2 AND rating IS NOT NULL;'
    );
  });

  it('returns true when 5 bad, 5 good ratings exist for a user', async () => {
    Mysql.query.mockResolvedValue([
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 1 },
      { rating: 1 },
      { rating: 1 },
      { rating: 1 },
      { rating: 1 },
    ]);
    expect(await User.getRating(2)).toBeTruthy();
    expect(mysqlSpy).toHaveBeenCalledTimes(1);
    expect(mysqlSpy).toHaveBeenCalledWith(
      'SELECT * FROM ratings WHERE ratee = 2 AND rating IS NOT NULL;'
    );
  });
});
