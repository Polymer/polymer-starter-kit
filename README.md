## Polymer Starter Kit

> A starting point for building web applications with Polymer

### High-level

* Polymer, Paper and Iron elements
* Material Design Grid & Breakpoints
* App theming using Polymer custom props
* Offline-first through Service Worker elements
* Responsive App layout boilerplate
* End-to-end Build Tooling (including Vulcanize)
* Unit testing with Web Component Tester
* Routing with Page.js

### Instructions

With Node and npm installed, run:

```sh
$ npm install -g gulp && npm install -g bower && npm install && bower install
```

### Serve / watch

```sh
$ gulp serve
```

### Run tests

```sh
$ gulp test:local
```

### Build / vulcanize

```sh
$ gulp
```

### Service Worker

Polymer Starter Kit offers an offline-first experience thanks to Service Worker, [sw-precache](https://github.com/GoogleChrome/sw-precache) and the [Platinum Service Worker elements](https://github.com/PolymerElements/platinum-sw). New to Service Worker? Read the following [introduction](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) to understand how it works.

Our default offline setup should work well for relatively simple applications. For more complex apps, we recommend learning how Service Worker works so that you can make the most of the Platinum Service Worker element abstractions. 

### Filing bugs in the right place

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

#### Not yet ready for Service Worker support?

If for any reason you decide that Service Worker support isn't for you, you can disable it from your Polymer Starter Kit project using these 3 steps:

* Remove 'precache' from the list in the 'default' gulp task ([gulpfile.js](https://github.com/PolymerElements/polymer-starter-kit/blob/master/gulpfile.js)) 
* Remove the two Platinum Service Worker elements (platinum-sw/..) in [app/elements/elements.html](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/elements/elements.html)
* Remove references to the platinum-sw elements from your application [index](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/index.html). 

You will also want to navigate to `chrome://serviceworker-internals` and unregister any Service Workers registered by Polymer Starter Kit for your app just in case there's a copy of it cached. 

