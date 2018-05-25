/**
 * Created by cshao on 8/12/16.
 */

'use strict';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

exports.canUseDOM = canUseDOM;

exports.DEVICE_URL_PREFIX = '/data_api/device';
exports.DEVICE_ENDPOINT_PREFIX = '/data_api/endpoint';

const REG_EXP_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REG_EXP_PASSWORD = /^[a-zA-Z0-9./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]*$/;
const REG_EXP_NAME = /^[a-zA-Z0-9 ._#@()\u4e00-\u9eff-]*$/;
const REG_EXP_FIELD = /^[a-zA-Z0-9._]*$/;
const REG_EXP_ID = /^[a-zA-Z0-9_]*$/;
/*
 * \u4e00-\u9eff  Chinese character
 * \u2103         ℃
 * \u2109         ℉
 * \u00a5\uffe5   ￥
 * \u3380-\u33dd  Other unit
 *
 */
const REG_EXP_UNIT = /^[0-9a-zA-Z$\/%\u4e00-\u9eff\u3380-\u33dd\u2103\u2109\u00a5\uffe5]*$/;

exports.VALIDATE_TYPE = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  NAME: 'NAME',
  FIELD: 'FIELD',
  ID: 'ID',
  UNIT: 'UNIT'
};

const KEY_DISPLAY_MAPPING = {
  'EMAIL': '邮箱',
  'PASSWORD': '密码',
  'NAME': '名称',
  'FIELD': '字段名',
  'ID': 'ID',
  'UNIT': '单位'
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
      message: '请输入' + typeDisplay
    };
  }

  if (typeof inputStr !== 'string') {
    return {
      result: false,
      message: '请输入正确的' + typeDisplay
    };
  }

  let lengthLimit = validateType === this.VALIDATE_TYPE.UNIT ? 16 : 32;
  if (inputStr.length > lengthLimit) {
    return {
      result: false,
      message: '输入的' + typeDisplay + '过长，请重新输入'
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
    case this.VALIDATE_TYPE.FIELD:
      regExp = REG_EXP_FIELD;
      break;
    case this.VALIDATE_TYPE.ID:
      regExp = REG_EXP_ID;
      break;
    case this.VALIDATE_TYPE.UNIT:
      regExp = REG_EXP_UNIT;
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
      message: '输入的' + typeDisplay + '格式不正确，或含有非法字符'
    };
  }

  let invalidChar = getInvalidChar(inputStr, regExp);
  if (invalidChar === null) {
    return {
      result: false,
      message: '请输入正确的' + typeDisplay
    };
  } else {
    if (invalidChar === '') {
      invalidChar = '空格';
    }
    return {
      result: false,
      message: '输入的' + typeDisplay + '含有非法字符：' + invalidChar + '，请重新输入'
    };
  }
};

// URL
const ENCODING_QUESTION_MARK = '__qm__';
const ENCODING_EQUAL = '__eq__';
const ENCODING_AND = '__and__';
exports.encodeURL = function(url) {
  return url.replace(/\?/g, ENCODING_QUESTION_MARK)
    .replace(/=/g, ENCODING_EQUAL)
    .replace(/&/g, ENCODING_AND);
};
exports.decodeURL = function(encodedUrl) {
  if (!encodedUrl) {
    return null;
  }
  return encodedUrl.replace(new RegExp(ENCODING_QUESTION_MARK, 'g'), '?')
    .replace(new RegExp(ENCODING_EQUAL, 'g'), '=')
    .replace(new RegExp(ENCODING_AND, 'g'), '&');
};

exports.getDuplicateItem = function(array, interestedFields) {
  let normalizedObj = {};
  for (let i=0; i<array.length; i++) {
    let item = array[i];
    for (let k in item) {
      if (interestedFields && interestedFields.indexOf(k) < 0) {
        continue;
      }

      if (!normalizedObj[k]) {
        normalizedObj[k] = [];
      }

      let v = item[k];
      if (!v) {
        continue;
      }

      if (normalizedObj[k].indexOf(v) >= 0) {
        return {
          duplicateField: k,
          item: array[i],
          index: i
        };
      } else {
        normalizedObj[k].push(v);
      }
    }
  }

  return null;
};
