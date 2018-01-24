'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var privateData = new WeakMap();

var Session = function Session(info, token) {
  _classCallCheck(this, Session);

  this.info = info;
  this.token = token;
};

var ModuleBase = (_temp = _class = function () {
  function ModuleBase() {
    _classCallCheck(this, ModuleBase);
  }

  _createClass(ModuleBase, [{
    key: 'init',
    value: function init() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        try {
          return resolve(_this.onInit && _this.onInit.apply(_this, args));
        } catch (e) {
          return reject(e);
        }
      });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new Promise(function (resolve, reject) {
        try {
          return resolve(_this2.onStart && _this2.onStart.apply(_this2, args));
        } catch (e) {
          return reject(e);
        }
      });
    }
  }]);

  return ModuleBase;
}(), _class.$name = 'base', _class.$type = 'service', _class.$funcDeps = {
  init: [],
  start: []
}, _temp);
exports.default = ModuleBase;