import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { validatePassword } from '../../common/passwords';
import { validateUsername } from '../../common/usernames';
import Modal from './Modal';
import Button from './Button';
import { logIn } from '../actions';

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
    const remember = this.loginForm.elements.remember.value;
    return { username, password, remember };
  }

  validateForm() {
    const { username, password } = this.parseLoginEntries();
    if (username.length === 0) {
      return 'errors.sessions.usernameMissing';
    }

    if (password.length === 0) {
      return 'errors.sessions.passwordMissing';
    }

    const usernameValid = validateUsername(username);
    if (!usernameValid.valid) {
      return usernameValid.message;
    }

    const passwordValid = validatePassword(password);
    if (!passwordValid.valid) {
      return passwordValid.message;
    }

    return null;
  }

  handleLogIn(e) {
    e.preventDefault();
    const { username, password, remember } = this.parseLoginEntries();
    this.props.logIn(username, password, remember);
  }

  handleChange(e) {
    e.preventDefault();
    const formValidation = this.validateForm();
    this.setState({
      validationError: formValidation,
      formIsValid: !formValidation,
    });
  }

  render() {
    return (
      <Modal
        title="Log in"
        closeModal={this.props.closeModal}
      >
        <form ref={(el) => { this.loginForm = el; }} className="LogInModal--form">
          <div className="LogInModal--form--inputContainer">
            <div>
              <label htmlFor="LogInModal--form--username">
                <FormattedMessage {...messages.sessions.username} />
              </label>
              <label htmlFor="LogInModal--form--password">
                <FormattedMessage {...messages.sessions.password} />
              </label>
            </div>
            <div>
              <input
                type="text" name="username" id="LogInModal--form--username"
                onChange={this.handleChange}
              />
              <input
                type="text" name="password" id="LogInModal--form--password"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="LogInModal--form--submitContainer">
            <input type="checkbox" name="remember" id="LogInModal--form--remember" />
            <label htmlFor="LogInModal--form--remember">
              <FormattedMessage {...messages.sessions.rememberMe} />
            </label>
            <Button action={this.handleLogIn} disabled={!this.formIsValid}>
              <FormattedMessage {...messages.sessions.logIn} />
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
}

LogInModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
};

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapDispatchToProps(dispatch) {
  return { logIn: (username, password, remember) =>
    dispatch(logIn(username, password, remember)) };
}

const LogInModal = connect(
  null,
  mapDispatchToProps
)(LogInModalView);

export default LogInModal;
