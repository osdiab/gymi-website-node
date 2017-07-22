export default function topics(state = {}, action) {
  switch (action.type) {
    case 'LOAD_TOPICS_REQUEST':
      return Object.assign({}, state, {
        requestingTopics: true,
        topicsError: null,
      });
    case 'LOAD_TOPICS_SUCCESS': {
      return Object.assign({}, state, {
        topics: action.topics,
        requestingTopics: false,
        topicsError: null,
      });
    }
    case 'LOAD_TOPICS_FAILURE':
      return Object.assign({}, state, {
        requestingTopics: false,
        topicsError: action.err,
      });
    default: {
      return Object.assign({}, state);
    }
  }
}
