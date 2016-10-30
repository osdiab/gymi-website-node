// Top level component of the data sharing overview table.
// Retrieves an app's view of the district's data through
// the app-view-service and displays it with a TabbedDataTable

import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { Provider as ReduxProvider } from 'react-redux';

import GymiWebsite from './components/GymiWebsite';
import store from './store';

export default function run() {
  addLocaleData([...en, ...zh]);
  const el = document.getElementById('gymi-app-container');
  render(
    <ReduxProvider store={store}>
      <GymiWebsite />
    </ReduxProvider>
  , el);
}
