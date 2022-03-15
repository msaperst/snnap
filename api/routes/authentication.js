const express = require('express');

const router = express.Router();
const { validationResult, check } = require('express-validator');
const User = require('../components/user/User');

const signupValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('number', 'Number is required').not().isEmpty(),
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check('password', 'Password must be 6 or more characters').isLength({
    min: 6,
  }),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zip', 'Zip is required').not().isEmpty(),
];

const loginValidation = [
  check('username', 'Please include a valid username').not().isEmpty(),
  check('password', 'Please include a valid password').not().isEmpty(),
  check('rememberMe', 'Remember me must be true or false').isBoolean(),
];

router.post('/register', signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  const user = User.register(
    req.body.firstName,
    req.body.lastName,
    req.body.username,
    req.body.email,
    req.body.number,
    req.body.password,
    req.body.city,
    req.body.state,
    req.body.zip
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

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.errors[0]);
  }
  const user = User.login(
    req.body.username,
    req.body.password,
    req.body.rememberMe
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

module.exports = router;
