'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sha512gen_salt = sha512gen_salt;
exports.crypt = crypt;

var _sha512cryptNode = require('sha512crypt-node');

function sha512gen_salt() {
  var char_num = 16;
  var result = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < char_num; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function crypt(plain_text, _salt) {
  if (!_salt) {
    return null;
  }
  var salt = _salt;
  var firstDollar = salt.indexOf('$');

  if (firstDollar >= 0) {
    var secondDollar = salt.indexOf('$', firstDollar + 1);
    var thirdDollar = salt.indexOf('$', secondDollar + 1);
    if (secondDollar >= 0 && thirdDollar >= 0) {
      salt = salt.substr(secondDollar + 1, thirdDollar - secondDollar - 1);
    } else {
      return null;
    }
  }
  try {
    return (0, _sha512cryptNode.b64_sha512crypt)(plain_text, salt);
  } catch (e) {
    console.log(e);
    return null;
  }
}