self.custom203FetchHandler = function(request) {
  return new Response('', {
    status: 203,
    statusText: 'Via customFetchHandler'
  });
};

self.custom410FetchHandler = function(request) {
  return new Response('', {
    status: 410,
    statusText: 'Via customFetchHandler'
  });
};
