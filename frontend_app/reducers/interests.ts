/**
 * Defines state transitions related to interests in the dream project app.
 */

import {Reducer} from 'redux';

import {Id} from 'common/entities';
import {Topic} from 'common/topics';

interface IOwnInterests {
  readonly otherInterests: Topic[];
  readonly primaryInterest: Topic;
}

export interface IState {
  readonly ownInterests?: IOwnInterests;
  readonly requestingOwnInterests: boolean;
  readonly ownInterestsError?: Error;
  readonly addingOwnInterests: boolean;
  readonly addInterestsError?: Error;
  readonly removingOwnInterests: boolean;
  readonly removeInterestsError?: Error;
}

const initialState: IState = {
  requestingOwnInterests: false,
  addingOwnInterests: false,
  removingOwnInterests: false
};

export type Action = {
  type: 'OWN_INTERESTS_REQUEST'
} | {
  type: 'OWN_INTERESTS_SUCCESS',
  otherInterests: Topic[];
  primaryInterest: Topic;
} | {
  type: 'OWN_INTERESTS_FAILURE',
  err: Error
} | {
  type: 'ADD_INTERESTS_REQUEST'
} | {
  type: 'ADD_INTERESTS_SUCCESS'
} | {
  type: 'ADD_INTERESTS_FAILURE',
  err: Error
} | {
  type: 'REMOVE_INTERESTS_REQUEST'
} | {
  type: 'REMOVE_INTERESTS_SUCCESS'
} | {
  type: 'REMOVE_INTERESTS_FAILURE',
  err: Error
};

const interests: Reducer<IState> = (
  state: IState,
  action: Action
): IState => {
  switch (action.type) {
    case 'OWN_INTERESTS_REQUEST':
      return { ...state, requestingOwnInterests: true, ownInterestsError: undefined };
    case 'OWN_INTERESTS_SUCCESS': {
      const { otherInterests, primaryInterest } = action;

      return {
        ...state,
        ownInterests: { otherInterests, primaryInterest },
        requestingOwnInterests: false,
        ownInterestsError: undefined
      };
    }
    case 'OWN_INTERESTS_FAILURE':
      return {
        ...state,
        requestingOwnInterests: false,
        ownInterestsError: action.err
      };
    case 'ADD_INTERESTS_REQUEST':
      return {
        ...state,
        addingOwnInterests: true,
        addInterestsError: undefined
      };
    case 'ADD_INTERESTS_SUCCESS': {
      return {
        ...state,
        addingOwnInterests: false,
        addInterestsError: undefined
      };
    }
    case 'ADD_INTERESTS_FAILURE':
      return {
        ...state,
        addingOwnInterests: false,
        addInterestsError: action.err
      };
    case 'REMOVE_INTERESTS_REQUEST':
      return {
        ...state,
        removingOwnInterests: true,
        removeInterestsError: undefined
      };
    case 'REMOVE_INTERESTS_SUCCESS': {
      return {
        ...state,
        removingOwnInterests: false,
        removeInterestsError: undefined
      };
    }
    case 'REMOVE_INTERESTS_FAILURE':
      return {
        ...state,
        removingOwnInterests: false,
        removeInterestsError: action.err
      };
    default:
      return state;
  }
};

export default interests;
