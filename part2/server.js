/*
Add label url:          http://138.68.25.50:7821/query?op=add&img=Hiking.jpg&label=hike
Delete label url:       http://138.68.25.50:7821/query?op=delete&img=skyscraper.jpg&label=sky
Filter label url:       http://138.68.25.50:7821/query?op=filter&label=xyz
Favorite url:           http://138.68.25.50:7821/query?op=favorite&img=skyscraper.jpg
                        http://138.68.25.50:7821/query?op=unfavorite&img=skyscraper.jpg
Favorite sidebar url:   http://138.68.25.50:7821/query?op=select_all_favorite
*/

// Add db.close() ?

// Global variables
var port = 6758;

// Include modules & initialization stuff
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var querystring = require('querystring');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var LIVE = true;
var request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// Database initialization
var sqlite3 = require("sqlite3").verbose();
var dbFile = "photos.db";
var db = new sqlite3.Database(dbFile);



// URL containing the API key 
// professor's API key
url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCed8rPNBMEB3hvgGLfgWpVgTPlT0ZX67M';
// below is our API key
// url = 'https://vision.googleapis.com/v1/images:annotate?key=AlzaSyBLnUSNiv2xhjcPqgzl60ruY6YAp7RKaHg';

function annotateImage(requestObject) {
    if (LIVE) {
	// The code that makes a request to the API
	// Uses the Node request module, which packs up and sends off
	// an XMLHttpRequest. 
	request(
	    { // HTTP header stuff
		url: url,
		method: "POST",
		headers: {"content-type": "application/json"},
		// stringifies object and puts into HTTP request body as JSON 
		json: requestObject,
	    },
	    // callback function for API request
	    APIcallback
	);
    } else {  // not live! return fake response
	// call fake callback in 2 seconds
	console.log("not live");
	setTimeout(fakeAPIcallback, 2000);
    }
}

	
// live callback function
function APIcallback(err, APIresponse, body) {
    if ((err) || (APIresponse.statusCode != 200)) {
	console.log("Got API error"); 
    } else {
	APIresponseJSON = body.responses[0];
	console.log(APIresponseJSON);
    }
}

// Comment out to make this a module:
//annotateImage();

// Uncomment to make this a module:
// exports.annotateImage = annotateImage;


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
        		
	    // An object that gets stringified and sent to the API in the body of an HTTP request
	    requestObject = {
            "requests": [ {"image": {"source": {"imageUri": "http://138.68.25.50:" + port + "/Uploads/" + file.name}},"features": [{ "type": "LABEL_DETECTION" }]}]
        }
	
		db.serialize(function() {
			db.run('INSERT OR REPLACE INTO PhotoLabels VALUES (?, "", 0)', [file.name], function errorCallBack(err, tableData) {
				if (err)
					console.log("Error(app.post('/main')): ", err);

				else 
					console.log("tableData: ", tableData);
			});
		});

	    // The code that makes a request to the API
	    // Uses the Node request module, which packs up and sends off an XMLHttpRequest. 
	    var imageName = file.name;
	    var newLabel = "";
	
        request(
	    { // HTTP header stuff
		    url: url,
		    method: "POST",
		    headers: {"content-type": "application/json"},
		    // stringifies object and puts into HTTP request body as JSON 
		    json: requestObject,
	    },

	    // callback function for API request
	    function APIcallback(err, APIresponse, body) {
			if ((err) || (APIresponse.statusCode != 200)) 
            {
				console.log("Got API error"); 
			} 
            else 
            {
				APIresponseJSON = body.responses[0];
				console.log(APIresponseJSON);
				console.log("labels: ");
                if(!APIresponseJSON.labelAnnotations)
                    console.log("Error from Google API Service.");
                else
                {
                    for (var i = 0; i < 5; i++)
				    {
                        if (i == 0)
                            newLabel = APIresponseJSON.labelAnnotations[i].description;
					
                        else
                            newLabel = newLabel + "," + APIresponseJSON.labelAnnotations[i].description;
					
                        console.log(newLabel);
                    }
                }
                
				db.run('UPDATE PhotoLabels SET labels = ? WHERE fileName = ?', [newLabel, imageName], function errorCallBack(err, tableData) {
                    if (err)
                        console.log("Error(app.post('/main')): ", err);

                    else 
                        console.log("No error");
                }); 
			}
        }
        );
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
    else if (queryObj.op == "filter") 
    {
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
    
    // Query: op=favorite&img=[image name]
    else if (queryObj.op == "favorite") 
    {
        console.log("inside favorite query");
        var fav = 1;
        var imageName = queryObj.img;

        if (imageName)
        {
            db.run('UPDATE PhotoLabels SET favorite = ? WHERE fileName = ?', [fav, imageName], function (err, data) {
                if (err)
                {
                    console.log("Error(favorite): ", error);
                    res.status(400);
                    res.send("errrror");
                }

                else
                {
                    console.log("got: ", data);
                    res.status(200);
                    res.send("favorite set to 1");
                }
            });
        }
    }

    // Query: op=unfavorite&img=[image name]
    else if (queryObj.op == "unfavorite") 
    {
        console.log("inside unfavorite query");
        var fav = 0;
        var imageName = queryObj.img;

        if (imageName)
        {
            db.run('UPDATE PhotoLabels SET favorite = ? WHERE fileName = ?', [fav, imageName], function (err, data) {
                if (err)
                {
                    console.log("Error(favorite): ", error);
                    res.status(400);
                    res.send("errrror");
                }

                else
                {
                    console.log("got: ", data);
                    res.status(200);
                    res.send("favorite set to 0");
                }
            });
        }
    }

    // Query: op=select_all_favorite
    else if (queryObj.op == "select_all_favorite")
    {
        db.all('SELECT * FROM PhotoLabels WHERE favorite = 1', function (err, tableData) {
        
            if (err)
            {
                console.log("error: ", err);
                res.status(400);
                res.send("Query-select_all_favorite: ERROR");
            }

            else
            {
                res.status(200);
                res.type("text/json");
                res.send(tableData);
            }
        });
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
  console.log("Listening on Port " + port + "...");
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
