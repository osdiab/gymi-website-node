import React from 'react';
import { IndexRoute, Route } from 'react-router';

import SiteLayout from './SiteLayout';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import TimelinePage from './pages/TimelinePage';
import JoinUsPage from './pages/JoinUsPage';
import ContactUsPage from './pages/ContactUsPage';
import NotFoundPage from './pages/NotFoundPage';
import { Summer2013Page, Summer2014Page, Summer2015Page } from './pages/periods';

export default (
  <Route path="/" component={SiteLayout}>
    <IndexRoute component={HomePage} />
    <Route path="aboutUs" component={AboutUsPage} />
    <Route path="timeline" component={TimelinePage} />
    <Route path="timeline/summer2013" component={Summer2013Page} />
    <Route path="timeline/summer2014" component={Summer2014Page} />
    <Route path="timeline/summer2015" component={Summer2015Page} />
    <Route path="joinUs" component={JoinUsPage} />
    <Route path="contactUs" component={ContactUsPage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
