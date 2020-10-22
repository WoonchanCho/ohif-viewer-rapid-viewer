import { SET_USER, CLEAR_USER } from '../constants/ActionTypes';
import User from '../../dao/user';

export const defaultState = {
  user: new User(),
  isLoggedIn: false,
};

const authentication = (state = defaultState, action) => {
  switch (action.type) {
    case SET_USER:
      if (!action.user.loggedInAt) {
        action.user.loggedInAt = Date.now();
      }
      return Object.assign({}, state, {
        user: action.user,
        isLoggedIn: !action.user.expired,
      });

    case CLEAR_USER:
      return Object.assign({}, defaultState);

    default:
      return state;
  }
};

export default authentication;
