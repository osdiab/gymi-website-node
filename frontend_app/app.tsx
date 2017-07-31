// Top level component of the data sharing overview table.
// Retrieves an app's view of the district's data through
// the app-view-service and displays it with a TabbedDataTable

import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { Provider as ReduxProvider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

// redux-thunk allows for asynchronous actions; see ../actions/index.js for an example.
import thunkMiddleware from 'redux-thunk';


import GymiWebsite from './components/GymiWebsite';
import reducers from './reducers';

export default function run() {
  addLocaleData([...en, ...zh]);
  const el = document.getElementById('gymi-app-container');

  // Grab the state from a global injected into server-generated HTML
  const preloadedState = (window as Window & {__PRELOADED_STATE__: {}}).__PRELOADED_STATE__;
  const store = createStore(reducers, preloadedState, composeWithDevTools(
    applyMiddleware(thunkMiddleware)
  ));

  render(
    <ReduxProvider store={store}>
      <GymiWebsite />
    </ReduxProvider>
  , el);
}
