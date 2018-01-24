'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _azRestfulHelpers = require('az-restful-helpers');

var _ModuleBase2 = require('../ModuleBase');

var _ModuleBase3 = _interopRequireDefault(_ModuleBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AuthProviderManager = (_temp = _class = function (_ModuleBase) {
  _inherits(AuthProviderManager, _ModuleBase);

  function AuthProviderManager(sequelizeStore, supportedProviders, options) {
    _classCallCheck(this, AuthProviderManager);

    var _this = _possibleConstructorReturn(this, (AuthProviderManager.__proto__ || Object.getPrototypeOf(AuthProviderManager)).call(this));

    _this.accountLinkStore = sequelizeStore.getAccountLinkStore();
    _this.supportedProviders = supportedProviders;

    _this.providerMap = {};
    Object.keys(_this.supportedProviders).forEach(function (key) {
      var supportedProvider = _this.supportedProviders[key];
      _this.providerMap[key] = new supportedProvider.provider(_this.accountLinkStore);
    });
    _this.options = options;
    return _this;
  }

  _createClass(AuthProviderManager, [{
    key: 'getAuthProvider',
    value: function getAuthProvider(authType) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!authType) {
          return reject(new _azRestfulHelpers.RestfulError(400, '"auth_type" is empty'));
        }

        var authProvider = _this2.providerMap[authType];
        if (!authProvider) {
          return reject(new _azRestfulHelpers.RestfulError(400, 'Unknown auth_type: ' + authType));
        }

        return resolve(authProvider);
      });
    }
  }]);

  return AuthProviderManager;
}(_ModuleBase3.default), _class.$name = 'authProviderManager', _class.$type = 'service', _class.$inject = ['sequelizeStore'], _class.$funcDeps = {
  init: [],
  start: []
}, _temp);
exports.default = AuthProviderManager;