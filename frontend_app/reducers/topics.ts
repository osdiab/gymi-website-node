/**
 * Describes state transitions related to topics, i.e. things someone can
 * be interested in.
 */

import {Topic} from 'common/topics';

export type Action = {
  type: 'LOAD_TOPICS_REQUEST'
} | {
  type: 'LOAD_TOPICS_SUCCESS',
  topics: Topic[]
} | {
  type: 'LOAD_TOPICS_FAILURE',
  err: Error
};

export interface IState {
  readonly requestingTopics: boolean;
  readonly topicsError?: Error;
  readonly topics?: Topic[];
}
const initialState: IState = {
  requestingTopics: false
};

const topics = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case 'LOAD_TOPICS_REQUEST':
      return {
        ...state,
        requestingTopics: true,
        topicsError: undefined
      };
    case 'LOAD_TOPICS_SUCCESS': {
      return {
        ...state,
        topics: action.topics,
        requestingTopics: false,
        topicsError: undefined
      };
    }
    case 'LOAD_TOPICS_FAILURE':
      return {
        ...state,
        requestingTopics: false,
        topicsError: action.err
      };
    default: {
      return state;
    }
  }
};

export default topics;
