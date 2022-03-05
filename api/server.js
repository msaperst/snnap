const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const job = require('./routes/job.js');
const authentication = require('./routes/authentication.js');
const user = require('./routes/user.js');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use('/api/auth', authentication);
app.use('/api/user', user);
app.use('/api/jobs', job);

// Handling Errors
app.use((err, req, res) => {
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(process.env.API_PORT || 3001);
