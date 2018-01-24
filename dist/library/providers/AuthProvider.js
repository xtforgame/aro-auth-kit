'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _azRestfulHelpers = require('az-restful-helpers');

var _checkParams = require('../checkParams');

var _checkParams2 = _interopRequireDefault(_checkParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthProvider = function () {
  function AuthProvider(accountLinkStore) {
    _classCallCheck(this, AuthProvider);

    this.accountLinkStore = accountLinkStore;
    this.checkParams = _checkParams2.default;
  }

  _createClass(AuthProvider, [{
    key: 'verifyAuthParams',
    value: function verifyAuthParams() {
      return _azRestfulHelpers.RestfulError.rejectWith(501, 'this authentication method is not implemented');
    }
  }, {
    key: 'authenticate',
    value: function authenticate(authParams) {
      var _this = this;

      var result = this.checkParams(authParams, this.requiredAuthParams);
      if (result) {
        return Promise.reject(result);
      }
      var providerUserId = authParams[this.providerUserIdName];

      return this.accountLinkStore.findAccountLink(this.providerId, providerUserId).then(function (account) {
        if (!account) {
          return _azRestfulHelpers.RestfulError.rejectWith(401, 'Wrong credential');
        }
        return _this.verifyAuthParams(authParams, account);
      });
    }
  }, {
    key: 'getAlParamsForCreate',
    value: function getAlParamsForCreate() {
      return _azRestfulHelpers.RestfulError.rejectWith(501, 'this authentication method is not implemented');
    }
  }, {
    key: 'createAccountLink',
    value: function createAccountLink(alParams, user) {
      var _this2 = this;

      var result = this.checkParams(alParams, this.requiredAuthParams);
      if (result) {
        return Promise.reject(result);
      }
      return this.getAlParamsForCreate(alParams).then(function (paramsForCreate) {
        return _this2.accountLinkStore.createAccountLink(paramsForCreate, user);
      });
    }
  }, {
    key: 'requiredAuthParams',
    get: function get() {
      return this.constructor.requiredAuthParams;
    }
  }, {
    key: 'providerId',
    get: function get() {
      return this.constructor.providerId;
    }
  }, {
    key: 'providerUserIdName',
    get: function get() {
      return this.constructor.providerUserIdName;
    }
  }]);

  return AuthProvider;
}();

exports.default = AuthProvider;