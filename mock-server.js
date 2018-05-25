/**
 * Created by cshao on 10/2/15.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const middleware = require('./middleware/middleware');

const mock = require('./mock-routes/mock');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', mock);

// catch 404 and forward to error handler
app.use(middleware.notFoundHandler);
app.use(middleware.devErrorHandler);

module.exports = app;
