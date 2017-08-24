/**
 * Defines a button
 */
import * as classnames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router';

import 'frontend/components/Button.less';

export enum Size {
  small = 'small',
  medium = 'medium',
  large = 'large',
  xlarge = 'xlarge'
}

export enum Kind {
  secondary = 'secondary',
  primary = 'primary',
  destructive = 'destructive'
}

interface IProps {
  children: React.ReactNode;
  className: string;
  action: Function | {
    href: string,
    target: '_self' | '_blank'
  };
  kind?: Kind;
  size?: Size;
  disabled?: boolean;
  style: React.CSSProperties;
}

const Button: React.StatelessComponent<IProps> = ({
  children,
  className,
  action,
  kind = 'secondary',
  size = 'medium',
  disabled = false,
  style = {}
}) => {
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
      target: action.target || null
    };
  }

  const finalClassName = classnames(
    className,
    'Button',
    `Button--${size}`,
    `Button--${kind}`
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
};

export default Button;
