import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import messages from '../../messages';
import Button from '../Button';
import './NotFoundPage.less';

export default function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <Helmet title="404" />
      <h1>
        <FormattedMessage {...messages.NotFoundPage.uhOh} />
      </h1>
      <h2>
        <FormattedMessage {...messages.NotFoundPage.pageNonexistent} />
      </h2>
      <Button action={{ href: '/' }}>
        <FormattedMessage {...messages.NotFoundPage.returnHome} />
      </Button>
    </div>
  );
}
