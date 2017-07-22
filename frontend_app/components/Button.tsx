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
  style = {},
}) {
  let ElemType = null;
  let actionAttributes = null;
  if (_.isFunction(action)) {
    ElemType = 'button';
    actionAttributes = { onClick: action, type: 'button' };
  } else if (_.isString(action)) {
    ElemType = 'button';
    actionAttributes = { type: action };
  } else {
    const linkIsInternal = action.href && !(/^(?:[a-z]+:)?\/\//.test(action.href));
    ElemType = linkIsInternal ? Link : 'a';
    actionAttributes = {
      to: (linkIsInternal ? action.href : null),
      href: (linkIsInternal ? null : action.href),
      target: action.target || null,
    };
  }

  const finalClassName = classnames(
    className,
    'Button',
    `Button--${size}`,
    `Button--${type}`,
  );

  return (
    <ElemType
      className={finalClassName}
      disabled={disabled}
      {...actionAttributes}
      style={style}
    >
      {children}
    </ElemType>
  );
}

export const SIZES = ['small', 'medium', 'large', 'xlarge'];
export const TYPES = ['secondary', 'primary', 'destructive'];
Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  action: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      target: PropTypes.oneOf(['_self', '_blank']),
    }),
    PropTypes.oneOf(['submit', 'reset', 'button', 'menu']),
  ]),
  type: PropTypes.oneOf(TYPES),
  size: PropTypes.oneOf(SIZES),
  disabled: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.string),
};
