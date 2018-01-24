import AuthProvider from './AuthProvider';
import { RestfulError } from 'az-restful-helpers';
import { sha512gen_salt, crypt } from '../utils/crypt';

export default class BasicProvider extends AuthProvider {
  static requiredAuthParams = ['username', 'password'];
  static providerId = 'basic';
  static providerUserIdName = 'username';

  verifyAuthParams(authParams, account) {
    const { password } = authParams;
    const cryptedPassword = account.provider_user_access_info && account.provider_user_access_info.password;
    if (cryptedPassword && crypt(password, cryptedPassword) === cryptedPassword) {
      return Promise.resolve(account);
    }
    return RestfulError.rejectWith(401, 'Wrong credential');
  }

  getAlParamsForCreate(alParams) {
    const result = this.checkParams(alParams, ['username', 'password']);
    if (result) {
      return Promise.reject(result);
    }
    return Promise.resolve({
      provider_id: this.providerId,
      provider_user_id: alParams.username,
      provider_user_access_info: {
        password: crypt(alParams.password, sha512gen_salt()),
      },
    });
  }
}
