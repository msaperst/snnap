const { validationResult } = require('express-validator');
const User = require('../components/user/User');

const Common = class {
  static async checkInput(req, res) {
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
    return token;
  }
};

module.exports = Common;
