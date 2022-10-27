import {observable, action} from 'mobx';

export class UserStore {
  @observable user = null;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  @action.bound setUser(user) {
    this.user = user;
  }
}
