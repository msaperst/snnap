const rateLimit = require('express-rate-limit');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const job = require('./routes/job.js');
const authentication = require('./routes/authentication.js');
const user = require('./routes/user.js');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.API_LIMIT || '100', // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.use(limiter);

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

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
