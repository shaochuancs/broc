/**
 * Created by cshao on 8/9/16.
 */

'use strict';

import api from '../../../common/api';

function login(param, successCB, failCB) {
  $.post(api.LOGIN, param).done(successCB).fail(failCB);
}

export {
  login
};
