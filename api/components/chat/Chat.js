const db = require('mysql');
const Mysql = require('../../services/Mysql');
const User = require('../user/User');
const parseIntAndDbEscape = require('../Common');

const Chat = class {
  constructor(id) {
    if (id) {
      this.id = parseIntAndDbEscape(id);
    }
  }

  static async addConversation(message) {
    const senderId = (await User.getBasicUserInfo(message.from)).id;
    const recipientId = (await User.getBasicUserInfo(message.to)).id;
    await Mysql.query(
      `INSERT INTO conversations (sender, recipient, sentAt, message) VALUES (${senderId}, ${recipientId}, ${db.escape(
        new Date(message.sentAt)
      )}, ${db.escape(message.body)});`
    );
  }

  async getConversationList() {
    const sent = await Mysql.query(
      `SELECT distinct sender AS user, users.username FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = ${this.id}`
    );
    const received = await Mysql.query(
      `SELECT distinct recipient AS user, users.username FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = ${this.id}`
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
      `SELECT sentAt, message AS body, users.username AS 'from', ${db.escape(
        userInfo.username
      )} AS 'to' FROM conversations INNER JOIN users ON conversations.sender = users.id WHERE recipient = ${
        this.id
      } AND users.username = ${db.escape(user)}`
    );
    const received = await Mysql.query(
      `SELECT sentAt, message AS body, users.username AS 'to', ${db.escape(
        userInfo.username
      )} AS 'from' FROM conversations INNER JOIN users ON conversations.recipient = users.id WHERE sender = ${
        this.id
      } AND users.username = ${db.escape(user)}`
    );
    const allMessages = [...sent, ...received];
    return allMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  }
};

module.exports = Chat;
