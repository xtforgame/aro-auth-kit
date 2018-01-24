import { RestfulError } from 'az-restful-helpers';
import checkParams from '../checkParams';

export default class AuthProvider {
  constructor(accountLinkStore) {
    this.accountLinkStore = accountLinkStore;
    this.checkParams = checkParams;
  }

  get requiredAuthParams() {
    return this.constructor.requiredAuthParams;
  }

  get providerId() {
    return this.constructor.providerId;
  }

  get providerUserIdName() {
    return this.constructor.providerUserIdName;
  }

  verifyAuthParams() {
    return RestfulError.rejectWith(501, 'this authentication method is not implemented');
  }

  authenticate(authParams) {
    const result = this.checkParams(authParams, this.requiredAuthParams);
    if (result) {
      return Promise.reject(result);
    }
    const { [this.providerUserIdName]: providerUserId } = authParams;
    return this.accountLinkStore.findAccountLink(this.providerId, providerUserId)
      .then((account) => {
        if (!account) {
          return RestfulError.rejectWith(401, 'Wrong credential');
        }
        return this.verifyAuthParams(authParams, account);
      });
  }

  getAlParamsForCreate() {
    return RestfulError.rejectWith(501, 'this authentication method is not implemented');
  }

  createAccountLink(alParams, user) {
    const result = this.checkParams(alParams, this.requiredAuthParams);
    if (result) {
      return Promise.reject(result);
    }
    return this.getAlParamsForCreate(alParams)
      .then(paramsForCreate => this.accountLinkStore.createAccountLink(paramsForCreate, user));
  }
}
