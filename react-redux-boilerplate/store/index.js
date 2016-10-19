// combines all the redux reducers into a single store. redux-thunk allows for asynchronous actions;
// see ../actions/index.js for an example.

import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import counter from './counter';
import language from './language';
import quote from './quote';

const store = createStore(combineReducers({
  counter,
  language,
  quote,
}), compose(
  applyMiddleware(thunkMiddleware),
  // add dev tools as middleware; if not present, add identity fn as middleware
  (window.devToolsExtension ? window.devToolsExtension() : (_) => _)
));

// createStore initializes each reducer, and hence populates the initial state. To see initial
// values, see the default values for the state parameter in each reducer.
export default store;
