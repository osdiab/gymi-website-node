/**
 * All messages related to the dream project application
 */

import home from 'frontend/messages/en/dreamProject/home';
import layout from 'frontend/messages/en/dreamProject/layout';
import navigation from 'frontend/messages/en/dreamProject/navigation';
import newSubmission from 'frontend/messages/en/dreamProject/newSubmission';
import profile from 'frontend/messages/en/dreamProject/profile';
import students from 'frontend/messages/en/dreamProject/students';

export default [
  ...navigation,
  ...layout,
  ...profile,
  ...newSubmission,
  ...home,
  ...students
];
