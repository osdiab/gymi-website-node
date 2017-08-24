import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';

import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';
import LeadershipTeamSection from './LeadershipTeamSection';

require('./AboutUsPage.less');

const aboutMessages = messages.AboutUsPage;

function AboutUsPage({ intl }) {
  return (
    <ChevronPage className="AboutUsPage ChevronPage">
      <Helmet title={intl.formatMessage(messages.SiteNavigation.aboutUs)} />
      <PageSection
        className="AboutUsPage--section AboutUsPage--splash"
        background={{
          media: {
            imageUrl: 'media/page_assets/about_us/group_photo.jpg',
          },
          tint: 'lightGreen',
        }}
        whiteText
      >
        <div className="AboutUsPage--section--content">
          <h1><FormattedMessage {...aboutMessages.splash.title} /></h1>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--about">
        <div className="AboutUsPage--section--content">
          <h2><FormattedMessage {...aboutMessages.background.title} /></h2>
          <FormattedHTMLMessage {...aboutMessages.background.body} />
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--section AboutUsPage--details" style={{ padding: 0 }}>
        <div className="AboutUsPage--details--content">
          <div className="AboutUsPage--details--column AboutUsPage--goals">
            <section>
              <h2><FormattedMessage {...aboutMessages.goals.title} /></h2>
              <FormattedHTMLMessage {...aboutMessages.goals.body} />
            </section>
          </div>

          <div className="AboutUsPage--details--column AboutUsPage--progress">
            <section>
              <h2><FormattedMessage {...aboutMessages.progress.title} /></h2>
              <FormattedHTMLMessage {...aboutMessages.progress.body} />
              {
                [
                  { season: 'summer', year: 2015 },
                  { season: 'summer', year: 2014 },
                  { season: 'summer', year: 2013 },
                ].map(({ season, year }) => (
                  <Button
                    className="AboutUsPage--progress--button"
                    key={season + year}
                    action={{
                      href: `/timeline/${season}${year}`,
                    }}
                  >
                    <FormattedMessage
                      {...messages.seasons.seasonalDate[season]}
                      values={{ year }}
                    />
                  </Button>
                ))
              }
            </section>
          </div>
        </div>
      </PageSection>

      <PageSection className="AboutUsPage--members">
        <div className="AboutUsPage--section--content">
          <section className="AboutUsPage--team">
            <h2><FormattedMessage {...aboutMessages.team.title} /></h2>
            <LeadershipTeamSection />
          </section>

          <section className="AboutUsPage--partners">
            <h2><FormattedMessage {...aboutMessages.partners.title} /></h2>
            {[
              {
                name: 'Zhejiang University',
                logo: '/media/page_assets/about_us/partner_logos/zhejiang.png',
                id: 'zhejiangUniversity',
              },
              {
                name: 'Nanjing Normal University',
                logo: '/media/page_assets/about_us/partner_logos/nnu.png',
                id: 'nanjingNormalUniversity',
              },
            ].map(({ name, logo, id }) => (
              <div key={id} className="AboutUsPage--orgProfile">
                <div className="AboutUsPage--orgProfile--column">
                  <img
                    alt={`${name} logo`}
                    src={logo}
                  />
                </div>
                <div className="AboutUsPage--orgProfile--column">
                  <h3><FormattedMessage {...aboutMessages.partners[id].name} /></h3>
                  <p><FormattedMessage {...aboutMessages.partners[id].description} />
                  </p>
                </div>
              </div>
            ))}
          </section>

          <section className="AboutUsPage--collaborators">
            <h2><FormattedMessage {...aboutMessages.collaborators.title} /></h2>
            {[
              {
                name: 'The Resolution Project',
                logo: '/media/page_assets/about_us/collaborator_logos/resolution.png',
                id: 'resolutionProject',
              },
              {
                name: 'Pandeagle Cultural Institute',
                logo: '/media/page_assets/about_us/collaborator_logos/pci.jpg',
                id: 'pandeagleCulturalInstitute',
              },
              {
                name: 'Global Young Voices',
                logo: '/media/page_assets/about_us/collaborator_logos/global_young_voices.png',
                id: 'globalYoungVoices',
              },
            ].map(({ name, logo, id }) => (
              <div key={id} className="AboutUsPage--orgProfile">
                <div className="AboutUsPage--orgProfile--column">
                  <img
                    className="AboutUsPage--orgProfile--logo"
                    alt={`${name} logo`}
                    src={logo}
                  />
                </div>
                <div className="AboutUsPage--orgProfile--column">
                  <h3><FormattedMessage {...aboutMessages.collaborators[id].name} /></h3>
                  <p><FormattedMessage {...aboutMessages.collaborators[id].description} />
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </PageSection>
    </ChevronPage>
  );
}

AboutUsPage.propTypes = {
  intl: intlShape,
};

export default injectIntl(AboutUsPage);
