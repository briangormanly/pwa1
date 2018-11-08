if(navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw/sw.js').then(function(registration) {
    console.log('SW Registered! again');

    // get the server public key
    let publicKey = 'BGgdKzBiaeRwYKs0bz1vx_3m1vuNVIsfefV5-fZZZcIywYspOPWpzaUSXyjwVm9qZMkxU-9MJPFCg3cYAQH9Iy0';


    registration.pushManager.getSubscription().then((sub) => {
      // if found return the subscription
      if(sub) return sub;

      //subscribe
      let key = urlB64ToUint8Array(publicKey);
      return registration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: key});

    }).then(sub => sub.toJSON())
      //.then(console.log)

      .then((msg) => {
        console.log('{"endpoint": "' + msg.endpoint + '", "expirationTime": "null", "keys: {" "auth": "' + msg.keys.auth + '", "p256dh": "' + msg.keys.p256dh + '"}}');

        fetch('/pwa/clientCredentials',
          {method: "post",
    			headers: {
    				'Accept': 'application/json',
    				'Content-Type': 'application/json'
    			},
    			body: '{"endpoint": "' + msg.endpoint + '", "expirationTime": "null", "keys": {"auth": "' + msg.keys.auth + '", "p256dh": "' + msg.keys.p256dh + '"}}'
    		}).then((res) => {
          if(res.status < 400) {
            res.json().then((data) => {
              console.log("Data: " + data.Message);
            })
          }
        })


      })

      .catch((msg) => {
        console.log('in 1: ' + msg);
      });

  }).catch(console.log);
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
