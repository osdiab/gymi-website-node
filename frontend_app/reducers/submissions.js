export default function submissions(state = {}, action) {
  switch (action.type) {
    case 'OTHER_SUBMISSIONS_REQUEST':
      return Object.assign({}, state, {
        requestingOtherSubmissions: true,
        otherSubmissionsError: null,
      });
    case 'OTHER_SUBMISSIONS_SUCCESS': {
      return Object.assign({}, state, {
        otherSubmissions: action.otherSubmissions,
        requestingOtherSubmissions: false,
        otherSubmissionsError: null,
      });
    }
    case 'OTHER_SUBMISSIONS_FAILURE':
      return Object.assign({}, state, {
        requestingOtherSubmissions: false,
        otherSubmissionsError: action.err,
      });
    case 'OWN_SUBMISSIONS_REQUEST':
      return Object.assign({}, state, {
        requestingOwnSubmissions: true,
        ownSubmissionsError: null,
      });
    case 'OWN_SUBMISSIONS_SUCCESS': {
      return Object.assign({}, state, {
        ownSubmissions: action.submissions,
        requestingOwnSubmissions: false,
        ownSubmissionsError: null,
      });
    }
    case 'OWN_SUBMISSIONS_FAILURE':
      return Object.assign({}, state, {
        requestingOwnSubmissions: false,
        ownSubmissionsError: action.err,
      });
    case 'CREATE_SUBMISSION_REQUEST':
      return Object.assign({}, state, {
        creatingSubmission: true,
        createSubmissionError: null,
      });
    case 'CREATE_SUBMISSION_FAILURE':
      return Object.assign({}, state, {
        creatingSubmission: false,
        createSubmissionError: action.err,
      });
    case 'CREATE_SUBMISSION_SUCCESS':
      return Object.assign({}, state, {
        creatingSubmission: false,
        createSubmissionError: null,
        createdSubmission: true,
      });
    default: {
      return Object.assign({}, state);
    }
  }
}

