var express = require('express');
var _ = require('lodash');
var app = express();
var config = require('./config')();
var http = require('http');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('filmomat.db');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var machine = require('./machine.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

machine.init();

app.get('/', function(req, res) {
	var getRow = undefined;

	// function to render
	var render = function() {
		console.log(getRow);
		res.render('index', {films: getRow } );
	};

	// function to call render after number of calls
	var finished = _.after(1, render);

	// DO NOT REMOVE!
	// db.serialize(function() {
	// 	db.each("SELECT film_name as filmname, iso, manufacturer, processid, process_name as processname, step_id, step_name as step, step_time as time, temp, interval, chemical, dilution FROM FILMS INNER JOIN PROCESSES ON id = film_id INNER JOIN STEPS ON process_id = process_id where film_id = 1 GROUP BY processid", function(error, row) {
	// 		console.log(row);
	// 	});
	//
	// });

	db.serialize(function() {
		db.all("SELECT * from FILMS", function(error, row) {
			getRow = row;
			// tell finished that it's ready
			finished();
		});
	});
});

app.get('/newfilm', function(req, res) {
	res.render('newfilm', {});
});

app.post('/newfilm', function(req, res) {
	var name = req.body.name;
	var iso = req.body.iso;
	var manufacturer = req.body.manufacturer;

	db.serialize(function() {
		db.each("INSERT INTO films(film_name, iso, manufacturer) VALUES ($name, $iso, $manufacturer)", {$name: name, $iso: iso, $manufacturer: manufacturer});
	});
});

var server = app.listen(config.port, function() {
	console.log('Express server listening on port ' + config.port);
});
