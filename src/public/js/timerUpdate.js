$(function() {
    // Socket IO
    var socket = io.connect('http://localhost:3000');

    // socket.on('time', function(data) {
    //     if(data.message) {
    //         console.log(data.message);
    //         $('#time').text(data.message);
    //     }
    //     else {
    //         console.log('there is a problem: ', data.message);
    //     }
    // });
    //
    // socket.on('comment', function(data) {
    //     if(data.message) {
    //         $('#comment').text(data.message);
    //     }
    //     else {
    //         console.log('there is a problem: ', data.message);
    //     }
    // });

    var duration = 0;
    var start = Date.now(), diff, minutes, seconds, interv, interval;
    var int = 0;
    var string = "";

    socket.on('step', function(data) {
        if(data.message) {
            // $('#comment').text(data.message);
            console.log(data.message);
            // duration = Math.ceil((data.message / 1000));
			//
            // var minutes = "0" + Math.floor(duration / 60);
            // var seconds = "0" + (duration - minutes * 60);
            // var time = minutes.substr(-2) + ":" + seconds.substr(-2);

            $('#time').text(time);
            // interval = data.message.interval.toSeconds();

            // console.log('duration: ' + duration + ' inter: ');

			console.log(data.message.time);
            // var counter = new Countdown({
            //     seconds:  data.message.time,  // number of seconds to count down
            //     onUpdate: function(sec) {
            //         // console.log(sec);
            //         var minutes = "0" + Math.floor(sec / 60);
            //         var seconds = "0" + (sec - minutes * 60);
            //         console.log(minutes.substr(-2) + ":" + seconds.substr(-2));
            //     }, // callback for each second
            //     done: function() { console.log('counter ended!'); } // final action
            // });
			//
            // counter.start();
        }
        else {
            console.log('there is a problem: ', data.message);
        }
    });

    socket.on('processDone', function(data) {
        console.log('done: ' + data.state);
        if(data.state) {
            // $('#comment').text(data.message);
            console.log('process finished');
        }
        else {
            console.log('there is a problem: ', data.message);
        }
    });

    String.prototype.toSeconds = function () {
    	if (!this) return null;
    	var time = this.split(':');
    	return (+time[0]) * 60 + (+time[1] || 0);
    };

});


function Countdown(options) {
  var timer,
  instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdate || function () {},
  counterEnd = options.done || function () {};

  function decrementCounter() {
    updateStatus(seconds);
    if (seconds === 0) {
      counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}
