const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const User = require('../components/user/User');
const Job = require('../components/job/Job');
const JobApplication = require('../components/jobApplication/JobApplication');
const Common = require('./common');

const newJobValidation = [
  check('type', 'Please provide a valid job type.').isNumeric(),
  check('subtype', 'Please provide a valid looking for.').isNumeric(),
  check('location', 'Please select a valid city from the drop down.')
    .not()
    .isEmpty(),
  check('details', 'Please provide a valid job details.').not().isEmpty(),
  check('pay', 'Please provide a valid pay.').isNumeric(),
  check('duration', 'Please provide a valid duration.').isNumeric(),
  check('range', 'Please provide a valid duration range.')
    .optional()
    .isNumeric(),
  check('date', 'Please provide a valid date.').isDate(),
  check('date', 'Please provide a date after today.').not().isBefore(),
];

router.post('/new-job', newJobValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    const { equipment, skills } = Common.getEquipmentAndSkills(req);
    Job.create(
      await user.getId(),
      req.body.type,
      req.body.subtype,
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
});

const applyToJobValidation = [
  check('userName', 'Please provide a valid name.').not().isEmpty(),
  check('portfolio.*.link', 'Portfolio Link must be a valid URL')
    .optional()
    .isURL(),
  check('website', 'Website must be a valid URL').optional().isURL(),
  check('insta', 'Instagram Link must be a valid URL').optional().isURL(),
  check('fb', 'Facebook Link must be a valid URL').optional().isURL(),
];

router.post('/apply-to-job', applyToJobValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    const { equipment, skills } = Common.getEquipmentAndSkills(req);
    JobApplication.create(
      req.body.job,
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
});

const selectJobApplicationValidation = [
  check('job', 'Please provide a valid job id.').not().isEmpty(),
  check('jobApplication', 'Please provide a valid job application id')
    .not()
    .isEmpty(),
];

router.post(
  '/select-job-application',
  selectJobApplicationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const job = new Job(req.body.job);
      await job.selectApplication(req.body.jobApplication);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
);

router.get('/job-application/:id', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const application = new JobApplication(req.params.id);
    const info = await application.getInfo();
    if (info) {
      return res.send(info);
    }
    return res.status(422).send({ msg: 'job applications not found' });
  });
});

router.get('/job-applications/:id', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const applications = await JobApplication.getApplications(req.params.id);
    if (applications) {
      return res.send(applications);
    }
    return res.status(422).send({ msg: 'job applications not found' });
  });
});

// information about our system
router.get('/types', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () =>
    res.send(await Job.getJobTypes())
  );
});

router.get('/subtypes', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () =>
    res.send(await Job.getJobSubtypes())
  );
});

router.get('/equipment', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () =>
    res.send(await Job.getEquipment())
  );
});

router.get('/skills', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () =>
    res.send(await Job.getSkills())
  );
});

router.get('/job/:id', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const job = new Job(req.params.id);
    if (job) {
      return res.send(await job.getInfo());
    }
    return res.status(422).send({ msg: 'job not found' });
  });
});

router.get('/jobs', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const jobs = await Job.getJobs();
    return res.send(jobs);
  });
});

module.exports = router;
