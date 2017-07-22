export default function interests(state = {}, action) {
  switch (action.type) {
    case 'OWN_INTERESTS_REQUEST':
      return Object.assign({}, state, { requestingOwnInterests: true, ownInterestsError: null });
    case 'OWN_INTERESTS_SUCCESS': {
      const { otherInterests, primaryInterest } = action;
      return Object.assign({}, state, {
        ownInterests: { otherInterests, primaryInterest },
        requestingOwnInterests: false,
        ownInterestsError: null,
      });
    }
    case 'OWN_INTERESTS_FAILURE':
      return Object.assign({}, state, {
        requestingOwnInterests: false,
        ownInterestsError: action.err,
      });
    case 'ADD_INTERESTS_REQUEST':
      return Object.assign({}, state, { addingOwnInterests: true, addInterestsError: null });
    case 'ADD_INTERESTS_SUCCESS': {
      return Object.assign({}, state, {
        addingOwnInterests: false,
        addInterestError: null,
      });
    }
    case 'ADD_INTERESTS_FAILURE':
      return Object.assign({}, state, {
        addingOwnInterests: false,
        addInterestsError: action.err,
      });
    case 'REMOVE_INTERESTS_REQUEST':
      return Object.assign({}, state, {
        removingOwnInterests: true,
        removeInterestsError: null,
      });
    case 'REMOVE_INTERESTS_SUCCESS': {
      return Object.assign({}, state, {
        removingOwnInterests: false,
        removeInterestError: null,
      });
    }
    case 'REMOVE_INTERESTS_FAILURE':
      return Object.assign({}, state, {
        removingOwnInterests: false,
        removeInterestsError: action.err,
      });
    default:
      return state;
  }
}
