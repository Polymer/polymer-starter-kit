@component("my-greeting")
class MyGreeting extends polymer.Base {
   @property({notify: true})
   greeting:string = "Welcome!";
}
MyGreeting.register();

/*************************
(function() {
  Polymer({
    is: 'my-greeting',
    properties: {
      greeting: {
        type: String,
        value: 'Welcome!',
        notify: true
      }
    }
  });
})();
*************************/