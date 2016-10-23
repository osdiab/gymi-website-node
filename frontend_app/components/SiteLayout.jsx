import React, { PropTypes } from 'react';

import SiteNavigation from './SiteNavigation.jsx';

require('./WebsiteLayout.less');
export default function WebsiteLayout({ children }) {
  return (
    <div className="WebsiteLayout">
      <SiteNavigation />
      <div className="WebsiteLayout--content">
        {children}
      </div>
    </div>
  );
}

WebsiteLayout.propTypes = {
  children: PropTypes.node,
};
