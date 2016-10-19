// View of the React application as a whole.
import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';

import CounterSection from '../components/CounterSection';
import LanguageSelector from '../components/LanguageSelector';
import QuoteSection from '../components/QuoteSection';

export function ExampleAppView({ currentLanguage, defaultLanguage }) {
  // NOTE: need key on IntlProvider to trigger page rerender
  // https://github.com/yahoo/react-intl/issues/234
  return (
    <IntlProvider
      locale={currentLanguage.localeCode}
      key={currentLanguage.localeCode}
      defaultLocale={defaultLanguage.localeCode}
    >
      <div className="overview">
        <h1>Example Application</h1>
        <LanguageSelector />
        <CounterSection />
        <QuoteSection />
      </div>
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
import { connect } from 'react-redux';

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
