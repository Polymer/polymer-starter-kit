self.addEventListener('message', function(event) {
  event.ports[0].postMessage(event.data);
});
