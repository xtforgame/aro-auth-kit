/* eslint-disable no-underscore-dangle */
import ModuleBase from './ModuleBase';
import JwtSessionHelper from 'jwt-session-helper';

export default class AuthCore extends ModuleBase {
  static $name = 'authCore';
  static $type = 'service';
  static $inject = [];
  static $funcDeps = {
    init: [],
    start: [],
  };

  constructor(secret, options = {}){
    super();
    this.jwtSessionHelper = options.jwtSessionHelper || new JwtSessionHelper(secret, {
      defaults: {
        algorithm: 'HS256',
      },
      signDefaults: {
        issuer: 'localhost',
        expiresIn: '1y',
      },
      parsePayload: ({ user, provider_id, provider_user_id, ...rest }) => ({
        user_id: user.id,
        user_name: user.name,
        auth_type: provider_id,
        auth_id: provider_user_id,
        privilege: user.privilege,
        subject: `user:${user.id}:${0}`,
        token_type: 'Bearer',
        ...rest,
      }),
      exposeInfo: (originalData, payload) => {
        let result = { ...payload };
        delete result.auth_type;
        delete result.auth_id;
        delete result.expiry_date;
        return result;
      },
    });
    this.Session = this.jwtSessionHelper.Session;
    this.options = options;
  }

  // =====================================================

  decodeToken = (token) => {
    try{
      return this.jwtSessionHelper.decode(token);
    }catch(e){
      console.log('e :', e);
    }
    return null;
  };

  verifyToken = (token) => {
    try{
      return this.jwtSessionHelper.verify(token);
    }catch(e){
      console.log('e :', e);
    }
    return null;
  };

  signToken = (token) => {
    return this.jwtSessionHelper.sign(token);
  };

  verifyAuthorization(headers) {
    let authorization = headers;
    if(typeof headers !== 'string'){
      authorization = headers.authorization;
    }
    if (!authorization || typeof authorization !== 'string') {
      return null;
    }

    const tokenStartPos = authorization.indexOf(' ');
    if (tokenStartPos < 0) {
      return null;
    }

    const token = authorization
    .substr(tokenStartPos + 1, authorization.length - tokenStartPos - 1);

    return token && this.verifyToken(token);
  }

  // =====================================================

  createSession(sessionData) {
    return this.jwtSessionHelper.createSession(sessionData);
  }

  removeSession(token) {
    return Promise.resolve(0);
  }
}
