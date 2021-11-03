const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./dbConnection');
const { signupValidation, loginValidation } = require('./validation');
const User = require('./components/user/User');

router.post('/register', signupValidation, async (req, res) => {
  const user = User.register(
    req.body.username,
    req.body.password,
    req.body.name,
    req.body.email
  );
  try {
    await user.getToken();
    return res.status(201).send({
      msg: 'Thank you for registering with us!',
    });
  } catch (error) {
    // TODO - switch based on response message
    return res.status(401).send({
      msg: error.message,
    });
  }
});

router.post('/login', loginValidation, async (req, res) => {
  const user = User.login(req.body.username, req.body.password);
  try {
    return res.status(200).send({
      token: await user.getToken(),
      name: await user.getName(),
      username: await user.getUsername(),
      email: await user.getEmail(),
    });
  } catch (error) {
    // TODO - switch based on response message
    return res.status(401).send({
      msg: error.message,
    });
  }
});

router.post('/get-user', signupValidation, (req, res) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
  ) {
    return res.status(422).json({
      message: 'Please provide the token',
    });
  }
  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
  db.query('SELECT * FROM users where id=?', decoded.id, (error, results) => {
    if (error) throw error;
    return res.send({
      error: false,
      data: results[0],
      message: 'Fetch Successfully.',
    });
  });
});

module.exports = router;
