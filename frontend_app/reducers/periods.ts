/**
 * Describes state changes for the periods reducer
 */
import {Reducer} from 'redux';

import {Period} from 'common/periods';

export type Action = {
  type: 'LOAD_PERIODS_REQUEST'
} | {
  type: 'LOAD_PERIODS_SUCCESS',
  periods: Period[]
} | {
  type: 'LOAD_PERIODS_FAILURE',
  err: Error
};

export interface IState {
  readonly periodsError?: Error;
  readonly requestingPeriods: boolean;
  readonly periods?: Period[];
}

const initialState: IState = {
  requestingPeriods: false
};

const periods: Reducer<IState> = (
  state: IState = initialState, action: Action
): IState => {
  switch (action.type) {
    case 'LOAD_PERIODS_REQUEST':
      return {
        ...state,
        requestingPeriods: true,
        periodsError: undefined
      };
    case 'LOAD_PERIODS_SUCCESS': {
      return {
        ...state,
        periods: action.periods,
        requestingPeriods: false,
        periodsError: undefined
      };
    }
    case 'LOAD_PERIODS_FAILURE':
      return {
        ...state,
        requestingPeriods: false,
        periodsError: action.err
      };
    default: {
      return state;
    }
  }
};

export default periods;
