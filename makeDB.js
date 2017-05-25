var sqlite3 = require("sqlite3").verbose();
var dbFile = "photos.db";

var db = new sqlite3.Database(dbFile);
var cmdStr = "CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, labelCount INTEGER, favorite INTEGER)"

db.run(cmdStr);
