const express = require('express');

const router = express.Router();
const { validationResult, check } = require('express-validator');
const User = require('../components/user/User');
const Company = require('../components/company/Company');
const Mysql = require('../services/Mysql');

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
    const company = new Company(await user.getId());
    return res.send(await company.getInfo());
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
  try {
    const userInfo = await Mysql.query(`SELECT id, name, website, insta, fb
                                         FROM companies WHERE id = ${req.params.id};`);
    return res.send(userInfo[0]);
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

const updatePortfolioValidation = [
  check('experience', 'Experience is required').not().isEmpty(),
];

router.post(
  '/update-portfolio',
  updatePortfolioValidation,
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
      const company = new Company(await user.getId());
      await company.setPortfolio(req.body.experience, req.body.portfolioItems);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

router.post('/update-company-information', async (req, res) => {
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
      // if value is not set, just use the basic array value
      if (equipment.some((item) => item === undefined)) {
        equipment = req.body.equipment;
      }
    }
    let skills = [];
    if (req.body.skills) {
      skills = req.body.skills.map((option) => option.value);
      // if value is not set, just use the basic array value
      if (skills.some((item) => item === undefined)) {
        skills = req.body.skills;
      }
    }
    const company = new Company(await user.getId());
    await company.setCompanyInformation(
      req.body.name,
      req.body.website,
      req.body.insta,
      req.body.fb,
      equipment.toString(),
      skills.toString()
    );
    return res.status(200).send();
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

module.exports = router;
