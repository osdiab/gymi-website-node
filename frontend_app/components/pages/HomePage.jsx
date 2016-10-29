import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Button from '../Button';
import messages from '../../messages';
import PageSection from './PageSection';

require('./HomePage.less');

const homeMessages = messages.HomePage;

export default function HomePage() {
  return (
    <div className="HomePage">
      <PageSection
        className="HomePage--section HomePage--splash"
        videoBackground={{
          videoUrls: ['/images/media/main_page/home_video_720.mp4'],
          posterUrl: '/images/media/main_page/home_video_poster.jpg',
        }}
        colorBackground="lightBlue"
        whiteText
      >
        <div className="HomePage--section--content">
          <h1><FormattedMessage {...homeMessages.splash.title} /></h1>
          <p><FormattedMessage {...homeMessages.splash.body} /></p>
        </div>
      </PageSection>

      <PageSection className="HomePage--section HomePage--about">
        <div className="HomePage--section--content">
          <h2><FormattedMessage {...homeMessages.about.title} /></h2>
          <p><FormattedMessage {...homeMessages.about.body} /></p>
          <div>
            <Button action={{ href: '/counter', internal: true }}>
              <FormattedMessage {...homeMessages.about.aboutButton} />
            </Button>
          </div>
        </div>
      </PageSection>

      <PageSection className="HomePage--section HomePage--details" style={{ padding: 0 }}>
        <div className="HomePage--details--content">
          <div className="HomePage--details--column">
            <section>
              <h2><FormattedMessage {...homeMessages.whatWeDo.title} /></h2>
              <p><FormattedMessage {...homeMessages.whatWeDo.body} /></p>
            </section>
            <img
              src="/images/backgrounds/blueAbstract.jpg"
              role="presentation"
              className="HomePage--details--leftImage"
            />
            <section>
              <h2><FormattedMessage {...homeMessages.whyWeDoThis.title} /></h2>
              <p><FormattedMessage {...homeMessages.whyWeDoThis.body} /></p>
            </section>
          </div>

          <div className="HomePage--details--column">
            <section className="HomePage--details--latestNews">
              <h2><FormattedMessage {...homeMessages.latestNews.title} /></h2>
              <FormattedHTMLMessage {...homeMessages.latestNews.body} />
              <div className="HomePage--details--button">
                <Button action={{ href: '/quote', internal: true }}>
                  <FormattedMessage {...homeMessages.latestNews.timelineButton} />
                </Button>
              </div>
            </section>
          </div>
        </div>
      </PageSection>

      <PageSection className="HomePage--section HomePage--joinUs" whiteText>
        <div className="HomePage--section--content">
          <h2><FormattedMessage {...homeMessages.joinUs.title} /></h2>
          <p><FormattedMessage {...homeMessages.joinUs.body} /></p>
          <div className="HomePage--joinUs--buttons">
            <Button action={{ href: '/counter', internal: true }}>
              <FormattedMessage {...homeMessages.joinUs.becomeMentorButton} />
            </Button>
            <Button action={{ href: '/counter', internal: true }}>
              <FormattedMessage {...homeMessages.joinUs.followUsButton} />
            </Button>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
