'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _AuthProvider2 = require('./AuthProvider');

var _AuthProvider3 = _interopRequireDefault(_AuthProvider2);

var _azRestfulHelpers = require('az-restful-helpers');

var _crypt = require('../utils/crypt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasicProvider = (_temp = _class = function (_AuthProvider) {
  _inherits(BasicProvider, _AuthProvider);

  function BasicProvider() {
    _classCallCheck(this, BasicProvider);

    return _possibleConstructorReturn(this, (BasicProvider.__proto__ || Object.getPrototypeOf(BasicProvider)).apply(this, arguments));
  }

  _createClass(BasicProvider, [{
    key: 'verifyAuthParams',
    value: function verifyAuthParams(authParams, account) {
      var password = authParams.password;

      var cryptedPassword = account.provider_user_access_info && account.provider_user_access_info.password;
      if (cryptedPassword && (0, _crypt.crypt)(password, cryptedPassword) === cryptedPassword) {
        return Promise.resolve(account);
      }
      return _azRestfulHelpers.RestfulError.rejectWith(401, 'Wrong credential');
    }
  }, {
    key: 'getAlParamsForCreate',
    value: function getAlParamsForCreate(alParams) {
      var result = this.checkParams(alParams, ['username', 'password']);
      if (result) {
        return Promise.reject(result);
      }
      return Promise.resolve({
        provider_id: this.providerId,
        provider_user_id: alParams.username,
        provider_user_access_info: {
          password: (0, _crypt.crypt)(alParams.password, (0, _crypt.sha512gen_salt)())
        }
      });
    }
  }]);

  return BasicProvider;
}(_AuthProvider3.default), _class.requiredAuthParams = ['username', 'password'], _class.providerId = 'basic', _class.providerUserIdName = 'username', _temp);
exports.default = BasicProvider;