#ES6 Boilerplate

A starting place for ES6 projects.

This repo contains a starting structure for writing well tested ECMAScript 6 applications.

##Tools

This repo comes packaged with [gulp](http://gulpjs.com/) tasks for transforming ES6 to ES5. The following tools are used:

* [browserify](http://browserify.org/) (with the babelify transformer)
* [babel](https://babeljs.io/) - for transforming ES6 code to ES5 so you can use it today!
* [jest](https://facebook.github.io/jest/) - for running unit tests

##Structure

The root level of the project contins the following directories and files:

* `lib/` - where your source code goes
* `gulp/` - where all the gulp tasks are kept
* `bootstrap.js` - this gets included into the test environment via jest
* `dist/` - where your final bundle goes
* `gulpfile.js` - the gulp entry point (shouldn't have to do anything with is)
* `package.json` - lists dev dependencies for the build process

After a build, the concatenated and minified browser export will be placed in the `dist` directory by default.

##Configuration

You can tweak gulp variables, like the source and dist directories, as well
as what paths to watch when running the gulp dev task.

##Building

Before building or testing, install all the deps:

```
npm i
```

There is an npm script you can run to build:

```
npm run build
```

Or to kick off the file watcher and build as you make changes, run the dev task:

```
npm run dev
```

##Testing

There is an npm script for that too!:

```
npm test
```

## Babel Polyfill

If you are creating a package for the browser, the babel polyfill for es6 features is exposed via the babelify transformer that is included. Just add it to your browser based module:

```js
require('babelify/polyfill');
```

There is a sample class and test included that you can run after cloning and doing `npm i`

##Suggestions? Improvements?

Please open issues or pull requests if you have bugs/improvements.