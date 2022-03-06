const express = require('express');

const router = express.Router();
const User = require('../components/user/User');

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
    return res.send(await user.getUserInfo());
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

router.post('/set-avatar', async (req, res) => {
  if (!req.files) {
    return res.status(422).send('Please include a valid avatar file');
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

    const file = req.files.avatar;
    const extension = file.name.split('.').pop();
    const newName = `${await user.getUsername()}.${extension}`;
    const path = `${__dirname}/../../ui/public/avatars/${newName}`;

    file.mv(path, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send({ avatar: newName });
    });
    return res.status(422).send('Some error occurred');
  } catch (error) {
    return res.status(422).send({
      msg: error.message,
    });
  }
});

module.exports = router;
