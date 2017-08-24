/**
 * Renders the footer of each page
 */
import * as React from 'react';

import Modal from 'frontend/components/Modal';

import 'frontend/components/Footer.less';

type IProps = {};
interface IState {
  wechatModalOpen: boolean;
}

export default class Footer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      wechatModalOpen: false
    };
  }

  public render() {
    return (
      <footer className='Footer'>
        <img src='/media/icons/logo.svg' alt='GYMI Logo' className='Footer--logo' />
        <p>
          © GYMI 2015<br />
          Official 501(c)(3)<br />
          <a href='mailto:hr@gymiteam.com'>info@gymiteam.com</a>
        </p>
        <ul className='Footer--social'>
          <li>
            <a href='https://www.facebook.com/GYMIUS'>
              <img src='/media/icons/facebook.svg' alt='GYMI Facebook' />
            </a>
          </li>
          <li>
            <a href='https://twitter.com/gymi_us'>
              <img src='/media/icons/twitter.svg' alt='GYMI Twitter' />
            </a>
          </li>
          <li>
            <button onClick={this.openWechatModal}>
              <img src='/media/icons/wechat.svg' alt='GYMI Wechat' />
            </button>
          </li>
        </ul>
        { this.state.wechatModalOpen && (
          <Modal
            closeModal={this.closeWechatModal}
            title='GYMI Wechat'
            width={500}
          >
            <img src='/media/wechat_qr.jpg' alt='Wechat QR Code' />
          </Modal>
        )}
      </footer>
    );
  }

  private toggleWechatModal = (e: React.MouseEvent<HTMLButtonElement>, open: boolean) => {
    e.preventDefault();
    this.setState({ wechatModalOpen: open });
  }
  private openWechatModal = (e: React.MouseEvent<HTMLButtonElement>) => this.toggleWechatModal(e, true);
  private closeWechatModal = (e: React.MouseEvent<HTMLButtonElement>) => this.toggleWechatModal(e, false);
}
