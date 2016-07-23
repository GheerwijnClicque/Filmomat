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

var start = undefined;

machine.getInfo = function() {
	if (machine.steps !== undefined) {
		return {
			start: start,
			time: machine.steps[machine.stepNumber].step_time.toMiliSeconds() / 1000,
			desc: machine.steps[machine.stepNumber].step_name,
			interval: machine.steps[machine.stepNumber].interval
		};
	}
};

// function to get miliseconds from string
String.prototype.toMiliSeconds = function () {
	if (!this) return null;
	var time = this.split(':');
	return (+time[0]) * 60 + (+time[1] || 0) * 1000;
};

// function after interval and before next step
// ee.on('interval', function() {
// 	start = Date.now();
// 	// type = 'Interval';
// 	// machine.emit('change', machine.getInfo());
//
// 	// increment step
// 	machine.stepNumber++;
// 	// emit event
// 	machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
//
//
//
//
// 	// setTimeout(function() {
// 	// 	// code after interval and before next step
// 	//
// 	// 	// increment step
// 	// 	machine.stepNumber++;
// 	// 	// emit event
// 	// 	machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
// 	// }, machine.steps[machine.stepNumber].interval.toMiliSeconds());
// });

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
	// io.on('connection', function(socket) {
	// 	// socket.emit('step', {message: e});
	// 	console.log('socket connection made');
	//
	// 	console.log('process started');
	// 	machine.stepNumber = 0;
	// 	machine.steps = JSON.parse(steps);
	// 	// console.log("steps: " + steps);
	//
	// 	// emit outside that it started
	// 	machine.emit('started');
	// 	machine.nextStep();
	// });

	console.log('process started');
	machine.stepNumber = 0;
	machine.steps = JSON.parse(steps);
	// console.log("steps: " + steps);

	// emit outside that it started
	machine.emit('started');
	machine.nextStep();

};

// machine.on('interval', function() {
// 	console.log('agitate');
// });

function timer(callback, delay) {
    var id, started, remaining = delay, running;

    this.start = function() {
        running = true;
        started = new Date();
        id = setTimeout(callback, remaining);
    };

    this.pause = function() {
        running = false;
        clearTimeout(id);
        remaining -= new Date() - started;
    };

    this.getTimeLeft = function() {
        if (running) {
            this.pause();
            this.start();
        }

        return remaining;
    };

    this.getStateRunning = function() {
        return running;
    };

    this.start();
}

var time;


// function to start next step
machine.nextStep = function() {
	// var inter;
	// check if stepnumber isn't to high
	if (machine.stepNumber < machine.steps.length) {
		// set new start date
		start = Date.now();

		// emit new step info
		machine.emit('change', machine.getInfo());

		// set interval to agitate
		var interval = setInterval(function() {console.log('agitate');}, machine.steps[machine.stepNumber].interval.toMiliSeconds());

		// set function to end step
		time = new timer(function() {
			console.log(machine.steps[machine.stepNumber]);
			console.log('step: ' + machine.steps[machine.stepNumber].step_name);

			clearInterval(interval);
			machine.stepNumber++;
			machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
		}, machine.steps[machine.stepNumber].step_time.toMiliSeconds());

	} else {
		// on the end, event when done
		machine.emit('processDone');
		stepNumber = 0;
		// clearInterval(inter);
		console.log('process done');
	}

};

// var n = 100;
// setTimeout(countDown,1000);
//
// function countDown(){
//    n--;
//    if(n > 0){
// 	  setTimeout(countDown,1000);
//    }
//    console.log("timeout: " + n);
// }

module.exports = function() {
	// io = socket_io;
	return machine;
};
