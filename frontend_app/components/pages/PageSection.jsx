import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import browser from 'detect-browser';

require('./PageSection.less');

export default function PageSection({
  children, className, background, whiteText, style,
}) {
  // clip-path doesn't work correctly in firefox, edge, and msie, so disable overlap
  const patchStyle = {};
  if (['firefox', 'ie', 'edge'].includes(browser.name)) {
    patchStyle.marginBottom = 0;
    patchStyle.paddingTop = '50px';
  }

  // if a video background or tint is present, the background must be set to none or that content
  // won't be visible (negative z-index). If an image is present, we should set the background image
  // to that, rather than clearing it.
  let bgStyle = {};
  if (background) {
    bgStyle = background.media && background.media.imageUrl ?
      { backgroundImage: `url("${background.media.imageUrl}")` } : { background: 'none' };
  }
  const finalStyle = Object.assign({}, patchStyle, bgStyle, style);

  return (
    <section
      className={classnames(
        'PageSection',
        className,
        whiteText && 'PageSection--whiteText',
      )}
      style={finalStyle}
    >
      <div className="PageSection--content">
        {children}
      </div>
      {background && background.media && background.media.videoUrls &&
        <video
          className="PageSection--videoBackground"
          autoPlay muted loop preload
          poster={background.media.posterUrl}
        >
          {_.map(background.media.videoUrls, url => <source key={url} src={url} />)};
        </video>
      }
      {background && background.tint &&
        <div
          className={classnames(
            'PageSection--backgroundTint',
            `PageSection--backgroundTint--${background.tint}`
          )}
        />}
    </section>
  );
}

PageSection.BACKGROUND_TINTS = [
  'lightBlue', 'orange', 'lightGreen', 'white',
];
PageSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  background: PropTypes.shape({
    media: PropTypes.oneOfType([
      PropTypes.shape({
        videoUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
        posterUrl: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        imageUrl: PropTypes.string,
      }),
    ]),
    tint: PropTypes.oneOf(PageSection.BACKGROUND_TINTS),
  }),
  whiteText: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
