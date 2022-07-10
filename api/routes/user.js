const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const User = require('../components/user/User');
const Mysql = require('../services/Mysql');
const Common = require('./common');

router.get('/get', async (req, res) => {
  let token;
  try {
    token = await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  try {
    const user = User.auth(token);
    return res.send(await user.getInfo());
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

router.get('/get/:user', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  try {
    const userInfo =
      await Mysql.query(`SELECT id, username, first_name, last_name, avatar
                                         FROM users WHERE id = '${req.params.user}' OR username = '${req.params.user}';`);
    if (userInfo[0] && userInfo[0].id) {
      return res.send(userInfo[0]);
    }
    return res.status(422).send({ msg: 'user not found' });
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

const setAvatarValidation = [
  check('avatar', 'Avatar is required').not().isEmpty(),
];

router.post('/set-avatar', setAvatarValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    await user.setAvatar(req.body.avatar);
    return res.status(200).send();
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

const updateAccountInformationValidation = [
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check('number', 'Number is required').not().isEmpty(),
];

router.post(
  '/update-account-information',
  updateAccountInformationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      await user.setAccountInformation(req.body.email, req.body.number);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

const updatePersonalInformationValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zip', 'Zip is required').not().isEmpty(),
];

router.post(
  '/update-personal-information',
  updatePersonalInformationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      await user.setPersonalInformation(
        req.body.firstName,
        req.body.lastName,
        req.body.city,
        req.body.state,
        req.body.zip
      );
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

const updatePasswordValidation = [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Password must be 6 or more characters').isLength({
    min: 6,
  }),
];

router.post('/update-password', updatePasswordValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    await user.updatePassword(req.body.currentPassword, req.body.newPassword);
    return res.status(200).send();
  } catch (error) {
    switch (error.message) {
      case "Current password doesn't match existing password.":
        return res.status(409).send({
          msg: error.message,
        });
      default:
        return res.status(422).send({
          msg: error.message,
        });
    }
  }
});

module.exports = router;
