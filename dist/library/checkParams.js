'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOnFailToCheckReqParams = defaultOnFailToCheckReqParams;
exports.default = checkParams;

var _azRestfulHelpers = require('az-restful-helpers');

function defaultOnFailToCheckReqParams(value) {
  return new _azRestfulHelpers.RestfulError(400, '"' + value + '" is empty');
}

function checkParams(obj, _requiredParams) {
  var onFail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOnFailToCheckReqParams;

  var requiredParams = _requiredParams || [];
  for (var i = 0; i < requiredParams.length; i++) {
    if (obj[requiredParams[i]] == null) {
      return onFail(requiredParams[i], i, requiredParams);
    }
  }
  return null;
}