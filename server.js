// Include modules
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var querystring = require('querystring');
var app = express();

// Database initialization
var sqlite3 = require("sqlite3").verbose();
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);

// Making public folder static
app.use(express.static(path.join(__dirname, 'public')));

// Static Home page & dumps database
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/home.html');
    
    // Dump database
    db.all('SELECT * FROM PhotoLabels', function (err, tableData) {
        if (err) {
            console.log("error: ", err);
        }

        else {
            console.log("got: ", tableData);
            res.status(200);
            // CHECK if below line works. 
            res.send(tableData);
        }
    });
});

// Static Main page
app.get('/main', function (req, res) {
	res.sendFile(__dirname + '/public/main.html');
});

// Dynamic Main Page
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

// Queries - Add label, Delete label
app.get('/query', function (query, res) {

	queryObj = querystring.parse(query);

	// Query: op=add&img=[image filename]&label=[label to add]
	if (queryObj.op == "add") {
		var imageName = queryObj.img;
		var newLabel = queryObj.label;

		if (imageName && newLabel) {
			db.get('SELECT labels FROM PhotoLabels WHERE fileName = ?', [imageName], function (err, data) {
				console.log("getting labels from ", imageName);

				if (err) {
					console.log("error: ", err);
				}

				else {
					db.run('UPDATE PhotoLabels SET labels = ? WHERE fileName = ?', [data.labels + ", " + newLabel, imageName], function (err) {
						if (err) {
							console.log("error: ", err);
							res.status(400);
							res.send("requested photo not found");
						}

						else {
							res.status(200);
							res.send("added label " + newLabel + " to " + imageName);
						}
					}); 
				}
			});
		}
	}

    // Query: op=delete&img=[image filename]&label=[label to delete]
    else if (queryObj.op == "delete") {
        var imageName = queryObj.img;
        var deleteLabel = queryObj.label;

        if (imageName && deleteLabel) {
			db.get('SELECT labels FROM PhotoLabels WHERE fileName = ?', [imageName], function (err, data) {
				console.log("getting labels from ", imageName);

				if (err) {
					console.log("error: ", err);
				}

                else {
                    var updatedLabel = removeLabel(data.labels, deleteLabel);

                    if (updatedLabel) {

                        db.run('UPDATE PhotoLabels SET labels = ? WHERE fileName = ?', [updatedLabel, imageName], function (err) {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400);
                                res.send("requested photo not found");
                            }

                            else {
                                res.status(200);
                                res.send("deleted label " + deleteLabel + " from " + imageName);
                            }
                        });
                    }

                    else {
                        console.log("label could not be found");
                    }
                }
            });
        }
    }

    // Query: op=filter&label=[label to delete]
    else if (queryObj.op == "filter") {
        var filterLabel = queryObj.label;

        if (filterLabel) {
            db.all('SELECT * FROM PhotoLabels WHERE labels LIKE ?', [%filterLabel%], function (err, tableData) {
                if (err) {
                    console.log("error: ", err);
                    res.status(400);
                    res.send("requested photo not found");
                }

                else {
                    console.log("got: ", tableData);
                    res.status(200);
                    // CHECK if below line works
                    res.send(tableData);
                }
            });
        }
    }
});

// Main
app.listen(7821, function() {
  console.log("Listening on Port 7821...");
});

// My functions
function removeLabel(currentLabel, deleteLabel) {

    var index = currentLabel.indexOf(deleteLabel);

    // Removes deleteLabel from currentLabel
    if (index != -1) {
        var updatedLabel = currentLabel.slice(0, index);
        updatedLabel += currentLabel.slice(index + deleteLabel.length + 1);
    
        return updatedLabel;
    }

    else {
        return "";
    }
}
