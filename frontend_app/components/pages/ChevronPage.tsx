import browser from 'detect-browser';
import classnames from 'classnames';
import React, { PropTypes } from 'react';

require('./ChevronPage.less');

/**
 * Causes PageSections on this page to appear as stylized chevrons.
 */
export default function ChevronPage({ children, className }) {
  // clip-path doesn't work correctly in firefox, edge, and msie, so disable overlap
  const isUnsupportedBrowser = ['firefox', 'ie', 'edge'].includes(browser.name);
  const finalClassName = classnames(
    'ChevronPage',
    className,
    isUnsupportedBrowser && 'ChevronPage--unsupported',
  );

  return <div className={finalClassName}>{children}</div>;
}

ChevronPage.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
