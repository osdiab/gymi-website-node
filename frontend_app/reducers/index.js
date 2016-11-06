// combines all the redux reducers into a single one.
import { combineReducers } from 'redux';

import language from './language';
import session from './session';
import interests from './interests';
import submissions from './submissions';

export default combineReducers({
  language,
  session,
  interests,
  submissions,
});
