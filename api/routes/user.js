const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const User = require('../components/user/User');
const Common = require('./common');
const Job = require('../components/job/Job');
const JobApplication = require('../components/jobApplication/JobApplication');

router.get('/get', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    return res.send(await user.getInfo());
  });
});

router.get('/get/:user', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async () => {
    const userInfo = await User.getBasicUserInfo(req.params.user);
    if (userInfo && userInfo.id) {
      return res.send(userInfo);
    }
    return res.status(422).send({ msg: 'user not found' });
  });
});

router.get('/settings', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    return res.send(await user.getSettings());
  });
});

router.get('/jobs', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    const jobs = await Job.getUserJobs(await user.getId());
    return res.send(jobs);
  });
});

router.get('/job-applications', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    const applications = JobApplication.getUserApplications(await user.getId());
    return res.send(await applications);
  });
});

router.get('/notifications', async (req, res) => {
  await Common.basicAuthExecuteAndReturn(req, res, async (token) => {
    const user = User.auth(token);
    return res.send(await user.getNotifications());
  });
});

const markNotificationReadValidation = [
  check('notification', 'Notification must be provided').isNumeric(),
];

router.post(
  '/mark-notification-read',
  markNotificationReadValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      await user.markNotificationRead(req.body.notification);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  },
);

const setAvatarValidation = [
  check('avatar', 'Avatar is required').not().isEmpty(),
];

router.post('/set-avatar', setAvatarValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    await user.setAvatar(req.body.avatar);
    return res.status(200).send();
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

const updateAccountInformationValidation = [
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
];

router.post(
  '/update-account-information',
  updateAccountInformationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      await user.setAccountInformation(req.body.email, req.body.number);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  },
);

const updatePersonalInformationValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('location', 'City is required').not().isEmpty(),
];

router.post(
  '/update-personal-information',
  updatePersonalInformationValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      await user.setPersonalInformation(
        req.body.firstName,
        req.body.lastName,
        req.body.location,
      );
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  },
);

const updatePasswordValidation = [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Password must be 6 or more characters').isLength({
    min: 6,
  }),
];

router.post('/update-password', updatePasswordValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    await user.updatePassword(req.body.currentPassword, req.body.newPassword);
    return res.status(200).send();
  } catch (error) {
    switch (error.message) {
      case "Current password doesn't match existing password.":
        return res.status(409).send({
          msg: error.message,
        });
      default:
        return res.status(422).send({
          msg: error.message,
        });
    }
  }
});

const updateNotificationSettingsValidation = [
  check('email', 'Email must be true or false').isBoolean(),
  check('push', 'Push must be true or false').isBoolean(),
];

router.post(
  '/update-notification-settings',
  updateNotificationSettingsValidation,
  async (req, res) => {
    const token = await Common.checkInput(req, res);
    if (typeof token !== 'string' && !(token instanceof String)) {
      return token;
    }
    try {
      const user = User.auth(token);
      await user.updateNotificationSettings(req.body.email, req.body.push);
      return res.status(200).send();
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  },
);

const rateValidation = [
  check('id', 'id must be an integer').isNumeric(),
  check('rating', 'Rating must be true or false')
    .isBoolean()
    .optional({ nullable: true }),
];

router.post('/rate', rateValidation, async (req, res) => {
  const token = await Common.checkInput(req, res);
  if (typeof token !== 'string' && !(token instanceof String)) {
    return token;
  }
  try {
    const user = User.auth(token);
    await user.rate(req.body.id, req.body.rating);
    return res.status(200).send();
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

module.exports = router;
