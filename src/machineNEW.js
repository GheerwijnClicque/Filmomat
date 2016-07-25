var util = require('util');
var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var board = new five.Board(), initialized; // {port: 'com4'}

var lcd; // LCD
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
			time: (machine.steps[machine.stepNumber].step_time.toMiliSeconds() - (Date.now() - start)) / 1000,
			desc: machine.steps[machine.stepNumber].step_name,
			interval: machine.steps[machine.stepNumber].interval
		};
	}
};

// function to get miliseconds from string
String.prototype.toMiliSeconds = function () {
	if (!this) return null;
	var time = this.split(':');
	return (+time[0]) * 60000 + (+time[1] || 0) * 1000;
};

// function to init the board
machine.init = function() {
	board.on('ready', function() {
		// set everything
		lcd = new five.LCD({pins: [8, 9, 4, 5, 6, 7], rows: 2, cols: 16});

		machine.emit('ready');
		printLCD('ready', 0);
		console.log('everything set');
		initialized = true;
	});
};

// function to start the process
machine.start = function(steps) {
	printLCD("process started", 0);
	console.log('process started');
	if(initialized) {
		machine.stepNumber = 0;
		machine.steps = JSON.parse(steps);
		// console.log("steps: " + steps);

		// emit outside that it started
		machine.emit('started');
		machine.nextStep();
	}
};

machine.isRunning = function() {
	// console.log('running?: ' + time.getStateRunning());
	if(time !== undefined) {
		if(!time.getStateRunning()) {
			console.log('machine is not running');
			return false;
		}
		else if(time.getStateRunning()){
			console.log('machine is running');
			return true;
		}
	}
	else {
		console.log('timer not started!');
		return false;
	}
};

machine.stop = function() {
	clearTimeout(time);
	time.stop();
	console.log('machine stop');
};

machine.pause = function() {
	if(time !== undefined) {
		time.pause();
	}
};

ee.on('lcd', function() {
	if(time !== undefined) {
		milliToMinutes(time.getTimeLeft());
	}
});

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

	this.stop = function() {
		running = false;
		clearTimeout(id);
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
		var interval = setInterval(function() {
			console.log('agitate');
		}, machine.steps[machine.stepNumber].interval.toMiliSeconds());


		var lcdTime = setInterval(function() {
			ee.emit('lcd');
			printLCD(milliToMinutes(time.getTimeLeft()), 1);
		}, 250);

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
		lcd.clear();
		printLCD("process finished", 0);
		console.log('process done');
	}

};

var printLCD = function(text, line) {
	lcd.cursor(line, 0).print(text);
};

var milliToMinutes = function(milliseconds) {
	var min = Math.floor(Math.ceil(milliseconds / 1000) / 60);
	var sec = Math.ceil((milliseconds / 1000) - (min * 60));
	if(sec < 10) {
		sec = "0" + sec;
	}
	if(min < 10) {
		min = "0" + min;
	}
	return min + ':' + sec;
};

module.exports = function() {
	return machine;
};
