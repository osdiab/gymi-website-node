import HomePage from './HomePage';
import AboutUsPage from './AboutUsPage';
import TimelinePage from './TimelinePage';
import JoinUsPage from './JoinUsPage';
import ContactUsPage from './ContactUsPage';
import SiteNavigation from './SiteNavigation';
import LeadershipTeamSection from './LeadershipTeamSection';
import seasons from './seasons';
import sessions from './sessions';
import periods from './periods';
import errors from './errors';
import dreamProject from './dreamProject';
import NotFoundPage from './NotFoundPage';

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
];
