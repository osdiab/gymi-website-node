/**
 * Encapsulates display logic for the site's navigation pane, as
 * well as retrieving relevant information from the Redux store.
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {Dispatch} from 'redux';

import { hideModal, showModal } from 'frontend/actions';
import Button from 'frontend/components/Button';
import LanguageSelector from 'frontend/components/LanguageSelector';
import messages from 'frontend/messages';
import {IState as IApplicationState} from 'frontend/reducers';

import 'frontend/components/SiteNavigation.less';

const navigationMessages = messages.SiteNavigation;

const NAV_LINKS = [
  {
    id: 'aboutUs',
    url: '/aboutUs',
    imageUrl: '/media/icons/person.svg'
  },
  {
    id: 'timeline',
    url: '/timeline',
    imageUrl: '/media/icons/timeline.svg'
  },
  {
    id: 'joinUs',
    url: '/joinUs',
    imageUrl: '/media/icons/handshake.svg'
  },
  {
    id: 'contactUs',
    url: '/contactUs',
    imageUrl: '/media/icons/phone.svg'
  }
];

export function SiteNavigationView(
  { loggedIn, showLogInModal }
) {
  const finalLinks = loggedIn ? NAV_LINKS.concat({
    id: 'dreamProject',
    url: '/dreamProject',
    imageUrl: '/media/icons/documents.svg'
  }) : NAV_LINKS;

  const links = finalLinks.map(({ id, url, imageUrl }) => (
    <li className='SiteNavigation--items--item' key={url}>
      <Link to={url}>
        <img role='presentation' className='SiteNavigation--items--item--icon' src={imageUrl} />
        <div className='SiteNavigation--items--item--text'>
          <FormattedMessage {...navigationMessages[id]} />
        </div>
      </Link>
    </li>
  ));
  return (
    <nav className='SiteNavigation'>
      <div className='SiteNavigation--wrapper'>
        <div className='SiteNavigation--logo'>
          <Link to='/'>
            <img alt='Home' src='/media/icons/logo.svg' />
          </Link>
        </div>
        <ul className='SiteNavigation--items'>{links}</ul>
        <LanguageSelector />
        { !loggedIn && <Button type='primary' action={showLogInModal}>
          <FormattedMessage {...messages.sessions.logIn} />
        </Button> }
      </div>
    </nav>
  );
}

SiteNavigationView.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  showLogInModal: PropTypes.func.isRequired
};

function mapStateToProps(state: IApplicationState) {
  return {
    loggedIn: !!state.session.token,
    showingLogInModal: state.session.showingLogInModal
  };
}

function mapDispatchToProps(dispatch: Dispatch<IApplicationState>) {
  return {
    showLogInModal: () => dispatch(showModal('login'))
  };
}

const SiteNavigation = connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteNavigationView);

export default SiteNavigation;
