/**
 * Top level component for the frontend application
 */

import * as React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';
import { Provider as ReduxProvider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

// redux-thunk allows for asynchronous actions; see ../actions/index.js for an example.
import thunkMiddleware from 'redux-thunk';

import GymiWebsite from 'frontend/components/GymiWebsite';
import reducer, {IState} from 'frontend/reducers';

export default function run() {
  addLocaleData([...en, ...zh]);
  const el = document.getElementById('gymi-app-container');

  // Grab the state from a global injected into server-generated HTML
  const preloadedState: IState = (window as Window & {__PRELOADED_STATE__: IState}).__PRELOADED_STATE__;
  const store = createStore<IState>(reducer, preloadedState, composeWithDevTools(
    applyMiddleware(thunkMiddleware)
  ));

  render(
    <ReduxProvider store={ store }>
      <GymiWebsite />
    </ReduxProvider>
  , el);
}
