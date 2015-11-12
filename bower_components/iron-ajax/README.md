iron-ajax
=========

The `iron-ajax` element exposes network request functionality.

```html
<iron-ajax auto
    url="https://www.googleapis.com/youtube/v3/search"
    params='{"part":"snippet", "q":"polymer", "key": "AIzaSyAuecFZ9xJXbGDkQYWBmYrtzOGJD-iDIgI", "type": "video"}'
    handle-as="json"
    last-response="{{ajaxResponse}}"></iron-ajax>
```

With `auto` set to `true`, the element performs a request whenever
its `url`, `params` or `body` properties are changed. Automatically generated
requests will be debounced in the case that multiple attributes are changed
sequentially.

Note: The `params` attribute must be double quoted JSON.

You can trigger a request explicitly by calling `generateRequest` on the
element.
