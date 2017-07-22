import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Helmet from 'react-helmet';

import Button from '../../Button';
import ChevronPage from '../ChevronPage';
import messages from '../../../messages';
import PageSection from '../PageSection';
import QuestionSection from './QuestionSection';

require('./JoinUsPage.less');

const joinMessages = messages.JoinUsPage;
const SECTIONS = [
  {
    id: 'becomeAMentor',
    questions: ['where', 'requirements', 'sessionCoordinators', 'faq'],
    btn: 'https://docs.google.com/forms/d/e/1FAIpQLSeE1W4ZM6T8qCypmxCNI6Bo7lUMJzPHXj_Se0kBIplq3nIXoA/viewform?c=0&w=1',
    color: 'salmon',
  },
  {
    id: 'joinTheGymiTeam',
    questions: ['availablePositions', 'requirements'],
    btn: '/contactUs',
    color: 'purple',
  },
  {
    id: 'makeADonation',
    btn: (
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="ZL6RVZAW2JVU4" />
        <Button
          className="JoinUsPage--QuestionSection--Button-btn"
          action="submit"
        >Donate</Button>
      </form>
    ),
    color: 'green',
  },
  {
    id: 'becomeASponsor',
    btn: '/contactUs',
    color: 'blue',
  },
  {
    id: 'becomeAnAdvisor',
    btn: '/contactUs',
    color: 'yellow',
  },
];

function JoinUsPage({ intl }) {
  return (
    <ChevronPage className="JoinUsPage ChevronPage">
      <Helmet title={intl.formatMessage(messages.SiteNavigation.joinUs)} />
      <PageSection
        className="JoinUsPage--section JoinUsPage--splash"
        background={{
          media: {
            imageUrl: 'media/page_assets/join_us/piano_tinted.png',
          },
        }}
        whiteText
      >
        <div className="JoinUsPage--section--content">
          <h1><FormattedMessage {...joinMessages.splash.title} /></h1>
          <p><FormattedMessage {...joinMessages.splash.body} /></p>
        </div>
      </PageSection>
      <PageSection>
        { SECTIONS.map(section => <QuestionSection key={`${section.id}`} {...section} />)}
      </PageSection>
    </ChevronPage>
  );
}

JoinUsPage.propTypes = {
  intl: intlShape,
};

export default injectIntl(JoinUsPage);
