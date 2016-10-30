import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';

require('./AboutUsPage.less');

const aboutMessages = messages.AboutUsPage;

export default function AboutUsPage() {
  return (
    <ChevronPage className="AboutUsPage ChevronPage">
      <PageSection
        className="AboutUsPage--section AboutUsPage--splash"
      >
        <div className="AboutUsPage--section--content">
          <h1><FormattedMessage {...aboutMessages.splash.title} /></h1>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--about">
        <div className="AboutUsPage--section--content">
          <h2><FormattedMessage {...aboutMessages.background.title} /></h2>
          <FormattedHTMLMessage {...aboutMessages.background.body} />
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--details" style={{ padding: 0 }}>
        <div className="AboutUsPage--details--content">
          <div className="AboutUsPage--details--column">
            <section>
              <h2><FormattedMessage {...aboutMessages.goals.title} /></h2>
              <FormattedHTMLMessage {...aboutMessages.goals.body} />
            </section>
          </div>

          <div className="AboutUsPage--details--column">
            <section>
              <h2><FormattedMessage {...aboutMessages.progress.title} /></h2>
              <FormattedHTMLMessage {...aboutMessages.progress.body} />
            </section>
          </div>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--team">
        <div className="AboutUsPage--section--content">
          <h2><FormattedMessage {...aboutMessages.team.title} /></h2>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--partners">
        <div className="AboutUsPage--section--content">
          <h2><FormattedMessage {...aboutMessages.partners.title} /></h2>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--partners">
        <div className="AboutUsPage--section--content">
          <h2><FormattedMessage {...aboutMessages.partners.title} /></h2>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--collaborators">
        <div className="AboutUsPage--section--content">
          <h2><FormattedMessage {...aboutMessages.collaborators.title} /></h2>
        </div>
      </PageSection>
    </ChevronPage>
  );
}

