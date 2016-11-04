import React from 'react';

import Button from '../Button';

export default function NotFoundPage() {
  return (
    <div>
      <h1>Uh oh!</h1>
      <h2>This page does not exist.</h2>
      <Button action={{ href: '/' }}>Return home</Button>
    </div>
  );
}
