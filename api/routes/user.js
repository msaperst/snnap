const express = require('express');

const router = express.Router();
const User = require('../components/user/User');

router.get('/get-user', async (req, res) => {
  let token;
  try {
    token = await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  const user = User.auth(token);
  try {
    return res.send(await user.getUserInfo());
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

module.exports = router;
