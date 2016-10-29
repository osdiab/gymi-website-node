// View of the React application as a whole.
import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import { translations } from '../messages';
import SiteLayout from './SiteLayout';
import HomePage from './pages/HomePage';
import CounterSection from './CounterSection';
import QuoteSection from './QuoteSection';

export function ExampleAppView({ currentLanguage, defaultLanguage }) {
  // NOTE: need key on IntlProvider to trigger page rerender
  // https://github.com/yahoo/react-intl/issues/234
  return (
    <IntlProvider
      locale={currentLanguage.localeCode}
      key={currentLanguage.localeCode}
      messages={translations[currentLanguage.localeCode]}
      defaultLocale={defaultLanguage.localeCode}
    >
      <Router history={browserHistory}>
        <Route path="/" component={SiteLayout}>
          <IndexRoute component={HomePage} />
          <Route path="counter" component={CounterSection} />
          <Route path="quote" component={QuoteSection} />
        </Route>
      </Router>
    </IntlProvider>
  );
}

const languagePropType = PropTypes.shape({
  localeCode: PropTypes.string.isRequired,
});
ExampleAppView.propTypes = {
  currentLanguage: languagePropType.isRequired,
  defaultLanguage: languagePropType.isRequired,
};

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.

function mapStateToProps(state) {
  return {
    currentLanguage: state.language.currentLanguage,
    defaultLanguage: state.language.defaultLanguage,
  };
}

const ExampleApp = connect(
  mapStateToProps,
)(ExampleAppView);

export default ExampleApp;
