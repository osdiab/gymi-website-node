import React from 'react';
import { FormattedMessage, FormattedDate, injectIntl, intlShape } from 'react-intl';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Helmet from 'react-helmet';

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

const PERIODS = [
  { period: 'summer', year: 2013 },
  { period: 'summer', year: 2014 },
  { period: 'summer', year: 2015 },
  { period: 'summer', year: 2016 },
];

const imageGalleryOpts = {
  showFullscreenButton: false,
  items: TIMELINE_SLIDES.map(({ period, year }) => {
    const imageSrc = `/media/page_assets/timeline/carousel/${year}_${period.toLowerCase()}.jpg`;
    return {
      original: imageSrc,
      thumbnail: imageSrc,
      description: `${period} ${year}`,
    };
  }),
  renderItem: (item) => {
    const [period, year] = item.description.split(' ');
    return (
      <div className="image-gallery-image">
        <img src={item.original} alt={item.originalAlt} />
        { item.description &&
          <div className="TimelinePage--gallery--description image-gallery-description">
            <h2>
              { SEASONS.includes(period.toLowerCase()) ? (
                <FormattedMessage
                  {...seasonsMessages.seasonalDate[period.toLowerCase()]}
                  values={{ year }}
                />
              ) : (
                <FormattedDate
                  value={new Date(`${period} 15, ${year}`)}
                  year="numeric"
                  month="long"
                />
              ) }
            </h2>
            <p>
              <FormattedMessage
                {...timelineMessages[`${period.toLowerCase()}${year}`].description}
              />
            </p>
          </div>
        }
      </div>
    );
  },
};

function TimelinePage({ intl }) {
  return (
    <ChevronPage className="TimelinePage ChevronPage">
      <Helmet title={intl.formatMessage(messages.SiteNavigation.timeline)} />
      <PageSection
        className="TimelinePage--section TimelinePage--splash"
        background={{
          media: {
            imageUrl: 'media/textures/grey_horizontal.png',
          },
        }}
        whiteText
      >
        <div className="TimelinePage--section--content TimelinePage--gallery">
          <h1><FormattedMessage {...timelineMessages.title} /></h1>
          <ImageGallery {...imageGalleryOpts} />
        </div>
      </PageSection>

      { PERIODS.map(({ period, year }) => (
        <PageSection
          key={`PageSection--${period}--${year}`}
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

TimelinePage.propTypes = {
  intl: intlShape,
};

export default injectIntl(TimelinePage);
