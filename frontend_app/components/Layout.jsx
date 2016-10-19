import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import LanguageSelector from '../components/LanguageSelector';

export default function Layout({ children }) {
  return (
    <div className="overview">
      <div className="navbar">
        <h2>Navigation</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/counter">Counter</Link></li>
          <li><Link to="/quote">Quote</Link></li>
        </ul>
        <LanguageSelector />
      </div>
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
