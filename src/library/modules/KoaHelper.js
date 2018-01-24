/* eslint-disable no-underscore-dangle */
import ModuleBase from './ModuleBase';

import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';

const privateData = new WeakMap();

class Session {
  constructor(info, token) {
    this.info = info;
    this.token = token;
  }
}

export default class KoaHelper extends ModuleBase {
  static $name = 'koaHelper';
  static $type = 'service';
  static $inject = ['authCore', 'sequelizeStore', 'authProviderManager'];
  static $funcDeps = {
    init: [],
    start: [],
  };

  constructor(authCore, sequelizeStore, authProviderManager){
    super();
    this.authCore = authCore;
    this.sequelizeStore = sequelizeStore;
    this.authProviderManager = authProviderManager;
  }

  _ensureLocal(ctx){
    ctx.local = ctx.local || {};
  }

  _ensureUserSession(ctx){
    this._ensureLocal(ctx);
    if(ctx.local.userSession){
      return ;
    }
    ctx.local.userSession = this.verifyUserSession(ctx.request);
  }

  verifyUserSession(request) {
    return this.authCore.verifyAuthorization(request.headers);
  }

  isAdmin(userSession) {
    return (userSession && userSession.privilege === 'admin');
  }

  hasUserPrivilege(userSession, userId) {
    return this.isAdmin(userSession) || userId === 'me' || (userSession.userid === userId);
  }

  // middlewares
  requireAdminPrivilege = (ctx, next) => {
    this._ensureUserSession(ctx);
    let userSession = ctx.local.userSession;
    if (!userSession) {
      RestfulError.koaThrowWith(ctx, 401, 'Unauthenticated');
    }

    if (!this.isAdmin(userSession)) {
      RestfulError.koaThrowWith(ctx, 403, 'Admin privilege required');
    }

    return next();
  };

  getIdentity = (ctx, next) => {
    this._ensureUserSession(ctx);
    return next();
  };

  // post sessions
  authenticate = (ctx, next) => {
    const json = ctx.request.body;
    return this.authProviderManager.getAuthProvider(json.auth_type)
      .then(provider => provider.authenticate(json))
      .then(account => {
        const { info } = this.authCore.createSession(account);
        info.access_token = account.provider_user_access_info.access_token;
        return ctx.body = info;
      })
      .catch((error) => {
        if(error.status === 401){
          return RestfulResponse.koaResponseWith(ctx, 200, { error: error.message });
        }
        if(error instanceof RestfulError) {
          return error.koaThrow(ctx);
        }
      });
  };
}
