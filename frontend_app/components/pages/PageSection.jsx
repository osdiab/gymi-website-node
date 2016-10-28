import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import browser from 'detect-browser';

require('./PageSection.less');

/**
 * If videoBackground is present, it will be used to play a video in the
 * background of the PageSection.
 */
export default function PageSection({
  children, className, videoBackground, colorBackground, whiteText,
}) {
  // clip-path doesn't work correctly in firefox, edge, and msie, so disable overlap
  const style = {};
  if (['firefox', 'ie', 'edge'].includes(browser.name)) {
    style.marginBottom = 0;
    style.paddingTop = '50px';
  }
  return (
    <section
      className={classnames(
        'PageSection',
        className,
        whiteText && 'PageSection--whiteText',
      )}
      style={style}
    >
      <div className="PageSection--content">
        {children}
      </div>
      {videoBackground &&
        <video
          className="PageSection--videoBackground"
          autoPlay muted loop preload
          poster={videoBackground.posterUrl}
        >
          {_.map(videoBackground.videoUrls, url => <source key={url} src={url} />)};
        </video>
      }
      {colorBackground && <div className={`PageSection--colorBackground PageSection--colorBackground--${colorBackground}`} />}
    </section>
  );
}

PageSection.backgroundColors = [
  'lightBlue', 'orange', 'darkBlue',
];
PageSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  videoBackground: PropTypes.shape({
    videoUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    posterUrl: PropTypes.string.isRequired,
  }),
  colorBackground: PropTypes.oneOf(PageSection.backgroundColors),
  whiteText: PropTypes.bool,
};
