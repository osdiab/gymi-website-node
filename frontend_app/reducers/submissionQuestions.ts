export default function submissionQuestions(state = {}, action) {
  switch (action.type) {
    case 'SUBMISSION_QUESTIONS_REQUEST':
      return Object.assign({}, state, {
        requestingQuestions: true,
        questionsError: null,
      });
    case 'SUBMISSION_QUESTIONS_SUCCESS': {
      return Object.assign({}, state, {
        questions: action.questions,
        requestingQuestions: false,
        questionsError: null,
      });
    }
    case 'SUBMISSION_QUESTIONS_FAILURE':
      return Object.assign({}, state, {
        requestingQuestions: false,
        questionsError: action.err,
      });
    default: {
      return Object.assign({}, state);
    }
  }
}
