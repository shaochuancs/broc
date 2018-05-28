/**
 * Created by cshao on 8/9/16.
 */

'use strict';

const API_FAKE_AUTH = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth';

function requestInvite(name, email, successCB, failCB) {
  return $.ajax(API_FAKE_AUTH, {
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      name: name,
      email: email
    })
  }).done(successCB).fail(failCB);
}

export {
  requestInvite
};