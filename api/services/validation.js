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
  check('type', 'Please select a valid job type').isIn([
    'Wedding',
    "B'nai Mitzvah",
    'Commercial Event',
    'Other',
  ]),
  check('location', 'Please include a job location').not().isEmpty(),
  check('details', 'Please include some job details').not().isEmpty(),
  check('pay', 'Please include the job pay').isNumeric(),
  check('duration', 'Please include the job duration').isNumeric(),
  check('units', 'Please include the job duration units').isIn([
    'Minutes',
    'Hours',
    'Days',
  ]),
  check('date', 'Please include the job date').isDate(),
  check('date', 'Please include a job date after today').isAfter(),
  check('time', 'Please include the job time').not().isEmpty(),
];
