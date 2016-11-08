export default function modal(state = {}, action) {
  switch (action.type) {
    case 'SHOW_MODAL':
      return Object.assign({}, state, {
        modalId: action.modalId,
        props: action.props,
      });
    case 'HIDE_MODAL':
      return Object.assign({}, state, {
        modalId: null,
        props: null,
      });
    default:
      return Object.assign({}, state);
  }
}
