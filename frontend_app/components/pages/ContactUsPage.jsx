// TODO: convert alerts into internationalized messages in UI
import emailValidator from 'email-validator';
import _ from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import TextInput from '../TextInput';
import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';

require('./ContactUsPage.less');

const contactMessages = messages.ContactUsPage;

const validateEmail = (email) => {
  if (emailValidator.validate(email)) {
    return false;
  }
  return 'errors.invalidEmail';
};

export default class ContactUsPage extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.state = {
      sent: false,
      sendTriggered: false,
    };
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      alert('Contact form invalid, please try again');
    }

    this.setState({
      sendTriggered: true,
    });
    fetch('/api/emails', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, message, reason, sender,
      }),
    }).then(() => {
      this.setState({
        sent: true,
      });
    }).catch(() => {
      this.setState({
        sendTriggered: false,
        sent: false,
      });
      alert('Oh no! Something went wrong. Please email us at the addresses above.');
    });
  }

  validateForm() {
    const { name, sender, reason, message } = _.chain(this.contactForm.elements)
      .pick(['name', 'sender', 'reason', 'message'])
      .mapValues(e => e.value).value();

    if (!(name && sender && reason && message)) {
      this.setState({
        formIsValid: false,
      });
      return true;
    }
    const emailError = validateEmail(sender);
    if (emailError) {
      this.setState({
        formIsValid: false,
      });
      return true;
    }

    this.setState({
      formIsValid: true,
    });
    return false;
  }

  render() {
    return (
      <ChevronPage className="ContactUsPage ChevronPage">
        <PageSection
          className="ContactUsPage--section ContactUsPage--splash"
          background={{
            media: {
              imageUrl: 'media/page_assets/contact/name_lanyards_tinted.jpg',
            },
          }}
          whiteText
        >
          <div className="ContactUsPage--section--content">
            <h1><FormattedMessage {...contactMessages.splash.title} /></h1>
          </div>
        </PageSection>
        <PageSection className="ContactUsPage--details">
          <div className="ContactUsPage--details--content">
            <div className="ContactUsPage--details--map" />
            <div className="ContactUsPage--details--contact">
              <h3><FormattedMessage {...contactMessages.address.title} /></h3>
              <address className="ContactUsPage--details--contact--address">
                <p>
                  <FormattedMessage {...contactMessages.address.firstLine} /><br />
                  <FormattedMessage {...contactMessages.address.secondLine} />
                </p>
              </address>
              <div className="ContactUsPage--details--contact--emails">
                <p>
                  <span className="ContactUsPage--details--contact--emails--prompt">
                    <FormattedMessage {...contactMessages.emails.general} />:
                  </span>
                  <a href="mailto:gymi.volunteer@gmail.com">gymi.volunteer@gmail.com</a>
                </p>
                <p>
                  <span className="ContactUsPage--details--contact--emails--prompt">
                    <FormattedMessage {...contactMessages.emails.press} />:
                  </span>
                  <a href="mailto:gymi.volunteer@gmail.com">gymi.volunteer@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </PageSection>
        <PageSection className="ContactUsPage--section">
          <div className="ContactUsPage--section--content">
            <h2><FormattedMessage {...contactMessages.contactForm.title} /></h2>
            <form
              onSubmit={this.onSubmit}
              className="ContactUsPage--contactForm"
              ref={(f) => { this.contactForm = f; }}
            >
              <div className="ContactUsPage--contactForm--row">
                <TextInput
                  type="text" name="name" maxLength={80} required
                  labelId="ContactUsPage.contactForm.name"
                  onChange={this.validateForm}
                />
              </div>

              <div className="ContactUsPage--contactForm--row">
                <TextInput
                  type="text" name="sender"
                  labelId="ContactUsPage.contactForm.email"
                  maxLength={254}
                  validateFn={validateEmail}
                  onChange={this.validateForm}
                />
              </div>

              <fieldset className="ContactUsPage--contactForm--row">
                <legend>
                  <FormattedMessage {...contactMessages.contactForm.occasion} />
                </legend>

                <input
                  type="radio" name="reason" id="ContactUsPage--contactForm--reason--general"
                  value="general"
                  onChange={this.validateForm}
                />
                <label htmlFor="ContactUsPage--contactForm--reason--general">
                  <FormattedMessage {...contactMessages.contactForm.generalInquiries} />
                </label>

                <input
                  type="radio" name="reason" id="ContactUsPage--contactForm--reason--press"
                  value="press"
                  onChange={this.validateForm}
                />
                <label htmlFor="ContactUsPage--contactForm--reason--press">
                  <FormattedMessage {...contactMessages.contactForm.pressInformation} />
                </label>
              </fieldset>
              <div className="ContactUsPage--contactForm--row">
                <label htmlFor="ContactUsPage--contactForm--message">
                  <FormattedMessage {...contactMessages.contactForm.message} />
                </label>
                <textarea
                  id="ContactUsPage--contactForm--message"
                  name="message"
                  rows="10"
                  maxLength="1000"
                  onChange={this.validateForm}
                />
              </div>
              <Button action="submit" disabled={!this.state.formIsValid || this.state.sendTriggered}>
                <FormattedMessage
                  {...contactMessages.contactForm[this.state.sent ? 'sent' : 'send']}
                />
              </Button>
            </form>
          </div>
        </PageSection>
      </ChevronPage>
    );
  }
}
