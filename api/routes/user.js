const express = require('express');

const router = express.Router();
const fs = require('fs');
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
  try {
    const user = User.auth(token);
    return res.send(await user.getUserInfo());
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

router.post('/set-avatar', async (req, res) => {
  if (!req.files) {
    return res.status(422).send('Please include a valid avatar file');
  }
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

    const file = req.files.avatar;
    const extension = file.name.split('.').pop();
    const newName = `${await user.getUsername()}.${extension}`;
    const path = `${__dirname}/../../ui/public/avatars/${newName}`;

    // clean-up the old file
    try {
      fs.unlinkSync(path);
      // eslint-disable-next-line no-empty
    } catch (err) {}

    file.mv(path, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      await user.setAvatar(newName);
      return res.status(200).send({ file: newName });
    });
    return '';
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.errors[0]);
    }
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.errors[0]);
    }
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

module.exports = router;
