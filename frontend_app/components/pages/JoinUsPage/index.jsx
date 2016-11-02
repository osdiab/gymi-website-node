import React from 'react';
import { FormattedMessage } from 'react-intl';

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
    buttonUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeE1W4ZM6T8qCypmxCNI6Bo7lUMJzPHXj_Se0kBIplq3nIXoA/viewform?c=0&w=1',
    color: 'salmon',
  },
  {
    id: 'joinTheGymiTeam',
    questions: ['availablePositions', 'requirements'],
    buttonUrl: '/contactUs',
    color: 'purple',
  },
  {
    id: 'makeADonation',
    buttonUrl: 'https://www.paypal.com/donate/?token=utLA_vrF2l3R74XC7tkgAW1czfs8JN2LYgldjA0FayZMcKqT7FXAAvvjyBOClYSPymEdZ0',
    color: 'green',
  },
  {
    id: 'becomeASponsor',
    buttonUrl: '/contactUs',
    color: 'blue',
  },
  {
    id: 'becomeAnAdvisor',
    buttonUrl: '/contactUs',
    color: 'yellow',
  },
];

export default function JoinUsPage() {
  return (
    <ChevronPage className="JoinUsPage ChevronPage">
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

