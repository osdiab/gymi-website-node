import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Carousel from 'nuka-carousel';

import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';

require('./TimelinePage.less');

const timelineMessages = messages.TimelinePage;
const seasonsMessages = messages.seasons;

const TIMELINE_SLIDES = [
  { period: 'February', year: 2013 },
  { period: 'March', year: 2013 },
  { period: 'April', year: 2013 },
  { period: 'Summer', year: 2013 },
  { period: 'Winter', year: 2013 },
  { period: 'Spring', year: 2014 },
  { period: 'Summer', year: 2014 },
  { period: 'Spring', year: 2015 },
  { period: 'Summer', year: 2015 },
  { period: 'Fall', year: 2015 },
];
const SEASONS = [
  'summer', 'winter', 'fall', 'spring',
];

const SESSIONS = [
  { period: 'summer', year: 2013 },
  { period: 'summer', year: 2014 },
  { period: 'summer', year: 2015 },
];

const CAROUSEL_SETTINGS = {
  autoplay: true,
  autoplayInterval: 5000,
  wrapAround: true,
};

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

          <Carousel {...CAROUSEL_SETTINGS}>
            { TIMELINE_SLIDES.map(({ period, year }) => {
              const lowerPeriod = period.toLowerCase();
              const imageSrc =
                `/media/page_assets/timeline/carousel/${year}_${lowerPeriod}.jpg`;
              return (
                <div
                  className="TimelinePage--carousel--slide"
                  key={`${period}${year}`}
                >
                  <img role="presentation" src={imageSrc} />
                  <h2>
                    { SEASONS.includes(period) ? (
                      <FormattedMessage
                        {...seasonsMessages.seasonalDate[lowerPeriod]}
                        values={{ year }}
                      />
                    ) : (
                      <FormattedDate
                        value={new Date(`${period} ${year}`)}
                        year="numeric"
                        month="long"
                      />
                    ) }
                  </h2>
                  <p>
                    <FormattedMessage
                      {...timelineMessages[`${lowerPeriod}${year}`].description}
                    />
                  </p>
                </div>
              );
            })}
          </Carousel>
        </div>
      </PageSection>

      { SESSIONS.map(({ period, year }) => (
        <PageSection
          className="TimelinePage--section TimelinePage--timelineLink"
          background={{
            media: {
              imageUrl: `media/page_assets/timeline/${period}_${year}_tinted.png`,
            },
          }}
          whiteText
        >
          <div className="TimelinePage--section--content">
            <h1>
              <FormattedMessage
                {...seasonsMessages.seasonalDate[period]}
                values={{ year }}
              />
            </h1>
            <p>
              <Button
                className="TimelinePage--timelineLink--button"
                action={{
                  href: `/timeline/${period}${year}`,
                }}
              >
                View
              </Button>
            </p>
          </div>
        </PageSection>
      ))}

      <PageSection className="TimelinePage--section TimelinePage--moreToCome">
        <div className="TimelinePage--section--content">
          <h1><FormattedMessage {...timelineMessages.andMoreToCome} /></h1>
        </div>
      </PageSection>
    </ChevronPage>
  );
}
