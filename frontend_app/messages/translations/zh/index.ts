/**
 * Translations of English messages into Chinese.
 */
import AboutUsPage from 'frontend/messages/translations/zh/AboutUsPage';
import common from 'frontend/messages/translations/zh/common';
import ContactUsPage from 'frontend/messages/translations/zh/ContactUsPage';
import dreamProject from 'frontend/messages/translations/zh/dreamProject';
import errors from 'frontend/messages/translations/zh/errors';
import HomePage from 'frontend/messages/translations/zh/HomePage';
import JoinUsPage from 'frontend/messages/translations/zh/JoinUsPage';
import LeadershipTeamSection from 'frontend/messages/translations/zh/LeadershipTeamSection';
import NotFoundPage from 'frontend/messages/translations/zh/NotFoundPage';
import periods, { summer2013, summer2014, summer2015, summer2016 } from 'frontend/messages/translations/zh/periods';
import seasons from 'frontend/messages/translations/zh/seasons';
import sessions from 'frontend/messages/translations/zh/sessions';
import SiteNavigation from 'frontend/messages/translations/zh/SiteNavigation';
import TimelinePage from 'frontend/messages/translations/zh/TimelinePage';

export default [
  ...HomePage,
  ...AboutUsPage,
  ...TimelinePage,
  ...JoinUsPage,
  ...ContactUsPage,
  ...SiteNavigation,
  ...LeadershipTeamSection,
  ...summer2013,
  ...summer2014,
  ...summer2015,
  ...summer2016,
  ...seasons,
  ...sessions,
  ...periods,
  ...errors,
  ...dreamProject,
  ...NotFoundPage,
  ...common
];
