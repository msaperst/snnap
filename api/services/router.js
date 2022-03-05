const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');

const User = require('../components/user/User');
const Mysql = require('./Mysql');

// information about our user
