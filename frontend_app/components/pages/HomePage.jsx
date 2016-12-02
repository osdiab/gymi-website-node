import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Button from '../Button';
import ChevronPage from './ChevronPage';
import messages from '../../messages';
import PageSection from './PageSection';
import { showModal, hideModal } from '../../actions';

require('./HomePage.less');

const homeMessages = messages.HomePage;
export class HomePageView extends React.Component {
  componentDidMount() {
    if (this.props.location.query.signUp && !this.props.loggedIn) {
      let role = this.props.location.query.role;
      // don't allow admin signup
      if (role === 'admin') {
        role = null;
      }
      this.props.showSignUpModal(role || 'student');
    }
  }

  render() {
    return (
      <ChevronPage className="HomePage">
        <Helmet title={this.props.intl.formatMessage(messages.SiteNavigation.home)} />
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
            media: { imageUrl: '/media/page_assets/home/shermin_with_kids.jpg' }, tint: 'white',
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
              <div className="HomePage--details--leftImage HomePage--details--displayImage" />
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
              <div className="HomePage--details--rightImage HomePage--details--displayImage" />
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
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="ZL6RVZAW2JVU4" />
                <Button
                  className="HomePage--donate"
                  action="submit"
                >Donate</Button>
              </form>
            </div>
          </div>
        </PageSection>
      </ChevronPage>
    );
  }
}

HomePageView.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      signUp: PropTypes.string,
      role: PropTypes.string,
    }),
  }),
  showSignUpModal: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  intl: intlShape,
};

function mapStateToProps(state) {
  return {
    loggedIn: !!state.session.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showSignUpModal: (role = 'student') => dispatch(showModal('signup', {
      role,
      closeModal: () => {
        browserHistory.push('/');
        return dispatch(hideModal());
      },
    })),
  };
}

const HomePage = connect(
  mapStateToProps, mapDispatchToProps
)(injectIntl(HomePageView));
export default HomePage;

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

