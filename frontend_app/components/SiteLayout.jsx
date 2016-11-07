import React, { PropTypes } from 'react';
import 'react-select/dist/react-select.css';

import SiteNavigation from './SiteNavigation';
import Footer from './Footer';

import './SiteLayout.less';

export default function SiteLayout({ children }) {
  return (
    <div className="SiteLayout">
      <SiteNavigation />
      <div className="SiteLayout--wrapper">
        <main className="SiteLayout--content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

SiteLayout.propTypes = {
  children: PropTypes.node,
};
