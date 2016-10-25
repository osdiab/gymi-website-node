import React, { PropTypes } from 'react';

import SiteNavigation from './SiteNavigation.jsx';

require('./SiteLayout.less');
export default function SiteLayout({ children }) {
  return (
    <div className="SiteLayout">
      <SiteNavigation />
      <div className="SiteLayout--content">
        {children}
      </div>
    </div>
  );
}

SiteLayout.propTypes = {
  children: PropTypes.node,
};
