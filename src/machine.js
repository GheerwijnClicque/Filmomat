var five = require('johnny-five');
var board = new five.Board({port: 'com4'});

var machine = function() {};
machine.prototype.init = function() {
	board.on('ready', function() {
		// set everything
		console.log('everything set');
	});
};


module.exports = new machine();
