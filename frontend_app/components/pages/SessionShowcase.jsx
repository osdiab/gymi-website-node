import _ from 'lodash';
import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import PageSection from './PageSection';
import ChevronPage from './ChevronPage';
import messages from '../../messages';

require('./SessionShowcase.less');

export default function SessionShowcase({
  messagesId, season, year, imageDetails, imageGallery, backgroundImageUrl, backgroundTint,
}) {
  return (
    <ChevronPage className={`SessionShowcase--${messagesId}`}>
      <PageSection
        className="SessionShowcase--section SessionShowcase--splash"
        background={{
          media: { imageUrl: backgroundImageUrl },
          tint: backgroundTint,
        }}
        whiteText
      >
        <div className="SessionShowcase--section--content">
          <h1>
            <FormattedMessage
              {...messages.seasons.seasonalDate[season]}
              values={{ season, year }}
            />
          </h1>
        </div>
      </PageSection>

      <PageSection>
        <section className="SessionShowcase--section--content">
          <FormattedHTMLMessage
            {...messages.sessions[messagesId].description}
          />
        </section>
        <section className="SessionShowcase--imageStories SessionShowcase--section--content">
          {imageDetails.map(({ imageId, media }) => {
            const key = `${messagesId}--${imageId}`;
            const label = `${key}--caption`;
            return (
              <figure key={key}>
                <div className="SessionShowcase--imageStories--media">
                  { _.isString(media) ?
                    <img src={media} aria-describedby={label} alt="" /> : media
                  }
                </div>
                <figcaption id={label}>
                  <FormattedMessage
                    {...messages.sessions[messagesId].sections[imageId]}
                  />
                </figcaption>
              </figure>
            );
          })}
        </section>
        <section>
          <h2>
            <FormattedMessage {...messages.sessions.morePhotos} />
          </h2>
          <div className="SessionShowcase--gallery">
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

SessionShowcase.propTypes = {
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
};
