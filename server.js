const express = require('express');
const app = express();

// required to parse the body of a request (post)
var bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json' }));

app.use(express.static('client/public'));

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: './client/views' })
})

/*
app.route('/api/game/pace')
	.get(gameController.getPace)
	.post(gameController.setPace);
*/

app.listen(1337, () => console.log('OregonTrail listening on port 1337!'));
