## Polymer Starter Kit

> A starting point for building web applications with Polymer

### High-level

* Demo elements updated to 0.8 syntax
* Bower: pulls in 0.8-previews for all core, paper elements used.
* Testing: updated to use `<test-fixture>`, latest WCT
* Vulcanize: gulp-vulcanize updated upstream, works fine w/0.8 here
* WebComponentsReady / unresolved handling baked in
* Layout using latest paper-*, iron-* elements

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

Copyright Google Inc. 2015. Released under an Apache-2 license.
