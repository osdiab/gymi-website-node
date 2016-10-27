import React, { PropTypes } from 'react';
import classnames from 'classnames';

require('./PageSection.less');

export default function PageSection({ centered, children, className }) {
  return (
    <section
      className={classnames(
        'PageSection',
        centered && 'PageSection--centered',
        className,
      )}
    >
      {children}
    </section>
  );
}

PageSection.propTypes = {
  centered: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
