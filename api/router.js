const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./dbConnection');
const { signupValidation, loginValidation } = require('./validation');

router.post('/register', signupValidation, (req, res) => {
  db.query(
    `SELECT *
     FROM users
     WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})
        OR LOWER(username) = LOWER(${db.escape(req.body.username)});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This user is already in use!',
        });
      }
      // username is available
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            msg: err,
          });
        }
        // has hashed pw => add to database
        db.query(
          `INSERT INTO users (name, username, email, password)
               VALUES ('${req.body.name}',
                       ${db.escape(req.body.username)},
                       ${db.escape(req.body.email)},
                       ${db.escape(hash)})`,
          (err) => {
            if (err) {
              return res.status(400).send({
                msg: err,
              });
            }
            return res.status(201).send({
              msg: 'The user has been registered with us!',
            });
          }
        );
      });
    }
  );
});
router.post('/login', loginValidation, (req, res) => {
  db.query(
    `SELECT *
     FROM users
     WHERE username = ${db.escape(req.body.username)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Username or password is incorrect!',
        });
      }
      // check password
      bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
        // wrong password
        if (bErr) {
          return res.status(401).send({
            msg: 'Username or password is incorrect!',
          });
        }
        if (bResult) {
          const token = jwt.sign(
            { id: result[0].id },
            'the-super-strong-secrect',
            { expiresIn: '1h' }
          );
          db.query(
            `UPDATE users
               SET last_login = now()
               WHERE id = '${result[0].id}'`
          );
          return res.status(200).send({
            msg: 'Logged in!',
            token,
            name: result[0].name,
            username: result[0].username,
            email: result[0].email,
          });
        }
        return res.status(401).send({
          msg: 'Username or password is incorrect!',
        });
      });
    }
  );
});
router.post('/get-user', signupValidation, (req, res) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
  ) {
    return res.status(422).json({
      message: 'Please provide the token',
    });
  }
  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
  db.query('SELECT * FROM users where id=?', decoded.id, (error, results) => {
    if (error) throw error;
    return res.send({
      error: false,
      data: results[0],
      message: 'Fetch Successfully.',
    });
  });
});
module.exports = router;
