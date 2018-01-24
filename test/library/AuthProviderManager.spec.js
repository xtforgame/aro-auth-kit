/*eslint-disable no-unused-vars, no-undef */
import chai from 'chai';

import path from 'path';
import fs from 'fs';
import {
  AuthCore,
  SequelizeStore,
  AuthProviderManager,
  BasicProvider,
} from '../../src/library';

import Azldi from 'azldi';

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
  write(path.resolve(__dirname, './AuthProviderManager.spec.log'), args[0] + '\n');
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

let expect = chai.expect;

describe('AuthProviderManager', function(){
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
      AuthProviderManager,
      SequelizeStore,
      AuthCore,
    ];
    let digestOrder = [
      AuthCore,
      SequelizeStore,
      AuthProviderManager,
    ];

    let azldi = null;
    let authProviderManager = null;
    let sequelizeStore = null;
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

      authProviderManager = results[0];
      sequelizeStore = results[1];

      return resetTestDbAndTestRole();
    });

    it('should be able to create', function(){
      this.timeout(9000);
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
      .then(() => {
        return authProviderManager.getAuthProvider('basic');
      })
      .then(basicAuthProvider => {
        console.log('basicAuthProvider.requiredAuthParams :', basicAuthProvider.requiredAuthParams);
        return basicAuthProvider.authenticate({
          username: 'admin',
          password: 'admin',
        });
      });
    });
  });
});
