/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import './Modal.less';

const DEFAULT_WIDTH = 400;

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  handleKeyUp(e) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }

  render() {
    const windowStyle = {
      width: `${this.props.width}px`,
    };
    return (
      <div className="Modal">
        <div className="Modal--background" onClick={this.props.closeModal} />
        <div className="Modal--window" style={windowStyle}>
          <header className="Modal--header">
            <button className="Modal--close" onClick={this.props.closeModal} />
            <h2>{this.props.title}</h2>
          </header>
          <div className="Modal--window--content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  width: DEFAULT_WIDTH,
};

Modal.propTypes = {
  width: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  closeModal: React.PropTypes.func.isRequired,
  children: React.PropTypes.node.isRequired,
};
