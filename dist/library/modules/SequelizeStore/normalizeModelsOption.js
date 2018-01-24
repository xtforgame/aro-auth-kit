'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function () {
  var modelsOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _modelsOption$user = modelsOption.user;
  _modelsOption$user = _modelsOption$user === undefined ? {} : _modelsOption$user;
  var _modelsOption$user$pu = _modelsOption$user.publicColumns,
      userPublicColumns = _modelsOption$user$pu === undefined ? [] : _modelsOption$user$pu,
      _modelsOption$user$co = _modelsOption$user.columns,
      userColumns = _modelsOption$user$co === undefined ? {} : _modelsOption$user$co,
      _modelsOption$account = modelsOption.accountLink;
  _modelsOption$account = _modelsOption$account === undefined ? {} : _modelsOption$account;
  var _modelsOption$account2 = _modelsOption$account.publicColumns,
      accountLinkPublicColumns = _modelsOption$account2 === undefined ? [] : _modelsOption$account2,
      _modelsOption$account3 = _modelsOption$account.columns,
      accountLinkColumns = _modelsOption$account3 === undefined ? {} : _modelsOption$account3;


  return {
    user: {
      publicColumns: Array.from(new Set(['id', 'name', 'privilege', 'labels'].concat(_toConsumableArray(userPublicColumns)))),
      columns: _extends({
        id: {
          type: _sequelize2.default.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey'
        },
        name: {
          type: _sequelize2.default.STRING,

          comment: 'Username'
        },
        privilege: _sequelize2.default.STRING,
        labels: {
          type: _sequelize2.default.JSONB,
          defaultValue: {}
        }
      }, userColumns)
    },
    accountLink: {
      publicColumns: Array.from(new Set(['id', 'provider_id', 'provider_user_id'].concat(_toConsumableArray(accountLinkPublicColumns)))),
      columns: _extends({
        id: {
          type: _sequelize2.default.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey'
        },
        provider_id: {
          type: _sequelize2.default.STRING
        },
        provider_user_id: {
          type: _sequelize2.default.STRING
        },
        provider_user_access_info: {
          type: _sequelize2.default.JSONB
        }
      }, accountLinkColumns)
    }
  };
};