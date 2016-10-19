// Expresses how state related to the counter section changes as actions arrive.
// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

const counter = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNTER':
      return Object.assign({}, state, { value: state.value + 1 });
    default:
      return state;
  }
};

export default counter;
