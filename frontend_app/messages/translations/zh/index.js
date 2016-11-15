import HomePage from './HomePage';
import AboutUsPage from './AboutUsPage';
import TimelinePage from './TimelinePage';
import JoinUsPage from './JoinUsPage';
import ContactUsPage from './ContactUsPage';
import SiteNavigation from './SiteNavigation';
import LeadershipTeamSection from './LeadershipTeamSection';
import seasons from './seasons';
import sessions from './sessions';
import periods, { summer2013, summer2014, summer2015 } from './periods';
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
  ...summer2013,
  ...summer2014,
  ...summer2015,
  ...seasons,
  ...sessions,
  ...periods,
  ...errors,
  ...dreamProject,
  ...NotFoundPage,
];
