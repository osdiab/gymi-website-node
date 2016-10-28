import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Button from '../Button';
import PageSection from './PageSection';

require('./HomePage.less');

export const messages = {
  splash: {
    title: {
      id: 'HomePage.splash.title',
      defaultMessage: 'Join us on the journey of mentoring awesome kids.',
    },
    body: {
      id: 'HomePage.splash.body',
      defaultMessage: 'Each summer, Global Youth Mentorship Initiative (GYMI) holds summer ' +
        'sessions that help underprivileged students gain access to mentorship and educational ' +
        'resources.',
    },
  },
  about: {
    title: {
      id: 'HomePage.about.title',
      defaultMessage: 'We are GYMI.',
    },
    body: {
      id: 'HomePage.about.body',
      defaultMessage: 'We are mentors from all over the world, dedicated with one purpose: to ' +
        'bring inspiration and passion for learning to those who are less privileged and help them ' +
        'expand their borders.',
    },
    aboutButton: {
      id: 'HomePage.about.aboutButton',
      defaultMessage: 'About Us',
    },
  },
  quote: {
    body: {
      id: 'HomePage.quote.body',
      defaultMessage: '"Education is only the most fully conscious of the channels whereby each ' +
        'generation influences the next."',
    },
    author: {
      id: 'HomePage.quote.author',
      defaultMessage: '―C.S. Lewis',
    },
  },
  whatWeDo: {
    title: {
      id: 'HomePage.whatWeDo.title',
      defaultMessage: 'What we do',
    },
    body: {
      id: 'HomePage.whatWeDo.body',
      defaultMessage: 'Our trained mentors spearhead summer sessions focused on arts and ' +
        'technology in a one-to-one or small group setting, and follow up with their students for ' +
        'at least a year online.',
    },
  },
  whyWeDoThis: {
    title: {
      id: 'HomePage.whyWeDoThis.title',
      defaultMessage: 'Why do we do this?',
    },
    body: {
      id: 'HomePage.whyWeDoThis.body',
      defaultMessage: 'Many students around the world do not have access to resources outside of ' +
        'the basic academic curriculum even though they are enthusiastic about learning more. ' +
        'GYMI tries to address this type of educational inequality by mobilizing talented and ' +
        'passionate undergraduates.',
    },
  },
  latestNews: {
    title: {
      id: 'HomePage.latestNews.title',
      defaultMessage: 'Latest News',
    },
    body: {
      id: 'HomePage.latestNews.body',
      defaultMessage: '<p>This past summer, GYMI has been busy hosting several awesome summer camps! ' +
        'GYMI camps ranged from rural areas in Guizhou to suburban Hangzhou and Quzhou schools for ' +
        'children under the poverty line. We were able to collect funds from multiple media ' +
        'resources and direct them to where they are most needed.</p>' +

        '<p>GYMI camps are unlike other traditional volunteer programs. We build unique mentor-mentee ' +
        'relationships by enfocing a low mentor to mentee ratio. Our mentors teach classes on ' +
        'subjects that they experienced in and accompany their mentees to other mentor-taught ' +
        'classes.</p>' +

        '<p>These classes focus on creativity and critical thinking, including subjects such ' +
        'as computer science, public speaking, drama, arts and crafts, etc. At the end of each ' +
        'two-week session, the mentees each display a finished art/drama project in addition to ' +
        'making a speech about their dreams and goals for the future. Following the speech, ' +
        'mentors and mentees work together to create a one year long follow-up project to help ' +
        'the mentee achieve their goals.</p>' +

        '<p>Ultimately, not only does this setup help the mentees achieve a personal dream, but ' +
        'also, the mentors are able to recognize thier own potential as future leaders or great ' +
        'teachers.</p>',
    },
    timelineButtonText: {
      id: 'HomePage.latestNews.timelineButtonText',
      defaultMessage: 'View Timeline',
    },
  },
  donate: {
    title: {
      id: 'HomePage.donate.title',
      defaultMessage: 'GYMI + A Karma World',
    },
    body: {
      id: 'HomePage.donate.body',
      defaultMessage: 'Like our cause? Donate please!',
    },
    learnMoreButton: {
      id: 'HomePage.donate.learnMoreButton',
      defaultMessage: 'Learn More',
    },
  },
  joinUs: {
    title: {
      id: 'HomePage.joinUs.title',
      defaultMessage: 'Join Us',
    },
    body: {
      id: 'HomePage.joinUs.body',
      defaultMessage: 'Like our cause? There are many ways for you to help! Join our team of ' +
        'fantastic volunteers, donate to our program, or help us spread the word about GYMI!',
    },
    becomeMentorButton: {
      id: 'HomePage.joinUs.becomeMentorButton',
      defaultMessage: 'Become a Mentor',
    },
    followUsButton: {
      id: 'HomePage.joinUs.followUsButton',
      defaultMessage: 'Follow Us',
    },
  },
};

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
          <h1><FormattedMessage {...messages.splash.title} /></h1>
          <p><FormattedMessage {...messages.splash.body} /></p>
        </div>
      </PageSection>

      <PageSection className="HomePage--section HomePage--about">
        <div className="HomePage--section--content">
          <h2><FormattedMessage {...messages.about.title} /></h2>
          <p><FormattedMessage {...messages.about.body} /></p>
          <div>
            <Button action={{ href: '/counter', internal: true }}>
              <FormattedMessage {...messages.about.aboutButton} />
            </Button>
          </div>
        </div>
      </PageSection>

      <PageSection className="HomePage--section HomePage--details" style={{ padding: 0 }}>
        <div className="HomePage--details--content">
          <div className="HomePage--details--column">
            <section>
              <h2><FormattedMessage {...messages.whatWeDo.title} /></h2>
              <p><FormattedMessage {...messages.whatWeDo.body} /></p>
            </section>
            <img
              src="/images/backgrounds/blueAbstract.jpg"
              role="presentation"
              className="HomePage--details--leftImage"
            />
            <section>
              <h2><FormattedMessage {...messages.whyWeDoThis.title} /></h2>
              <p><FormattedMessage {...messages.whyWeDoThis.body} /></p>
            </section>
          </div>

          <div className="HomePage--details--column">
            <section className="HomePage--details--latestNews">
              <h2><FormattedMessage {...messages.latestNews.title} /></h2>
              <FormattedHTMLMessage {...messages.latestNews.body} />
              <div className="HomePage--details--button">
                <Button action={{ href: '/quote', internal: true }}>
                  <FormattedMessage {...messages.latestNews.timelineButtonText} />
                </Button>
              </div>
            </section>
          </div>
        </div>
      </PageSection>

      <PageSection className="HomePage--section HomePage--joinUs" whiteText>
        <div className="HomePage--section--content">
          <h2><FormattedMessage {...messages.joinUs.title} /></h2>
          <p><FormattedMessage {...messages.joinUs.body} /></p>
          <div className="HomePage--joinUs--buttons">
            <Button action={{ href: '/counter', internal: true }}>
              <FormattedMessage {...messages.joinUs.becomeMentorButton} />
            </Button>
            <Button action={{ href: '/counter', internal: true }}>
              <FormattedMessage {...messages.joinUs.followUsButton} />
            </Button>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
