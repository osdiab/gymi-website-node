/**
 * Describes state transitions related to users, i.e. the currently
 * logged in user and the set of users you can see.
 */

import {Map} from 'immutable';
import {Reducer} from 'redux';

import {Id} from 'common/entities';
import {User} from 'common/users';

export type Action = {
  type: 'CHANGE_PASSWORD_REQUEST'
} | {
  type: 'CHANGE_PASSWORD_SUCCESS'
} | {
  type: 'CHANGE_PASSWORD_FAILURE',
  err: Error
} | {
  type: 'SIGN_UP_USER_REQUEST'
} | {
  type: 'SIGN_UP_USER_SUCCESS'
} | {
  type: 'SIGN_UP_USER_FAILURE',
  err: Error
} | {
  type: 'LOAD_USER_REQUEST',
  id: Id
} | {
  type: 'LOAD_USER_SUCCESS',
  user: User
} | {
  type: 'LOAD_USER_FAILURE',
  err: Error
} | {
  type: 'LOAD_ALL_USERS_REQUEST'
} | {
  type: 'LOAD_ALL_USERS_SUCCESS',
  users: User[]
} | {
  type: 'LOAD_ALL_USERS_FAILURE',
  err: Error
};

export interface IState {
  readonly loadingUser: boolean;
  readonly loadUserError?: Error;
  readonly loadingAllUsers: boolean;
  readonly loadAllUsersError?: Error;
  readonly requestingUserSignUp: boolean;
  readonly userSignUpError?: Error;
  readonly userSignUpSuccessful: boolean;
  readonly requestingPasswordChange: boolean;
  readonly passwordChangeError?: Error;
  readonly passwordChangeSuccessful: boolean;

  readonly allUsers?: User[];
  readonly loadedUsers: Map<Id, User>;
}

const initialState: IState = {
  loadingUser: false,
  loadingAllUsers: false,
  requestingPasswordChange: false,
  requestingUserSignUp: false,
  userSignUpSuccessful: false,
  passwordChangeSuccessful: false,
  loadedUsers: Map<Id, User>()
};

const users: Reducer<IState> = (
  state: IState,
  action: Action
): IState => {
  switch (action.type) {
    case 'CHANGE_PASSWORD_REQUEST':
      return {
        ...state,
        requestingPasswordChange: true,
        passwordChangeError: undefined,
        passwordChangeSuccessful: false
      };
    case 'CHANGE_PASSWORD_SUCCESS':
      return {
        ...state,
        requestingPasswordChange: false,
        passwordChangeError: undefined,
        passwordChangeSuccessful: true
      };
    case 'CHANGE_PASSWORD_FAILURE':
      return {
        ...state,
        requestingPasswordChange: false,
        passwordChangeError: action.err,
        passwordChangeSuccessful: false
      };
    case 'SIGN_UP_USER_REQUEST':
      return {
        ...state,
        requestingUserSignUp: true,
        userSignUpError: undefined,
        userSignUpSuccessful: false
      };
    case 'SIGN_UP_USER_SUCCESS':
      return {
        ...state,
        requestingUserSignUp: false,
        userSignUpError: undefined,
        userSignUpSuccessful: true
      };
    case 'SIGN_UP_USER_FAILURE':
      return {
        ...state,
        requestingUserSignUp: false,
        userSignUpError: action.err,
        userSignUpSuccessful: false
      };
    case 'LOAD_USER_REQUEST':
      return {
        ...state,
        loadingUser: true,
        loadUserError: undefined,
        loadedUsers: state.loadedUsers.delete(action.id)
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        loadingUser: false,
        loadedUsers: state.loadedUsers.set(action.user.id, action.user)
      };
    case 'LOAD_USER_FAILURE':
      return {
        ...state,
        loadingUser: false,
        loadUserError: action.err
      };
    case 'LOAD_ALL_USERS_REQUEST':
      return {
        ...state,
        loadingAllUsers: true,
        loadAllUsersError: undefined
      };
    case 'LOAD_ALL_USERS_SUCCESS':
      return {
        ...state,
        loadingAllUsers: false,
        allUsers: action.users
      };
    case 'LOAD_ALL_USERS_FAILURE':
      return {
        ...state,
        loadingAllUsers: false,
        loadAllUsersError: action.err
      };
    default:
      return state;
  }
};

export default users;
