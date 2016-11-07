import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { toggleLogInModal } from '../actions';
import messages from '../messages';
import LanguageSelector from '../components/LanguageSelector';
import Button from './Button';
import LogInModal from './LogInModal';

require('./SiteNavigation.less');

const navigationMessages = messages.SiteNavigation;

const NAV_LINKS = [
  {
    id: 'aboutUs',
    url: '/aboutUs',
    imageUrl: '/media/icons/person.svg',
  },
  {
    id: 'timeline',
    url: '/timeline',
    imageUrl: '/media/icons/timeline.svg',
  },
  {
    id: 'joinUs',
    url: '/joinUs',
    imageUrl: '/media/icons/handshake.svg',
  },
  {
    id: 'contactUs',
    url: '/contactUs',
    imageUrl: '/media/icons/phone.svg',
  },
];

export function SiteNavigationView(
  { loggedIn, showingLogInModal, showLogInModal, hideLogInModal }
) {
  const finalLinks = loggedIn ? NAV_LINKS.concat({
    id: 'dreamProject',
    url: '/dreamProject',
    imageUrl: '/media/icons/documents.svg',
  }) : NAV_LINKS;

  const links = finalLinks.map(({ id, url, imageUrl }) => (
    <li className="SiteNavigation--items--item" key={url}>
      <Link to={url}>
        <img role="presentation" className="SiteNavigation--items--item--icon" src={imageUrl} />
        <div className="SiteNavigation--items--item--text">
          <FormattedMessage {...navigationMessages[id]} />
        </div>
      </Link>
    </li>
  ));
  return (
    <nav className="SiteNavigation">
      <div className="SiteNavigation--logo">
        <Link to="/">
          <img alt="Home" src="/media/icons/logo.svg" />
        </Link>
      </div>
      <ul className="SiteNavigation--items">{links}</ul>
      <LanguageSelector />
      { !loggedIn && <Button type="primary" action={showLogInModal}>Log In</Button> }
      { showingLogInModal && <LogInModal closeModal={hideLogInModal} /> }
    </nav>
  );
}

SiteNavigationView.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  showingLogInModal: PropTypes.bool.isRequired,
  showLogInModal: PropTypes.func.isRequired,
  hideLogInModal: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    loggedIn: !!state.session.token,
    showingLogInModal: state.session.showingLogInModal,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showLogInModal: () => dispatch(toggleLogInModal(true)),
    hideLogInModal: () => dispatch(toggleLogInModal(false)),
  };
}

const SiteNavigation = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SiteNavigationView);

export default SiteNavigation;
