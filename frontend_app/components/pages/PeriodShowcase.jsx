import _ from 'lodash';
import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import PageSection from './PageSection';
import ChevronPage from './ChevronPage';
import messages from '../../messages';

require('./PeriodShowcase.less');

function PeriodShowcase({
  messagesId, season, year, imageDetails, imageGallery, backgroundImageUrl, backgroundTint,
  intl,
}) {
  return (
    <ChevronPage className={`PeriodShowcase--${messagesId}`}>
      <Helmet
        title={intl.formatMessage(
          messages.seasons.seasonalDate[season], { season, year }
        )}
      />
      <PageSection
        className="PeriodShowcase--section PeriodShowcase--splash"
        background={{
          media: { imageUrl: backgroundImageUrl },
          tint: backgroundTint,
        }}
        whiteText
      >
        <div className="PeriodShowcase--section--content">
          <h1>
            <FormattedMessage
              {...messages.seasons.seasonalDate[season]}
              values={{ season, year }}
            />
          </h1>
        </div>
      </PageSection>

      <PageSection>
        <section className="PeriodShowcase--section--content">
          <FormattedHTMLMessage
            {...messages.periods[messagesId].description}
          />
        </section>
        <section className="PeriodShowcase--imageStories PeriodShowcase--section--content">
          {imageDetails.map(({ imageId, media }) => {
            const key = `${messagesId}--${imageId}`;
            const label = `${key}--caption`;
            return (
              <figure key={key}>
                <div className="PeriodShowcase--imageStories--media">
                  { _.isString(media) ?
                    <img src={media} aria-describedby={label} alt="" /> : media
                  }
                </div>
                <figcaption id={label}>
                  <FormattedMessage
                    {...messages.periods[messagesId].sections[imageId]}
                  />
                </figcaption>
              </figure>
            );
          })}
        </section>
        <section>
          <h2>
            <FormattedMessage {...messages.periods.morePhotos} />
          </h2>
          <div className="PeriodShowcase--gallery">
            <ImageGallery
              items={imageGallery}
              showFullscreenButton={false}
            />
          </div>
        </section>
      </PageSection>
    </ChevronPage>
  );
}

PeriodShowcase.propTypes = {
  messagesId: PropTypes.string.isRequired,
  season: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  imageDetails: PropTypes.arrayOf(PropTypes.shape({
    media: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    imageId: PropTypes.string,
  })).isRequired,
  imageGallery: PropTypes.arrayOf(PropTypes.shape({ original: PropTypes.string })),
  backgroundImageUrl: PropTypes.string.isRequired,
  backgroundTint: PropTypes.string,
  intl: intlShape,
};

export default injectIntl(PeriodShowcase);
