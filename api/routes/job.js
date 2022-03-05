const express = require('express');

const router = express.Router();
const { validationResult, check } = require('express-validator');
const Mysql = require('../services/Mysql');
const User = require('../components/user/User');
const RequestToHire = require('../components/requestToHire/RequestToHire');

const newRequestToHireValidation = [
  check('type', 'Please provide a valid job type.').isNumeric(),
  check('location', 'Please provide a valid location.').not().isEmpty(),
  check('details', 'Please provide a valid job details.').not().isEmpty(),
  check('pay', 'Please provide a valid pay.').isNumeric(),
  check('duration', 'Please provide a valid duration.').isNumeric(),
  check('range', 'Please provide a valid duration range.')
    .optional()
    .isNumeric(),
  check('date', 'Please provide a valid date.').isDate(),
  check('date', 'Please provide a date after today.').not().isBefore(),
];

router.post(
  '/new-request-to-hire',
  newRequestToHireValidation,
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
      let equipment = [];
      if (req.body.equipment) {
        equipment = req.body.equipment.map((option) => option.value);
      }
      let skills = [];
      if (req.body.skills) {
        skills = req.body.skills.map((option) => option.value);
      }
      RequestToHire.create(
        await user.getId(),
        req.body.type,
        req.body.location.properties.formatted,
        req.body.details,
        req.body.pay,
        req.body.duration,
        req.body.durationMax,
        req.body.date,
        equipment.toString(),
        skills.toString()
      );
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

// information about our system
router.get('/types', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  const jobTypes = await Mysql.query(`SELECT *
                                      FROM job_types;`);
  try {
    return res.send(jobTypes);
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});
router.get('/equipment', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  const equipment = await Mysql.query(`SELECT *
                                       FROM equipment;`);
  try {
    return res.send(equipment);
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});
router.get('/skills', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  const skills = await Mysql.query(`SELECT *
                                    FROM skills;`);
  try {
    return res.send(skills);
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

router.get('/hire-requests', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  const hireRequests = await Mysql.query(
    `SELECT hire_requests.*, hire_requests.type as typeId, job_types.type
     FROM hire_requests
              INNER JOIN job_types ON hire_requests.type = job_types.id
     WHERE hire_requests.date_time > NOW();`
  );
  try {
    return res.send(hireRequests);
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

module.exports = router;
