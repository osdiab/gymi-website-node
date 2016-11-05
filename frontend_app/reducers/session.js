// Expresses how state related to the user's session changes as actions arrive.
// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

const isBrowser = typeof window !== 'undefined' && window.document;

const TOKEN_KEY = 'session.token';

function fetchStoredToken() {
  if (!isBrowser) {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
}

function persistToken(token, remember) {
  if (!isBrowser) {
    return;
  }

  if (remember) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
}

function clearStoredToken() {
  if (!isBrowser) {
    return;
  }
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
}

export default function session(state = {}, action) {
  const initialState = {
    token: fetchStoredToken(),
    loginError: null,
    showingLogInModal: false,
  };

  switch (action.type) {
    case 'TOGGLE_LOGIN_MODAL':
      return Object.assign({}, state, { showingLogInModal: action.show });
    case 'LOGIN_REQUEST':
      return Object.assign({}, state, { loggingIn: true, loginError: null });
    case 'LOGIN_SUCCESS':
      persistToken(action.token, action.remember);
      return Object.assign({}, state, { token: action.token });
    case 'LOGIN_FAILURE':
      return Object.assign({}, state, { loggingIn: false, loginError: action.errMessage });
    case 'LOGOUT':
      clearStoredToken();
      return Object.assign({}, state, { token: null });
    default:
      return Object.assign({}, initialState, state);
  }
}

