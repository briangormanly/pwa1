self.addEventListener('install', (e) => {
  console.log('V1.1 installing…');

});

self.addEventListener('activate', (e) => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', (e) => {
  console.log('Fetch Event: ' + e.request.url)


});


self.addEventListener('push', (e) => {
  console.log('getting a message!');
  let n = self.registration.showNotification('A notification from the service worker');
  e.waitUntil(n);
  console.log('Push Received!');
});
