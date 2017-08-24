/**
 * Renders a modal with a form that allows users to sign up.
 */
import * as _ from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { validatePassword } from 'common/passwords';
import {Role, VALID_ROLES} from 'common/roles';
import { validateUsername } from 'common/usernames';
import { signUpUser } from 'frontend/actions';
import Button from 'frontend/components/Button';
import Modal from 'frontend/components/Modal';
import TextInput from 'frontend/components/TextInput';

import messages from 'frontend/messages';

import 'frontend/components/SignUpModal.less';

export interface IProps {
  signUpError: string;
  role: Role;
  closeModal(): void;
  signUp(username: string, name: string, password: string, role: Role): void;
}

interface IFormElems extends HTMLCollection {
  username: HTMLInputElement;
  name: HTMLInputElement;
  password: HTMLInputElement;
  role: HTMLInputElement;
}

export class SignUpModalView extends React.Component<IProps> {
  private signUpForm: HTMLFormElement;
  private refsHandlers = {
    signUpForm: (el: HTMLFormElement) => { this.signUpForm = el; }
  };

  constructor(props: IProps) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.parseFormEntries = this.parseFormEntries.bind(this);
    this.state = {
      usernameError: validateUsername(''),
      passwordError: validatePassword(''),
      nameError: true
    };
  }

  public componentDidMount() {
    (this.signUpForm.elements as IFormElems).username.focus();
  }

  public render() {
    return (
      <Modal
        title='Sign up'
        closeModal={this.props.closeModal}
      >
        { this.props.signUpError &&
          <p className='SignUpModal--errors'>
            <FormattedMessage {..._.get(messages, this.props.signUpError)} />
          </p>
        }
        <form
          ref={this.refsHandlers.signUpForm}
          onSubmit={this.handleSignUp}
          className='SignUpModal--form'
        >
          <input type='hidden' name='role' value={this.props.role} />
          { this.props.role !== 'student' &&
            <h2>
              {_.capitalize(this.props.role)} sign up
            </h2>
          }
          <ul className='SignUpModal--form--entries'>
            <li>
              <TextInput
                name='username'
                labelId='sessions.username'
                onChange={value => this.setState({
                  usernameError: validateUsername(value)
                })}
                validateFn={validateUsername}
                required
              />
            </li>

            <li>
              <TextInput
                type='password' name='password'
                labelId='sessions.password'
                onChange={value => this.setState({
                  passwordError: validatePassword(value)
                })}
                validateFn={validatePassword}
                required
              />
            </li>

            <li>
              <TextInput
                name='name' id='SignUpModal--form--name'
                labelId='sessions.name'
                onChange={value => this.setState({
                  nameError: value.length === 0
                })}
                required
              />
            </li>

            <li className='SignUpModal--form--submitItem'>
              <Button type='primary' action='submit' disabled={!this.formIsValid()}>
                <FormattedMessage {...messages.sessions.signUp} />
              </Button>
            </li>
          </ul>
        </form>
      </Modal>
    );
  }

  private parseFormEntries() {
    const elems = this.signUpForm.elements as IFormElems;
    const username = elems.username.value;
    const name = elems.name.value;
    const password = elems.password.value;
    const role = elems.role.value;

    return { username, password, name, role };
  }

  private handleSignUp(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    const { username, password, name, role } = this.parseFormEntries();
    if (!(role in Role)) {
      throw new Error(`Role '${role} is not one of ${VALID_ROLES}`);
    }
    this.props.signUp(username, name, password, Role[role]);
  }

  private formIsValid() {
    return !(this.state.usernameError || this.state.passwordError || this.state.nameError);
  }
}

function mapStateToProps(state) {
  return {
    signUpError: state.session.signUpError
  };
}

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
function mapDispatchToProps(dispatch) {
  return {
    signUp: (username, name, password, role) =>
      dispatch(signUpUser(username, name, password, role))
  };
}

const SignUpModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpModalView);

export default SignUpModal;
