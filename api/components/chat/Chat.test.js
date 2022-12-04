const Chat = require('./Chat');

jest.mock('../../services/Mysql');
const Mysql = require('../../services/Mysql');

describe('chat', () => {
  const sqlSpy = jest.spyOn(Mysql, 'query');
  let message;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    Mysql.query.mockResolvedValue([]);
    message = {
      to: 'msaperst',
      from: 'grob',
      body: 'hello',
      sentAt: 1669385983788,
      reviewed: false,
    };
  });

  it('errors out when a bad user is provided', async () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Chat('a');
    }).toThrow('Invalid User Input');
  });

  it('correctly adds a message to a conversation', async () => {
    Mysql.query
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 2 }])
      .mockResolvedValueOnce([]);
    await Chat.addConversation(message);
    expect(sqlSpy).toHaveBeenCalledTimes(5);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      5,
      expect.stringMatching(
        /^INSERT INTO conversations \(sender, recipient, sentAt, message, reviewed\) VALUES \(1, 2, '2022-11-25 \d{2}:19:43.788', 'hello', false\);$/
      )
    );
  });

  it('does nothing if mark message read is not array', async () => {
    const chat = new Chat(1);
    chat.markMessagesRead(message);
    expect(sqlSpy).toHaveBeenCalledTimes(0);
  });

  it('does nothing if mark message read is empty array', async () => {
    const chat = new Chat(1);
    chat.markMessagesRead([]);
    expect(sqlSpy).toHaveBeenCalledTimes(0);
  });

  it('marks each message as read that is passed in', async () => {
    const chat = new Chat(1);
    chat.markMessagesRead([1, 2]);
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      'UPDATE conversations SET reviewed = true WHERE id = 1 AND recipient = 1 AND reviewed = false;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'UPDATE conversations SET reviewed = true WHERE id = 2 AND recipient = 1 AND reviewed = false;'
    );
  });

  it('does nothing if mark all messages read is provided a bogus user', async () => {
    const chat = new Chat(1);
    await chat.markAllMessagesRead(1);
    expect(sqlSpy).toHaveBeenCalledTimes(1);
  });

  it('marks all messages as read', async () => {
    Mysql.query.mockResolvedValueOnce([{ id: 2 }]);
    const chat = new Chat(1);
    await chat.markAllMessagesRead(2);
    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      'UPDATE conversations SET reviewed = true WHERE sender = 2 AND recipient = 1 AND reviewed = false;'
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'UPDATE conversations SET reviewed = true WHERE sender = 1 AND recipient = 2 AND reviewed = false;'
    );
  });

  it('returns empty when user has no conversation history', async () => {
    const chat = new Chat(1);
    expect(await chat.getConversationList()).toEqual([]);
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT DISTINCT sender AS user, users.username, SUM(IF(reviewed = '0', 1, 0)) AS unread FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = 1 GROUP BY sender;"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT DISTINCT recipient AS user, users.username, 0 AS unread FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = 1;'
    );
  });

  it('returns user when only one conversation with one message exists', async () => {
    Mysql.query.mockResolvedValueOnce([{ user: 1, username: 'msaperst' }]);
    const chat = new Chat(1);
    expect(await chat.getConversationList()).toEqual([
      {
        user: 1,
        username: 'msaperst',
      },
    ]);
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT DISTINCT sender AS user, users.username, SUM(IF(reviewed = '0', 1, 0)) AS unread FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = 1 GROUP BY sender;"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT DISTINCT recipient AS user, users.username, 0 AS unread FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = 1;'
    );
  });

  it('returns users when multiple conversations with multiple messages exist', async () => {
    Mysql.query.mockResolvedValueOnce([
      { user: 1, username: 'msaperst' },
      { user: 1, username: 'msaperst' },
    ]);
    Mysql.query.mockResolvedValueOnce([
      { user: 2, username: 'grob' },
      { user: 1, username: 'msaperst' },
    ]);
    const chat = new Chat(1);
    expect(await chat.getConversationList()).toEqual([
      {
        user: 1,
        username: 'msaperst',
      },
      {
        user: 2,
        username: 'grob',
      },
    ]);
    expect(sqlSpy).toHaveBeenCalledTimes(2);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      1,
      "SELECT DISTINCT sender AS user, users.username, SUM(IF(reviewed = '0', 1, 0)) AS unread FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = 1 GROUP BY sender;"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      'SELECT DISTINCT recipient AS user, users.username, 0 AS unread FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = 1;'
    );
  });

  it('returns an empty array when a user is not supplied to get conversation with', async () => {
    const chat = new Chat(1);
    expect(await chat.getConversationWith()).toEqual([]);
    expect(sqlSpy).toHaveBeenCalledTimes(0);
  });

  it('returns an empty array when an invalid user is not supplied to get conversation with', async () => {
    const chat = new Chat(1);
    expect(await chat.getConversationWith('grob')).toEqual([]);
    expect(sqlSpy).toHaveBeenCalledTimes(1);
  });

  it('returns all messages for a provided user', async () => {
    Mysql.query
      .mockResolvedValueOnce([{ user: 1, username: 'msaperst' }])
      .mockResolvedValueOnce([{ ...message, reviewed: true }])
      .mockResolvedValueOnce([
        { ...message, sentAt: 1669385983780, reviewed: true },
        { ...message, sentAt: 1669385983789, id: 5 },
      ]);
    const chat = new Chat(1);
    expect(await chat.getConversationWith('grob')).toEqual([
      {
        body: 'hello',
        from: 'grob',
        reviewed: true,
        sentAt: 1669385983780,
        to: 'msaperst',
      },
      {
        body: 'hello',
        from: 'grob',
        reviewed: true,
        sentAt: 1669385983788,
        to: 'msaperst',
      },
      {
        body: 'hello',
        from: 'grob',
        id: 5,
        reviewed: false,
        sentAt: 1669385983789,
        to: 'msaperst',
      },
    ]);
    expect(sqlSpy).toHaveBeenCalledTimes(4);
    expect(sqlSpy).toHaveBeenNthCalledWith(
      2,
      "SELECT conversations.id, sentAt, reviewed, message AS body, users.username AS 'from', 'msaperst' AS 'to' FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = 1 AND users.username = 'grob';"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      3,
      "SELECT conversations.id, sentAt, reviewed, message AS body, users.username AS 'to', 'msaperst' AS 'from' FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = 1 AND users.username = 'grob';"
    );
    expect(sqlSpy).toHaveBeenNthCalledWith(
      4,
      'UPDATE conversations SET reviewed = true WHERE id = 5 AND recipient = 1 AND reviewed = false;'
    );
  });
});
