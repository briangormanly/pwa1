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

/*
let sendMessageElement = document.getElementById('sendMessage');
sendMessageElement.addEventListener('click', (e) => {
  navigator.serviceWorker.controller.postMessage('Hello Brian');
});

// set up a listener for html messages that may come in
// we can additionally setup messaging channels to make this more robust.
navigator.serviceWorker.addEventListener('message', (e) => {
  console.log(e.data);
})

const applicationServerPublicKey = 'BBZolo6sNMCpw3HJ0um997ZYMfULtls4q2fyah7EY3T6EYyKgcQO4tesmHNFKKfbwbS1b4pL7jPLGAdn9BqtOyA';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

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

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
*/
