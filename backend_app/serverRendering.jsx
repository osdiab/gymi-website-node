import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';
import areIntlLocalesSupported from 'intl-locales-supported';
import IntlPolyfill from 'intl';
import Helmet from 'react-helmet';

import reducers from '../frontend_app/reducers';
import { findSupportedLanguage, getSupportedLanguages } from '../frontend_app/reducers/language';
import routes from '../frontend_app/components/routes';
import { translations } from '../frontend_app/messages';

// taken from http://formatjs.io/guides/runtime-environments/#server

const supportedLocales = getSupportedLanguages().map(l => l.localeCode);

if (global.Intl) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (!areIntlLocalesSupported(supportedLocales)) {
    // `Intl` exists, but it doesn't have the data we need, so load the
    // polyfill and replace the constructors with need with the polyfill's.
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  // No `Intl`, so use and load the polyfill.
  global.Intl = IntlPolyfill;
}

const googleAnalyticsCode = `
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-86896275-1', 'auto');
  ga('send', 'pageview');

</script>`;

function renderFullPage(html, preloadedState, head) {
  return `
<!DOCTYPE html>
<html>
  <head ${head.htmlAttributes.toString()}>
    ${head.title.toString()}
    <link rel="stylesheet" type="text/css" href="/stylesheets/general.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/bundle.css" />
    <link rel="shortcut icon" type="image/png" href="/media/favicon.png"/>
    <link href='https://fonts.googleapis.com/css?family=Noto+Serif:400,400i|Ubuntu:400,400i,500' rel='stylesheet' type='text/css'/>
  </head>
  <body>
    <div id="gymi-app-container">${html}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
    </script>
    <script src="/bundle.js" type="text/javascript" charset="utf-8"></script>
    ${googleAnalyticsCode}
  </body>
</html>`;
}

export function handleRender(req, res) {
  const supportedLanguage = findSupportedLanguage(req.language);
  const store = supportedLanguage ?
    createStore(reducers, { language: { currentLanguage: supportedLanguage } }) :
    createStore(reducers);

  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const lang = supportedLanguage ? supportedLanguage.localeCode : 'en';
    // Render the component to a string
    const html = renderToString(
      <ReduxProvider store={store}>
        <IntlProvider
          locale={lang}
          messages={translations[lang]}
          defaultLocale="en"
        >
          <RouterContext {...props} />
        </IntlProvider>
      </ReduxProvider>
    );
    const head = Helmet.rewind();

    // Grab the initial state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState, head));
  });
}
