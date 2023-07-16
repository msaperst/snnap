const express = require('express');

const router = express.Router();
const { validationResult, check } = require('express-validator');
const User = require('../components/user/User');

const signupValidation = [
  check('firstName', 'Please provide a valid first name.').not().isEmpty(),
  check('lastName', 'Please provide a valid last name.').not().isEmpty(),
  check('location', 'Please select a valid city from the drop down.')
    .not()
    .isEmpty(),
  check('email', 'Please provide a valid email.')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check(
    'username',
    'Username can only contain alpha numeric characters and underscores.',
  ).matches(/^\w+$/),
  check(
    'username',
    'Username must contain at least one alphabetical character.',
  ).matches(/[a-zA-Z]+/),
  check('password', 'Password must be 6 or more characters.').isLength({
    min: 6,
  }),
];

router.post('/register', signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  const user = User.register(
    req.body.firstName,
    req.body.lastName,
    req.body.location,
    req.body.email,
    req.body.username,
    req.body.password,
  );
  try {
    await user.getToken();
    return res.status(201).send({
      msg: 'Thank you for registering with us!',
    });
  } catch (error) {
    switch (error.message) {
      case 'This email is already in our system. Try resetting your password.':
      case 'Sorry, that username is already in use.':
        return res.status(409).send({
          msg: error.message,
        });
      default:
        return res.status(400).send({
          msg: error.message,
        });
    }
  }
});

const loginValidation = [
  check('username', 'Please include a valid username.').not().isEmpty(),
  check('password', 'Please include a valid password.').not().isEmpty(),
  check('rememberMe', 'Remember me must be true or false.').isBoolean(),
];

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  const user = User.login(
    req.body.username,
    req.body.password,
    req.body.rememberMe,
  );
  try {
    const userInfo = await user.getInfo();
    userInfo.token = await user.getToken();
    return res.status(200).send(userInfo);
  } catch (error) {
    switch (error.message) {
      case 'Username or password is incorrect!':
        return res.status(401).send({
          msg: error.message,
        });
      default:
        return res.status(400).send({
          msg: error.message,
        });
    }
  }
});

const forgotValidation = [
  check('email', 'Please provide a valid email.')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];

router.post('/forgot', forgotValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  try {
    await User.forgot(req.body.email);
    return res.status(200).send({
      msg: 'successfully sent reset code',
    });
  } catch (error) {
    return res.status(409).send({
      msg: error.message,
    });
  }
});

const resetValidation = [
  check('email', 'Please provide a valid email.')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check('code', 'Please provide a valid code.').not().isEmpty(),
  check('password', 'Password must be 6 or more characters.').isLength({
    min: 6,
  }),
];

router.post('/reset', resetValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  try {
    const username = await User.reset(
      req.body.email,
      req.body.code,
      req.body.password,
    );
    return res.status(200).send({
      username,
    });
  } catch (error) {
    return res.status(409).send({
      msg: error.message,
    });
  }
});

module.exports = router;
