/**
 * Defines all actions the store can handle
 */
import * as moment from 'moment';
import { browserHistory } from 'react-router';
import {Dispatch} from 'redux';

import {Id} from 'common/entities';
import {SupportedLocaleCode} from 'common/languages';
import {Role} from 'common/roles';
import {SubmissionQuestion} from 'common/submissionQuestions';
import {Submission} from 'common/submissions';
import {User} from 'common/users';
import {IState} from 'frontend/reducers';

import {IProps as ILogInModalProps} from 'frontend/components/LogInModal';

import {Action as InterestsAction} from 'frontend/reducers/interests';
import {Action as LanguageAction} from 'frontend/reducers/language';
import {Action as ModalAction, ModalData} from 'frontend/reducers/modal';
import {Action as PeriodsAction} from 'frontend/reducers/periods';
import {Action as SessionAction} from 'frontend/reducers/session';
import {
  Action as SubmissionQuestionsAction
} from 'frontend/reducers/submissionQuestions';
import {Action as SubmissionsAction} from 'frontend/reducers/submissions';
import {Action as TopicsAction} from 'frontend/reducers/topics';
import {Action as UsersAction} from 'frontend/reducers/users';

// Actions define what events can cause application state to change. How the application state
// actually changes is defined by each reducer in the Redux store (see the store/ directory).

// Synchronous actions are just Javascript objects that contain a `type` and other metadata. The
// `type` allows the `store` to distinguish what action is occurring, and, if present, the Redux
// reducers can use the metadata in other fields to modify the state properly.
export function setCurrentLanguage(localeCode: SupportedLocaleCode): LanguageAction {
  return { type: 'SET_CURRENT_LANGUAGE', localeCode };
}

export function logInRequest(): SessionAction {
  return { type: 'LOGIN_REQUEST' };
}
export function logInSuccess(
  token: string, user: User, remember: boolean
): SessionAction {
  return { type: 'LOGIN_SUCCESS', token, user, remember };
}
export function logInFailure(errMessage: string): SessionAction {
  return { type: 'LOGIN_FAILURE', errMessage };
}
export function showModal(modalData: ModalData): ModalAction {
  return { type: 'SHOW_MODAL', modalData};
}

export function hideModal(): ModalAction {
  return { type: 'HIDE_MODAL' };
}
export function logOut(): SessionAction {
  browserHistory.push('/');

  return { type: 'LOGOUT' };
}

// Asynchronous actions depend on redux-thunk to function correctly.  Asynchronous actions are
// functions that can dispatch synchronous actions as they please. Hence, this function receives
// `dispatch` as a parameter.
export function logIn(username: string, password: string, remember: boolean) {
  return (dispatch: Dispatch<IState>) => {
    dispatch(logInRequest());
    fetch('/api/sessions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
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

export function loadOtherSubmissionsFailure(err: Error) {
  return { type: 'OTHER_SUBMISSIONS_FAILURE', err };
}

export function loadOtherSubmissionsSuccess(submissions: Submission[]) {
  return { type: 'OTHER_SUBMISSIONS_SUCCESS', submissions };
}

export function loadOtherSubmissions(userId: Id, token: string) {
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadOtherSubmissionsRequest());
    const after = moment().subtract(1, 'month').toISOString();

    return fetch(`/api/submissions?after=${encodeURIComponent(after)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        const retrievedSubmissions: Submission[] = responseData.data;
        // convert string timestamps to actual date objects
        dispatch(loadOtherSubmissionsSuccess(
          retrievedSubmissions.map(s => ({
            ...s,
            timestamp: new Date(s.timestamp)
          }))
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadOwnSubmissionsRequest());
    return fetch(`/api/users/${userId}/submissions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadOwnInterestsRequest());

    return fetch(`/api/users/${userId}/interests`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(createSubmissionRequest());
    return fetch(`/api/users/${userId}/submissions`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        answers
      })
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadSubmissionQuestionsRequest());
    return fetch('/api/submissionQuestions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

export function loadPeriodsRequest() {
  return { type: 'LOAD_PERIODS_REQUEST' };
}

export function loadPeriodsFailure(err) {
  return { type: 'LOAD_PERIODS_FAILURE', err };
}

export function loadPeriodsSuccess(periods) {
  return { type: 'LOAD_PERIODS_SUCCESS', periods };
}

export function loadPeriods(token) {
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadPeriodsRequest());
    return fetch('/api/periods', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadPeriodsSuccess(responseData.data));
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
      dispatch(loadPeriodsFailure(errMessage));
    }).catch(() => {
      dispatch(loadPeriodsFailure('errors.unexpected'));
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

export function loadTopics(token) {
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadTopicsRequest());
    return fetch('/api/topics', {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(addInterestRequest());
    return fetch(`/api/users/${userId}/interests`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        topicId,
        primary
      })
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(removeInterestRequest());
    return fetch(`/api/users/${userId}/interests`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        topicId,
        primary
      })
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
  return (dispatch: Dispatch<IState>) => {
    dispatch(changePasswordRequest());
    return fetch(`/api/users/${userId}/credentials`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        newPassword
      })
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

export function signUpUser(username: string, name: string, password: string, role: Role, loggedInToken = '') {
  return (dispatch: Dispatch<IState>) => {
    dispatch(signUpUserRequest());
    type SignUpHeaders = {
      Accept: string,
      'Content-Type': string,
      Authorization: string
    };

    const headers: SignUpHeaders = <SignUpHeaders>{
      Accept: 'application/json',
      'Content-Type': 'application/json'
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
        role
      })
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

export function loadUserRequest(id: Id) {
  return { type: 'LOAD_USER_REQUEST', id };
}

export function loadUserFailure(err) {
  return { type: 'LOAD_USER_FAILURE', err };
}

export function loadUserSuccess(user) {
  return { type: 'LOAD_USER_SUCCESS', user };
}

export function loadUser(userId, token) {
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadUserRequest(userId));
    return fetch(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

export function loadAllUsersRequest() {
  return { type: 'LOAD_ALL_USERS_REQUEST' };
}

export function loadAllUsersFailure(err) {
  return { type: 'LOAD_ALL_USERS_FAILURE', err };
}

export function loadAllUsersSuccess(users) {
  return { type: 'LOAD_ALL_USERS_SUCCESS', users };
}

export function loadAllUsers(token) {
  return (dispatch: Dispatch<IState>) => {
    dispatch(loadAllUsersRequest());
    return fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => Promise.all([response, response.json()])
    ).then(([response, responseData]) => {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(loadAllUsersSuccess(responseData.data));
        return;
      }
      dispatch(loadAllUsersFailure('errors.unexpected'));
    }).catch(() => {
      dispatch(loadAllUsersFailure('errors.unexpected'));
    });
  };
}
