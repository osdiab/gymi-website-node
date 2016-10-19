// Actions define what events can cause application state to change. How the application state
// actually changes is defined by each reducer in the Redux store (see the store/ directory).

import 'whatwg-fetch';

// Synchronous actions are just Javascript objects that contain a `type` and other metadata. The
// `type` allows the `store` to distinguish what action is occurring, and, if present, the Redux
// reducers can use the metadata in other fields to modify the state properly.
export function setCurrentLanguage(localeCode) {
  return { type: 'SET_CURRENT_LANGUAGE', localeCode };
}

export function incrementCounter() {
  return { type: 'INCREMENT_COUNTER' };
}

export function fetchingQuote() {
  return { type: 'FETCHING_QUOTE' };
}

export function receivedQuote(author, quote) {
  return {
    type: 'RECEIVED_QUOTE',
    author,
    quote,
  };
}

export function fetchingQuoteFailed(err) {
  return {
    type: 'FETCHING_QUOTE_FAILED',
    err,
  };
}

// Gets a random quote and dispatches actions to update the Redux store correspondingly.
//
// Sends Redux actions at each step. This is an asynchronous action that depends on redux-thunk to
// function correctly.  Asynchronous actions are functions that can dispatch synchronous actions as
// they please. Hence, this function receives `dispatch` as a parameter.
export function fetchQuote() {
  return (dispatch) => {
    dispatch(fetchingQuote());
    fetch('/api/quote').then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }

      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }).then((response) => {
      dispatch(receivedQuote(response.author, response.quote));
    }).catch((err) => {
      dispatch(fetchingQuoteFailed(err));
    });
  };
}
