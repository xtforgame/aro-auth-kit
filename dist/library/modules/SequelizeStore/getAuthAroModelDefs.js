'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var _ref$user = _ref.user,
      userPublicColumns = _ref$user.publicColumns,
      userColumns = _ref$user.columns,
      _ref$accountLink = _ref.accountLink,
      accountLinkPublicColumns = _ref$accountLink.publicColumns,
      accountLinkColumns = _ref$accountLink.columns;

  return {
    models: {
      users: {
        pAs: userPublicColumns,
        columns: userColumns,
        names: {
          singular: 'user',
          plural: 'users'
        },
        tableOptions: {}
      },
      accountLinks: {
        pAs: accountLinkPublicColumns,
        columns: accountLinkColumns,
        names: {
          singular: 'accountLink',
          plural: 'accountLinks'
        },
        tableOptions: {
          indexes: [{
            unique: true,
            fields: ['user_id', 'provider_id'],
            where: {
              deleted_at: null
            }
          }, {
            unique: true,
            fields: ['provider_id', 'provider_user_id'],
            where: {
              deleted_at: null
            }
          }]
        }
      }
    },
    associationTables: {},
    associations: [{
      a: { name: 'users', options: {} },
      type: 'hasMany',
      b: { name: 'accountLinks', options: {} }
    }]
  };
};