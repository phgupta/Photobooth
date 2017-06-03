/*
Add label url:    http://138.68.25.50:7821/query?op=add&img=Hiking.jpg&label=hike
Delete label url: http://138.68.25.50:7821/query?op=delete&img=skyscraper.jpg&label=sky
Filter label url: http://138.68.25.50:7821/query?op=filter&label=xyz
*/

// Add db.close() ?

// Global variables
var port = 7821;

// Include modules & initialization stuff
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var querystring = require('querystring');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));


// Database initialization
var sqlite3 = require("sqlite3").verbose();
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);


// Static Home page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/home.html');
});


// Static Main page
app.get('/main', function(req, res) {
	res.sendFile(__dirname + '/public/main.html');
});


// Dynamic Main Page - Uploads imageName to database
app.post('/main', function(req, res) {
    
    var form = new formidable.IncomingForm();
	form.parse(req);

	form.on('fileBegin', function(name, file) {
		file.path = __dirname + '/public/Uploads/' + file.name;
	
		db.serialize(function() {
			db.run('INSERT OR REPLACE INTO PhotoLabels VALUES (?, "", 0)', [file.name], function errorCallBack(err, tableData) {
				if (err)
					console.log("Error(app.post('/main')): ", err);

				else 
					console.log("tableData: ", tableData);
			});
		});
	});

	form.on('end', function() {
		console.log('Success!');
		res.status(201);
		res.send('Recieved file');
	});
});


// Queries - Add label, Delete label, Dump, Filter
app.get('/query', function (query, res) {

	queryObj = querystring.parse(query.url.split("?")[1]);

	// Query: op=add&img=[image filename]&label=[label to add]
	if (queryObj.op == "add") 
    {
        var imageName = queryObj.img;
		var newLabel = queryObj.label;

		if (imageName && newLabel) 
        {
			db.get('SELECT labels FROM PhotoLabels WHERE fileName = ?', [imageName], function(err, data) {

				if (err)
					console.log("Error-AddQuery(app.get('/query')): ", err);

				else 
                {
                    if (!data.labels) 
			            db.run('UPDATE PhotoLabels SET labels = ? WHERE fileName = ?', [newLabel, imageName], errorCallBack(err)); 

                    else 
                        db.run('UPDATE PhotoLabels SET labels = ? WHERE fileName = ?', [data.labels + "," + newLabel, imageName], errorCallBack(err)); 
                }
			});
		}
	}

    // Query: op=delete&img=[image filename]&label=[label to delete]
    else if (queryObj.op == "delete") 
    {
        var imageName = queryObj.img;
        var deleteLabel = queryObj.label;

        if (imageName && deleteLabel) 
        {
			db.get('SELECT labels FROM PhotoLabels WHERE fileName = ?', [imageName], function(err, data) {

				if (err) 
					console.log("Error-DeleteQuery(app.get('/query')): ", err);

                else 
                {
                    var updatedLabel = removeLabel(data.labels, deleteLabel);

                    if (updatedLabel) 
                    {
                        db.run('UPDATE PhotoLabels SET labels = ? WHERE fileName = ?', [updatedLabel, imageName], function(err) {
                            if (err) 
                            {
                                console.log("error: ", err);
                                res.status(400);
                                res.send("Requested photo not found");
                            }

                            else 
                            {
                                res.status(200);
                                res.send("Deleted label " + deleteLabel + " from " + imageName);
                            }
                        });
                    }

                    else 
                        console.log("label could not be found");
                }
            });
        }
    }

    // Query: op=dump
    else if (queryObj.op == "dump") 
    {    
        db.all('SELECT * FROM PhotoLabels', function(err, tableData) {
            if (err)
			    console.log("Error-DumpQuery(app.get('/query')): ", err);
            
            else 
            {
                res.status(200);
                res.send(tableData);
            }
        });
    }

    // Query: op=filter&label=[label to delete]
    else if (queryObj.op == "filter") {
        var filterLabel = queryObj.label;

        if (filterLabel) {
            db.all('SELECT * FROM PhotoLabels WHERE labels LIKE ?', ["%" + filterLabel + "%"], function (err, tableData) {
                if (err) 
                {
                    console.log("error: ", err);
                    res.status(400);
                    res.send("requested photo not found");
                }

                else 
                {
                    console.log("got: ", tableData);
                    res.status(200);
                    // CHECK if below line works
                    res.send(tableData);
                }
            });
        }
    }

    function errorCallBack(err) {
     
        if (err) 
        {
	        console.log("Error: ", err);
			res.status(400);
		    res.send("Requested photo not found");
		}

		else 
        {
		    res.status(200);
			res.send("Added label " + newLabel + " to " + imageName);
		}
    }
});


// Main
app.listen(port, function() {
  console.log("Listening on Port" + port + "...");
});


// My functions
function removeLabel(currentLabel, deleteLabel) {

    var labelArray = currentLabel.split(",");
    console.log("labelArray before deleting: ", labelArray);

    var index = labelArray.indexOf(deleteLabel);

    if (index > -1)
    {
        labelArray.splice(index, 1);
        console.log("labelArray after deleting: ", labelArray);
        var result = labelArray.join(",");
        console.log("stringified labelArray: ", result);
        return result;
    }
    
    return "";
}
