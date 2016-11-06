import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../../Button';
import messages from '../../../messages';
import { logOut as logOutAction } from '../../../actions';

import './DreamProjectLayout.less';

export function DreamProjectLayoutView({ children, location, logOut }) {
  const PAGES = [
    {
      id: 'home',
      action: { href: '/dreamProject' },
    },
    {
      id: 'students',
      action: { href: '/dreamProject/students' },
    },
    {
      id: 'profile',
      action: { href: '/dreamProject/profile' },
    },
    {
      id: 'logOut',
      action: logOut,
    },
  ];

  return (
    <div className="DreamProjectLayout">
      <header>
        <h1>
          <FormattedMessage {...messages.dreamProject.layout.title} />
        </h1>
        <nav>
          <ul>
            { PAGES.map(({ id, action }) => (
              <Button
                key={id}
                className={action.href && location.pathname.startsWith(action.href) ?
                    'DreamProjectLayout--nav--active' : ''}
                action={action}
              >
                <FormattedMessage {...messages.dreamProject.navigation[id]} />
              </Button>
            ))}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

DreamProjectLayoutView.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  logOut: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOutAction),
  };
}


const DreamProjectLayout = connect(
  null,
  mapDispatchToProps
)(DreamProjectLayoutView);

export default DreamProjectLayout;
