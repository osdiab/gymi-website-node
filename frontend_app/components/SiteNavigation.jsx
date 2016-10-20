import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import LanguageSelector from '../components/LanguageSelector';
require('./SiteNavigation.less');

const NAV_LINKS = [
  {
    text: 'Home',
    url: '/',
    imageUrl: '/images/menu/person.png',
  },
  {
    text: 'Counter',
    url: '/counter',
    imageUrl: '/images/menu/person.png',
  },
  {
    text: 'Quote',
    url: '/quote',
    imageUrl: '/images/menu/person.png',
  },
];

export default function SiteNavigation() {
  const links = NAV_LINKS.map(({ text, url, imageUrl }) => (
    <li className="SiteNavigation--items--item" key={url}>
      <Link to={url}>
        <img className="SiteNavigation--items--item--icon" src={imageUrl} />
        <div className="SiteNavigation--items--item--text">{text}</div>
      </Link>
    </li>
  ));
  return (
    <div className="SiteNavigation">
      <div className="SiteNavigation--logo">
        <Link to="/">
          <img src="/images/menu/logo.png" />
        </Link>
      </div>
      <ul className="SiteNavigation--items">{links}</ul>
      <LanguageSelector />
    </div>
  );
}

SiteNavigation.propTypes = {
  children: PropTypes.node,
};

