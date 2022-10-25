import initinalState from '@configs/store';
import Store from '@flux/store';
import rootReducer from '@reducers/index';

export default new Store(rootReducer, initinalState);
