import * as types from './constants/ActionTypes.js';
import actions from './actions.js';
import User from '../dao/user';

describe('actions', () => {
  test('exports have not changed', () => {
    const expectedExports = ['setUser', 'clearUser'].sort();

    const exports = Object.keys(actions).sort();

    expect(exports).toEqual(expectedExports);
  });

  it('should create an action to set authentication user', () => {
    const user = new User(
      'xnatUrl',
      'username',
      'email',
      'firstName',
      'lastName',
      'token',
      'secret',
      Date.now() + 1000,
      Date.now()
    );

    const expectedAction = {
      type: types.SET_USER,
      user,
    };
    expect(actions.setUser(user)).toEqual(expectedAction);
  });
});
