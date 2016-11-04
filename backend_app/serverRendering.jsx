import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';

import reducers from '../frontend_app/reducers';
import Routes from '../frontend_app/components/Routes';
import { translations } from '../frontend_app/messages';

function renderFullPage(html, preloadedState) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/stylesheets/general.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/bundle.css" />
    <link rel="shortcut icon" type="image/png" href="/media/favicon.png"/>
    <link href='https://fonts.googleapis.com/css?family=Noto+Serif:400,400i|Ubuntu:500,300italic' rel='stylesheet' type='text/css'/>
  </head>
  <body>
    <div id="gymi-app-container">${html}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
    </script>
    <script src="/bundle.js" type="text/javascript" charset="utf-8"></script>
  </body>
</html>`;
}

export function handleRender(req, res) {
  const store = createStore(reducers);

  match({ routes: Routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    // Render the component to a string
    const html = renderToString(
      <ReduxProvider store={store}>
        <IntlProvider
          messages={translations.en}
          defaultLocale="en"
        >
          <RouterContext {...props} />
        </IntlProvider>
      </ReduxProvider>
    );

    // Grab the initial state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState));
  });
}
