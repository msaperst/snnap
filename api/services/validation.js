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

exports.newRequestToHireValidation = [
  check('type', 'Please provide a valid job type.').isNumeric(),
  check('location', 'Please provide a valid location.').not().isEmpty(),
  check('details', 'Please provide a valid job details.').not().isEmpty(),
  check('pay', 'Please provide a valid pay.').isNumeric(),
  check('duration', 'Please provide a valid duration.').isNumeric(),
  check('range', 'Please provide a valid duration range.')
    .optional()
    .isNumeric(),
  check('date', 'Please provide a valid date.').isDate(),
  check('date', 'Please provide a date after today.').isAfter(),
  check('time', 'Please provide a valid time.').not().isEmpty(),
];
