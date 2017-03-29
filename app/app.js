const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

const app = express();

require('dotenv')
  .config();


app.get('/', function (req, res) {

});

module.exports = app;
