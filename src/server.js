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


// Add new film
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

// Add new process for film
app.get('/newprocess/:id', function(req, res) {
	res.render('newprocess', {id: req.params.id});
});

app.post('/addprocess/:id', function(req, res) {
	var steps = req.body.data;
	var processName = req.body.name;
	var lastProcessId = 0;

	var filmId = req.params.id;
	db.serialize(function() {
		db.each("SELECT COUNT(*) as count FROM processes where process_name = $name", {$name: processName}, function(error, row) {
			if(row.count === 0) {
				db.run("INSERT INTO processes(film_id, process_name) VALUES ($id, $name)", {$id: filmId, $name: processName}, function() {
					lastProcessId = this.lastID;
					for(var i = 0; i < steps.length; i++) {
						db.run("INSERT INTO steps(process_id, step_name, step_time, temp, interval, chemical, dilution) VALUES ($process_id, $name, $time, $temp, $interval, $chemical, $dilution)", {$process_id: lastProcessId, $name: steps[i].name, $time: steps[i].duration, $temp: steps[i].temperature, $interval: steps[i].interval, $chemical: steps[i].chemical, $dilution: steps[i].dilution });
					}
				});
			}
			else {
				console.log("already exists");
				// not working
				res.writeHead(200, { 'Content-Type': 'application/text' });
				res.end('Process name already exists!');
			}
		});
	});
});






var server = app.listen(config.port, function() {
	console.log('Express server listening on port ' + config.port);
});
