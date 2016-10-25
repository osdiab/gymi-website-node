import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function HomePage() {
  return (
    <div className="HomePage">
      <h1>Example Application</h1>
      <p>Welcome to this website! There is a counter, and a quote page.</p>
      <FormattedMessage id="TimelinePage.march2013.description" />
    </div>
  );
}
