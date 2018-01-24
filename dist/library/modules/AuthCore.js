'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _ModuleBase2 = require('./ModuleBase');

var _ModuleBase3 = _interopRequireDefault(_ModuleBase2);

var _jwtSessionHelper = require('jwt-session-helper');

var _jwtSessionHelper2 = _interopRequireDefault(_jwtSessionHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AuthCore = (_temp = _class = function (_ModuleBase) {
  _inherits(AuthCore, _ModuleBase);

  function AuthCore(secret) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, AuthCore);

    var _this = _possibleConstructorReturn(this, (AuthCore.__proto__ || Object.getPrototypeOf(AuthCore)).call(this));

    _this.decodeToken = function (token) {
      try {
        return _this.jwtSessionHelper.decode(token);
      } catch (e) {
        console.log('e :', e);
      }
      return null;
    };

    _this.verifyToken = function (token) {
      try {
        return _this.jwtSessionHelper.verify(token);
      } catch (e) {
        console.log('e :', e);
      }
      return null;
    };

    _this.signToken = function (token) {
      return _this.jwtSessionHelper.sign(token);
    };

    _this.jwtSessionHelper = options.jwtSessionHelper || new _jwtSessionHelper2.default(secret, {
      defaults: {
        algorithm: 'HS256'
      },
      signDefaults: {
        issuer: 'localhost',
        expiresIn: '1y'
      },
      parsePayload: function parsePayload(_ref) {
        var user = _ref.user,
            provider_id = _ref.provider_id,
            provider_user_id = _ref.provider_user_id,
            rest = _objectWithoutProperties(_ref, ['user', 'provider_id', 'provider_user_id']);

        return _extends({
          user_id: user.id,
          user_name: user.name,
          auth_type: provider_id,
          auth_id: provider_user_id,
          privilege: user.privilege,
          subject: 'user:' + user.id + ':' + 0,
          token_type: 'Bearer'
        }, rest);
      },
      exposeInfo: function exposeInfo(originalData, payload) {
        var result = _extends({}, payload);
        delete result.auth_type;
        delete result.auth_id;
        delete result.expiry_date;
        return result;
      }
    });
    _this.Session = _this.jwtSessionHelper.Session;
    _this.options = options;
    return _this;
  }

  _createClass(AuthCore, [{
    key: 'verifyAuthorization',
    value: function verifyAuthorization(headers) {
      var authorization = headers;
      if (typeof headers !== 'string') {
        authorization = headers.authorization;
      }
      if (!authorization || typeof authorization !== 'string') {
        return null;
      }

      var tokenStartPos = authorization.indexOf(' ');
      if (tokenStartPos < 0) {
        return null;
      }

      var token = authorization.substr(tokenStartPos + 1, authorization.length - tokenStartPos - 1);

      return token && this.verifyToken(token);
    }
  }, {
    key: 'createSession',
    value: function createSession(sessionData) {
      return this.jwtSessionHelper.createSession(sessionData);
    }
  }, {
    key: 'removeSession',
    value: function removeSession(token) {
      return Promise.resolve(0);
    }
  }]);

  return AuthCore;
}(_ModuleBase3.default), _class.$name = 'authCore', _class.$type = 'service', _class.$inject = [], _class.$funcDeps = {
  init: [],
  start: []
}, _temp);
exports.default = AuthCore;