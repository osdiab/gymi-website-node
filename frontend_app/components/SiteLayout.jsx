import React, { PropTypes } from 'react';

import SiteNavigation from './SiteNavigation';

require('./SiteLayout.less');

export default function SiteLayout({ children }) {
  return (
    <div className="SiteLayout">
      <SiteNavigation />
      <div className="SiteLayout--wrapper">
        <div className="SiteLayout--content">
          {children}
        </div>
      </div>
    </div>
  );
}

SiteLayout.propTypes = {
  children: PropTypes.node,
};
