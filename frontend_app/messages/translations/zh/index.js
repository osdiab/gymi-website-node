import HomePage from './HomePage';
import AboutUsPage from './AboutUsPage';
import TimelinePage from './TimelinePage';
import JoinUsPage from './JoinUsPage';
import ContactUsPage from './ContactUsPage';
import SiteNavigation from './SiteNavigation';
import LeadershipTeamSection from './LeadershipTeamSection';
import seasons from './seasons';
import periods, { summer2013, summer2014, summer2015 } from './periods';

export default [
  ...HomePage,
  ...AboutUsPage,
  ...TimelinePage,
  ...JoinUsPage,
  ...ContactUsPage,
  ...SiteNavigation,
  ...LeadershipTeamSection,
  ...seasons,
  ...periods,
  ...summer2013,
  ...summer2014,
  ...summer2015,
];
