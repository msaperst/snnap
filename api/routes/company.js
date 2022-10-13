const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const User = require('../components/user/User');
const Company = require('../components/company/Company');
const Common = require('./common');

router.get('/get', async (req, res) => {
  let token;
  try {
    token = await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      msg: error.message,
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

router.get('/get/:user', async (req, res) => {
  try {
    await User.isAuth(req.headers.authorization);
  } catch (error) {
    return res.status(401).json({
      msg: error.message,
    });
  }
  try {
    const company = new Company(req.params.user);
    if (company) {
      return res.send(await company.getInfo());
    }
    return res.status(422).send({ msg: 'company not found' });
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

const updatePortfolioInformationValidation = [
  check('portfolioItems.*.link', 'Portfolio Link must be a valid URL')
    .optional()
    .isURL(),
];

router.post(
  '/update-portfolio',
  updatePortfolioInformationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
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

const updateCompanyInformationValidation = [
  check('website', 'Website must be a valid URL').optional().isURL(),
  check('insta', 'Instagram Link must be a valid URL').optional().isURL(),
  check('fb', 'Facebook Link must be a valid URL').optional().isURL(),
  check('equipment.*.what', 'Equipment information must be provided'),
];

router.post(
  '/update-company-information',
  updateCompanyInformationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      const { equipment, skills } = Common.getEquipmentAndSkills(req);
      const company = new Company(await user.getId());
      await company.setCompanyInformation(
        req.body.name,
        req.body.website,
        req.body.insta,
        req.body.fb,
        equipment,
        skills
      );
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

module.exports = router;
