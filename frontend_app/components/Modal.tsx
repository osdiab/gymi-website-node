/**
 * Renders a modal on screen with handlers to dismiss it.
 */
import * as React from 'react';

import 'frontend/components/Modal.less';

const DEFAULT_WIDTH = 400;

interface IProps {
  width?: number;
  title: string;
  children: React.ReactNode;
  closeModal(): void;
}

export default class Modal extends React.Component<IProps> {
  public static defaultProps: IProps = {
    width: DEFAULT_WIDTH
  } as IProps;

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const windowStyle = {
      width: `${this.props.width}px`
    };

    return (
      <div className='Modal' role='dialog'>
        <div className='Modal--background' onClick={this.props.closeModal} role='button' />
        <div className='Modal--window' style={windowStyle}>
          <header className='Modal--header'>
            <button className='Modal--close' onClick={this.props.closeModal} />
            <h2>{this.props.title}</h2>
          </header>
          <div className='Modal--window--content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  private handleKeyUp(e: React.KeyboardEvent<KeyboardEvent>) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }
}
