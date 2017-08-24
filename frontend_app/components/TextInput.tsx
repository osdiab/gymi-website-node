/**
 * Renders a styled single-line text input element, with support for labels
 * and error states
 */
import * as classnames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import {
  FormattedMessage, InjectedIntl, InjectedIntlProps, injectIntl, intlShape
} from 'react-intl';

import messages from 'frontend/messages';

import 'frontend/components/TextInput.less';

const DEFAULT_WIDTH = 400;

interface IProps extends InjectedIntlProps {
  intl: InjectedIntl;
  placeholderId?: string;
  labelId: string;
  required?: boolean;
  kind?: ('text' | 'password');
  name: string;
  maxLength: number;
  onChange(value: string): void;
  validateFn(value: string): (string | null);
}

interface IState {
  value: string;
  focused: boolean;
  hasFocusedBefore: boolean;
}

/**
 * validateFn, if provided, must output a falsey value if the input is valid, or the id of an error
 * message on failure.
 */
class TextInput extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    kind: 'text'
  } as IProps;

  private input: HTMLInputElement;

  constructor(props: IProps & InjectedIntlProps) {
    super(props);
    this.state = {
      value: '',
      focused: false,
      hasFocusedBefore: false
    };
  }

  public render() {
    const {
      kind, validateFn, placeholderId, labelId, required, intl, onChange, name, maxLength
    } = this.props;

    const { focused, hasFocusedBefore } = this.state;

    let errorId;
    if (required && this.state.value === '') {
      errorId = 'errors.required';
    } else if (validateFn) {
      errorId = validateFn(this.state.value);
    }

    const inputProps = {
      ref: (i: HTMLInputElement) => { this.input = i; },
      kind,
      name,
      onChange: () => {
        this.handleChange();
        if (onChange) {
          onChange(this.input.value);
        }
      },
      onFocus: () => this.setState({ focused: true, hasFocusedBefore: true }),
      onBlur: () => this.setState({ focused: false }),
      placeholder: placeholderId === undefined ? undefined : intl.formatMessage({id: placeholderId}),
      maxLength
    };

    const colorBarClassName = classnames(
      'TextInput--colorBar',
      focused && 'TextInput--colorBar--focused',
      !focused && hasFocusedBefore && errorId && 'TextInput--colorBar--error'
    );

    return (
      <div className='TextInput'>
        <div className={colorBarClassName} />
        <div className='TextInput--content'>
          <label>
            <div className='TextInput--info'>
              <span className='TextInput--label'>
                <FormattedMessage {..._.get(messages, labelId)} />
              </span>

              {!focused && hasFocusedBefore && errorId &&
                <span className='TextInput--error'>
                  <FormattedMessage {..._.get(messages, errorId)} />
                </span>
              }
            </div>
            <input {...inputProps} />
          </label>
        </div>
      </div>
    );
  }

  private handleChange = () => {
    this.setState({
      value: this.input.value
    });
  }
}

export default injectIntl(TextInput);
