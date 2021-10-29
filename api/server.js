const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./router.js');

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

app.listen(3001, () => console.log('Server is running on port 3001'));
