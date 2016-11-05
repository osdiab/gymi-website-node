// Actions define what events can cause application state to change. How the application state
// actually changes is defined by each reducer in the Redux store (see the store/ directory).

// Synchronous actions are just Javascript objects that contain a `type` and other metadata. The
// `type` allows the `store` to distinguish what action is occurring, and, if present, the Redux
// reducers can use the metadata in other fields to modify the state properly.
export function setCurrentLanguage(localeCode) {
  return { type: 'SET_CURRENT_LANGUAGE', localeCode };
}

export const loginRequest = { type: 'LOGIN_REQUEST' };
export function loginSuccess(token, remember) {
  return { type: 'LOGIN_SUCCESS', token, remember };
}
export function loginFailure(errMessage) {
  return { type: 'LOGIN_SUCCESS', errMessage };
}
export function toggleLogInModal(show) {
  return { type: 'TOGGLE_LOGIN_MODAL', show };
}
export const logOut = { type: 'LOGOUT' };

// Asynchronous actions depend on redux-thunk to function correctly.  Asynchronous actions are
// functions that can dispatch synchronous actions as they please. Hence, this function receives
// `dispatch` as a parameter.
export function logIn(dispatch) {
  return (username, password, remember) => {
    dispatch(loginRequest);
    fetch('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }).then(response => [response, response.json()]
    ).then(([response, responseData]) => {
      if (response.statusCode === 200) {
        dispatch(loginSuccess(responseData.token, remember));
        return;
      }
      let errMessage;
      switch (response.statusCode) {
        case 400:
          // unexpected: form should catch this on frontend
          errMessage = 'errors.missingCredentials';
          break;
        case 401:
          errMessage = 'errors.badCredentials';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(loginFailure(errMessage));
    }).catch(() => {
      dispatch(loginFailure('errors.unexpected'));
    });
  };
}
