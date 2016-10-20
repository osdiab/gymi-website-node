// Component
// View of the section of the page that displays a counter and a button to increment it.
// Presentational code only; state is passed as properties by the container.
import React, { PropTypes } from 'react';

require('./LanguageSelector.less');
export function LanguageSelectorView({
  currentLanguage, validLanguages, setCurrentLanguage,
}) {
  const languageButtons = validLanguages.map((lang) => (
    <li className="LanguageSelector--languages--entry" key={lang.localeCode}>
      <button
        disabled={currentLanguage.localeCode === lang.localeCode}
        onClick={() => setCurrentLanguage(lang.localeCode)}
      >
        {lang.shortDisplayName}
      </button>
    </li>
  ));

  return (<div className="LanguageSelector">
    <ul className="LanguageSelector--languages">
      {languageButtons}
    </ul>
  </div>);
}

const languagePropType = PropTypes.shape({
  localeCode: PropTypes.string.isRequired,
  shortDisplayName: PropTypes.string.isRequired,
});
LanguageSelectorView.propTypes = {
  currentLanguage: languagePropType.isRequired,
  validLanguages: PropTypes.arrayOf(languagePropType).isRequired,
  setCurrentLanguage: PropTypes.func.isRequired,
};

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
import { connect } from 'react-redux';

import { setCurrentLanguage } from '../actions';

function mapStateToProps(state) {
  return {
    currentLanguage: state.language.currentLanguage,
    validLanguages: state.language.validLanguages,
  };
}

function mapDispatchToProps(dispatch) {
  return { setCurrentLanguage: (localeCode) =>
    dispatch(setCurrentLanguage(localeCode)) };
}

const LanguageSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelectorView);

export default LanguageSelector;
