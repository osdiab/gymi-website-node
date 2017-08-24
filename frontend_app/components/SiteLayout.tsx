/**
 * Global layout for the GYMI website
 */

import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

import Footer from 'frontend/components/Footer';
import LogInModal from 'frontend/components/LogInModal';
import SignUpModal from 'frontend/components/SignUpModal';
import SiteNavigation from 'frontend/components/SiteNavigation';
import {IState as IApplicationState} from 'frontend/reducers';
import {SupportedLanguage} from 'frontend/reducers/language';
import {ModalData} from 'frontend/reducers/modal';

import 'frontend/components/SiteLayout.less';

export const SiteLayoutView: React.StatelessComponent<IProps> = (props: IProps) => {
  const { children, modalData, currentLanguage } = props;
  let modal;
  if (modalData) {
    switch (modalData.modalId) {
      case 'login':
        modal = <LogInModal {...modalData.props} />;
        break;
      case 'signup':
        modal = <SignUpModal {...modalData.props} />;
        break;
      default:
        console.error('Invalid modal id', modalData);
    }
  }

  return (
    <div className='SiteLayout'>
      <Helmet
        htmlAttributes={{ lang: currentLanguage }}
        defaultTitle='GYMI'
        titleTemplate='%s | GYMI'
      />
      <SiteNavigation />
      <div className='SiteLayout--wrapper'>
        <main className='SiteLayout--content'>
          {children}
        </main>
        <Footer />
      </div>
      {modal}
    </div>
  );
};

interface IProps {
  readonly children?: React.ReactNode;
  readonly modalData?: ModalData;
  readonly currentLanguage: SupportedLanguage;
}

function mapStateToProps(state: IApplicationState) {
  return {
    modalData: state.modal.modalData,
    currentLanguage: state.language.currentLanguage.localeCode
  };
}

const SiteLayout = connect(mapStateToProps)(SiteLayoutView);
export default SiteLayout;
