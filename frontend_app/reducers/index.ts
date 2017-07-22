// combines all the redux reducers into a single one.
import { combineReducers } from 'redux';

import language from './language';
import session from './session';
import interests from './interests';
import submissions from './submissions';
import submissionQuestions from './submissionQuestions';
import periods from './periods';
import topics from './topics';
import users from './users';
import modal from './modal';

export default combineReducers({
  language,
  session,
  interests,
  submissions,
  submissionQuestions,
  topics,
  users,
  modal,
  periods,
});
