/**
 * Defines state transitions for the user's session, i.e. login state
 */
// tslint:disable-next-line:no-suspicious-comment
// TODO: make resilient to errors from local/sessionStorage

// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

import {Reducer} from 'redux';

import {User} from 'common/users';

const isBrowser = window !== undefined && window.document;

const TOKEN_KEY = 'session.token';
const USER_KEY = 'session.user';

function clearStoredToken() {
  if (!isBrowser) {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

function fetchStoredLogin() {
  if (!isBrowser) {
    return null;
  }
  const data = {
    token: window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY),
    user: window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY)
  };

  // don't return if missing data
  if (!data.token || !data.user) {
    clearStoredToken();

    return null;
  }

  return { token: data.token, user: JSON.parse(data.user) };
}

function persistLogin(token: string, user: User, remember: boolean) {
  if (!isBrowser) {
    return;
  }

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export type Action = {
  type: 'LOGIN_REQUEST'
} | {
  type: 'LOGIN_SUCCESS',
  token: string,
  user: User,
  remember: boolean
} | {
  type: 'LOGIN_FAILURE',
  errMessage: string // TODO: make this an actual Error
} | {
  type: 'LOGOUT'
};

export interface IState {
  readonly logInError?: string;
  readonly loggingIn: boolean;
  readonly token?: string;
  readonly user?: User;
}

const initialState: IState = {
  loggingIn: false,
  ...(fetchStoredLogin() || {})
};

const session: Reducer<IState> = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {...state, loggingIn: true, logInError: undefined};
    case 'LOGIN_SUCCESS':
      persistLogin(action.token, action.user, action.remember);

      return {...state, token: action.token, user: action.user };
    case 'LOGIN_FAILURE':
      return {...state, loggingIn: false, logInError: action.errMessage};
    case 'LOGOUT':
      clearStoredToken();

      return {... state, token: undefined};
    default: {

      return {...initialState, ...state};
    }
  }
};

export default session;
