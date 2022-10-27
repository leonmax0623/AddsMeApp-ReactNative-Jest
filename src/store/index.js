import {UserStore} from './UserStore';

class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
  }
}
const store = new RootStore();

export default store;
