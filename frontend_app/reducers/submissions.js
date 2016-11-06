import _ from 'lodash';

export default function submissions(state = {}, action) {
  switch (action.type) {
    case 'OTHER_SUBMISSIONS_REQUEST':
      return Object.assign({}, state, { requestingOtherSubmissions: true });
    case 'OTHER_SUBMISSIONS_SUCCESS': {
      return Object.assign({}, state, {
        otherSubmissions: _.unionBy(state.otherSubmissions, submissions, 'id'),
        requestingOtherSubmissions: false,
      });
    }
    case 'OTHER_SUBMISSIONS_FAILURE':
      return Object.assign({}, state, {
        requestingOtherSubmissions: false,
        ownSubmissionsError: action.err,
      });
    case 'OWN_SUBMISSIONS_REQUEST':
      return Object.assign({}, state, { requestingOwnSubmissions: true });
    case 'OWN_SUBMISSIONS_SUCCESS': {
      return Object.assign({}, state, {
        ownSubmissions: submissions,
        requestingOwnSubmissions: false,
      });
    }
    case 'OWN_SUBMISSIONS_FAILURE':
      return Object.assign({}, state, {
        requestingOwnSubmissions: false,
        ownSubmissionsError: action.err,
      });
    default: {
      const initialState = {
        otherSubmissions: [],
      };
      return Object.assign({}, initialState, state);
    }
  }
}

