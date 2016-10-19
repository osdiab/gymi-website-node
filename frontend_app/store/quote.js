// Defines how state relating to the quote section changes as actions arrive.
// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

const quote = (state = { fetching: false }, action) => {
  switch (action.type) {
    case 'FETCHING_QUOTE':
      return Object.assign({}, state, { fetching: true, fetchError: null });
    case 'RECEIVED_QUOTE':
      return Object.assign({}, state, {
        quote: action.quote,
        author: action.author,
        fetching: false,
      });
    case 'FETCHING_QUOTE_FAILED':
      return Object.assign({}, state, { fetchError: action.err, fetching: false });
    default:
      return state;
  }
};

export default quote;
