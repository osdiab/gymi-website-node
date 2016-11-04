import React from 'react';

import './Footer.less';

export default function Footer() {
  return (
    <footer className="Footer">
      <img src="/media/icons/logo.svg" alt="GYMI Logo" className="Footer--logo" />
      <p>
        © GYMI 2015<br />
        Official 501(c)(3)<br />
        <a href="mailto:gymi.volunteer@gmail.com">gymi.volunteer@gmail.com</a>
      </p>
      <ul className="Footer--social">
        <li>
          <a href="https://www.facebook.com/GYMIUS">
            <img src="/media/icons/facebook.svg" alt="GYMI Facebook" />
          </a>
        </li>
        <li>
          <a href="https://twitter.com/gymi_us">
            <img src="/media/icons/twitter.svg" alt="GYMI Twitter" />
          </a>
        </li>
        <li>
          <a href="wechat.com">
            <img src="/media/icons/wechat.svg" alt="GYMI Wechat" />
          </a>
        </li>
      </ul>
    </footer>
  );
}
