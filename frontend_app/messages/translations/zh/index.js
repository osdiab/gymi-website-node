import HomePage from './HomePage';
import AboutUsPage from './AboutUsPage';
import TimelinePage from './TimelinePage';
import JoinUsPage from './JoinUsPage';
// import ContactPage from './ContactPage';
import SiteNavigation from './SiteNavigation';
import LeadershipTeamSection from './LeadershipTeamSection';
import seasons from './seasons';

export default [
  ...HomePage,
  ...AboutUsPage,
  ...TimelinePage,
  ...JoinUsPage,
  // ...ContactPage,
  ...SiteNavigation,
  ...LeadershipTeamSection,
  ...seasons,
];
