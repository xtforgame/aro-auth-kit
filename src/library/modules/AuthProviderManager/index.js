/* eslint-disable no-underscore-dangle */
import { RestfulError } from 'az-restful-helpers';
import ModuleBase from '../ModuleBase';

export default class AuthProviderManager extends ModuleBase {
  static $name = 'authProviderManager';
  static $type = 'service';
  static $inject = ['sequelizeStore'];
  static $funcDeps = {
    init: [],
    start: [],
  };

  constructor(sequelizeStore, supportedProviders, options){
    super();
    this.accountLinkStore = sequelizeStore.getAccountLinkStore();
    this.supportedProviders = supportedProviders;

    this.providerMap = {};
    Object.keys(this.supportedProviders).forEach(key => {
      const supportedProvider = this.supportedProviders[key];
      this.providerMap[key] = new supportedProvider.provider(this.accountLinkStore);
    });
    this.options = options;
  }

  getAuthProvider(authType) {
    return new Promise((resolve, reject) => {
      if (!authType) {
        return reject(new RestfulError(400, '"auth_type" is empty'));
      }

      const authProvider = this.providerMap[authType];
      if (!authProvider) {
        return reject(new RestfulError(400, `Unknown auth_type: ${authType}`));
      }

      return resolve(authProvider);
    });
  }
}
