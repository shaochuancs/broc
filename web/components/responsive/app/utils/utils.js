/**
 * Created by cshao on 11/5/16.
 */

'use strict';

import utils from '../../../common/utils';
const _ = require('lodash');
const moment = require('moment');
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

utils.dateFormatterPerDay = function(timestamp) {
  return moment(timestamp).format('HH:mm');
};

utils.isBrowserEnv = function() {
  return typeof window === 'object';
};

utils.getURLParams = function() {
  if (!utils.isBrowserEnv()) {
    return null;
  }
  var params = {};
  var url = location.search;
  var lastQuestionMarkLoc = url.lastIndexOf('?');
  if (lastQuestionMarkLoc >= 0) {
    var paramsArr = url.slice(lastQuestionMarkLoc + 1).split('&');

    for (var i in paramsArr) {
      var item = paramsArr[i];
      var paramKeyVal = item.split('=');
      params[paramKeyVal[0]] = paramKeyVal[1];
    }
  }
  return params;
};

utils.getErrorMessage = function(errorObj, defaultMessage) {
  if (!errorObj) {
    throw new TypeError('required argument errorObj is missing');
  }

  if (errorObj.responseJSON && errorObj.responseJSON.message) {
    return errorObj.responseJSON.message;
  }

  let message;
  try {
    message = JSON.parse(errorObj.responseText).message;
  } catch(e) {
    message = defaultMessage;
  }
  if (!message) {
    message = defaultMessage;
  }
  return message;
};

utils.abortAllXHRs = function(xhrs) {
  for (let i in xhrs) {
    if (_.isFunction(xhrs[i].abort)) {
      xhrs[i].abort();
    }
  }
};

export default utils;
