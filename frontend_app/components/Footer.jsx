import React from 'react';

import Modal from './Modal';

import './Footer.less';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wechatModalOpen: false,
    };
  }

  render() {
    return (
      <footer className="Footer">
        <img src="/media/icons/logo.svg" alt="GYMI Logo" className="Footer--logo" />
        <p>
          © GYMI 2015<br />
          Official 501(c)(3)<br />
          <a href="mailto:info@gymiteam.com">info@gymiteam.com</a>
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
            <button
              onClick={(e) => {
                e.preventDefault();
                this.setState({ wechatModalOpen: true });
              }}
            >
              <img src="/media/icons/wechat.svg" alt="GYMI Wechat" />
            </button>
          </li>
        </ul>
        { this.state.wechatModalOpen && (
          <Modal
            closeModal={() => this.setState({ wechatModalOpen: false })}
            title="GYMI Wechat"
            width=500
          >
            <img src="/media/wechat_qr.jpg" alt="Wechat QR Code" />
          </Modal>
        )}
      </footer>
    );
  }
}
