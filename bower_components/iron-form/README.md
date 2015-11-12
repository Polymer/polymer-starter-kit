
<!---

This README is automatically generated from the comments in these files:
iron-form.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

-->

[![Build Status](https://travis-ci.org/PolymerElements/iron-form.svg?branch=master)](https://travis-ci.org/PolymerElements/iron-form)

_[Demo and API Docs](https://elements.polymer-project.org/elements/iron-form)_


##&lt;iron-form&gt;


``<iron-form>` is an HTML `<form>` element that can validate and submit any custom
elements that implement `Polymer.IronFormElementBehavior`, as well as any
native HTML elements.

It supports both `get` and `post` methods, and uses an `iron-ajax` element to
submit the form data to the action URL.

  Example:

    <form is="iron-form" id="form" method="post" action="/form/handler">
      <paper-input name="name" label="name"></paper-input>
      <input name="address">
      ...
    </form>

By default, a native `<button>` element will submit this form. However, if you
want to submit it from a custom element's click handler, you need to explicitly
call the form's `submit` method.

  Example:

    <paper-button raised onclick="submitForm()">Submit</paper-button>

    function submitForm() {
      document.getElementById('form').submit();
    }

To customize the request sent to the server, you can listen to the `iron-form-presubmit`
event, and modify the form's[`iron-ajax`](https://elements.polymer-project.org/elements/iron-ajax)
object. However, If you want to not use `iron-ajax` at all, you can cancel the
event and do your own custom submission:

  Example of modifying the request, but still using the build-in form submission:
    form.addEventListener('iron-form-presubmit', function() {
      this.request.method = 'put';
      this.request.params = someCustomParams;
    });

  Example of bypassing the build-in form submission:
    form.addEventListener('iron-form-presubmit', function(event) {
      event.preventDefault();
      var firebase = new Firebase(form.getAttribute('action'));
      firebase.set(form.serialize());
    });


