/**
 * Created by cshao on 6/5/16.
 */

'use strict';

const debugServer = require('debug')('uniboard:server');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const moreRelative = require('nunjucks-more-relative');
moreRelative(nunjucks);

const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const middleware = require('./middleware/middleware');
const routes = require('./routes/index');

const utils = require('./utils/utils');

const isProdMode = process.env.NODE_ENV === 'production';

global.Cookies = null;

var app = express();

var nunjucksConf = {
  express: app,
  tags: {
    variableStart: '{=',
    variableEnd: '=}'
  }
};
if (!isProdMode) {
  nunjucksConf.watch = true;
  nunjucksConf.noCache = true;
}
let nunjucksEnv = nunjucks.configure([path.join(__dirname, 'web/static/compiled/views'), path.join(__dirname, 'web/static/startup-pages'), path.join(__dirname, 'web/static/pages'), path.join(__dirname, 'web/static/partial')], nunjucksConf);
app.set('view engine', 'html');
app.disable('x-powered-by');
app.use(middleware.customHeaderAttacher);

app.use(compress());
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.configRoute = function(API_X, SECRET) {
  app.set('API_X', API_X);
  app.set('SECRET', SECRET);

  //Extend token expire date
  app.use(function(req, res, next) {
    if (req.cookies.token && req.path.indexOf('/static')!==0) {
      var decoded;
      try {
        decoded = jwt.verify(req.cookies.token, SECRET);

        // parameter for all view pages
        res.locals.accountEmail = decoded.email;
        res.locals.companyEndpoint = decoded.companyEndpoint;

        req.decodedToken = decoded;
        var expire = req.decodedToken.exp;
        if (new Date().getTime() > expire*1000-utils.TOKEN_EXTEND_DISTANCE_TO_EXPIRE_IN_MILLISECONDS) {
          utils.setTokenCookie(decoded, SECRET, res);
        }
      } catch(err) {
        debugServer(err);
      }
    }
    next();
  });

  const tokenAchieveFunction = function(req) {
    if (req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  };

  app.use('/app/s', expressJwt({secret: SECRET, getToken: tokenAchieveFunction}));
  app.use('/api', middleware.checkCSRF);
  app.use('/api/secure', expressJwt({secret: SECRET, getToken: tokenAchieveFunction}));
  app.use('/', routes);

  app.use('/static', express.static(path.join(__dirname, 'web/static'), {'extensions': ['html', 'js', 'css'], 'maxAge': '7d'}));
  app.use(express.static(path.join(__dirname, 'web/static/pages'), {'extensions': ['html', 'js', 'css'], 'maxAge': '7d'}));
  app.use(express.static(path.join(__dirname, 'web/static/cert_webroot'), {'maxAge': '7d'}));
  app.use(express.static(path.join(__dirname, 'web/static/startup-pages'), {'extensions': ['html', 'js', 'css'], 'maxAge': '7d'}));
};

app.configErrorHandler = function(isProdMode) {
  // catch 404 and forward to error handler
  app.use(middleware.notFoundHandler);

  if (isProdMode) {
    app.use(middleware.prodErrorHandler);
  } else {
    app.use(middleware.devErrorHandler);
  }
};

app.configTemplate = function(isProdMode) {
  debugServer('isProdMode: ' + isProdMode);
  app.set('view cache', isProdMode ? true : false);
  nunjucksEnv.addGlobal('isProdMode', isProdMode);
};

module.exports = app;
