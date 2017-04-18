// Provides an equivalent to navigator.serviceWorker.ready that waits for the page to be controlled,
// as opposed to waiting for the active service worker.
// See https://github.com/slightlyoff/ServiceWorker/issues/799
window._controlledPromise = new Promise(function(resolve) {
  // Resolve with the registration, to match the .ready promise's behavior.
  var resolveWithRegistration = function() {
    navigator.serviceWorker.getRegistration().then(function(registration) {
      resolve(registration);
    });
  };

  if (navigator.serviceWorker.controller) {
    resolveWithRegistration();
  } else {
    navigator.serviceWorker.addEventListener('controllerchange', resolveWithRegistration);
  }
});
