// TODO: convert alerts into internationalized messages in UI
import emailValidator from 'email-validator';
import _ from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';

require('./ContactUsPage.less');

const contactMessages = messages.ContactUsPage;

export default class ContactUsPage extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      sent: false,
      sendTriggered: false,
    };
  }
  onSubmit(e) {
    e.preventDefault();
    const requiredFields = ['name', 'message', 'reason', 'sender'];
    const formValues = _.chain(this.contactForm.elements)
      .pick(requiredFields)
      .mapValues(v => v.value).value();

    if (_.compact(_.values(formValues)).length !== requiredFields.length) {
      alert('Please fill in all the fields!');
      return;
    }

    const { name, message, reason, sender } = formValues;

    if (!emailValidator.validate(sender)) {
      alert('Please enter a valid email address.');
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
                <label htmlFor="ContactUsPage--contactForm--name">
                  <FormattedMessage {...contactMessages.contactForm.name} />
                </label>
                <input
                  type="text" name="name" id="ContactUsPage--contactForm--name"
                  maxLength="80"
                />
              </div>

              <div className="ContactUsPage--contactForm--row">
                <label htmlFor="ContactUsPage--contactForm--email">
                  <FormattedMessage {...contactMessages.contactForm.email} />
                </label>
                <input
                  type="text" name="sender" id="ContactUsPage--contactForm--email"
                  maxLength="254"
                />
              </div>

              <fieldset className="ContactUsPage--contactForm--row">
                <legend>
                  <FormattedMessage {...contactMessages.contactForm.occasion} />
                </legend>

                <input type="radio" name="reason" id="ContactUsPage--contactForm--reason--general" value="general" />
                <label htmlFor="ContactUsPage--contactForm--reason--general">
                  <FormattedMessage {...contactMessages.contactForm.generalInquiries} />
                </label>

                <input type="radio" name="reason" id="ContactUsPage--contactForm--reason--press" value="press" />
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
                  cols="80"
                  rows="10"
                  maxLength="1000"
                />
              </div>
              <Button action="submit" disabled={this.state.sendTriggered}>
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
