/**
 * Describes state transitions related to submissions
 */
import {Reducer} from 'redux';

import {Submission} from 'common/submissions';

export type Action = {
  type: 'OTHER_SUBMISSIONS_REQUEST'
} | {
  type: 'OTHER_SUBMISSIONS_SUCCESS',
  submissions: Submission[]
} | {
  type: 'OTHER_SUBMISSIONS_FAILURE',
  err: Error
} | {
  type: 'OWN_SUBMISSIONS_REQUEST'
} | {
  type: 'OWN_SUBMISSIONS_SUCCESS',
  submissions: Submission[]
} | {
  type: 'OWN_SUBMISSIONS_FAILURE',
  err: Error
} | {
  type: 'CREATE_SUBMISSION_REQUEST'
} | {
  type: 'CREATE_SUBMISSION_SUCCESS'
} | {
  type: 'CREATE_SUBMISSION_FAILURE',
  err: Error
};

export interface IState {
  readonly requestingOtherSubmissions: boolean;
  readonly otherSubmissionsError?: Error;
  readonly otherSubmissions?: Submission[];
  readonly requestingOwnSubmissions: boolean;
  readonly ownSubmissionsError?: Error;
  readonly ownSubmissions?: Submission[];
  readonly creatingSubmission: boolean;
  readonly createSubmissionError?: Error;
  readonly createdSubmission: boolean;
}

const initialState: IState = {
  requestingOtherSubmissions: false,
  requestingOwnSubmissions: false,
  creatingSubmission: false,
  createdSubmission: false
};

const submissions: Reducer<IState> = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case 'OTHER_SUBMISSIONS_REQUEST':
      return {
        ...state,
        requestingOtherSubmissions: true,
        otherSubmissionsError: undefined
      };
    case 'OTHER_SUBMISSIONS_SUCCESS': {
      return {
        ...state,
        otherSubmissions: action.submissions,
        requestingOtherSubmissions: false,
        otherSubmissionsError: undefined
      };
    }
    case 'OTHER_SUBMISSIONS_FAILURE':
      return {
        ...state,
        requestingOtherSubmissions: false,
        otherSubmissionsError: action.err
      };
    case 'OWN_SUBMISSIONS_REQUEST':
      return {
        ...state,
        requestingOwnSubmissions: true,
        ownSubmissionsError: undefined
      };
    case 'OWN_SUBMISSIONS_SUCCESS': {
      return {
        ...state,
        ownSubmissions: action.submissions,
        requestingOwnSubmissions: false,
        ownSubmissionsError: undefined
      };
    }
    case 'OWN_SUBMISSIONS_FAILURE':
      return {
        ...state,
        requestingOwnSubmissions: false,
        ownSubmissionsError: action.err
      };
    case 'CREATE_SUBMISSION_REQUEST':
      return {
        ...state,
        creatingSubmission: true,
        createSubmissionError: undefined
      };
    case 'CREATE_SUBMISSION_FAILURE':
      return {
        ...state,
        creatingSubmission: false,
        createSubmissionError: action.err
      };
    case 'CREATE_SUBMISSION_SUCCESS':
      return {
        ...state,
        creatingSubmission: false,
        createSubmissionError: undefined,
        createdSubmission: true
      };
    default: {
      return {
        creatingSubmission: false,
        createdSubmission: false,
        ...state
      };
    }
  }
};

export default submissions;
