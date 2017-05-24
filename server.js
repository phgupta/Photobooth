var express = require('express');
var path = require('path');
var formidable = require('formidable');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/home.html');
});

app.get('/main', function (req, res) {
	res.sendFile(__dirname + '/public/main.html');
});

app.post('/main', function (req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req);

	form.on('fileBegin', function (name, file) {
		file.path = __dirname + '/public/Uploads/' + file.name;
		console.log("uploading...", file.name, name);
	});

	form.on('end', function () {
		console.log('success');
		res.status(201);
		res.send('recieved file');
	});
});

app.listen(7821, function() {
  console.log("Listening on Port 7821...");
});
