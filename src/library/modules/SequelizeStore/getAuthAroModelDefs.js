// model for az RDBMS ORM
//import Sequelize from 'sequelize';

export default ({
  user: {
    publicColumns: userPublicColumns,
    columns: userColumns,
  },
  accountLink: {
    publicColumns: accountLinkPublicColumns,
    columns: accountLinkColumns,
  },
}) => {
  return {
    models: {
      users: {
        // tableName: 'tbl_user',
        pAs: userPublicColumns,
        columns: userColumns,
        names: {
          singular: 'user',
          plural: 'users',
        },
        tableOptions: {},
      },
      accountLinks: {
        // tableName: 'tbl_account_link',
        pAs: accountLinkPublicColumns,
        columns: accountLinkColumns,
        names: {
          singular: 'accountLink',
          plural: 'accountLinks',
        },
        tableOptions: {
          indexes: [
            {
              unique: true,
              fields: ['user_id', 'provider_id'],
              where: {
                deleted_at: null,
              },
            },
            {
              unique: true,
              fields: ['provider_id', 'provider_user_id'],
              where: {
                deleted_at: null,
              },
            },
          ],
        },
      },
      // sessions: {
      //   // tableName: 'tbl_session',
      //   pAs: null,
      //   columns: {
      //     id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      //     token: Sequelize.STRING(900),
      //     token_type: Sequelize.STRING,
      //     auth_type: Sequelize.STRING,
      //     auth_id: Sequelize.STRING,
      //     userid: Sequelize.BIGINT.UNSIGNED,
      //     name: Sequelize.STRING,
      //     expiry_date: Sequelize.DATE,
      //   },
      //   names: {
      //     singular: 'session',
      //     plural: 'sessions',
      //   },
      //   tableOptions: {},
      // },
    },
    associationTables: {},
    associations: [
      // {
      //   a: { name: 'users', options: {} },
      //   type: 'hasMany',
      //   b: { name: 'sessions', options: {} },
      // },
      {
        a: { name: 'users', options: {} },
        type: 'hasMany',
        b: { name: 'accountLinks', options: {} },
      },
    ],
  };
};
