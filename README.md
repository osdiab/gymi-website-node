# gymi-website-node

TODO: add more details

## Installation

### Install node

* OSX: `brew install node`
* Ubuntu: `apt-get install nodejs`

### Install external dependencies

* Dependencies of [`pg-native`](https://github.com/brianc/node-pg-native)
* On Ubuntu, for some libs (like `pg-promise`) to work, also symlink `node` to the `nodejs` binary.

### Clone the repository

1. Pull the repository: `git clone git@github.com:osdiab/gymi-website-node.git`
1. Enter the directory: `cd gymi-website-node`

### Install dependencies

The Node Package Manager (`npm`) manages library dependencies for you in Node projects. You can find
the list of dependencies for any Node project in its `package.json` file. To install them, simply
run:

```
npm install
```

This will download all the Node libraries you need, and place them into the `node_modules/`
directory at the base of the project. `node` can access them so long as you run it in somewhere in
the project dir; if you want to see for yourself, open the Node REPL by running `node` with no
arguments while in the project directory, and try running `const l = require('lodash')`—it will
place the `lodash` library in the `l` variable.

## Running the application

### For the development server...

Run this command (which is defined in the `scripts` section of `package.json`):

```
npm run-script dev-server
```

Et voilà! Visit [localhost:3000](http://localhost:3000) to see everything in action.

#### Remote dependencies

This may not work for you immediately, because there are remote dependencies (namely, the database)
that are required for the project to run. You need to set some environment variables to use them.

To do so in a Unix/Mac environment, I suggest adding these to your `.bashrc` (or the equivalent for
whatever shell you're using):

```
export GYMI_WEBSITE_DEV_DB_HOST=<INSERT_HOST_HERE>
export GYMI_WEBSITE_DEV_DB_USERNAME=<INSERT_USERNAME_HERE>
export GYMI_WEBSITE_DEV_DB_PASSWORD=<INSERT_PASSWORD_HERE>
export GYMI_WEBSITE_DEV_DB_DATABASE=<INSERT_DATABASE_HERE>
```

If you are testing the contact form, you also need these in your environment.

```
export GYMI_EMAIL_USERNAME="<INSERT_EMAIL_HERE>"
export GYMI_EMAIL_PASSWORD="<INSERT_PASSWORD_HERE>"
export GYMI_EMAIL_HOST="<INSERT_HOST_HERE>"
```

You can ask me for the real values of these variables.

### For the production server...

Ensure all the proper environment variables are present, and then run:

```
npm start
```

## Deploying

1. SSH into the prod machine.
1. Build the repo. `npm run-script build`
1. Stop the existing process. `pm2 stop backend.bundle`
1. Start the new version. `pm2 start build/backend.bundle.js`

### Environment variables

They are contained in `~/.bashrc` on the prod machines.
