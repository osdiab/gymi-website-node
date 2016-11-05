// combines all the redux reducers into a single one.
import { combineReducers } from 'redux';

import language from './language';
import session from './session';

export default combineReducers({
  language,
  session,
});
