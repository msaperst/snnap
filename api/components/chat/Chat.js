const db = require('mysql');
const Mysql = require('../../services/Mysql');
const User = require('../user/User');
const parseIntAndDbEscape = require('../Common');

const Chat = class {
  constructor(id) {
    this.id = parseIntAndDbEscape(id);
  }

  static async addConversation(message) {
    const senderId = (await User.getBasicUserInfo(message.from)).id;
    const recipientId = (await User.getBasicUserInfo(message.to)).id;
    await Mysql.query(
      `INSERT INTO conversations (sender, recipient, sentAt, message, reviewed) VALUES (${parseIntAndDbEscape(
        senderId
      )}, ${parseIntAndDbEscape(recipientId)}, ${db.escape(
        new Date(message.sentAt)
      )}, ${db.escape(message.body)}, ${Boolean.valueOf(message.reviewed)});`
    );
  }

  markMessagesRead(messages) {
    if (!Array.isArray(messages)) {
      return;
    }
    messages.forEach((message) => {
      Mysql.query(
        `UPDATE conversations SET reviewed = true WHERE id = ${parseIntAndDbEscape(
          message
        )} AND recipient = ${this.id} AND reviewed = false;`
      );
    });
  }

  async markAllMessagesRead(user) {
    const userInfo = await User.getBasicUserInfo(user);
    if (!userInfo) {
      return;
    }
    await Mysql.query(
      `UPDATE conversations SET reviewed = true WHERE sender = ${userInfo.id} AND recipient = ${this.id} AND reviewed = false;`
    );
    await Mysql.query(
      `UPDATE conversations SET reviewed = true WHERE sender = ${this.id} AND recipient = ${userInfo.id} AND reviewed = false;`
    );
  }

  async getConversationList() {
    const sent = await Mysql.query(
      `SELECT DISTINCT sender AS user, users.username, SUM(IF(reviewed = '0', 1, 0)) AS unread FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = ${this.id} GROUP BY sender;`
    );
    const received = await Mysql.query(
      `SELECT DISTINCT recipient AS user, users.username, 0 AS unread FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = ${this.id};`
    );
    const allConversations = [...sent, ...received];
    const uniqueConversations = [];
    allConversations.filter((item) => {
      const i = uniqueConversations.findIndex((x) => x.user === item.user);
      if (i <= -1) {
        uniqueConversations.push(item);
      }
      return null;
    });
    return uniqueConversations;
  }

  async getConversationWith(user) {
    if (!user) {
      return [];
    }
    const userInfo = await User.getBasicUserInfo(this.id);
    if (!userInfo) {
      return [];
    }
    const sent = await Mysql.query(
      `SELECT conversations.id, sentAt, reviewed, message AS body, users.username AS 'from', ${db.escape(
        userInfo.username
      )} AS 'to' FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = ${
        this.id
      } AND users.username = ${db.escape(user)};`
    );
    const received = await Mysql.query(
      `SELECT conversations.id, sentAt, reviewed, message AS body, users.username AS 'to', ${db.escape(
        userInfo.username
      )} AS 'from' FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = ${
        this.id
      } AND users.username = ${db.escape(user)};`
    );
    let allMessages = [...sent, ...received];
    allMessages = allMessages.sort(
      (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
    );
    const unread = allMessages.filter((message) => !message.reviewed);
    this.markMessagesRead(unread.map((message) => message.id));
    return allMessages;
  }
};

module.exports = Chat;
