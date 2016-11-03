import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import messages from '../messages';
import LanguageSelector from '../components/LanguageSelector';

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
    imageUrl: '/media/icons/documents.svg',
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

export default function SiteNavigation() {
  const links = NAV_LINKS.map(({ id, url, imageUrl }) => (
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
    </nav>
  );
}
