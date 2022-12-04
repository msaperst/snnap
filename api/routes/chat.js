const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const User = require('../components/user/User');
const Common = require('./common');
const Chat = require('../components/chat/Chat');

router.get('/conversation-list', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const chat = new Chat(User.decode(token).id);
    res.send(await chat.getConversationList());
  });
});

router.get('/conversation-with/:user', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const chat = new Chat(User.decode(token).id);
    res.send(await chat.getConversationWith(req.params.user));
  });
});

const markMessagesReadValidation = [
  check('user', 'User chatting with must be provided').isAlphanumeric(),
];

router.post(
  '/mark-messages-read',
  markMessagesReadValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const chat = new Chat(User.decode(token).id);
      await chat.markAllMessagesRead(req.body.user);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

module.exports = router;
