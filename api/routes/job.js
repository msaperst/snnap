const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const Mysql = require('../services/Mysql');
const User = require('../components/user/User');
const RequestToHire = require('../components/requestToHire/RequestToHire');
const ApplicationForRequestToHire = require('../components/applicationForRequestToHire/ApplicationForRequestToHire');
const Common = require('./common');

const newRequestToHireValidation = [
  check('type', 'Please provide a valid job type.').isNumeric(),
  check('location', 'Please provide a valid city.').not().isEmpty(),
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
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      const { equipment, skills } = Common.getEquipmentAndSkills(req);
      RequestToHire.create(
        await user.getId(),
        req.body.type,
        req.body.location,
        req.body.details,
        req.body.pay,
        req.body.duration,
        req.body.durationMax,
        req.body.date,
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

const applyToRequireToHireValidation = [
  check('userName', 'Please provide a valid name.').not().isEmpty(),
  check('portfolio.*.link', 'Portfolio Link must be a valid URL')
    .optional()
    .isURL(),
  check('website', 'Website must be a valid URL').optional().isURL(),
  check('insta', 'Instagram Link must be a valid URL').optional().isURL(),
  check('fb', 'Facebook Link must be a valid URL').optional().isURL(),
];

router.post(
  '/apply-to-hire-request',
  applyToRequireToHireValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      const { equipment, skills } = Common.getEquipmentAndSkills(req);
      ApplicationForRequestToHire.create(
        req.body.hireRequest,
        await user.getId(),
        req.body.company,
        req.body.userName,
        req.body.companyName,
        req.body.website,
        req.body.insta,
        req.body.fb,
        req.body.experience,
        equipment,
        skills,
        req.body.portfolio
      );
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

const selectHireRequestApplicationValidation = [
  check('hireRequest', 'Please provide a valid hire request id.')
    .not()
    .isEmpty(),
  check(
    'hireRequestApplication',
    'Please provide a valid hire request application id'
  )
    .not()
    .isEmpty(),
];

router.post(
  '/select-hire-request-application',
  selectHireRequestApplicationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const hireRequest = new RequestToHire(req.body.hireRequest);
      await hireRequest.selectApplication(req.body.hireRequestApplication);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

router.get('/hire-request-application/:id', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const application = new ApplicationForRequestToHire(req.params.id);
    const info = await application.getInfo();
    if (info) {
      return res.send(info);
    }
    return res.status(422).send({ msg: 'hire request applications not found' });
  });
});

router.get('/hire-request-applications/:id', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const applications = await ApplicationForRequestToHire.getApplications(
      req.params.id
    );
    if (applications) {
      return res.send(applications);
    }
    return res.status(422).send({ msg: 'hire request applications not found' });
  });
});

// information about our system
router.get('/types', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const jobTypes = await Mysql.query(`SELECT *
                                        FROM job_types;`);
    return res.send(jobTypes);
  });
});

router.get('/equipment', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const equipment = await Mysql.query(`SELECT *
                                         FROM equipment;`);
    return res.send(equipment);
  });
});

router.get('/skills', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const skills = await Mysql.query(`SELECT *
                                      FROM skills;`);
    return res.send(skills);
  });
});

router.get('/hire-request/:id', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const hireRequest = new RequestToHire(req.params.id);
    if (hireRequest) {
      return res.send(await hireRequest.getInfo());
    }
    return res.status(422).send({ msg: 'hire request not found' });
  });
});

router.get('/hire-requests', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const hireRequests = await RequestToHire.getHireRequests();
    return res.send(hireRequests);
  });
});

module.exports = router;
