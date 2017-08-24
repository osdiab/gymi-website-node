/**
 * Element that lets you select from a list of langauges.
 */
import * as React from 'react';
import { connect } from 'react-redux';

import {Language} from 'common/languages';
import { setCurrentLanguage as setLanguageAction } from 'frontend/actions';

import 'frontend/components/LanguageSelector.less';

interface ILangOptionProps {
  language: Language;
  disabled: boolean;
  setLanguage(lang: Language): void;
}

interface IProps {
  currentLanguage: Language;
  validLanguages: Language[];
  setCurrentLanguage(newLanguage: Language): void;
}

class LanguageOption extends React.Component<ILangOptionProps> {
  public render() {
    const {
      disabled, language
    } = this.props;

    return (
      <button
        disabled={disabled}
        onClick={this.setLanguage}
      >
        {language.shortDisplayName}
      </button>
    );
  }

  private setLanguage = () => {
    this.props.setLanguage(this.props.language);
  }
}

export const LanguageSelectorView: React.StatelessComponent<IProps> = ({
  currentLanguage, validLanguages, setCurrentLanguage
}) => {
  const languageButtons = validLanguages.map(lang => (
    <li className='LanguageSelector--languages--entry' key={lang.localeCode}>
      <LanguageOption
        disabled={currentLanguage.localeCode === lang.localeCode}
        language={lang}
        setLanguage={setCurrentLanguage}
      />
    </li>
  ));

  return (<div className='LanguageSelector'>
    <ul className='LanguageSelector--languages'>
      {languageButtons}
    </ul>
  </div>);
};

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapStateToProps(state) {
  return {
    currentLanguage: state.language.currentLanguage,
    validLanguages: state.language.validLanguages
  };
}

function mapDispatchToProps(dispatch) {
  return { setCurrentLanguage: (language: Language) =>
    dispatch(setLanguageAction(language.localeCode)) };
}

const LanguageSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelectorView);

export default LanguageSelector;
