import React from 'react';
import { Link } from 'react-router';

import LanguageSelector from '../components/LanguageSelector';

require('./SiteNavigation.less');

const NAV_LINKS = [
  {
    text: 'About Us',
    url: '/aboutUs',
    imageUrl: '/media/icons/person.svg',
  },
];

export default function SiteNavigation() {
  const links = NAV_LINKS.map(({ text, url, imageUrl }) => (
    <li className="SiteNavigation--items--item" key={url}>
      <Link to={url}>
        <img alt={text} className="SiteNavigation--items--item--icon" src={imageUrl} />
        <div className="SiteNavigation--items--item--text">{text}</div>
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
