const express = require('express');
const webpush = require('web-push');
const app = express();

const vapid = require('./vapid.json');

webpush.setVapidDetails('mailto:brian.gormanly@marist.edu', vapid.publicKey, vapid.privateKey);


var subscriptions = [];

// required to parse the body of a request (post)
var bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json' }));

app.use(express.static('client/public'));

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: './client/views' })
})



app.route('/pwa/clientCredentials')
  .post((req, res) => {
    //console.log('received creds: ' + req.body);
    // check to see if we already have the subscription
    var existing = getSubscription(req.body.endpoint);
    console.log('existing: ' + existing);
    if(!existing) {
      subscriptions.push(req.body);
    }

    // get subscription

    //console.log("all subscriptions: \n" + subscriptions);

    res.setHeader('Content-Type', 'application/json');
    res.send('{"Message": "Got it!"}');
  })

app.get('/send', function(req, res) {
  // configure keys
  console.log('About to send push message!!!!!');

  // send message to all subscriptions
  for(var i in subscriptions) {
    webpush.sendNotification(subscriptions[i], 'this is a message from the server!')
      .then(console.log);
  }

  res.setHeader('Content-Type', 'application/json');
  res.send('{"Message": "Sending Message!"}');
})

function getSubscription(endpoint) {
  // find existing subscription
  for(var i in subscriptions) {
    if(subscriptions[i].endpoint == endpoint) {
      return subscriptions[i];
    }
  }

  // no existing endpoint, create a new one

}

app.get('/clear', function(req, res) {
  // configure keys
  console.log('Clearning subscriptions!');

  subscriptions = [];

  res.setHeader('Content-Type', 'application/json');
  res.send('{"Message": "Subscriptions Cleared!"}');
})

function getSubscription(endpoint) {
  // find existing subscription
  for(var i in subscriptions) {
    if(subscriptions[i].endpoint == endpoint) {
      return subscriptions[i];
    }
  }

  // no existing endpoint, create a new one

}



app.listen(1337, () => console.log('Marist PWA listening on port 1337!'));
