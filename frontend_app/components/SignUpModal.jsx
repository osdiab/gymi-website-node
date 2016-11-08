import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import { validatePassword } from '../../common/passwords';
import { validateUsername } from '../../common/usernames';
// import { validateRole } from '../../common/roles';
import Modal from './Modal';
import Button from './Button';
import TextInput from './TextInput';
import { signUpUser } from '../actions';

import './SignUpModal.less';
import messages from '../messages';

export class SignUpModalView extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.parseLoginEntries = this.parseLoginEntries.bind(this);
    this.state = {
      usernameError: validateUsername(''),
      passwordError: validatePassword(''),
      nameError: true,
    };
  }

  parseLoginEntries() {
    const username = this.loginForm.elements.username.value;
    const name = this.loginForm.elements.name.value;
    const password = this.loginForm.elements.password.value;
    const role = this.loginForm.elements.role.value;
    return { username, password, name, role };
  }

  handleSignUp(e) {
    e.preventDefault();
    const { username, password, name, role } = this.parseLoginEntries();
    this.props.signUp(username, password, name, role);
  }

  formIsValid() {
    return !(this.state.usernameError || this.state.passwordError || this.state.nameError);
  }

  render() {
    return (
      <Modal
        title="Sign up"
        closeModal={this.props.closeModal}
      >
        { this.props.signUpError &&
          <p className="LoginModal--errors">
            <FormattedMessage {..._.get(messages, this.props.signUpError)} />
          </p>
        }
        <form
          ref={(el) => { this.loginForm = el; }}
          onSubmit={this.handleSignUp}
          className="SignUpModal--form"
        >
          <input type="hidden" name="role" value={this.props.role} />
          { this.props.role !== 'student' &&
            <h2>
              {_.capitalize(this.props.role)} sign up
            </h2>
          }
          <ul className="LoginModal--form--entries">
            <li>
              <TextInput
                name="username"
                labelId="sessions.username"
                onChange={value => this.setState({
                  usernameError: validateUsername(value),
                })}
                validateFn={validateUsername}
                required
              />
            </li>

            <li>
              <TextInput
                type="password" name="password"
                labelId="sessions.password"
                onChange={value => this.setState({
                  passwordError: validatePassword(value),
                })}
                validateFn={validatePassword}
                required
              />
            </li>

            <li>
              <TextInput
                name="name" id="SignUpModal--form--name"
                labelId="sessions.name"
                onChange={value => this.setState({
                  nameError: value.length === 0,
                })}
                required
              />
            </li>

            <li className="SignUpModal--form--submitItem">
              <Button type="primary" action="submit" disabled={!this.formIsValid()}>
                <FormattedMessage {...messages.sessions.signUp} />
              </Button>
            </li>
          </ul>
        </form>
      </Modal>
    );
  }
}

SignUpModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  signUpError: PropTypes.string,
  role: PropTypes.oneOf([
    'student', 'teacher', 'admin',
  ]),
};

function mapStateToProps(state) {
  return {
    signUpError: state.session.signUpError,
  };
}

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapDispatchToProps(dispatch) {
  return {
    signUp: (username, name, password, role) =>
      dispatch(signUpUser(username, name, password, role)),
  };
}

const SignUpModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpModalView);

export default SignUpModal;
