/* eslint-disable no-underscore-dangle */
const privateData = new WeakMap();

class Session {
  constructor(info, token) {
    this.info = info;
    this.token = token;
  }
}

export default class ModuleBase {
  static $name = 'base';
  static $type = 'service';
  static $funcDeps = {
    init: [],
    start: [],
  };

  constructor(){
  }

  init(...args) {
    return new Promise((resolve, reject) => {
      try {
        return resolve(this.onInit && this.onInit(...args));
      } catch (e) {
        return reject(e);
      }
    });
  }

  start(...args) {
    return new Promise((resolve, reject) => {
      try {
        return resolve(this.onStart && this.onStart(...args));
      } catch (e) {
        return reject(e);
      }
    });
  }
}
