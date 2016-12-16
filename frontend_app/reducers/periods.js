export default function periods(state = {}, action) {
  switch (action.type) {
    case 'LOAD_PERIODS_REQUEST':
      return Object.assign({}, state, {
        requestingPeriods: true,
        periodsError: null,
      });
    case 'LOAD_PERIODS_SUCCESS': {
      return Object.assign({}, state, {
        periods: action.periods,
        requestingPeriods: false,
        periodsError: null,
      });
    }
    case 'LOAD_PERIODS_FAILURE':
      return Object.assign({}, state, {
        requestingPeriods: false,
        periodsError: action.err,
      });
    default: {
      return Object.assign({}, state);
    }
  }
}
