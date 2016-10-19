# react-redux-boilerplate

Want to create a React/Redux app? Start here! Follow this README and the associated code comments
to gain a better understanding of the mindset that drives React/Redux frontend programming, and how
all these tools tie together.

For an overview of React and Redux, as well as other tools we use for frontend development at
Clever, see [our frontend
overview](https://clever.atlassian.net/wiki/display/ENG/Working+with+React).

## Application structure

This project has 4 subdirectories:

* `store/`: **Application state management**. Contains the single Redux store, which stores and
    organizes all application state. When an "action" occurs, Redux `reducers` get called. Reducers
    are pure functions that take in the current state and the action, and output the resulting new
    state.  Thus, the store determines how state is stored within it, and how the state can change
    as different actions occur.
* `actions/`: **Defining state transitions**: Contains all the possible actions that can occur in an
    application. Actions just plain Javascript objects that contain the `type` of the action, and
    any metadata the `store` needs to respond to that action.
* `components/`: Each component contains two parts:
    * Components that define **visual display**. React `Component`s that are generally
        **presentational** in nature—that is, they do not specify how to manage state, but merely
        describe what HTML should be outputted given their input properties.
        * See the README in `components/` for more detail on handling individual (not
            application-wide) component state.
    * Containers that **transfer application state to components**. Containers are wrappers
        around presentational components that pass them state and functions that
        modify state, so that the `components` don't need to know anything about how application
        state is managed. That way, the components can focus entirely on presentation.

Enter each subdirectory and read their documentation for more information on how they work.
