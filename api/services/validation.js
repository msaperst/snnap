const { check } = require('express-validator');

exports.signupValidation = [
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

exports.loginValidation = [
  check('username', 'Please include a valid username').not().isEmpty(),
  check('password', 'Password must be 6 or more characters').isLength({
    min: 6,
  }),
];
