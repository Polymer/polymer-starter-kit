# Add Push Notifications with platinum-push-messaging

This recipe helps you add push messaging capabilities to your Polymer Web App using the  `platinum-push-messaging` elements.

This recipe shows you the basics to get platinum push messaging running on your polymer app.
You will need a back-end server running to send push messages to multiple devices and to manage subscriptions.

The Platinum Push Messaging elements use service workers to send push messages via [Google Cloud Messaging](https://developers.google.com/cloud-messaging/).

Service Workers are only available to "secure origins" (HTTPS sites, basically) in line with a policy to prefer secure origins for powerful new features. However http://localhost is also considered a secure origin, so if you can, developing on localhost is an easy way to avoid this error. For production, your site will need to support HTTPS.

You will also need to add a UI to enable users to opt to receive push notifications. For this we will be using a `paper-toggle-button`

## Update your dependencies

- First, you'll need to import the `paper-toggle-button` and `platinum-push-messaging` elements in your `app/elements/elements.html`
```patch
+ <link rel="import" href="../bower_components/paper-toggle-button/paper-toggle-button.html">
...
+
+ <!-- Platinum Push Messaging element -->
+ <link rel="import" href="../bower_components/platinum-push-messaging/platinum-push-messaging.html">
+
```

## Add the UI
- Add the `paper-toggle-button` in `app/index.html`
```patch
+ <paper-toggle-button id="enable-push" toggles disabled></paper-toggle-button>
```

## Add the platinum push messaging element
- Add the push messaging element to your `app/index.html`
```patch
    </platinum-sw-register>
    -->
+   <platinum-push-messaging
+       message-url="notification-data.json"
+       worker-url="ppm-import.js"></platinum-push-messaging>
</template>
```
- `message-url`: The path where the push messaging element looks for the data to be shown in the notifications. This field is required at the moment.
- `worker-url`: The relative path where the Service Worker lies. PSK includes `sw-import.js` for `platinum-sw` elements by default. You need to add this to make it work after vulcanizing.

## Add notification data
- Create a file and add the data you want to show in the notification in `app/notification-data.json`
```patch
+ {
+   "message": "This is Message",
+   "tag": "test push notification",
+   "title": "This is Title",
+   "url": "redirect/url"
+ }
```

## Create the service worker import file
-  Create a file `app/ppm-import.js` and add this line in the file
```patch
+ importScripts('bower_components/platinum-push-messaging/service-worker.js');
```

## Add platinum push messaging to gulp copy task
- In `gulpfile.js`, add `platinum-push-messaging` elements in the copy task
- We do this to copy over the platinum push messaging elements as-is without vulcanizing, for the service-worker
```patch

// Copy all files at the root level (app)
gulp.task('copy', function() {
  var app = gulp.src([
    'app/*',
    '!app/test',
    '!app/elements',
    '!app/bower_components',
    '!app/cache-config.json',
    '!**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src([
-    'app/bower_components/{webcomponentsjs,platinum-sw,sw-toolbox,promise-polyfill}/**/*'
+    'app/bower_components/{webcomponentsjs,platinum-sw,sw-toolbox,promise-polyfill,platinum-push-messaging}/**/*'
  ]).pipe(gulp.dest(dist('bower_components')));

  return merge(app, bower)
    .pipe($.size({
      title: 'copy'
    }));
});
```

## Add the logic to register user for notifications
- Add the following code inside the `WebComponentsReady` event listener
```patch
// See https://github.com/Polymer/polymer/issues/1381
window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
+   var ppm = document.querySelector('platinum-push-messaging');
+   var toggle = document.getElementById('enable-push');
+
+   //Enables or disables toggle button based on browser support
+   toggle.disabled = !ppm.supported;
+
+   //Listener to enable or disable ppm when button is toggled
+   toggle.addEventListener('change', function() {
+       if (toggle.checked) {
+           ppm.enable();
+       } else {
+           ppm.disable();
+       }
+   });
+
+   //Event Listeners on ppm element
+   ppm.addEventListener('subscription-changed', function(event) {
+       // GCM always needs the subscriptionId passed separately. Note that as of M45,
+       // the subscriptionId and the endpoint have merged.
+       var subscriptionId = ppm.subscription ? ppm.subscription.subscriptionId : undefined;
+       if (ppm.subscription && !ppm.subscription.subscriptionId) {
+           var endpointSections = ppm.subscription.endpoint.split('/');
+           subscriptionId = endpointSections[endpointSections.length - 1];
+       }
+
+       if (subscriptionId)
+           console.log(subscriptionId); //this is only for testing
+   });
+   
+   ppm.addEventListener('enabled-changed', function(event) {
+       toggle.checked = ppm.enabled;
+       <!--
+           Type your logic for storing device subscription ids on server here.
+           -->
+      
+   });
});
```
This code checks if push messaging is supported in the client's browser and handles the state of the toggle button accordingly. A Unique subscription id is created everytime a user subscribes to push notifications.

Your subscription id (`[REGISTRATION_ID]`) will be shown in the console. You will need it in the last step to send push notifications. This will not work if `app/manifest.json` isn't updated with the required data, which will be added in the next steps.

## Create Project on Google Developer Console to use GCM
- Head over to [this link](http://updates.html5rocks.com/2015/03/push-notificatons-on-the-open-web#make-a-project-on-the-google-developer-console) and follow the instructions under 'Make a Project on the Google Developer Console'. Once you've created the project in the console, make a note of the server API key (`[SERVER_PUBLIC_API_KEY]`) and project id, which will act as your `gcm_sender_id` (`[GCM_SENDER_ID]`)

## Edit Web App Manifest
- in `app/manifest.json` add `gcm_sender_id` and `gcm_user_visible_only` fields
```patch
    ...
    "theme_color": "#2E3AA1",
+   "gcm_sender_id": "[GCM_SENDER_ID]",
+   "gcm_user_visible_only": true
}
```

## Send Push Notifications!
You can now send a push notification to subscription id `[REGISTRATION_ID]` with this simple command on the terminal

`curl https://android.googleapis.com/gcm/send -d "registration_id=[REGISTRATION_ID]" --header "Authorization: key=[SERVER_PUBLIC_API_KEY]"`

 To send to multiple subscribers and to manage subscriptions, you will need to set up a server to store registration ids. Check out [Cat Push Notifications](https://github.com/notwaldorf/caturday-post/blob/master/public/index.html#L156) for example server code.