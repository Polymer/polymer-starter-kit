![](https://cloud.githubusercontent.com/assets/110953/7877439/6a69d03e-0590-11e5-9fac-c614246606de.png)
## Polymer Starter Kit

> A starting point for building web applications with Polymer 1.0

### Included out of the box:

* [Polymer](https://www.polymer-project.org/), [Paper](https://elements.polymer-project.org/browse?package=paper-elements), [Iron](https://elements.polymer-project.org/browse?package=iron-elements) elements
* Initial design with [app-layout](https://polymerelements.github.io/app-layout/) elements 
* Routing with [app-route](https://www.polymer-project.org/1.0/toolbox/app-layout)
* Unit testing with [Web Component Tester](https://github.com/Polymer/web-component-tester)
* End-to-end build and optional offline setup through [polymer-build](https://github.com/Polymer/polymer-build)

## Getting Started

To take advantage of Polymer Starter Kit you need to:

1. Get a copy of the code.
2. Install the dependencies if you don't already have them.
3. Modify the application to your liking.
4. Deploy your production code.

### Get the code

[Download](https://github.com/polymerelements/polymer-starter-kit/releases/latest) and extract Polymer Starter Kit to where you want to work.

:warning: **Important**: Polymer Starter Kit contains dotfiles (files starting with a `.`). If you're copying the contents of the Starter Kit to a new location make sure you bring along these dotfiles as well! On Mac, [enable showing hidden files](http://ianlunn.co.uk/articles/quickly-showhide-hidden-files-mac-os-x-mavericks/), then try extracting/copying Polymer Starter Kit again. This time the dotfiles needed should be visible so you can copy them over without issues.

### Install dependencies

#### Quick-start (for experienced users)

With Node.js installed, run the following one liner from the root of your Polymer Starter Kit download:

```sh
npm install -g gulp bower polymer-cli && npm install && bower install
```

#### Prerequisites (for everyone)

The full starter kit requires the following major dependencies:

- Node.js, used to run JavaScript tools from the command line.
- npm, the node package manager, installed with Node.js and used to install Node.js packages.
- gulp, a Node.js-based build tool.
- bower, a Node.js-based package manager used to install front-end packages (like Polymer).
- polymer-cli, for running the local dev server
- The starter kit gulp build process uses platform specific tools which is handled by node-gyp which is included in node.js. See https://github.com/nodejs/node-gyp/blob/master/README.md for additional platform specific dependencies.

**To install dependencies:**

1)  Check your Node.js version.

```sh
node --version
```

The version should be at or above 0.4.x.

2)  If you don't have Node.js installed, or you have a lower version, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

3)  Install `gulp`, `bower`, `polymer-cli` globally.

```sh
npm install -g gulp bower polymer-cli
```

This lets you run `gulp` and `bower` from the command line and use the local dev server in `polymer-cli`.

4)  Install the starter kit's local `npm` and `bower` dependencies.

```sh
cd polymer-starter-kit && npm install && bower install
```

This installs the element sets (Paper, Iron, App Layout, and App Route) and tools the starter kit requires to build and serve apps.

### Development workflow

#### Serve

```sh
polymer serve --open
```

This will run a local server and open the `index.html` in your default browser

#### Run tests

```sh
polymer test
```

This runs the unit tests defined in the `test` directory through [web-component-tester](https://github.com/Polymer/web-component-tester).

To run tests Java 7 or higher is required. To update Java go to http://www.oracle.com/technetwork/java/javase/downloads/index.html and download ***JDK*** and install it.

#### Build & Vulcanize

```sh
gulp
```

Build and optimize the current project, ready for deployment. This includes vulcanization, image, script, stylesheet and HTML optimization and minification.
While it is also possible to build the project using the `polymer build` command, PSK ships with a gulpfile which uses the `polymer-build` library directly.
`polymer-build` does the same work as the Polymer CLI's `build` command, but also provides hooks for developers to add their own tasks. This means you can
extend the build process to include additional transpilers like Babel or TypeScript, preprocessors like SASS and Autoprefixer, and minifier like imagemin. 

## Application Theming & Styling

Polymer 1.0 uses CSS custom properties for theming. You can [read more about CSS custom properties on the polymer-project.org](https://www.polymer-project.org/1.0/docs/devguide/styling.html).

## Unit Testing

Web apps built with Polymer Starter Kit come configured with support for [Web Component Tester](https://github.com/Polymer/web-component-tester) - Polymer's preferred tool for authoring and running unit tests. This makes testing your element based applications a pleasant experience.

[Read more](https://github.com/Polymer/web-component-tester#html-suites) about using Web Component tester.

## Dependency Management

Polymer uses [Bower](http://bower.io) for package management. This makes it easy to keep your elements up to date and versioned. For tooling, we use npm to manage Node.js-based dependencies.

## Deploy

### Firebase

[See this Polycast on using Polymer CLI and deploying to Firebase](https://www.youtube.com/watch?v=pj2lmXVa84U)

## Frequently Asked Questions

### Where do I customise my application theme?

Theming can be achieved using [CSS Custom properties](https://www.polymer-project.org/1.0/docs/devguide/styling.html#xscope-styling-details). Take a look at [https://github.com/PolymerElements/polymer-starter-kit/blob/master/src/psk-app.html](src/psk-app.html) for an example.

A [Polycast](https://www.youtube.com/watch?v=omASiF85JzI) is also available that walks through theming using Polymer 1.0.

### Where do I configure routes in my application?

This can be done via the app-route element in `src/psk-app`. If you're new to app-route [check out the guide on polymer-project.org](https://www.polymer-project.org/1.0/toolbox/routing).

### Something has failed during installation. How do I fix this?

Our most commonly reported issue is around system permissions for installing Node.js dependencies.
We recommend following the [fixing npm permissions](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)
guide to address any messages around administrator permissions being required. If you use `sudo`
to work around these issues, this guide may also be useful for avoiding that.

If you run into an exception that mentions five optional dependencies failing (or an `EEXIST` error), you
may have run into an npm [bug](https://github.com/npm/npm/issues/6309). We recommend updating to npm 2.11.0+
to work around this. You can do this by opening a Command Prompt/terminal and running `npm install npm@2.11.0 -g`. If you are on Windows,
Node.js (and npm) may have been installed into `C:\Program Files\`. Updating npm by running `npm install npm@2.11.0 -g` will install npm
into `%AppData%\npm`, but your system will still use the npm version. You can avoid this by deleting your older npm from `C:\Program Files\nodejs`
as described [here](https://github.com/npm/npm/issues/6309#issuecomment-67549380).

If you get a browser console error indicating that an element you know you have installed is missing, try deleting the bower_components folder, then run `bower cache clean` followed by `bower install` to reinstall. This can be especially helpful when upgrading from a prior version of the Polymer Starter Kit.

If the issue is to do with a failure somewhere else, you might find that due to a network issue
a dependency failed to correctly install. We recommend running `npm cache clean` and deleting the `node_modules` directory followed by
`npm install` to see if this corrects the problem. If not, please check the [issue tracker](https://github.com/PolymerElements/polymer-starter-kit/issues) in case
there is a workaround or fix already posted.

### How do I add new files to Starter Kit so they're picked up by the build process?

Any files added to the `src` directory will be picked up by the build process.

## Licensing

Like other Google projects, Polymer Starter Kit includes Google license headers at the top of several of our source files. Google's open-source licensing requires that this header be kept in place (sorry!), however we acknowledge that you may need to add your own licensing to files you modify. This can be done by appending your own extensions to these headers.

## Contributing

Polymer Starter Kit is a new project and is an ongoing effort by the Web Component community. We welcome your bug reports, PRs for improvements, docs and anything you think would improve the experience for other Polymer developers.
