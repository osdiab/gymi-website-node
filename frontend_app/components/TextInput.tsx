/* eslint-disable */
import React, { PropTypes } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';
import classnames from 'classnames';

import messages from '../messages';

import './TextInput.less';

const DEFAULT_WIDTH = 400;

/**
 * validateFn, if provided, must output a falsey value if the input is valid, or the id of an error
 * message on failure.
 */
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: this.input.value,
    });
  }

  render() {
    const {
      type, validateFn, placeholderId, labelId, required, intl, onChange, name, maxLength
    } = this.props;

    const { focused, hasFocusedBefore } = this.state;

    let errorId;
    if (required && this.state.value === '') {
      errorId = 'errors.required';
    } else if (validateFn) {
      errorId = validateFn(this.state.value);
    }

    const inputProps = {
      ref: (i) => { this.input = i; },
      type,
      name,
      onChange: (e) => {
        this.handleChange(e);
        if (onChange) {
          onChange(this.input.value);
        }
      },
      onFocus: () => this.setState({ focused: true, hasFocusedBefore: true }),
      onBlur: () => this.setState({ focused: false }),
    }
    if (placeholderId) {
      inputProps.placeholder = intl.formatMessage(placeholderId);
    }

    if (maxLength) {
      inputProps.maxLength = maxLength;
    }

    const colorBarClassName = classnames(
      'TextInput--colorBar',
      focused && 'TextInput--colorBar--focused',
      !focused && hasFocusedBefore && errorId && 'TextInput--colorBar--error',
    )
    return (
      <div className="TextInput">
        <div className={colorBarClassName} />
        <div className="TextInput--content">
          <label>
            <div className="TextInput--info">
              <span className="TextInput--label">
                <FormattedMessage {..._.get(messages, labelId)} />
              </span>

              {!focused && hasFocusedBefore && errorId &&
                <span className="TextInput--error">
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
}

TextInput.propTypes = {
  validateFn: PropTypes.func,
  placeholderId: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password']),
  onChange: PropTypes.func,
  intl: intlShape,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

TextInput.defaultProps = {
  type: 'text',
};

export default injectIntl(TextInput);
