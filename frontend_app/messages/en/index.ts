/**
 * All the messages in the frontend app, in english.
 */
import AboutUsPage from 'frontend/messages/en/AboutUsPage';
import common from 'frontend/messages/en/common';
import ContactUsPage from 'frontend/messages/en/ContactUsPage';
import dreamProject from 'frontend/messages/en/dreamProject';
import errors from 'frontend/messages/en/errors';
import HomePage from 'frontend/messages/en/HomePage';
import JoinUsPage from 'frontend/messages/en/JoinUsPage';
import LeadershipTeamSection from 'frontend/messages/en/LeadershipTeamSection';
import NotFoundPage from 'frontend/messages/en/NotFoundPage';
import periods from 'frontend/messages/en/periods';
import seasons from 'frontend/messages/en/seasons';
import sessions from 'frontend/messages/en/sessions';
import SiteNavigation from 'frontend/messages/en/SiteNavigation';
import TimelinePage from 'frontend/messages/en/TimelinePage';

export default [
  ...HomePage,
  ...AboutUsPage,
  ...TimelinePage,
  ...JoinUsPage,
  ...ContactUsPage,
  ...SiteNavigation,
  ...LeadershipTeamSection,
  ...seasons,
  ...sessions,
  ...periods,
  ...errors,
  ...dreamProject,
  ...NotFoundPage,
  ...common
];
