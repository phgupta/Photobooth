var express = require('express');
var path = require('path');
var formidable = require('formidable');

var app = express();

// Database
var sqlite3 = require("sqlite3").verbose();
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);

// MAIN
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
		console.log("Uploading...", file.name, name);
	
		
		db.serialize(function () {

			console.log("file.name = ", file.name, "\n");
			db.run('INSERT OR REPLACE INTO PhotoLabels VALUES (?, "", 0)', [file.name], function errorCallBack(err, tableData) {
				if (err) {
					console.log("error: ", err);
				}

				else {
					console.log("got: ", tableData, "\n");
				}
			});
		});
		
	});

	form.on('end', function () {
		console.log('Success!');
		res.status(201);
		res.send('recieved file');
	});
});

app.listen(7821, function() {
  console.log("Listening on Port 7821...");
});
