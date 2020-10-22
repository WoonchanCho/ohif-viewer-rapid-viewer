import { Reducer } from 'redux-testkit';

import reducer, { defaultState } from './authentication';
import * as actionTypes from '../constants/ActionTypes.js';
import User from '../../dao/user';

describe('authentication reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState);
  });

  it('should set new data on first SET_USER', () => {
    const initialState = defaultState;

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

    const action = {
      type: actionTypes.SET_USER,
      user,
    };

    const expectedState = {
      user,
    };

    Reducer(reducer)
      .withState(initialState)
      .expect(action)
      .toReturnState(expectedState);
  });

  it('should clear user on CLEAR_USER', () => {
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

    const initialState = {
      user,
    };

    const action = {
      type: actionTypes.CLEAR_USER,
    };

    const expectedState = {
      user: defaultState,
    };

    Reducer(reducer)
      .withState(initialState)
      .expect(action)
      .toReturnState(expectedState);
  });
});
