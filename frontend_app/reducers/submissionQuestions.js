export default function submissionQuestions(state = {}, action) {
  switch (action.type) {
    case 'SUBMISSION_QUESTIONS_REQUEST':
      return Object.assign({}, state, {
        requestingSubmissionQuestions: true,
        submissionQuestionsError: null,
      });
    case 'SUBMISSION_QUESTIONS_SUCCESS': {
      return Object.assign({}, state, {
        submissionQuestions: action.questions,
        requestingSubmissionQuestions: false,
        submissionQuestionsError: null,
      });
    }
    case 'SUBMISSION_QUESTIONS_FAILURE':
      return Object.assign({}, state, {
        requestingSubmissionQuestions: false,
        submissionQuestionsError: action.err,
      });
    default: {
      return Object.assign({}, state);
    }
  }
}
