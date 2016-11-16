# frontend_app

This directory contains the entirety of the frontend application. It gets run in the browser, not on
the server (except when the `backend_app` server-renders it; see the `backend_app README` for
details about that).

This project is written in React and Redux; for an overview of those tools, I recommend the
following resources:

* The [official React docs](https://facebook.github.io/react/tutorial/tutorial.html) are thorough
    and accessible. Definitely recommend a quick read-through.
* The [official Redux docs](http://redux.js.org/) also explain why Redux exists and how it works in
    a thorough, accessible way.
* The [Egghead Redux videos](https://egghead.io/courses/getting-started-with-redux), produced by the
    creator of Redux, guides you through the motivations behind Redux, how to implement most of the
    library yourself, and also the latest and greatest Javascript tricks that are used in this
    repository. Once you go through these, you should really "get" Redux.
* My [react-redux-boilerplate](https://github.com/clever/frontend-boilerplate) repo. It provides a
    simple example of all the concepts in action—much smaller than this one.

## React Intro

React is a view library for Javascript. That is, it lets you **express what HTML your application
should output**, and manages that HTML as the user uses your web app. No more, no less.

To do that, you structure your web app as a set of **"React Components"**, or just **"Components"**.
These encapsulate chunks of your website—for instance, from something small and self-contained like
a `Button`, to something a bit larger like a section of a page, to something big like an
entire page.

Components form a hierarchical, nested structure just like HTML. Just like you can have `divs`
inside of `divs`, a Component might display some HTML, and maybe some other Components along with
it. In this way, when a Component renders another one inside it, you can refer to these two
Componetns as a **parent** and a **child**.

At the core, each Component consists of a few things:

1. A Component's parent provide them with `props`, which you can think of as input the Component
   uses to render the page. These are considered **immutable** by the Component—they cannot change
   the props they are given (but the parent can!). So **DON'T!** Or else, React will do very strange
   things.
1. Components can keep track of their own `state`, to store changing information the Component needs
   to keep track of—for instance, if a user clicks a button. **NOTE: They can only change their
   state by using the `this.setState()` method.** Do NOT update it directly, or things won't work
   correctly! (React won't know when changes have happened, for instance).
1. Components have to define a `render()` method. This defines how you use the `state` and `props`
   to produce what HTML should be outputted. In this way, you can think of a Component as a pure
   function of input `state` and `props`. You can tell all the possible things your component can
   output by changing what `state` and `props` you provide it.

That's it! There are a few other details about what you can do with Components like lifecycle
methods and PropTypes, but it is easier to see them in action or write some React code yourself.

So, the HTML that gets displayed is a function of the `props` and `state` your Components depend on.
As `props` and `state` changes, React determines what needs to be re-rendered on the page, and does
it.

In that way, **you never need to modify HTML elements on the page again.** Instead of using the
old-school pattern of finding the right element using `jQuery`, and then modifying its contents by
hand; instead you define all the possible outputs your application can produce, and then let React
modify each element for you.

This has a boatload of benefits—namely, now, how a Component on your page might look is defined in
one place alone—in the `render()` function for that component. No longer can code from one part of
your app accidentally destroy a different, unrelated part of the app, because the display of each
Component is isolated to its `render()` function.

Read the resources listed above for more details on how this all works.

## Redux Intro

While React makes outputting HTML in a structured way more convenient, it doesn't solve everything.
For instance, if each Component in your application manages its own state, things can get confusing
and complicated very fast.

What if two Components have different understandings about the state of the application? Or what if
they both depend on the same information, but have no way to directly share that information with
each other?

What if a parent needs to change its data based on something that happens in a child? That's
annoying, since it means the parent has to provide a callback function to the child; if the child is
several levels down, now you need to pass that callback all the way down, and in doing so all your
Components are now coupled with each other.

Redux makes the insight that for any shared state between Components, it's easier to think about it
if you keep that state in one place. So, a Redux **store** contains the application data. You
trigger **actions** that define the events that can occur in your application; the act of triggering
these actions is called **dispatching** them. Finally, **reducers** define how an action changes the
state of the application. The only way that state can be changed is by dispatching an action to a
reducer.

Any project should contain only one store, which serves as the source of truth for the entire
application state. Components that need access to the state are wrapped with Redux **containers**,
which inject a) the state the Component needs, and b) functions the Component needs that cause
changes to the Redux store to occur (i.e. they dispatch actions) into the Component via its `props`.

Redux containers decouple how the Components of your application work from how your state is
managed; they transform the contents of the state and the actions that can modify it into whatever
format your Components need to work properly.

To satisfy (a) above, you provide a function that takes in the current state of the application,
filters and transforms it to match how the Component expects to receive it in its `props`, and
outputs that transformed state as an object that gets injected into `props`.

For (b), you provide a function that takes in a function that can dispatch actions, and outputs all
the functions the Component expects to receive in `props`, that dispatch the relevant actions to
make those functions work. This, too, gets injected into `props`.

This is tough to swallow in a single read, so I highly recommend reading the resources listed above,
where they explain things better than I can.

## Application structure

This project has 5 subdirectories:

* `reducers/`: **Application state management**. Contains the reducers that defined the
    application's single Redux store, which stores and organizes all application state. When an
    "action" occurs, Redux `reducers` get called. Reducers are pure functions that take in the
    current state and the action, and output the resulting new state.  Thus, the store determines
    how state is stored within it, and how the state can change as different actions occur.
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
        * If a Component doesn't need any state or any ability to modify the application state, it
            may not have a container; you can tell by whether or not the Redux `connect` method is
            anywhere in the file.
* `messages/`: A repository of all the text that is displayed in the application, to be used with
    the `react-intl` library.
    * In general, we never type displayed text directly into the code, but instead give each message
        an `id` to identify which message it is, and a `defaultMessage` to indicate what it should
        say. In this application, all the messages are stored in this folder, and each language's
        `index.js` outputs a single array containing all the messages defined for that language.
        See the [`react-intl` docs](https://github.com/yahoo/react-intl/wiki) for more
        information.
    * There is a helpful script in `../scripts/` that checks which translations are missing in the
        defined translations for this project, as defined by the keys in the object that
        `./messages/translations/index.js` defines. To run, it, run
        `npm run-script check-translations`.
* `test/`: All the tests for this project. At the current time, there are few.

Enter each subdirectory and read their documentation for more information on how they work.
