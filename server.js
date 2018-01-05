const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bluebird = require('bluebird');
const cors = require('cors');

const config = require('./config');
const routes = require('./routes');
const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('tiny'));

var whitelist = ['http://localhost:4200',
  'http://localhost:8080',
  'http://www.repy.io',
  'https://www.repy.io',
  'https://repy-app.herokuapp.com'
]
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(whitelist));

app.use(express.static(__dirname + '/dist'));
app.use('/', routes);

app.listen(config.server.port, () => {
  console.log(`Connected on port ${config.server.port}`);
});

module.exports = app;
