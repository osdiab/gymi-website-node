import React from 'react';
import { FormattedMessage } from 'react-intl';

import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';

require('./TimelinePage.less');

const timelineMessages = messages.TimelinePage;

export default function TimelinePage() {
  return (
    <ChevronPage className="TimelinePage ChevronPage">
      <PageSection
        className="TimelinePage--section TimelinePage--splash"
        background={{
          media: {
            imageUrl: 'media/textures/grey_horizontal.png',
          },
        }}
        whiteText
      >
        <div className="TimelinePage--section--content">
          <h1><FormattedMessage {...timelineMessages.title} /></h1>
        </div>
      </PageSection>

      <PageSection className="TimelinePage--section TimelinePage--about">
        <div className="TimelinePage--section--content">
        </div>
      </PageSection>
    </ChevronPage>
  );
}
