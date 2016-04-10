### Polymer Performance Recipe

In the following write up we are going to take a look at how to optimize the loading of Web Component enabled websites. The goal here is not to give you a copy and paste approach, but rather to give you the starting components and thought process with how to optimize your web app given your domain constraints.

Current native support for Web Components is limited but growing, with only Chrome and Opera having a “fully" implemented spec. Due to the limited support, using Polymer or any web components in production across more than just Chrome requires you to load a polyfill. As with any polyfill there is a performance tradeoff, in the run time performance, spec compliance, as well as the network cost overhead. Lets dive into a few approaches that you can use to conditionally load the polyfill only when it is required.

In your index.html file, create an HTML Import to load your elements bundle. If Web Components are supported, this element will start loading right away, otherwise it will begin loading as soon as the Web Components polyfills have been loaded and given a chance to scan the page.

Note the use of the `async` attribute on the `link` element. This will ensure that loading the bundle does not block rendering in any way. Also note the `link` element has been given the `id` "bundle," this can be used later to listen for its load event.

```html
<link rel="import" id="bundle" href="/elements/elements.html" async>
```

Next we need to detect if Web Components are supported by the browser. If it _does_ support them, then we can skip loading the polyfills entirely. Otherwise, we'll use JavaScript to asynchronously load the polyfills.

Over in GitHub land @geenlen has cooked up a nifty bit of code to feature detect Web Components support

```js
var webComponentsSupported = ('registerElement' in document
  && 'import' in document.createElement('link')
  && 'content' in document.createElement('template'));
```

```js
if (!webComponentsSupported) {
  var script = document.createElement('script');
  script.onload = finishLazyLoading;
  script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
  document.head.appendChild(script);
} else {
  finishLazyLoading();
}
```

This bit of code can be placed directly in [`app.js`](https://github.com/PolymerElements/polymer-starter-kit/blob/master/app/scripts/app.js), right under the beginning of the IIFE.

So what is going on here, how does it work? The first thing that this method does is dynamically create a script tag, then assigns a callback when the resource loads, the code then sets the src of the script tag, and then injects the script tag into the head of our document. Once the tag is placed inside of our document, the network request will start and when the resource is fully downloaded the callback will be invoked.

Awesome! So now let’s move onto the logic around `finishLazyLoading`.

```js
function finishLazyLoading() {

  var onImportLoaded = function() {
    console.log('Elements are upgraded!');
    // Kickoff your app logic here!
  };

  var link = document.querySelector('#bundle');

  if (link.import && link.import.readyState === 'complete') {
    onImportLoaded();
  } else {
    link.addEventListener('load', onImportLoaded);
  }
}
```

`finishLazyLoading` checks to see if the import has finished loading and calls the `onImportLoaded` handler if it is. `onImportLoaded` is a good place to put your initial application logic because by this point you can be confident that all of your elements are ready. If the import hast not loaded, then we'll setup a listener for the load event of the `link` element and run `onImportLoaded` then.

As an alternative to having the `link` tag for your imports already in the page, you could choose to load them dynamically.

```js
function loadElements(pathToBundle, callback) {
  var bundle = document.createElement('link');
  bundle.setAttribute('async', true);
  bundle.rel = 'import';
  bundle.onload = callback;
  bundle.href = pathToBundle;

  document.head.appendChild(bundle);
}
```

The `loadElements` function uses a similar approach to the one we used to load our polyfills. Note that the user should pass in a callback which will execute once the bundle has finished loading.

For initial page load there is a slight performance tradeoff for going this route in browsers with Web Components support as it means the page must wait on JavaScript to execute before it can begin loading the elements.

However, this approach does open up the possibility for you to only have users download the elements that they need for specific pages in your app, and can be extremely useful for subsequent page loads. Consider for instance an application with an admin panel and a general app view. Given the fact that most users in our made up app do not go to the admin panel too often, there is no need for them to always incur the cost of downloading the admin suite of elements. Instead we will only have users download the "bundle" that they need depending on what page they navigate to.

For example with page.js your router could be structured as follows to optimize page load time, given a few assumptions about how users will be interacting with your app.

```js
page.on('admin', function() {
  loadElementBundle('elements/admin.html', renderAdminPane);
});
```

#### Further Thoughts

With Polymer, it is easy to fall into the trap of getting a flash of unstyled content, or a blank page while the polyfill and elements are downloading. The best way to avoid these pitfalls is to use a "loading" screen approach. The simplest of the loading approaches is to create a "splash" screen to display while your elements bundle is downloading. The splash screen can be anything from your logo on a colored background, to a full blown skeleton of what the page will look like once everything has loaded up.

In your index.html, place the markup for your splashscreen in an element with an `id` of "splash".

```html
<div id="splash">
  <!-- splash screen markup -->
</div>
```

You can easily modify `onImportLoaded` to remove the splash screen once your bundle has loaded in.

```js
var onImportLoaded = function() {
  var splash = document.getElementById('splash');
  splash.remove();

  console.log('Elements are upgraded!');
  // Kickoff your app logic here!
};
```

Hopefully these approaches give you some ideas on how to make your app lightning fast.

We hope to explore further ideas including [application shells](https://github.com/ebidel/polymer-experiments/blob/master/polymersummit/fouc/appshell.html) and being smart about your first meaningful paint in the near future.

--------

Further reading

* [Fast Polymer app loading](https://gist.github.com/ebidel/1ba71473d687d0567bd3) from Eric Bidelman
* [Polymer Perf Patterns](https://www.youtube.com/watch?v=Yr84DpNaMfk) from Eric Bidelman
* [Polymer for the Performance-obsessed](https://aerotwist.com/blog/polymer-for-the-performance-obsessed/) from Paul Lewis
