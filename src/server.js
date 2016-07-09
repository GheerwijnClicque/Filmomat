var express = require('express');
var app = express();
var config = require('./config')();
var http = require('http');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('filmomat.db');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

console.log(__dirname + '\\css');

app.get('/', function(req, res) {
	db.serialize(function() {
		db.each("SELECT * FROM FILMS", function(error, row) {
			console.log(row);
		});

	});


	res.render('index', {});
});

app.get('/newfilm', function(req, res) {
	res.render('newfilm', {});
});

app.post('/newfilm', function(req, res) {
	var name = req.body.name;
	var iso = req.body.iso;
	var manufacturer = req.body.manufacturer;

	console.log("name: " + name + " ,iso: " + iso + " ,manufacturer: " + manufacturer);



});

var server = app.listen(config.port, function() {
	console.log('Express server listening on port ' + config.port);
});
