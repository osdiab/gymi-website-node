import _ from 'lodash';

export default function interests(state = {}, action) {
  switch (action.type) {
    case 'OWN_INTERESTS_REQUEST':
      return Object.assign({}, state, { requestingOwnInterests: true });
    case 'OWN_INTERESTS_SUCCESS': {
      const otherInterests = _.omitBy(action.interests, i => i.primary);
      const primaryInterest = action.interests.find(i => i.primary);
      return Object.assign({}, state, {
        ownInterests: { otherInterests, primaryInterest },
        requestingOwnInterests: false,
      });
    }
    case 'OWN_INTERESTS_FAILURE':
      return Object.assign({}, state, {
        requestingOwnInterests: false,
        ownInterestsError: action.err,
      });
    default:
      return state;
  }
}
