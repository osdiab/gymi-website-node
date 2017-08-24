/**
 * Describes state transitions related to submission questions
 */

import {Reducer} from 'redux';

import {SubmissionQuestion} from 'common/submissionQuestions';

export type Action = {
  type: 'SUBMISSION_QUESTIONS_REQUEST'
} | {
  type: 'SUBMISSION_QUESTIONS_SUCCESS',
  questions: SubmissionQuestion[]
} | {
  type: 'SUBMISSION_QUESTIONS_FAILURE',
  err: Error
};

export interface IState {
  readonly requestingQuestions: boolean;
  readonly questionsError?: Error;
  readonly questions?: SubmissionQuestion[];
}

const initialState: IState = {
  requestingQuestions: false
};

const submissionQuestions: Reducer<IState> = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case 'SUBMISSION_QUESTIONS_REQUEST':
      return {
        ...state,
        requestingQuestions: true,
        questionsError: undefined
      };
    case 'SUBMISSION_QUESTIONS_SUCCESS': {
      return {
        ...state,
        questions: action.questions,
        requestingQuestions: false,
        questionsError: undefined
      };
    }
    case 'SUBMISSION_QUESTIONS_FAILURE':
      return {
        ...state,
        requestingQuestions: false,
        questionsError: action.err
      };
    default: {
      return {...state};
    }
  }
};

export default submissionQuestions;
