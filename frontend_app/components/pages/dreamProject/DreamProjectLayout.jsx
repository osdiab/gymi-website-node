import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Button from '../../Button';
import messages from '../../../messages';
import { logOut as logOutAction, toggleLogInModal } from '../../../actions';

import './DreamProjectLayout.less';

const isBrowser = typeof window !== 'undefined' && window.document;

export class DreamProjectLayoutView extends React.Component {
  constructor(props) {
    super(props);
    const { token, user, logOut, showLogInModal } = this.props;

    // TODO: move this check to routes and revert component to pure function
    if (isBrowser && (!token || !user)) {
      browserHistory.push('/');
      logOut();
      showLogInModal();
    }
  }

  render() {
    const { children, location, logOut, token, user } = this.props;

    // TODO: when routes handles this logic, it will prevent the console warning about server side
    // generated code differing from the client.
    if (!token || !user) {
      return <div />;
    }

    const PAGES = [
      {
        id: 'home',
        action: { href: '/dreamProject' },
      },
      // TODO: show again when implemented
      // {
      //   id: 'students',
      //   action: { href: '/dreamProject/students' },
      // },
      {
        id: 'profile',
        action: { href: '/dreamProject/profile' },
      },
      {
        id: 'logOut',
        action: logOut,
      },
    ];

    const strippedUrl = location.pathname.replace(/\/$/, ''); // remove trailing slash if present

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
                  className={action.href && strippedUrl === action.href ?
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
}

DreamProjectLayoutView.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  logOut: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,

  // TODO: remove these 3 when role checking is done in routes
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  token: PropTypes.string,
  showLogInModal: PropTypes.func.isRequired,
};

// TODO: remove this when role logic is moved into routes
function mapStateToProps(state) {
  return {
    token: state.session.token,
    user: state.session.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => dispatch(logOutAction()),
    showLogInModal: () => dispatch(toggleLogInModal(true)),
  };
}


const DreamProjectLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(DreamProjectLayoutView);

export default DreamProjectLayout;
