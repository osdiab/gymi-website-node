import React from 'react';

import Button from '../Button';
import './NotFoundPage.less';

export default function NotFoundPage() {
  return (
    <div className="NotFoundPage">
      <h1>Uh oh!</h1>
      <h2>404: This page does not exist.</h2>
      <Button action={{ href: '/' }}>Return home</Button>
    </div>
  );
}
