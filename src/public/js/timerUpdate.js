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
					draw(progress / 100);
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


	// SVG circle
	var range = document.getElementById('range');
	var bg = document.getElementById('counter');
	var ctx = bg.getContext('2d');
	var imd = null;
	var circ = Math.PI * 2;
	var quart = Math.PI / 2;

	ctx.beginPath();
		ctx.strokeStyle = '#6e6e6e';
		ctx.arc(120,120,70,0,2*Math.PI, false);
		ctx.lineWidth = 12.0;
		ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
		ctx.strokeStyle = '#F24D16';
		ctx.lineCap = 'square';
		ctx.stroke();
	ctx.closePath();

	ctx.fill();
	ctx.lineWidth = 12.0;

	imd = ctx.getImageData(0, 0, 240, 240);
	var draw = function(current) {
	    ctx.putImageData(imd, 0, 0);
	    ctx.beginPath();
	    ctx.arc(120, 120, 70, -(quart), ((circ) * current) - quart, false);
	    ctx.stroke();
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
