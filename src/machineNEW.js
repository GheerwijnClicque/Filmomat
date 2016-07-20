var util = require('util');
var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var board = new five.Board({port: 'com7'}); // {port: 'com4'}
var io;

var machine = new EventEmitter();
var ee = new EventEmitter();

var A = [1, 2, 3]; // pin numbers for valves
var B = [4, 5, 6];
var C = [7, 8, 9];
var Water = [10, 11, 12];
var pump = 13;

String.prototype.toMiliSeconds = function () {
	if (!this) return null;
	var time = this.split(':');
	return (+time[0]) * 60 + (+time[1] || 0) * 1000;
};

machine.init = function() {
	board.on('ready', function() {
		// set everything
		console.log('everything set');
	});
};

machine.start = function(steps) {
	console.log('it started');
	machine.stepNumber = 0;
	machine.steps = JSON.parse(steps);
	console.log(machine.steps);
	machine.nextStep();
};

machine.nextStep = function() {
	if (machine.stepNumber < machine.steps.length) {
		console.log('next step');
		setTimeout(function() {
			ee.emit('interval');
		}, machine.steps[machine.stepNumber].step_time.toMiliSeconds());
		ee.on('interval', function() {
			setTimeout(function() {
				machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
				machine.stepNumber++;
			}, machine.steps[machine.stepNumber].interval.toMiliSeconds());
		});
	} else {
		console.log('done');
	}

};



module.exports = function() {
	return machine;
};
