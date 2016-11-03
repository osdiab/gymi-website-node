# gymi-website-node

TODO: add more details

## Installation

### Install node

* OSX: `brew install node`
* Ubuntu: `apt-get install nodejs`

### Install external dependencies

* Dependencies of [`pg-native`](https://github.com/brianc/node-pg-native)
* On ubuntu, use the `nodejs` package; and for some libs (like `pg-promise`) to work, also symlink
    `node` to the `nodejs` binary.

### Clone the repository

1. Pull the repository: `git clone git@github.com:osdiab/gymi-website-node.git`
1. Enter the directory: `cd gymi-website-node`

### Install dependencies

```
npm install
```

## Running the application

### For the development server...

```
npm run-script dev-server
```

Et voilà! Visit [localhost:3000](http://localhost:3000) to see everything in action.

### For the production server...

Ensure all the proper environment variables are present, and then run:

```
npm start
```
