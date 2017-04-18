
<!---

This README is automatically generated from the comments in these files:
platinum-push-messaging.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

-->

[![Build Status](https://travis-ci.org/PolymerElements/platinum-push-messaging.svg?branch=master)](https://travis-ci.org/PolymerElements/platinum-push-messaging)

_[Demo and API Docs](https://elements.polymer-project.org/elements/platinum-push-messaging)_


##&lt;platinum-push-messaging&gt;


`<platinum-push-messaging>` sets up a [push messaging][1] subscription
and allows you to define what happens when a push message is received.

The element can be placed anywhere, but should only be used once in a
page. If there are multiple occurrences, only one will be active.

# Sample

For a complete sample that uses the element, see the [Cat Push
Notifications][3] project.

# Requirements
Push messaging is currently only available in Google Chrome, which
requires you to configure Google Cloud Messaging. Chrome will check that
your page links to a manifest file that contains a `gcm_sender_id` field.
You can find full details of how to set all of this up in the [HTML5
Rocks guide to push notifications][1].

# Notification details
The data for how a notification should be displayed can come from one of
three places.

Firstly, you can specify a URL from which to fetch the message data.
```
<platinum-push-messaging
  message-url="notification-data.json">
</platinum-push-messaging>
```

The second way is to send the message data in the body of
the push message from your server. In this case you do not need to
configure anything in your page:
```
<platinum-push-messaging></platinum-push-messaging>
```
**Note that this method is not currently supported by any browser**. It
is, however, defined in the
[draft W3C specification](http://w3c.github.io/push-api/#the-push-event)
and this element should use that data when it is implemented in the
future.

If a message-url is provided then the message body will be ignored in
favor of the first method.

Thirdly, you can manually define the attributes on the element:
```
<platinum-push-messaging
  title="Application updated"
  message="The application was updated in the background"
  icon-url="icon.png"
  click-url="notification.html">
</platinum-push-messaging>
```
These values will also be used as defaults if one of the other methods
does not provide a value for that property.

# Testing
If you have set up Google Cloud Messaging then you can send push messages
to your browser by following the guide in the [GCM documentation][2].

However, for quick client testing there are two options. You can use the
`testPush` method, which allows you to simulate a push message that
includes a payload.

Or, at a lower level, you can open up chrome://serviceworker-internals in
Chrome and use the 'Push' button for the service worker corresponding to
your app.

[1]: http://updates.html5rocks.com/2015/03/push-notificatons-on-the-open-web
[2]: https://developer.android.com/google/gcm/http.html
[3]: https://github.com/notwaldorf/caturday-post


