# Components

## A note on state management

All application state should be stored in the Redux store; but in certain cases, it may be easier to
store state within a component itself. You may do so if the state is specific to that instance of
the component alone (no external communication nor coordination), and is not predicated on any
external data (e.g. data from a database or an API).

For an example, many of the components in [the components
library](https://github.com/clever/components) follow this pattern because the state they manage
pertain only to those components alone, not some greater application data—like whether or not a
`ModalButton` should show its modal or not.
