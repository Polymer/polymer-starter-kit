
<!---

This README is automatically generated from the comments in these files:
platinum-https-redirect.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

_[Demo and API docs](https://elements.polymer-project.org/elements/platinum-https-redirect)_


##&lt;platinum-https-redirect&gt;

The `<platinum-https-redirect>` element redirects the current page to HTTPS, unless the page is
loaded from a web server running on `localhost`.

Using [HTTP Strict Transport Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
(HSTS) can be used to enforce HTTPS for an entire
[origin](https://html.spec.whatwg.org/multipage/browsers.html#origin), following the first visit to
any page on the origin. Configuring the underlying web server to
[redirect](https://en.wikipedia.org/wiki/HTTP_301) all HTTP requests to their HTTPS equivalents
takes care of enforcing HTTPS on the initial visit as well.
Both options provide a more robust approach to enforcing HTTPS, but require access to the underlying
web server's configuration in order to implement.

This element provides a client-side option when HSTS and server-enforced redirects aren't possible,
such as when deploying code on a shared-hosting provider like
[GitHub Pages](https://pages.github.com/).

It comes in handy when used with other `<platinum-*>` elements, since those elements use
[features which are restricted to HTTPS](http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features),
with an exception to support local web servers.

It can be used by just adding it to any page, e.g.

```html
<platinum-https-redirect></platinum-https-redirect>
```


