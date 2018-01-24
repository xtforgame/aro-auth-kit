/*eslint-disable no-unused-vars, no-undef */
import chai from 'chai';

import path from 'path';
import fs from 'fs';
import {
  AuthCore,
} from '../../src/library';
import Azldi from 'azldi';

let expect = chai.expect;

describe('AuthCore', function(){
  describe('Basic', function(){
    const key = fs.readFileSync(path.join(__dirname, '../self-signed/privatekey.pem'), 'utf8');
    let Classes = [
      AuthCore,
    ];
    let digestOrder = [
      AuthCore,
    ];

    let authCore = null;
    beforeEach(function() {
      let azldi = new Azldi();

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
        },
      });

      authCore = results[0];

      return true;
    });

    it('should be able to create', function(){
      this.timeout(9000);
      let token = authCore.signToken({
        user_id: 1,
        user_name: 'rick',
        auth_type: 'basic',
        auth_id: '00000001',
        token_type: 'Bearer',
        privilege: 'admin',
        session_id: 0,
      });

      // console.log('info :', info);
      // console.log('authCore.verifyToken(token) :', authCore.verifyToken(token));
      authCore.verifyAuthorization({
        authorization: `Bearer ${token}`,
      });

      let user = {
        id: 1,
        username: 'rick',
        privilege: 'admin',
      };

      authCore.createSession({
        user,
        provider_id: 'basic',
        provider_user_id: '00000001',
      });

      return Promise.resolve();
    });
  });
});
