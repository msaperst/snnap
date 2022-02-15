const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');
const {
  signupValidation,
  loginValidation,
  newRequestToHireValidation,
} = require('./validation');
const User = require('../components/user/User');

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
  const user = User.login(req.body.username, req.body.password);
  try {
    return res.status(200).send({
      token: await user.getToken(),
      name: await user.getName(),
      username: await user.getUsername(),
      email: await user.getEmail(),
    });
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

router.get('/get-user', async (req, res) => {
  let token;
  try {
    token = User.getToken(req.headers.authorization);
  } catch (error) {
    return res.status(422).json({
      message: error.message,
    });
  }
  const user = User.auth(token);
  try {
    return res.send({
      name: await user.getName(),
      username: await user.getUsername(),
      email: await user.getEmail(),
      lastLogin: await user.getLastLogin(),
    });
  } catch (error) {
    return res.status(401).send({
      msg: error.message,
    });
  }
});

router.post(
  '/newRequestToHire',
  newRequestToHireValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.errors[0]);
    }
    try {
      User.getToken(req.headers.authorization);
    } catch (error) {
      return res.status(422).json({
        message: error.message,
      });
    }
    try {
      // TODO - do something
      return res.send(req.body);
    } catch (error) {
      return res.status(401).send({
        msg: error.message,
      });
    }
  }
);

module.exports = router;
