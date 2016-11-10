import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import { validatePassword } from '../../common/passwords';
import { validateUsername } from '../../common/usernames';
import Modal from './Modal';
import Button from './Button';
import TextInput from './TextInput';
import { logIn } from '../actions';

import './LogInModal.less';
import messages from '../messages';

export class LogInModalView extends React.Component {
  constructor(props) {
    super(props);
    this.parseLoginEntries = this.parseLoginEntries.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      formIsValid: false,
      validationError: null,
    };
  }

  parseLoginEntries() {
    const username = this.loginForm.elements.username.value;
    const password = this.loginForm.elements.password.value;
    const remember = this.loginForm.elements.remember.checked;
    return { username, password, remember };
  }

  validateForm() {
    const { username, password } = this.parseLoginEntries();

    if (username.length === 0) {
      return 'errors.username.missing';
    }

    if (password.length === 0) {
      return 'errors.password.missing';
    }

    const usernameValidationError = validateUsername(username);
    if (usernameValidationError) {
      return usernameValidationError;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      return passwordValidationError;
    }

    return null;
  }

  handleLogIn(e) {
    e.preventDefault();
    const { username, password, remember } = this.parseLoginEntries();
    this.props.logIn(username, password, remember);
  }

  handleChange() {
    const formValidation = this.validateForm();
    this.setState({
      formIsValid: !formValidation,
    });
  }

  render() {
    return (
      <Modal
        title="Log in"
        closeModal={this.props.closeModal}
      >
        { this.props.logInError &&
          <p className="LoginModal--errors">
            <FormattedMessage {..._.get(messages, this.props.logInError)} />
          </p>
        }
        <form
          ref={(el) => { this.loginForm = el; }}
          onSubmit={this.handleLogIn}
          className="LogInModal--form"
        >
          <ul className="LoginModal--form--entries">
            <li>
              <TextInput
                type="text" name="username" required labelId="sessions.username"
                onChange={this.handleChange} validateFn={validateUsername}
              />
            </li>

            <li>
              <TextInput
                type="password" name="password" required labelId="sessions.password"
                onChange={this.handleChange} validateFn={validatePassword}
              />
            </li>
            <li className="LogInModal--form--rememberItem">
              <input type="checkbox" name="remember" id="LogInModal--form--remember" />
              <label htmlFor="LogInModal--form--remember">
                <FormattedMessage {...messages.sessions.rememberMe} />
              </label>
            </li>
            <li className="LogInModal--form--submitItem">
              <Button type="primary" action="submit" disabled={!this.state.formIsValid}>
                <FormattedMessage {...messages.sessions.logIn} />
              </Button>
            </li>
          </ul>
        </form>
      </Modal>
    );
  }
}

LogInModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  logInError: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    logInError: state.session.logInError,
  };
}

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapDispatchToProps(dispatch) {
  return {
    logIn: (username, password, remember) => dispatch(logIn(username, password, remember)),
  };
}

const LogInModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogInModalView);

export default LogInModal;
