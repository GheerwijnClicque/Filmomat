$(function() {
	function str_pad_left(string,pad,length) {
	    return (new Array(length+1).join(pad)+string).slice(-length);
	}

    // Socket IO
    var socket = io.connect('http://localhost:3000');

    var duration = 0;
    var start = Date.now(), diff, minutes, seconds, interv, interval;
    var int = 0;
    var string = "";


    socket.on('step', function(data) {
        if(data.message) {
            // $('#comment').text(data.message);
            // console.log(data.message.desc);
			$('#step').text('Executing "' + data.message.desc + '"');

            var counter = new Countdown({
                seconds:  data.message.time,  // number of seconds to count down
                onUpdate: function(sec) {
					var progress = 100 - Math.ceil((Math.round(sec) / Math.ceil(data.message.time)) * 100);

					// console.log('progress = ' + progress + "%");

					var minutes = Math.floor(Math.round(sec) / 60);
					var seconds = Math.round(sec) - (minutes * 60);
					$('#time').text(str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2));
					progressBar(progress);
                }, // callback for each second
                done: function() { console.log('counter ended!'); } // final action
            });

            counter.start();
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
			$('#time').text('process finished');
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



	var progressBar = function(progress) {
		$('#progress').width(progress + "%");
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
    if (Math.round(seconds) <= 0) {
      counterEnd();
      instance.stop();
    }
    seconds -= 0.25;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 250);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}
