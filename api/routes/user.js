const express = require('express');

const router = express.Router();
const { validationResult, check } = require('express-validator');
const User = require('../components/user/User');

router.get('/get', async (req, res) => {
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

const avatarValidation = [
  check('File', 'Please include a valid avatar file').not().isEmpty(),
];

router.post('/set-avatar', avatarValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  try {
    return res.status(200).send();
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

module.exports = router;
