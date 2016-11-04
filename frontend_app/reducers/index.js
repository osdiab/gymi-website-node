// combines all the redux reducers into a single one.
import { combineReducers } from 'redux';

import language from './language';

export default combineReducers({
  language,
});
