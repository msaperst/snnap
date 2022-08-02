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

  static getEquipmentAndSkills(req) {
    let equipment = [];
    if (req.body.equipment) {
      equipment = req.body.equipment;
    }
    let skills = [];
    if (req.body.skills) {
      skills = req.body.skills;
    }
    return { equipment, skills };
  }

  static async basicAuthExecuteAndReturn(req, res, callback) {
    let token;
    try {
      token = await User.isAuth(req.headers.authorization);
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
    try {
      return callback(token);
    } catch (error) {
      return res.status(422).send({
        msg: error.message,
      });
    }
  }
};

module.exports = Common;
