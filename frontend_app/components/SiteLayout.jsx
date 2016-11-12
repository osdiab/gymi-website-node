import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

import { hideModal as hideModalAction } from '../actions';
import SiteNavigation from './SiteNavigation';
import Footer from './Footer';
import LogInModal from './LogInModal';
import SignUpModal from './SignUpModal';

import './SiteLayout.less';

export function SiteLayoutView({ children, modalId, modalProps, loggedIn, hideModal }) {
  let modal;
  if (modalId) {
    switch (modalId) {
      case 'login':
        modal = <LogInModal {...modalProps} />;
        break;
      case 'signup':
        if (loggedIn) {
          hideModal();
          break;
        }
        modal = <SignUpModal {...modalProps} />;
        break;
      default:
        console.error(`Invalid modal id: ${modalId}`); // eslint-disable-line no-console
    }
  }
  return (
    <div className="SiteLayout">
      <SiteNavigation />
      <div className="SiteLayout--wrapper">
        <main className="SiteLayout--content">
          {children}
        </main>
        <Footer />
      </div>
      {modal}
    </div>
  );
}

SiteLayoutView.propTypes = {
  children: PropTypes.node.isRequired,
  modalId: PropTypes.node,
  modalProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  loggedIn: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    loggedIn: !!state.session.token,
    modalId: state.modal.modalId,
    modalProps: state.modal.props,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => dispatch(hideModalAction()),
  };
}

const SiteLayout = connect(mapStateToProps, mapDispatchToProps)(SiteLayoutView);
export default SiteLayout;
