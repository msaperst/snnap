const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./services/router.js');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use('/api', indexRouter);

// Handling Errors
app.use((err, req, res) => {
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const port = process.env.API_PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
