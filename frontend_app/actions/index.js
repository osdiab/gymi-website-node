import { browserHistory } from 'react-router';
import moment from 'moment';

// Actions define what events can cause application state to change. How the application state
// actually changes is defined by each reducer in the Redux store (see the store/ directory).

// Synchronous actions are just Javascript objects that contain a `type` and other metadata. The
// `type` allows the `store` to distinguish what action is occurring, and, if present, the Redux
// reducers can use the metadata in other fields to modify the state properly.
export function setCurrentLanguage(localeCode) {
  return { type: 'SET_CURRENT_LANGUAGE', localeCode };
}

export const logInRequest = { type: 'LOGIN_REQUEST' };
export function logInSuccess(token, user, remember) {
  return { type: 'LOGIN_SUCCESS', token, user, remember };
}
export function logInFailure(errMessage) {
  return { type: 'LOGIN_FAILURE', errMessage };
}
export function showModal(modalId, props = {}) {
  return { type: 'SHOW_MODAL', modalId, props };
}
export function hideModal() {
  return { type: 'HIDE_MODAL' };
}
export function logOut() {
  browserHistory.push('/');
  return { type: 'LOGOUT' };
}

// Asynchronous actions depend on redux-thunk to function correctly.  Asynchronous actions are
// functions that can dispatch synchronous actions as they please. Hence, this function receives
// `dispatch` as a parameter.
export function logIn(username, password, remember) {
  return (dispatch) => {
    dispatch(logInRequest);
    fetch('/api/sessions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(logInSuccess(responseData.data.token, responseData.data.user, remember));
        dispatch(hideModal());
        browserHistory.push('/dreamProject');
        return;
      }
      let errMessage;
      switch (response.status) {
        case 400:
          // unexpected: form should catch this on frontend
          errMessage = 'errors.unexpected';
          break;
        case 401:
          errMessage = 'errors.sessions.badCredentials';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(logInFailure(errMessage));
    }).catch(() => {
      dispatch(logInFailure('errors.unexpected'));
    });
  };
}

export function loadOtherSubmissionsRequest() {
  return { type: 'OTHER_SUBMISSIONS_REQUEST' };
}

export function loadOtherSubmissionsFailure(err) {
  return { type: 'OTHER_SUBMISSIONS_FAILURE', err };
}

export function loadOtherSubmissionsSuccess(submissions) {
  return { type: 'OTHER_SUBMISSIONS_SUCCESS', submissions };
}

export function loadOtherSubmissions(userId, token) {
  return (dispatch) => {
    dispatch(loadOtherSubmissionsRequest());
    const after = moment().subtract(1, 'month').toISOString();
    return fetch(`/api/submissions?after=${encodeURIComponent(after)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadOtherSubmissionsSuccess(
          responseData.data.map(s => Object.assign({}, s, { timestamp: new Date(s.timestamp) }))
        ));
        return;
      }
      let errMessage;
      switch (response.status) {
        case 400:
          // unexpected: userId somehow wasn't a string
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(loadOtherSubmissionsFailure(errMessage));
    }).catch(() => {
      dispatch(loadOtherSubmissionsFailure('errors.unexpected'));
    });
  };
}

export function loadOwnSubmissionsRequest() {
  return { type: 'OWN_SUBMISSIONS_REQUEST' };
}

export function loadOwnSubmissionsFailure(err) {
  return { type: 'OWN_SUBMISSIONS_FAILURE', err };
}

export function loadOwnSubmissionsSuccess(submissions) {
  return { type: 'OWN_SUBMISSIONS_SUCCESS', submissions };
}

export function loadOwnSubmissions(userId, token) {
  return (dispatch) => {
    dispatch(loadOwnSubmissionsRequest());
    return fetch(`/api/users/${userId}/submissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadOwnSubmissionsSuccess(
          responseData.data.map(s => Object.assign({}, s, { timestamp: new Date(s.timestamp) }))
        ));
        return;
      }
      let errMessage;
      switch (response.status) {
        case 400:
          // unexpected: userId somehow wasn't a string
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(loadOwnSubmissionsFailure(errMessage));
    }).catch(() => {
      dispatch(loadOwnSubmissionsFailure('errors.unexpected'));
    });
  };
}

export function loadOwnInterestsRequest() {
  return { type: 'OWN_INTERESTS_REQUEST' };
}

export function loadOwnInterestsFailure(err) {
  return { type: 'OWN_INTERESTS_FAILURE', err };
}

export function loadOwnInterestsSuccess(otherInterests, primaryInterest) {
  return { type: 'OWN_INTERESTS_SUCCESS', otherInterests, primaryInterest };
}

export function loadOwnInterests(userId, token) {
  return (dispatch) => {
    dispatch(loadOwnInterestsRequest());
    return fetch(`/api/users/${userId}/interests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadOwnInterestsSuccess(
          responseData.data.interests, responseData.data.primaryInterest)
        );
        return;
      }
      let errMessage;
      switch (response.status) {
        case 400:
          // unexpected: userId somehow wasn't a string
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(loadOwnInterestsFailure(errMessage));
    }).catch(() => {
      dispatch(loadOwnInterestsFailure('errors.unexpected'));
    });
  };
}

export function createSubmissionRequest() {
  return { type: 'CREATE_SUBMISSION_REQUEST' };
}

export function createSubmissionFailure(err) {
  return { type: 'CREATE_SUBMISSION_FAILURE', err };
}

export function createSubmissionSuccess() {
  return { type: 'CREATE_SUBMISSION_SUCCESS' };
}

export function createSubmission(userId, token, answers) {
  return (dispatch) => {
    dispatch(createSubmissionRequest());
    return fetch(`/api/users/${userId}/submissions`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers,
      }),
    }).then((response) => {
      if (response.status === 201) {
        dispatch(createSubmissionSuccess());
        dispatch(loadOwnSubmissions(userId, token));
        dispatch(loadOtherSubmissions(userId, token));
        return;
      }

      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(createSubmissionFailure(errMessage));
    }).catch(() => {
      dispatch(createSubmissionFailure('errors.unexpected'));
    });
  };
}

export function loadSubmissionQuestionsRequest() {
  return { type: 'SUBMISSION_QUESTIONS_REQUEST' };
}

export function loadSubmissionQuestionsFailure(err) {
  return { type: 'SUBMISSION_QUESTIONS_FAILURE', err };
}

export function loadSubmissionQuestionsSuccess(questions) {
  return { type: 'SUBMISSION_QUESTIONS_SUCCESS', questions };
}

export function loadSubmissionQuestions(userId, token) {
  return (dispatch) => {
    dispatch(loadSubmissionQuestionsRequest());
    return fetch('/api/submissionQuestions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadSubmissionQuestionsSuccess(responseData.data));
        return;
      }
      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(loadSubmissionQuestionsFailure(errMessage));
    }).catch(() => {
      dispatch(loadSubmissionQuestionsFailure('errors.unexpected'));
    });
  };
}

export function loadTopicsRequest() {
  return { type: 'LOAD_TOPICS_REQUEST' };
}

export function loadTopicsFailure(err) {
  return { type: 'LOAD_TOPICS_FAILURE', err };
}

export function loadTopicsSuccess(topics) {
  return { type: 'LOAD_TOPICS_SUCCESS', topics };
}

export function loadTopics(userId, token) {
  return (dispatch) => {
    dispatch(loadTopicsRequest());
    return fetch('/api/topics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadTopicsSuccess(responseData.data));
        return;
      }
      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(loadTopicsFailure(errMessage));
    }).catch(() => {
      dispatch(loadTopicsFailure('errors.unexpected'));
    });
  };
}

export function addInterestRequest() {
  return { type: 'ADD_INTEREST_REQUEST' };
}

export function addInterestFailure(err) {
  return { type: 'ADD_INTEREST_FAILURE', err };
}

export function addInterestSuccess() {
  return { type: 'ADD_INTEREST_SUCCESS' };
}

export function addInterest(userId, token, topicId, primary = false) {
  return (dispatch) => {
    dispatch(addInterestRequest());
    return fetch(`/api/users/${userId}/interests`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topicId,
        primary,
      }),
    }).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(addInterestSuccess());
        dispatch(loadOwnInterests(userId, token));
        return;
      }

      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(addInterestFailure(errMessage));
    }).catch(() => {
      dispatch(addInterestFailure('errors.unexpected'));
    });
  };
}

export function removeInterestRequest() {
  return { type: 'REMOVE_INTEREST_REQUEST' };
}

export function removeInterestFailure(err) {
  return { type: 'REMOVE_INTEREST_FAILURE', err };
}

export function removeInterestSuccess() {
  return { type: 'REMOVE_INTEREST_SUCCESS' };
}

export function removeInterest(userId, token, topicId, primary = false) {
  return (dispatch) => {
    dispatch(removeInterestRequest());
    return fetch(`/api/users/${userId}/interests`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topicId,
        primary,
      }),
    }).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(removeInterestSuccess());
        dispatch(loadOwnInterests(userId, token));
        return;
      }

      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(removeInterestFailure(errMessage));
    }).catch(() => {
      dispatch(removeInterestFailure('errors.unexpected'));
    });
  };
}

export function changePasswordRequest() {
  return { type: 'CHANGE_PASSWORD_REQUEST' };
}

export function changePasswordFailure(err) {
  return { type: 'CHANGE_PASSWORD_FAILURE', err };
}

export function changePasswordSuccess() {
  return { type: 'CHANGE_PASSWORD_SUCCESS' };
}

export function changePassword(userId, token, newPassword) {
  return (dispatch) => {
    dispatch(changePasswordRequest());
    return fetch(`/api/users/${userId}/credentials`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newPassword,
      }),
    }).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(changePasswordSuccess());
        return;
      }

      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(changePasswordFailure(errMessage));
    }).catch(() => {
      dispatch(changePasswordFailure('errors.unexpected'));
    });
  };
}

export function signUpUserRequest() {
  return { type: 'SIGN_UP_USER_REQUEST' };
}

export function signUpUserFailure(err) {
  return { type: 'SIGN_UP_USER_FAILURE', err };
}

export function signUpUserSuccess() {
  return { type: 'SIGN_UP_USER_SUCCESS' };
}

export function signUpUser(username, name, password, role, loggedInToken = '') {
  return (dispatch) => {
    dispatch(signUpUserRequest());
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (loggedInToken) {
      headers.Authorization = `Bearer ${loggedInToken}`;
    }

    return fetch('/api/users/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        username,
        name,
        password,
        role,
      }),
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        const { user, token } = responseData.data;
        dispatch(signUpUserSuccess());
        dispatch(hideModal());
        if (token) {
          dispatch(logInSuccess(token, user));
          browserHistory.push('/dreamProject');
        }
        return;
      }

      let errMessage;
      switch (response.status) {
        case 400:
          errMessage = 'errors.unexpected';
          break;
        case 401:
          // probably token expired
          dispatch(logOut());
          browserHistory.push('/');
          dispatch(showModal('login'));
          errMessage = 'errors.unexpected';
          break;
        default:
          errMessage = 'errors.unexpected';
      }
      dispatch(signUpUserFailure(errMessage));
    }).catch(() => {
      dispatch(signUpUserFailure('errors.unexpected'));
    });
  };
}

export function loadUserRequest() {
  return { type: 'LOAD_USER_REQUEST' };
}

export function loadUserFailure(err) {
  return { type: 'LOAD_USER_FAILURE', err };
}

export function loadUserSuccess(user) {
  return { type: 'LOAD_USER_SUCCESS', user };
}

export function loadUser(userId, token) {
  return (dispatch) => {
    dispatch(loadUserRequest());
    return fetch(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadUserSuccess(responseData.data));
        return;
      }
      dispatch(loadUserFailure('errors.unexpected'));
    }).catch(() => {
      dispatch(loadUserFailure('errors.unexpected'));
    });
  };
}
