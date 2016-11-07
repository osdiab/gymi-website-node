// TODO: resilient to errors from local/sessionStorage

// Expresses how state related to the user's session changes as actions arrive.
// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

const isBrowser = typeof window !== 'undefined' && window.document;

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
    user: window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY),
  };

  // don't return if missing data
  if (!data.token || !data.user) {
    clearStoredToken();
    return null;
  }
  return { token: data.token, user: JSON.parse(data.user) };
}

function persistLogin(token, user, remember) {
  if (!isBrowser) {
    return;
  }

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export default function session(state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_LOGIN_MODAL':
      return Object.assign({}, state, { showingLogInModal: action.show });
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, { loggingIn: true, logInError: null });
    case 'LOGIN_SUCCESS':
      persistLogin(action.token, action.user, action.remember);
      return Object.assign({}, state, { token: action.token, user: action.user });
    case 'LOGIN_FAILURE':
      return Object.assign({}, state, { loggingIn: false, logInError: action.errMessage });
    case 'LOGOUT':
      clearStoredToken();
      return Object.assign({}, state, { token: null });
    default: {
      const initialState = {
        showingLogInModal: false,
      };
      const loginData = fetchStoredLogin();
      if (loginData) {
        initialState.token = loginData.token;
        initialState.user = loginData.user;
      }
      return Object.assign({}, initialState, state);
    }
  }
}

