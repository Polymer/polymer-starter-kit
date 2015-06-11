![](https://cloud.githubusercontent.com/assets/110953/7877439/6a69d03e-0590-11e5-9fac-c614246606de.png)
## Polymer Starter Kit

> A starting point for building web applications with Polymer 1.0

### Included out of the box:

* [Polymer](http://polymer-project.org), [Paper](https://elements.polymer-project.org/browse?package=paper-elements) and [Iron](https://elements.polymer-project.org/browse?package=iron-elements) elements
* [Material Design](http://www.google.com/design/spec/material-design/introduction.html) layout
* Routing with [Page.js](https://visionmedia.github.io/page.js/)
* Unit testing with Web Component Tester
* Optional offline setup through [Platinum](https://elements.polymer-project.org/browse?package=platinum-elements) Service Worker elements
* End-to-end Build Tooling (including [Vulcanize](https://github.com/Polymer/vulcanize))

## Getting Started

To take advantage of Polymer Starter Kit you need to:

1. Get a copy of the code.
2. Install the dependencies if you don't already have them.
3. Modify the application to your liking.
4. Deploy your production code.

### Get the code

[Download](https://github.com/polymerelements/polymer-starter-kit/releases/latest) and extract Polymer Starter Kit to where you want to work.

The standard version of Polymer Starter Kit comes with tools that are very handy when developing a Polymer app. If you'd like to get started without installing any new tools, see Polymer Starter Kit Light in the [Releases](https://github.com/polymerelements/polymer-starter-kit/releases/latest) page.

### Install dependencies

#### Quick-start (for experienced users)

With Node.js installed, run the following one liner from the root of your Polymer Starter Kit download:

```sh
npm install -g gulp bower && npm install && bower install
```

#### Prerequisites (for everyone)

The full starter kit requires the following major dependencies:

- Node.js, used to run JavaScript tools from the command line.
- npm, the node package manager, installed with Node.js and used to install Node.js packages.
- gulp, a Node.js-based build tool.
- bower, a Node.js-based package manager used to install front-end packages (like Polymer).

**To install dependencies:**

1)  Check your Node.js version.

```sh
node --version
```

The version should be at or above 0.12.x.

2)  If you don't have Node.js installed, or you have a lower version, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

3)  Install `gulp` and `bower` globally.

```sh
npm install -g gulp bower
```

This lets you run `gulp` and `bower` from the command line.

4)  Install the starter kit's local `npm` and `bower` dependencies.

```sh
cd polymer-starter-kit && npm install && bower install
```

This installs the element sets (Paper, Iron, Platinum) and tools the starter kit requires to build and serve apps.

### Development workflow

#### Serve / watch

```sh
gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices connected to your network.

#### Run tests

```sh
gulp test:local
```

This runs the unit tests defined in the `app/test` directory through [web-component-tester](https://github.com/Polymer/web-component-tester).

#### Build & Vulcanize

```sh
gulp
```

Build and optimize the current project, ready for deployment. This includes linting as well as vulcanization, image, script, stylesheet and HTML optimization and minification. Outputs code to dist folder.

#### Build, Vulcanize & Serve

```sh
gulp serve:dist
```

Build and optimize the current project, serves built code from dist folder. This includes linting as well as vulcanization, image, script, stylesheet and HTML optimization and minification.

## Application Theming

Polymer 1.0 introduces a shim for CSS custom properties. We take advantage of this in `app/styles/app-theme.html` to provide theming for your application. You can also find our presets for Material Design breakpoints in this file.

[Read more](https://www.polymer-project.org/1.0/docs/devguide/styling.html) about CSS custom properties.

## Unit Testing

Web apps built with Polymer Starter Kit come configured with support for [Web Component Tester](https://github.com/Polymer/web-component-tester) - Polymer's preferred tool for authoring and running unit tests. This makes testing your element based applications a pleasant experience.

[Read more](https://github.com/Polymer/web-component-tester#html-suites) about using Web Component tester.

## Dependency Management

Polymer uses [Bower](http://bower.io) for package management. This makes it easy to keep your elements up to date and versioned. For tooling, we use npm to manage Node.js-based dependencies.

## Service Worker

Polymer Starter Kit offers an optional offline experience thanks to Service Worker and the [Platinum Service Worker elements](https://github.com/PolymerElements/platinum-sw). New to Service Worker? Read the following [introduction](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) to understand how it works.

Our optional offline setup should work well for relatively simple applications. For more complex apps, we recommend learning how Service Worker works so that you can make the most of the Platinum Service Worker element abstractions.

### Enable Service Worker support?

To enable Service Worker support for Polymer Starter Kit project use these 3 steps:

1. Uncomment Service Worker code in index.html
  ```HTML
  <!-- Uncomment next block to enable Service Worker support (1/2) -->
  <!--
  <paper-toast id="caching-complete"
               duration="6000"
               text="Caching complete! This app will work offline.">
  </paper-toast>

  <platinum-sw-register auto-register
                        clients-claim
                        skip-waiting
                        on-service-worker-installed="displayInstalledToast">
    <platinum-sw-cache default-cache-strategy="networkFirst"
                       precache-file="precache.json">
    </platinum-sw-cache>
  </platinum-sw-register>
  -->
  ```
1. Uncomment Service Worker code in elements.html
  
  ```HTML
  <!-- Uncomment next block to enable Service Worker Support (2/2) -->
  <!--
  <link rel="import" href="../bower_components/platinum-sw/platinum-sw-cache.html">
  <link rel="import" href="../bower_components/platinum-sw/platinum-sw-register.html">
  -->
  ```
1. Add 'precache' to the list in the 'default' gulp task like below.
[(gulpfile.js)](https://github.com/PolymerElements/polymer-starter-kit/blob/master/gulpfile.js)  
  
  ```HTML
  // Build Production Files, the Default Task
  gulp.task('default', ['clean'], function (cb) {
    runSequence(
      ['copy', 'styles'],
      'elements',
      ['jshint', 'images', 'fonts', 'html'],
      'vulcanize', 'precache',
      cb);
  });
  ```

#### Filing bugs in the right place

If you experience an issue with Service Worker support in your application, check the origin of the issue and use the appropriate issue tracker:

* [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox/issues)
* [platinum-sw](https://github.com/PolymerElements/platinum-sw/issues)
* [platinum-push-notifications-manager](https://github.com/PolymerElements/push-notification-manager/)
* For all other issues, feel free to file them [here](https://github.com/polymerelements/polymer-starter-kit/issues).

#### I get an error message about "Only secure origins are allowed"

Service Workers are only available to "secure origins" (HTTPS sites, basically) in line with a policy to prefer secure origins for powerful new features. However http://localhost is also considered a secure origin, so if you can, developing on localhost is an easy way to avoid this error. For production, your site will need to support HTTPS.

#### How do I debug Service Worker?

If you need to debug the event listener wire-up use `chrome://serviceworker-internals`.

#### What are those buttons on chrome://serviceworker-internals?

This page shows your registered workers and provides some basic operations.

* Unregister: Unregisters the worker.
* Start: Starts the worker. This would happen automatically when you navigate to a page in the worker's scope.
* Stop: Stops the worker.
* Sync: Dispatches a 'sync' event to the worker. If you don't handle this event, nothing will happen.
* Push: Dispatches a 'push' event to the worker. If you don't handle this event, nothing will happen.
* Inspect: Opens the worker in the Inspector.

#### Development flow

In order to guarantee that the latest version of your Service Worker script is being used, follow these instructions:

* After you made changes to your service worker script, close all but one of the tabs pointing to your web application
* Hit shift-reload to bypass the service worker as to ensure that the remaining tab isn't under the control of a service worker
* Hit reload to let the newer version of the Service Worker control the page.

If you find anything to still be stale, you can also try navigating to `chrome:serviceworker-internals` (in Chrome), finding the relevant Service Worker entry for your application and clicking 'Unregister' before refreshing your app. This will (of course) only clear it from the local development machine. If you have already deployed to production then further work will be necessary to remove it from your user's machines.

#### Disable Service Worker support after you enabled it

If for any reason you need to disable Service Worker support after previously enabling it, you can remove it from your Polymer Starter Kit project using these 4 steps:

1. Remove references to the platinum-sw elements from your application [index](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/index.html).
1. Remove the two Platinum Service Worker elements (platinum-sw/..) in [app/elements/elements.html](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/elements/elements.html)
1. Remove 'precache' from the list in the 'default' gulp task ([gulpfile.js](https://github.com/PolymerElements/polymer-starter-kit/blob/master/gulpfile.js))
1. Navigate to `chrome://serviceworker-internals` and unregister any Service Workers registered by Polymer Starter Kit for your app just in case there's a copy of it cached.

## Yeoman support

[generator-polymer](https://github.com/yeoman/generator-polymer/releases) now includes support for Polymer Starter Kit out of the box.

## Frequently Asked Questions

> Where do I customise my application theme?

Theming can be achieved using [CSS Custom properties](https://www.polymer-project.org/1.0/docs/devguide/styling.html#xscope-styling-details) via [app/styles/app-theme.html](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/styles/app-theme.html).
You can also use `app/styles/main.css` for pure CSS stylesheets (e.g for global styles), however note that Custom properties will not work there under the shim.

A [Polycast](https://www.youtube.com/watch?v=omASiF85JzI) is also available that walks through theming using Polymer 1.0.

> Where do I configure routes in my application?

This can be done via [`app/elements/routing.html`](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/elements/routing.html). We use Page.js for routing and new routes
can be defined in this import. We then toggle which `<iron-pages>` page to display based on the [selected](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/index.html#L105) route.

> Why are we using Page.js rather than a declarative router like `<more-routing>`?

`<more-routing>` (in our opinion) is good, but lacks imperative hooks for getting full control
over the routing in your application. This is one place where a pure JS router shines. We may
at some point switch back to a declarative router when our hook requirements are tackled. That
said, it should be trivial to switch to `<more-routing>` or another declarative router in your
own local setup.

> Where can I find the application layouts from your Google I/O 2015 talk?

App layouts live in a separate repository called [app-layout-templates](https://github.com/PolymerElements/app-layout-templates).
You can select a template and copy over the relevant parts you would like to reuse to Polymer Starter Kit.

You will probably need to change paths to where your Iron and Paper dependencies can be found to get everything working.
This can be done by adding them to the [`elements.html`](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/elements/elements.html) import.

> Something has failed during installation. How do I fix this?

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

If the issue is to do with a failure somewhere else, you might find that due to a network issue
a dependency failed to correctly install. We recommend running `npm cache clean` and deleting the `node_modules` directory followed by
`npm install` to see if this corrects the problem. If not, please check the [issue tracker](https://github.com/PolymerElements/polymer-starter-kit/issues) in case
there is a workaround or fix already posted.


> I'm having trouble getting Vulcanize to fully build my project on Windows. Help?

Some Windows users have run into trouble with the `elements.vulcanized.html` file in their `dist` folder
not being correctly vulcanized. This can happen if your project is in a folder with a name containing a
space. You can work around this issue by ensuring your path doesn't contain one.

There is also an [in-flight](https://github.com/PolymerElements/polymer-starter-kit/issues/62#issuecomment-108974016) issue
where some are finding they need to disable the `inlineCss` option in our configuration for Vulcanize
to correctly build. We are still investigating this, however for the time-being use the workaround if
you find your builds getting stuck here.


> How do I add new JavaScript files to Starter Kit so they're picked up by the build process?

At the bottom of `app/index.html`, you will find a build block that can be used to include additional
scripts for your app. Build blocks are just normal script tags that are wrapped in a HTML
comment that indicates where to concatenate and minify their final contents to.

Below, we've added in `script2.js` and `script3.js` to this block. The line
`<!-- build:js scripts/app.js -->` specifies that these scripts will be squashed into `scripts/app.js`
during a build.

```html
<!-- build:js scripts/app.js -->
<script src="scripts/app.js"></script>
<script src="scripts/script2.js"></script>
<script src="scripts/script3.js"></script>
<!-- endbuild-->
```

> I'm finding the installation/tooling here overwhelming. What should I do?

Don't worry! We've got your covered. Polymer Starter Kit tries to offer everything you need to build and optimize your apps for production, which is why we include the tooling we do. We realise however that our tooling setup may not be for everyone.

If you find that you just want the simplest setup possible, we recommend using Polymer Starter Kit light, which is available from the [Releases](https://github.com/PolymerElements/polymer-starter-kit/releases) page. This takes next to no time to setup.

## Contributing

Polymer Starter Kit is a new project and is an ongoing effort by the Web Component community. We welcome your bug reports, PRs for improvements, docs and anything you think would improve the experience for other Polymer developers.
