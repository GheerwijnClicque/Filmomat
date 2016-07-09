var express = require('express');
var app = express();
var config = require('./config')();
var http = require('http');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

console.log(__dirname + '\\css');

app.get('/', function(req, res) {
	res.render('index', {});
});

var server = app.listen(config.port, function() {
	console.log('Express server listening on port ' + config.port);
});
