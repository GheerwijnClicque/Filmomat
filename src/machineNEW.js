var util = require('util');
var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;
var VirtualSerialPort = require('udp-serial').SerialPort;
var firmata = require('firmata');

var board = new five.Board(), initialized; // {port: 'com4'}

var lcd; // LCD
var io;


var machine = new EventEmitter();
var ee = new EventEmitter();

var A, B, C, water, pump, cleanup; // pin numbers for valves
var temperature;

var start;

// ESP8266 (firmata baud = 115200)
	//create the udp serialport and specify the host and port to connect to
	var sp = new VirtualSerialPort({
	  host: '192.168.4.1',
	  type: 'udp4',
	  port: 1025
	});

	//use the serial port to send a command to a remote firmata(arduino) device
	var io = new firmata.Board(sp);

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

var setupESP = function() {
	io.once('ready', function(){
		console.log('IO Ready');
		io.isReady = true;

		var board = new five.Board({io: io, repl: true});

		board.on('ready', function(){
			console.log('five ready');
			//Full Johnny-Five support here:
			machine.emit('ready');

			A = new five.Relays([2, 3, 4]);
			B = new five.Relays([5, 6, 7]);
			C = new five.Relays([8, 9, 10]);
			water = new five.Relay(11);
			cleanup = new five.Relay(12);

			pump = new five.Relay(13);
			A.close();
			B.close();
			C.close();
			cleanup.close();
			water.close();
			pump.close();

			console.log('everything set');
			initialized = true;
		});
	});
};

// function to init the board
machine.init = function() {
	// setupESP();

	board.on('ready', function() {
		// lcd = new five.LCD({pins: [8, 9, 4, 5, 6, 7], rows: 2, cols: 16});

		machine.emit('ready');

		A = new five.Relays([2, 3, 4]);
		B = new five.Relays([5, 6, 7]);
		C = new five.Relays([8, 9, 10]);
		water = new five.Relay(11);
		cleanup = new five.Relay(12);

		pump = new five.Relay(13);
		A.close();
		B.close();
		C.close();
		cleanup.close();
		water.close();
		pump.close();

		// temperature = new five.Thermometer({
	    //    controller: "DS18B20",
	    //    pin: 14
	    //  });


		// printLCD('ready', 0);
		console.log('everything set');
		initialized = true;
	});
};

// function to start the process
machine.start = function(steps) {
	// printLCD("process started", 0);
	if(initialized && !machine.isRunning()) {
		machine.stepNumber = -1;
		machine.steps = JSON.parse(steps);
		// console.log("steps: " + steps);

		// emit outside that it started
		machine.emit('started');
		machine.nextStep();
		console.log('process started');
	}

};

machine.isRunning = function() {
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

machine.prepare = function(step) {
	prepareStep(machine.steps[machine.stepNumber]);
};

machine.cleanUp = function(time) {
	console.log('cleaning up for ' + time / 1000 + ' seconds');
	A = null;

	cleanup.open();
	pump.open();

	// wait x seconds for cleaning to complete, could be setTimeout
	board.wait((time), function() {
		console.log('cleaning done');

		cleanup.close();
		pump.close();

		machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
	});
};

machine.on('setupDone', function() {
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
		// printLCD(milliToMinutes(time.getTimeLeft()), 1);
	}, 250);

	// set function to end step
	time = new timer(function() {
		if (machine.stepNumber < machine.steps.length) {
			console.log(machine.stepNumber);
			console.log('step: ' + machine.steps[machine.stepNumber].step_name);

			clearInterval(interval);
			// cleanup for x milliseconds
			machine.cleanUp(10000);
		}
	}, machine.steps[machine.stepNumber].step_time.toMiliSeconds());
});

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
        id = setTimeout(function() {
			running = false;
			callback();
		}, remaining);
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
	machine.stepNumber++;
	// var inter;
	// check if stepnumber isn't to high
	console.log('=====');
	console.log(machine.stepNumber);
	console.log(machine.steps.length);
	console.log('=====');
	if (machine.stepNumber < machine.steps.length) {
		console.log('temp: ' + machine.steps[machine.stepNumber].temp);
		// machine.currentTemp = machine.steps[machine.stepNumber].temp;
		machine.prepare();
	} else {
		// on the end, event when done
		machine.emit('processDone');
		stepNumber = -1;
		// clearInterval(inter);
		// lcd.clear();
		// printLCD("process finished", 0);
		console.log('process done');
	}

};

// var printLCD = function(text, line) {
// 	lcd.cursor(line, 0).print(text);
// };

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

var prepareStep = function(step) {
	console.log('relaystep_chemical: ' + step.chemical);
	var relays = "";

	// select pins corresponding to chemical
	switch(step.chemical) {
		case "A":
			relays = A;
			break;
		case "B":
			relays = B;
			break;
		case "C":
			relays = C;
			break;
		case "water":
			relays = water;
			break;
	}
	relays.open();
	pump.open();

	// wait x seconds for setup to complete, could be setTimeout
	board.wait(10000, function() {
		relays.close();
		pump.close();
		// Start execution when setup is done
		machine.emit('setupDone');
    });
};

var tempControl = function(temp) {

};

module.exports = function() {
	return machine;
};
