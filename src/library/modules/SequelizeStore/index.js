/* eslint-disable no-underscore-dangle */
// import Sequelize from 'sequelize';
import ModuleBase from '../ModuleBase';

import getAuthAroModelDefs from './getAuthAroModelDefs';
import normalizeModelsOption from './normalizeModelsOption';
import { RestfulError } from 'az-restful-helpers';

export class AccountLinkStore {
  constructor(findAccountLink, createAccountLink) {
    this.findAccountLink = findAccountLink;
    this.createAccountLink = createAccountLink;
  }
}

export default class SequelizeStore extends ModuleBase {
  static $name = 'sequelizeStore';
  static $type = 'service';
  static $inject = ['authCore'];
  static $funcDeps = {
    init: [],
    start: [],
  };

  constructor(authCore, options){
    super();
    this.authCore = authCore;
    this.options = options;
    this.modelsOption = normalizeModelsOption(options.models);
  }

  onInit(_, resourceManager){
    this.resourceManager = resourceManager;
  }

  _filterColumns(modelName, origonalResult, passAnyway = []){
    if(!origonalResult || !origonalResult.dataValues){
      return null;
    }
    let dataFromDb = origonalResult.dataValues;

    let data = {};
    this.modelsOption[modelName].publicColumns.concat(passAnyway).map(columnName => {
      data[columnName] = dataFromDb[columnName];
    });
    return data;
  }

  getDefaultAroModels(){
    return getAuthAroModelDefs(this.modelsOption);
  }

  createAccountLink = (paramsForCreate, userId) => {
    const accountLinks = this.resourceManager.getModel('accountLinks');
    return this.resourceManager.db.transaction()
    .then(t =>
      accountLinks.createEx({
        value: (paramsForCreate),
        originalOptions: {
          transaction: t,
        },
      })
      .then((accountLink) => {
        // return accountLink.setUser(userId);
        return accountLink.setAssociationEx({
          model: 'user',
          value: userId,
          originalOptions: {
            transaction: t,
          },
        });
      })
      .then(v => {
        return t.commit()
        .then(() => v);
      })
      .catch((e) => {
        return t.rollback()
        .then(() => Promise.reject(e));
      })
    )
    .then(accountLink => {
      return this._filterColumns('accountLink', accountLink);
    })
    .catch((error) => {
      if (error && error.name === 'SequelizeUniqueConstraintError') {
        return RestfulError.rejectWith(409, 'This account link has been taken', error);
      }
      return RestfulError.rejectWith(500, 'Internal Server Error', error);
    });
  }

  findUserWithAccountLink = (userId) => {
    const users = this.resourceManager.getModel('users');
    return users.findOne({
      options: {
        submodels: [
          'accountLinks',
        ],
      },
      originalOptions: {
        where: {
          id: userId,
        },
      },
    })
      .then(({ origonalResult }) => {
        let user = this._filterColumns('user', origonalResult);
        if(!user){
          return null;
        }

        let userFromDb = origonalResult.dataValues;
        user.accountLinks = userFromDb.accountLinks.map(accountLinkFromDb => {
          return this._filterColumns('accountLink', accountLinkFromDb);
        });

        return user;
      });
  }

  findAccountLink = (provider_id, provider_user_id) => {
    const accountLinks = this.resourceManager.getModel('accountLinks');
    const users = this.resourceManager.getModel('users');
  
    return accountLinks.findOne({
      options: {
        submodels: [
          'user',
        ],
      },
      originalOptions: {
        attributes: undefined,
        where: {
          provider_id,
          provider_user_id,
        },
      },
    })
    .then(({ origonalResult }) => {
      let accountLink = this._filterColumns('accountLink', origonalResult, ['provider_user_access_info']);
      if(!accountLink){
        return null;
      }

      let accountLinkFromDb = origonalResult.dataValues;
      accountLink.user = this._filterColumns('user', accountLinkFromDb.user);

      return accountLink;
    });
  }

  deleteAllAccountLinkFromUser = (userId) => {
    const accountLinks = this.resourceManager.getModel('accountLinks');
    return findUserWithAccountLink(userId)
      .then((user) => {
        if (!user) {
          return RestfulError.rejectWith(404, 'UserNotFound');
        }
        return accountLinks.destroy({
          originalOptions: {
            where: {
              user_id: user.id,
            },
          },
        })
          .then(({ affectedRows }) => {
            console.log('DELETE ROWS :', affectedRows);
            return { success: true };
          });
      });
  }

  deleteAccountLinkFromUser = (userId, authType, isAdmin) => {
    const accountLinks = this.resourceManager.getModel('accountLinks');
    return findUserWithAccountLink(userId)
      .then((user) => {
        if (!user) {
          return RestfulError.rejectWith(404, 'UserNotFound');
        }
        if (user.accountLinks.length === 1 &&
         user.accountLinks[0].provider_id === authType &&
         !isAdmin) {
          return RestfulError.rejectWith(403, 'You cannot remove the only account link without the admin privilege.');
        }
        /* only unlink
        return user.removeAccountLinks(user.accountLinks)
        .then((affectedRows) => {
          console.log('DELETE ROWS :', affectedRows);
          return affectedRows;
        })
        .then(() => {
          return {success: true};
        });
        */
        return accountLinks.destroy({
          originalOptions: {
            where: {
              user_id: user.id,
              provider_id: authType,
            },
          },
        })
          .then(({ affectedRows }) => {
            console.log('DELETE ROWS :', affectedRows);
            return { success: true };
          });
      });
  }  

  // =====================================================

  getAccountLinkStore() {
    return new AccountLinkStore(this.findAccountLink, this.createAccountLink);
  }
}
