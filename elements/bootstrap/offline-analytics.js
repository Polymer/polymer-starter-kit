/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  var OFFLINE_ANALYTICS_DB_NAME = 'offline-analytics';
  var EXPIRATION_TIME_DELTA = 86400000; // One day, in milliseconds.
  var ORIGIN = /https?:\/\/((www|ssl)\.)?google-analytics\.com/;

  function replayQueuedAnalyticsRequests() {
    global.simpleDB.open(OFFLINE_ANALYTICS_DB_NAME).then(function(db) {
      db.forEach(function(url, originalTimestamp) {
        var timeDelta = Date.now() - originalTimestamp;
        // See https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
        var replayUrl = url + '&qt=' + timeDelta;

        console.log('About to replay:', replayUrl);
        global.fetch(replayUrl).then(function(response) {
          if (response.status >= 500) {
            // This will cause the promise to reject, triggering the .catch() function.
            return Response.error();
          }

          console.log('Replay succeeded:', replayUrl);
          db.delete(url);
        }).catch(function(error) {
          if (timeDelta > EXPIRATION_TIME_DELTA) {
            // After a while, Google Analytics will no longer accept an old ping with a qt=
            // parameter. The advertised time is ~4 hours, but we'll attempt to resend up to 24
            // hours. This logic also prevents the requests from being queued indefinitely.
            console.error('Replay failed, but the original request is too old to retry any ' +
              'further. Error:', error);
            db.delete(url);
          } else {
            console.error('Replay failed, and will be retried the next time the service worker ' +
              'starts. Error:', error);
          }
        });
      });
    });
  }

  function queueFailedAnalyticsRequest(request) {
    console.log('Queueing failed request:', request);

    global.simpleDB.open(OFFLINE_ANALYTICS_DB_NAME).then(function(db) {
      db.set(request.url, Date.now());
    });
  }

  function handleAnalyticsCollectionRequest(request) {
    return global.fetch(request).then(function(response) {
      if (response.status >= 500) {
        // This will cause the promise to reject, triggering the .catch() function.
        // It will also result in a generic HTTP error being returned to the controlled page.
        return Response.error();
      } else {
        return response;
      }
    }).catch(function() {
      queueFailedAnalyticsRequest(request);
    });
  }

  global.toolbox.router.get('/collect', handleAnalyticsCollectionRequest, {origin: ORIGIN});
  global.toolbox.router.get('/analytics.js', global.toolbox.networkFirst, {origin: ORIGIN});

  replayQueuedAnalyticsRequests();
})(self);
