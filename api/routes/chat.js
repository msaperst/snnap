const express = require('express');

const router = express.Router();
const User = require('../components/user/User');
const Common = require('./common');
const Chat = require('../components/chat/Chat');

router.get('/conversation-list', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    const chat = new Chat(await user.getId());
    res.send(await chat.getConversationList());
  });
});

router.get('/conversation-with/:user', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    const chat = new Chat(await user.getId());
    res.send(await chat.getConversationWith(req.params.user));
  });
});

module.exports = router;
