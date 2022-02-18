const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');
const {
  signupValidation,
  loginValidation,
  newRequestToHireValidation,
} = require('./validation');
const User = require('../components/user/User');
const Mysql = require('./Mysql');
const RequestToHire = require('../components/requestToHire/RequestToHire');

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
        req.body.units,
        req.body.date,
        req.body.time,
        equipment.toString(),
        skills.toString()
      );
      return res.send(req.body);
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

// information about our user
router.get('/get-user', async (req, res) => {
  let token;
  try {
    token = await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
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
    return res.status(422).send({
      msg: error.message,
    });
  }
});

// information about our system
router.get('/job-types', async (req, res) => {
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
        FROM hire_requests INNER JOIN job_types ON hire_requests.type = job_types.id;`
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
