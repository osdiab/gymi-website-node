/**
 * Renders the website. This is the top level component.
 */
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';

import {Language} from 'common/languages';
import routes from 'frontend/components/routes';
import { translations } from 'frontend/messages';

interface IProps {
  currentLanguage: Language;
  defaultLanguage: Language;
}

export const GymiWebsiteView: React.StatelessComponent<IProps> = ({ currentLanguage, defaultLanguage }) => {
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
};

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.

function mapStateToProps(state) {
  return {
    currentLanguage: state.language.currentLanguage,
    defaultLanguage: state.language.defaultLanguage
  };
}

const GymiWebsite = connect(
  mapStateToProps
)(GymiWebsiteView);

export default GymiWebsite;
