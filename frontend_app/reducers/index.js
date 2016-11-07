// combines all the redux reducers into a single one.
import { combineReducers } from 'redux';

import language from './language';
import session from './session';
import interests from './interests';
import submissions from './submissions';
import submissionQuestions from './submissionQuestions';
import topics from './topics';
import users from './users';

export default combineReducers({
  language,
  session,
  interests,
  submissions,
  submissionQuestions,
  topics,
  users,
});
