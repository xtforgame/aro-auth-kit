/*eslint-disable no-unused-vars, no-undef */
import chai from 'chai';

import path from 'path';
import fs from 'fs';
import {
  AuthCore,
  SequelizeStore,
  AuthProviderManager,
  KoaHelper,
  BasicProvider,
} from '../../src/library';

import Azldi from 'azldi';
import { RestfulError } from 'az-restful-helpers';

import Sequelize from 'sequelize';

import {
  postgresPort,
  postgresUser,
  postgresDbName,
  postgresPassword,
  postgresHost,
  getConnectString,
  resetTestDbAndTestRole,
} from '../test-utils/sequelize-utils';

// =================

import AzRdbmsOrm from 'az-rdbms-orm';
import createTestData from '../test-data/createTestData';

let logFiles = {};

let write = (file, data) => {
  let logFile = logFiles[file] = logFiles[file] || fs.createWriteStream(file, {flags : 'w'});
  logFile.write(data);
}

function databaseLogger(...args){ // eslint-disable-line no-unused-vars
  write(path.resolve(__dirname, './KoaHelper.spec.log'), args[0] + '\n');
}

const secret = fs.readFileSync(path.join(__dirname, '../self-signed/privatekey.pem'), 'utf8');

class AzRdbmsMgr {
  constructor(aroModelDefs, { databaseLogger = (() => {}) }){
    this.aroModelDefs = aroModelDefs;
    this.databaseLogger = databaseLogger;
    this.sequelizeDb = new Sequelize(getConnectString(postgresUser), {
      dialect: 'postgres',
      logging: this.databaseLogger,
    });

    this.resourceManager = new AzRdbmsOrm(this.sequelizeDb, this.aroModelDefs);
  }

  sync(force = true){
    return this.resourceManager.sync({force});
  }
}

// =================

class FakeCtx {
  constructor(props, reject){
    Object.keys(props).map(key => {
      this[key] = props[key];
    });
    this.reject = reject;
    this.headers = {};
  }
  throw(status, message){
    console.log('status, message :', status, message);
    this.reject({status, message});
  }

  set(obj){
    this.headers = {
      ...this.headers,
      ...obj,
    };
  }
}

let expect = chai.expect;

describe('KoaHelper', function(){
  describe('Basic', function(){
    const key = fs.readFileSync(path.join(__dirname, '../self-signed/privatekey.pem'), 'utf8');
    // let AuthCore = AuthCore(key, {});
    // let SequelizeStore = SequelizeStore({});
    // let AuthProviderManager = AuthProviderManager({
    //   basic: {
    //     provider: BasicProvider,
    //   },
    // }, {});
    let Classes = [
      KoaHelper,
      AuthProviderManager,
      SequelizeStore,
      AuthCore,
    ];
    let digestOrder = [
      AuthCore,
      SequelizeStore,
      AuthProviderManager,
      KoaHelper,
    ];

    let azldi = null;
    let authCore = null;
    let authProviderManager = null;
    let sequelizeStore = null;
    let koaHelper = null;
    beforeEach(function() {
      azldi = new Azldi();

      azldi.register(Classes);

      Classes.forEach(Class => {
        let classInfo = azldi.getClassInfo(Class.$name);
        // console.log('classInfo :', classInfo);
      });

      let digestIndex = 0;

      let results = azldi.digest({
        onCreate: (obj) => {
          digestIndex++
        },
        appendArgs: {
          authCore: [key, {}],
          sequelizeStore: [{}],
          authProviderManager: [
            {
              basic: {
                provider: BasicProvider,
              },
            },
            {},
          ],
        },
      });

      authCore = azldi.get('authCore');
      authProviderManager = azldi.get('authProviderManager');
      sequelizeStore = azldi.get('sequelizeStore');
      koaHelper = azldi.get('koaHelper');

      return resetTestDbAndTestRole();
    });

    const createAzRdbmsMgr = () => {
      let azRdbmsMgr = new AzRdbmsMgr(sequelizeStore.getDefaultAroModels(), {
        databaseLogger,
      });
      return azRdbmsMgr.sync()
      .then(() => {
        return createTestData(azRdbmsMgr.resourceManager, false);
      })
      .then(() => {
        return azldi.runAsync('init', [], {
          appendArgs: {
            sequelizeStore: [azRdbmsMgr.resourceManager],
          },
        });
      })
      .then(() => azRdbmsMgr);
    }

    it('should be able to create', function(){
      this.timeout(9000);
      return createAzRdbmsMgr();
    });

    it('should be able to auth (success)', function(){
      this.timeout(9000);
      const authInfo = {
        username: 'admin',
        password: 'admin',
      };
      return createAzRdbmsMgr()
      .then(() => {
        return authProviderManager.getAuthProvider('basic');
      })
      .then(basicAuthProvider => {
        // console.log('basicAuthProvider.requiredAuthParams :', basicAuthProvider.requiredAuthParams);
        return basicAuthProvider.authenticate({
          ...authInfo,
        });
      })
      .then(accountLink => {
        // console.log('accountLink :', accountLink);
        expect(accountLink).to.exist;
        expect(accountLink.id).to.be.equal('1');

        let ctx = new FakeCtx({
          request: {
            body: {
              auth_type: 'basic',
              ...authInfo,
            },
          },
        }, (e) => {throw e});

        return koaHelper.authenticate(ctx, () => {})
        .then(() => ctx);
      })
      .then(ctx => {
        expect(ctx).to.exist;
        expect(ctx.body).to.exist;
        expect(ctx.body.user_id).to.be.equal('1');
        expect(ctx.body.token).to.exist;
      });
    });

    it('should be able to auth (wrong user id)', function(){
      this.timeout(9000);
      const authInfo = {
        username: 'adminx',
        password: 'wrongpassword',
      };
      return createAzRdbmsMgr()
      .then(() => {
        return authProviderManager.getAuthProvider('basic');
      })
      .then(basicAuthProvider => {
        // console.log('basicAuthProvider.requiredAuthParams :', basicAuthProvider.requiredAuthParams);
        return basicAuthProvider.authenticate({
          ...authInfo,
        })
        .catch(e => {
          expect(e).to.be.an.instanceof(RestfulError);
          expect(e.status).to.be.equal(401);
        });
      })
      .then(() => {
        let ctx = new FakeCtx({
          request: {
            body: {
              auth_type: 'basic',
              ...authInfo,
            },
          },
        }, (e) => {throw e});

        return koaHelper.authenticate(ctx, () => {})
        .then(() => ctx);
      })
      .then(ctx => {
        expect(ctx).to.exist;
        expect(ctx.body).to.exist;
        expect(ctx.body.error).to.exist;
        expect(ctx.body.error).to.be.equal('Wrong credential');
      });
    });

    it('middleware: requireAdminPrivilege', function(){
      this.timeout(9000);
      return createAzRdbmsMgr()
      .then(() => {
        let tokenInfo = authCore.createSession({
          user: {
            id: 'admin',
            name: 'admin',
            privilege: 'admin',
          },
          provider_id: 'basic',
          provider_user_id: 'admin',
        });

        return new Promise((resolve, reject) => {
          // console.log('tokenInfo :', tokenInfo);
          let ctx = new FakeCtx({
            request: {
              headers: {
                authorization: `Bearer ${tokenInfo.token}`,
              },
            },
          }, reject);
          koaHelper.requireAdminPrivilege(ctx, () => {
            resolve(ctx);
          });
        });
      })
      .then(ctx => {
        expect(ctx).to.exist;
        expect(ctx.local).to.exist;
        expect(ctx.local.userSession).to.exist;
        expect(ctx.local.userSession.user_id).to.be.equal('admin');
      });
    });
  });
});
