import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import _ from 'lodash';

require('./Button.less');

export default function Button({
  children,
  className,
  action,
  type = 'secondary',
  size = 'medium',
  disabled = false,
}) {
  const actionIsFunc = _.isFunction(action);
  const linkIsInternal = action.href && !(/^(?:[a-z]+:)?\/\//.test(action.href));
  const linkType = linkIsInternal ? Link : 'a';
  const ElemType = actionIsFunc ? 'button' : linkType;

  const finalClassName = classnames(
    className,
    'Button',
    `Button--${size}`,
    `Button--${type}`,
  );
  const actionAttributes = actionIsFunc ? {
    onClick: action,
  } : {
    to: (linkIsInternal ? action.href : null),
    href: (linkIsInternal ? null : action.href),
    target: action.target || null,
  };

  return (
    <ElemType
      className={finalClassName}
      disabled={disabled}
      {...actionAttributes}
    >
      {children}
    </ElemType>
  );
}

Button.SIZES = ['small', 'medium', 'large', 'xlarge'];

Button.TYPES = ['secondary', 'primary', 'destructive'];

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  action: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      target: PropTypes.oneOf(['_self', '_blank']),
    }),
  ]),
  type: PropTypes.oneOf(Button.TYPES),
  size: PropTypes.oneOf(Button.SIZES),
  disabled: PropTypes.bool,
};
