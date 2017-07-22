import React from 'react';
import { IndexRoute, Route } from 'react-router';

import SiteLayout from './SiteLayout';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import TimelinePage from './pages/TimelinePage';
import JoinUsPage from './pages/JoinUsPage';
import ContactUsPage from './pages/ContactUsPage';
import NotFoundPage from './pages/NotFoundPage';
import { Summer2013Page, Summer2014Page, Summer2015Page, Summer2016Page } from './pages/periods';
import DreamProjectLayout from './pages/dreamProject/DreamProjectLayout';
import DreamProjectHomePage from './pages/dreamProject/DreamProjectHomePage';
import DreamProjectStudentsPage from './pages/dreamProject/DreamProjectStudentsPage';
import DreamProjectProfilePage from './pages/dreamProject/DreamProjectProfilePage';

export default (
  <Route path="/" component={SiteLayout}>
    <IndexRoute component={HomePage} />
    <Route path="aboutUs" component={AboutUsPage} />
    <Route path="timeline" component={TimelinePage} />
    <Route path="timeline/summer2013" component={Summer2013Page} />
    <Route path="timeline/summer2014" component={Summer2014Page} />
    <Route path="timeline/summer2015" component={Summer2015Page} />
    <Route path="timeline/summer2016" component={Summer2016Page} />
    <Route path="joinUs" component={JoinUsPage} />
    <Route path="contactUs" component={ContactUsPage} />
    <Route path="/dreamProject" component={DreamProjectLayout}>
      <IndexRoute component={DreamProjectHomePage} />
      <Route path="/dreamProject/students" component={DreamProjectStudentsPage} />
      <Route path="/dreamProject/profile(/:userId)" component={DreamProjectProfilePage} />
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Route>
);
