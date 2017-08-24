/**
 * Defines frontend routes for the website
 */
import * as React from 'react';
import { IndexRoute, Route } from 'react-router';

import AboutUsPage from 'frontend/components/pages/AboutUsPage';
import ContactUsPage from 'frontend/components/pages/ContactUsPage';
import DreamProjectHomePage from 'frontend/components/pages/dreamProject/DreamProjectHomePage';
import DreamProjectLayout from 'frontend/components/pages/dreamProject/DreamProjectLayout';
import DreamProjectProfilePage from 'frontend/components/pages/dreamProject/DreamProjectProfilePage';
import DreamProjectStudentsPage from 'frontend/components/pages/dreamProject/DreamProjectStudentsPage';
import HomePage from 'frontend/components/pages/HomePage';
import JoinUsPage from 'frontend/components/pages/JoinUsPage';
import NotFoundPage from 'frontend/components/pages/NotFoundPage';
import { Summer2013Page, Summer2014Page, Summer2015Page, Summer2016Page } from 'frontend/components/pages/periods';
import TimelinePage from 'frontend/components/pages/TimelinePage';
import SiteLayout from 'frontend/components/SiteLayout';

export default (
  <Route path='/' component={SiteLayout}>
    <IndexRoute component={HomePage} />
    <Route path='aboutUs' component={AboutUsPage} />
    <Route path='timeline' component={TimelinePage} />
    <Route path='timeline/summer2013' component={Summer2013Page} />
    <Route path='timeline/summer2014' component={Summer2014Page} />
    <Route path='timeline/summer2015' component={Summer2015Page} />
    <Route path='timeline/summer2016' component={Summer2016Page} />
    <Route path='joinUs' component={JoinUsPage} />
    <Route path='contactUs' component={ContactUsPage} />
    <Route path='/dreamProject' component={DreamProjectLayout}>
      <IndexRoute component={DreamProjectHomePage} />
      <Route path='/dreamProject/students' component={DreamProjectStudentsPage} />
      <Route path='/dreamProject/profile(/:userId)' component={DreamProjectProfilePage} />
    </Route>
    <Route path='*' component={NotFoundPage} />
  </Route>
);
