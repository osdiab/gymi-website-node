# Webpack & Babel

This project uses Webpack and Babel to improve your development experience.

## Babel

Babel is a Javascript **transpiler** that turns futuristic, cutting edge Javascript that Node and
browsers don't support yet into stuff they do support. A transpiler is a kind of compiler that,
rather than turning your code into an executable program, turns your code into another type of code;
in this case, it turns Javascript that hasn't yet been implemented in most environments (ES6 and
ES7) into Javascript that can be run.

There are a lot of newer features that not all environments support yet, like the `Array.find()`
function, `Promise`-style asynchronous functions (see `backend_app/README.md`), lambda syntax, and
classes. Babel converts this stuff into older style code that does the same thing but doesn't use
any of the new features.

## Webpack

Webpack is a build tool for web applications. It searches for all the `import` and `require`
statements in your codebase, preprocesses them however you tell it to, and then combines them all
into a bundled up executable (in this case, a Javascript file that has had Babel run on it, and all
the LESS CSS styles converted to plain CSS with non-vendor-prefixed styles automatically prefixed
for you, and consolidated in a global CSS file).

You don't need to understand it in detail unless you want to make some changes to how the project
gets built, but suffice it to say that this project defines a configuration for the frontend app and
backend app, and then outputs `build/backend.bundle.js` and `public/stylesheets/bundle.css`; when
`build/backend.bundle.js` is run, you are running the production server.

It also provides a middleware (see `backend_app/README.md`) that I've used here to provide a
convenient development server, that listens for changes and automatically applies those changes
while the server is running, so you don't need to keep restarting the server or refreshing the page
when you're doing simple things like changing styling. You can call that by running
`npm run-script dev-server`.
