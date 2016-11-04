import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';

require('./HomePage.less');

const homeMessages = messages.HomePage;

export default function HomePage() {
  return (
    <ChevronPage className="HomePage">
      <PageSection
        className="HomePage--section HomePage--splash"
        background={{
          media: {
            videoUrls: ['/media/videos/homeSplash/720.mp4'],
            posterUrl: '/media/videos/homeSplash/poster.jpg',
          },
          tint: 'lightBlue',
        }}
        whiteText
      >
        <div className="HomePage--section--content">
          <h1><FormattedMessage {...homeMessages.splash.title} /></h1>
          <p><FormattedMessage {...homeMessages.splash.body} /></p>
        </div>
      </PageSection>

      <PageSection
        className="HomePage--section HomePage--about"
        background={{
          media: { imageUrl: '/media/page_assets/home/shermin_with_kids.png' }, tint: 'white',
        }}
      >
        <div className="HomePage--section--content">
          <h2><FormattedMessage {...homeMessages.about.title} /></h2>
          <p><FormattedMessage {...homeMessages.about.body} /></p>
          <div>
            <Button action={{ href: '/aboutUs' }}>
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
            <div className="HomePage--details--leftImage" />
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
                <Button action={{ href: '/aboutUs' }}>
                  <FormattedMessage {...homeMessages.latestNews.timelineButton} />
                </Button>
              </div>
            </section>
          </div>
        </div>
      </PageSection>

      <PageSection
        className="HomePage--section HomePage--joinUs"
        background={{
          media: { imageUrl: '/media/textures/blue_horizontal.jpg' },
        }}
        whiteText
      >
        <div className="HomePage--section--content">
          <h2><FormattedMessage {...homeMessages.joinUs.title} /></h2>
          <p><FormattedMessage {...homeMessages.joinUs.body} /></p>
          <div className="HomePage--joinUs--buttons">
            <Button action={{ href: '/aboutUs' }}>
              <FormattedMessage {...homeMessages.joinUs.becomeMentorButton} />
            </Button>
            <Button action={{ href: '/aboutUs' }}>
              <FormattedMessage {...homeMessages.joinUs.followUsButton} />
            </Button>
          </div>
        </div>
      </PageSection>
    </ChevronPage>
  );
}

      // <PageSection
      //   className="HomePage--section HomePage--donate"
      //   whiteText
      //   background={{ media: { imageUrl: '/media/textures/blue_horizontal.jpg' } }}
      // >
      //   <div className="HomePage--section--content">
      //     <h2><FormattedMessage {...homeMessages.donate.title} /></h2>
      //     <p><FormattedMessage {...homeMessages.donate.body} /></p>
      //     <Button action={{ href: '/aboutUs' }}>
      //       <FormattedMessage {...homeMessages.donate.learnMoreButton} />
      //     </Button>
      //   </div>
      // </PageSection>

