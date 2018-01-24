'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _ModuleBase2 = require('./ModuleBase');

var _ModuleBase3 = _interopRequireDefault(_ModuleBase2);

var _azRestfulHelpers = require('az-restful-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privateData = new WeakMap();

var Session = function Session(info, token) {
  _classCallCheck(this, Session);

  this.info = info;
  this.token = token;
};

var KoaHelper = (_temp = _class = function (_ModuleBase) {
  _inherits(KoaHelper, _ModuleBase);

  function KoaHelper(authCore, sequelizeStore, authProviderManager) {
    _classCallCheck(this, KoaHelper);

    var _this = _possibleConstructorReturn(this, (KoaHelper.__proto__ || Object.getPrototypeOf(KoaHelper)).call(this));

    _this.requireAdminPrivilege = function (ctx, next) {
      _this._ensureUserSession(ctx);
      var userSession = ctx.local.userSession;
      if (!userSession) {
        _azRestfulHelpers.RestfulError.koaThrowWith(ctx, 401, 'Unauthenticated');
      }

      if (!_this.isAdmin(userSession)) {
        _azRestfulHelpers.RestfulError.koaThrowWith(ctx, 403, 'Admin privilege required');
      }

      return next();
    };

    _this.getIdentity = function (ctx, next) {
      _this._ensureUserSession(ctx);
      return next();
    };

    _this.authenticate = function (ctx, next) {
      var json = ctx.request.body;
      return _this.authProviderManager.getAuthProvider(json.auth_type).then(function (provider) {
        return provider.authenticate(json);
      }).then(function (account) {
        var _this$authCore$create = _this.authCore.createSession(account),
            info = _this$authCore$create.info;

        info.access_token = account.provider_user_access_info.access_token;
        return ctx.body = info;
      }).catch(function (error) {
        if (error.status === 401) {
          return _azRestfulHelpers.RestfulResponse.koaResponseWith(ctx, 200, { error: error.message });
        }
        if (error instanceof _azRestfulHelpers.RestfulError) {
          return error.koaThrow(ctx);
        }
      });
    };

    _this.authCore = authCore;
    _this.sequelizeStore = sequelizeStore;
    _this.authProviderManager = authProviderManager;
    return _this;
  }

  _createClass(KoaHelper, [{
    key: '_ensureLocal',
    value: function _ensureLocal(ctx) {
      ctx.local = ctx.local || {};
    }
  }, {
    key: '_ensureUserSession',
    value: function _ensureUserSession(ctx) {
      this._ensureLocal(ctx);
      if (ctx.local.userSession) {
        return;
      }
      ctx.local.userSession = this.verifyUserSession(ctx.request);
    }
  }, {
    key: 'verifyUserSession',
    value: function verifyUserSession(request) {
      return this.authCore.verifyAuthorization(request.headers);
    }
  }, {
    key: 'isAdmin',
    value: function isAdmin(userSession) {
      return userSession && userSession.privilege === 'admin';
    }
  }, {
    key: 'hasUserPrivilege',
    value: function hasUserPrivilege(userSession, userId) {
      return this.isAdmin(userSession) || userId === 'me' || userSession.userid === userId;
    }
  }]);

  return KoaHelper;
}(_ModuleBase3.default), _class.$name = 'koaHelper', _class.$type = 'service', _class.$inject = ['authCore', 'sequelizeStore', 'authProviderManager'], _class.$funcDeps = {
  init: [],
  start: []
}, _temp);
exports.default = KoaHelper;