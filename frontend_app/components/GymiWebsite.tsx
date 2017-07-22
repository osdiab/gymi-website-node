// View of the React application as a whole.
import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';

import { translations } from '../messages';
import routes from './routes';

export function GymiWebsiteView({ currentLanguage, defaultLanguage }) {
  // NOTE: need key on IntlProvider to trigger page rerender
  // https://github.com/yahoo/react-intl/issues/234
  return (
    <IntlProvider
      locale={currentLanguage.localeCode}
      key={currentLanguage.localeCode}
      messages={translations[currentLanguage.localeCode]}
      defaultLocale={defaultLanguage.localeCode}
    >
      <Router
        history={browserHistory}
        render={applyRouterMiddleware(useScroll())}
        routes={routes}
      />
    </IntlProvider>
  );
}

const languagePropType = PropTypes.shape({
  localeCode: PropTypes.string.isRequired,
});
GymiWebsiteView.propTypes = {
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

const GymiWebsite = connect(
  mapStateToProps,
)(GymiWebsiteView);

export default GymiWebsite;
