/**
 * Created by cshao on 11/5/16.
 */

'use strict';

const REG_EXP_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REG_EXP_PASSWORD = /^[a-zA-Z0-9./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/;
const REG_EXP_NAME = /^[a-zA-Z0-9 ._#@()\u4e00-\u9eff-]*$/;
const REG_EXP_ID = /^[a-zA-Z0-9_]*$/;

exports.VALIDATE_TYPE = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  NAME: 'NAME',
  ID: 'ID'
};

const KEY_DISPLAY_MAPPING = {
  'EMAIL': 'email',
  'PASSWORD': 'password',
  'NAME': 'name',
  'ID': 'ID',
};

function getInvalidChar(inputStr, regExp) {
  for (let c of inputStr) {
    if (!regExp.test(c)) {
      return c;
    }
  }
  return null;
}

exports.validateInput = function(inputStr, validateType, validateTypeDisplay, isOptional) {
  let typeDisplay = validateTypeDisplay ? validateTypeDisplay : KEY_DISPLAY_MAPPING[validateType];
  if (!inputStr && !isOptional) {
    return {
      result: false,
      message: 'Please input ' + typeDisplay
    };
  }

  if (typeof inputStr !== 'string') {
    return {
      result: false,
      message: 'Please input correct ' + typeDisplay
    };
  }

  let lengthLimit = 32;
  if (inputStr.length > lengthLimit) {
    return {
      result: false,
      message: 'The ' + typeDisplay + ' is too long'
    };
  }

  let regExp;
  switch (validateType) {
    case this.VALIDATE_TYPE.EMAIL:
      regExp = REG_EXP_EMAIL;
      break;
    case this.VALIDATE_TYPE.PASSWORD:
      regExp = REG_EXP_PASSWORD;
      break;
    case this.VALIDATE_TYPE.NAME:
      regExp = REG_EXP_NAME;
      break;
    case this.VALIDATE_TYPE.ID:
      regExp = REG_EXP_ID;
      break;
    default:
      throw new TypeError('Unsupported validateType');
  }

  let result = regExp.test(inputStr);
  if (result) {
    return {
      result: true
    };
  }

  if (validateType === this.VALIDATE_TYPE.EMAIL) {
    return {
      result: false,
      message: 'The format of ' + typeDisplay + ' is incorrect'
    };
  }

  let invalidChar = getInvalidChar(inputStr, regExp);
  if (invalidChar === null) {
    return {
      result: false,
      message: 'Please input correct' + typeDisplay
    };
  } else {
    if (invalidChar === '') {
      invalidChar = 'space';
    }
    return {
      result: false,
      message: 'The ' + typeDisplay + ' include invalid character: ' + invalidChar
    };
  }
};

exports.getErrorMessage = function(errorObj, defaultMessage) {
  if (!errorObj) {
    throw new TypeError('required argument errorObj is missing');
  }

  if (errorObj.responseJSON && errorObj.responseJSON.errorMessage) {
    return errorObj.responseJSON.errorMessage;
  }

  let message;
  try {
    message = JSON.parse(errorObj.responseText).errorMessage;
  } catch(e) {
    message = defaultMessage;
  }
  if (!message) {
    message = defaultMessage;
  }
  return message;
};

exports.abortAllXHRs = function(xhrs) {
  for (let i in xhrs) {
    if (typeof xhrs[i].abort === 'function') {
      xhrs[i].abort();
    }
  }
};
