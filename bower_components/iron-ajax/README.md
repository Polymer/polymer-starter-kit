
<!---

This README is automatically generated from the comments in these files:
iron-ajax.html  iron-request.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

-->

[![Build Status](https://travis-ci.org/PolymerElements/iron-ajax.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-ajax)

_[Demo and API Docs](https://elements.polymer-project.org/elements/iron-ajax)_


##&lt;iron-ajax&gt;


The `iron-ajax` element exposes network request functionality.

    <iron-ajax
        auto
        url="http://gdata.youtube.com/feeds/api/videos/"
        params='{"alt":"json", "q":"chrome"}'
        handle-as="json"
        on-response="handleResponse"
        debounce-duration="300"></iron-ajax>

With `auto` set to `true`, the element performs a request whenever
its `url`, `params` or `body` properties are changed. Automatically generated
requests will be debounced in the case that multiple attributes are changed
sequentially.

Note: The `params` attribute must be double quoted JSON.

You can trigger a request explicitly by calling `generateRequest` on the
element.



##&lt;iron-request&gt;


iron-request can be used to perform XMLHttpRequests.

    <iron-request id="xhr"></iron-request>
    ...
    this.$.xhr.send({url: url, params: params});

