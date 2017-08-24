/**
 * Defines state transitiosn for displaying modals.
 */

import {Reducer} from 'redux';

import {IProps as ILogInProps} from 'frontend/components/LogInModal';
import {IProps as ISignUpProps} from 'frontend/components/SignUpModal';

export type Action = {
  type: 'SHOW_MODAL',
  modalData: ModalData
} | {
  type: 'HIDE_MODAL'
};

export type ModalData = {
  readonly modalId: 'login';
} | {
  readonly modalId: 'signup';
};

export interface IState {
  readonly modalData?: ModalData;
}

const initialState: IState = {
};

const modal: Reducer<IState> = (
  state: IState = initialState, action: Action
): IState => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        ...state,
        modalData: action.modalData
      };
    case 'HIDE_MODAL':
      return {
        ...state,
        modalData: undefined
      };
    default:
      return state;
  }
};

export default modal;
