/**
 * Renders a modal that displays a login form.
 */
import * as _ from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {Dispatch} from 'redux';

import { validatePassword } from 'common/passwords';
import { validateUsername } from 'common/usernames';
import {hideModal} from 'frontend/actions';
import { logIn } from 'frontend/actions';
import Button from 'frontend/components/Button';
import Modal from 'frontend/components/Modal';
import TextInput from 'frontend/components/TextInput';
import {IState as IApplicationState} from 'frontend/reducers';

import messages from 'frontend/messages';

import 'frontend/components/LogInModal.less';

interface IProps {
  logInError?: string;
  hideModal(): void;
  logIn(username: string, password: string, remember: boolean): void;
}

interface IFormElems extends HTMLCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  remember: HTMLInputElement;
}

export class LogInModalView extends React.Component<IProps> {
  private loginForm: HTMLFormElement;
  private refHandlers = {
    form: (el: HTMLFormElement) => { this.loginForm = el; }
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      formIsValid: false,
      validationError: null
    };
  }

  public componentDidMount() {
    (this.loginForm.elements as IFormElems).username.focus();
  }

  public render() {
    return (
      <Modal
        title='Log in'
        closeModal={this.props.hideModal}
      >
        { this.props.logInError &&
          <p className='LoginModal--errors'>
            <FormattedMessage {..._.get(messages, this.props.logInError)} />
          </p>
        }
        <form
          ref={this.refHandlers.form}
          onSubmit={this.handleLogIn}
          className='LogInModal--form'
        >
          <ul className='LoginModal--form--entries'>
            <li>
              <TextInput
                type='text' name='username' required labelId='sessions.username'
                onChange={this.handleChange} validateFn={validateUsername}
              />
            </li>

            <li>
              <TextInput
                type='password' name='password' required labelId='sessions.password'
                onChange={this.handleChange} validateFn={validatePassword}
              />
            </li>
            <li className='LogInModal--form--rememberItem'>
              <input type='checkbox' name='remember' id='LogInModal--form--remember' />
              <label htmlFor='LogInModal--form--remember'>
                <FormattedMessage {...messages.sessions.rememberMe} />
              </label>
            </li>
            <li className='LogInModal--form--submitItem'>
              <Button type='primary' action='submit' disabled={!this.state.formIsValid}>
                <FormattedMessage {...messages.sessions.logIn} />
              </Button>
            </li>
          </ul>
        </form>
      </Modal>
    );
  }

  private parseLoginEntries = () => {
    const elems = this.loginForm.elements as IFormElems;
    const username = elems.username.value;
    const password = elems.password.value;
    const remember = elems.remember.checked;

    return { username, password, remember };
  }

  private validateForm = () => {
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

  private handleLogIn = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, remember } = this.parseLoginEntries();
    this.props.logIn(username, password, remember);
  }

  private handleChange = () => {
    const formValidation = this.validateForm();
    this.setState({
      formIsValid: !formValidation
    });
  }
}

function mapStateToProps(state: IState) {
  return {
    logInError: state.session.logInError
  };
}

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapDispatchToProps(dispatch: Dispatch<IApplicationState>) {
  return {
    logIn: (
      username: string, password: string, remember: boolean
    ) =>
      dispatch(logIn(username, password, remember)),
    hideModal: () => dispatch(hideModal())
  };
}

const LogInModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInModalView);

export default LogInModal;
