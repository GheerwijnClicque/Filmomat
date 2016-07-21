var util = require('util');
var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var board = new five.Board(); // {port: 'com4'}
var io;

var machine = new EventEmitter();
var ee = new EventEmitter();

var A = [1, 2, 3]; // pin numbers for valves
var B = [4, 5, 6];
var C = [7, 8, 9];
var Water = [10, 11, 12];
var pump = 13;

// function to get miliseconds from string
String.prototype.toMiliSeconds = function () {
	if (!this) return null;
	var time = this.split(':');
	return (+time[0]) * 60 + (+time[1] || 0) * 1000;
};

// function to init the board
machine.init = function() {
	board.on('ready', function() {
		// set everything
		machine.emit('ready');
		console.log('everything set');
	});
};

// function to start the process
machine.start = function(steps) {
	console.log('process started');
	machine.stepNumber = 0;
	machine.steps = JSON.parse(steps);
	// emit outside that it started
	machine.emit('started');
	machine.nextStep();
};

// function to start next step
machine.nextStep = function() {
	// check if stepnumber isn't to high
	if (machine.stepNumber < machine.steps.length) {
		// code for the step

		// set timeout for duration of step till interval, will emit code to start interval.
		setTimeout(function() {
			// Code before interval is placed here
			console.log('step; ' + machine.steps[machine.stepNumber].step_name);
			ee.emit('interval');
		}, machine.steps[machine.stepNumber].step_time.toMiliSeconds());

		// function after interval and before next step
		ee.on('interval', function() {
			setTimeout(function() {
				// code after interval and before next step

				// increment step
				machine.stepNumber++;
				// emit event
				machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
			}, machine.steps[machine.stepNumber].interval.toMiliSeconds());
		});
	} else {
		// on the end, event when done
		machine.emit('processDone');
		console.log('process done');
	}

};

module.exports = function() {
	return machine;
};
