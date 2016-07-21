var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var board = new five.Board(); // {port: 'com4'}
var io;

var machine = function() {};
var ee = new EventEmitter();

var A = [1, 2, 3]; // pin numbers for valves
var B = [4, 5, 6];
var C = [7, 8, 9];
var Water = [10, 11, 12];
var pump = 13;

machine.prototype.time = 0;

machine.prototype.init = function() {
	board.on('ready', function() {
		// set everything
		console.log('everything set');
	});
};

machine.prototype.start = function(steps) {
	var allSteps = JSON.parse(steps);
	console.log("started process " + allSteps[0].step_name);
	for(var i = 0; i < allSteps.length; i++) {
		// var stepname = allSteps[i].step_name;
		// var duration = allSteps[i].step_time;
		// var temperature = allSteps[i].temp;
		// var interval = allSteps[i].interval;
		// var chemical = allSteps[i].chemical;
		//
		// console.log("step: " + i + " = " + stepname + ", " + duration + ", " + temperature + ", " + interval + ", " + chemical);

		console.log("executing step " + allSteps[i].step_name + " (" + allSteps[i].step_id + ")");
		if(allSteps[i].step_time !== "" && allSteps[i].interval !== "") {
			moveChemical(allSteps[i].chemical);
			var duration = allSteps[i].step_time.toSeconds();
			var interval = allSteps[i].interval.toSeconds();

			console.log('duration: ' + duration + " interval: " + interval);
			ee.emit('startTimer', duration, interval);
		}
		// ee.emit('execute', allSteps[i]);
	}

};

String.prototype.toSeconds = function () {
	if (!this) return null;
	var time = this.split(':');
	return (+time[0]) * 60 + (+time[1] || 0);
};

var execute = function(step) {
	// console.log("executing step " + step.step_name + " (" + step.step_id + ")");
	// if(step.step_time !== "" && step.interval !== "") {
	// 	moveChemical(step.chemical);
	// 	var duration = step.step_time.toSeconds();
	// 	var interval = step.interval.toSeconds();
	//
	// 	console.log('duration: ' + duration + " interval: " + interval);
	// 	ee.emit('startTimer', duration, interval);
	//
	//
	//
	//
	// 	// startTimer(duration, interval);
	// 	// chemicalToTank('A');
	// }
};

var startTimer = function(duration, interval) {
	var interv;

	io.sockets.on('connection', function(socket) {
		var start = Date.now(), diff, minutes, seconds;
		var int = 0;
		var string = "";

		function timer() {
			diff = duration - (((Date.now() - start) / 1000) | 0);

			minutes = (diff / 60) | 0;
			seconds = (diff % 60) | 0;

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			string = minutes.toString() + ":" + seconds.toString();
			// Send update to page
			io.sockets.emit('time', {message: string});
			io.sockets.emit('comment', {message: '...'});

			if(diff <= 0) {
				start = Date.now() + 1000;
			}
			if(int == interval) {
				io.sockets.emit('comment', {message: 'agitate!'});
				console.log("agitate!");
				int = 0;
			}
			if(minutes === "00" && seconds === "00") {
				console.log('timer done!');
				clearInterval(interv);
			}
			int++;
		}

		// timer();
		interv = setInterval(timer, 1000);
	});
};

ee.on('startTimer', function(duration, interval) {
	startTimer(duration, interval);
});

// ee.on('execute', function(step) {
// 	execute(step);
// });

var moveChemical = function() {

};

var chemicalToTank = function(chemical) {
	board.on('ready', function() {
		var relay = new five.Relay({pin: 12});
		relay.on();
	});
};

var tankToWaste = function() {

};

module.exports = function(socket_io) {
	io = socket_io;
	return new machine();
};
